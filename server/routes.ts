import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertProfileSchema,
  insertContactRequestSchema,
  insertMatchSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle zod validation errors
  const validateRequest = (schema: z.ZodType<any, any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({
            message: "Validation error",
            errors: validationError.details
          });
        }
        next(error);
      }
    };
  };

  // User routes
  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser(req.body);
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Profile routes
  app.post('/api/profiles', validateRequest(insertProfileSchema), async (req, res) => {
    try {
      // Check if user exists
      const user = await storage.getUser(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has a profile
      const existingProfile = await storage.getProfileByUserId(req.body.userId);
      if (existingProfile) {
        return res.status(400).json({ message: "User already has a profile" });
      }

      const profile = await storage.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error creating profile" });
    }
  });

  app.get('/api/profiles/:id', async (req, res) => {
    try {
      const profile = await storage.getProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile" });
    }
  });

  app.get('/api/profiles', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const profiles = await storage.listProfiles(limit, offset);
      
      // For each profile, get the associated user (only include safe fields)
      const profilesWithUserInfo = await Promise.all(
        profiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          if (!user) return profile;
          
          return {
            ...profile,
            user: {
              username: user.username,
              email: user.email
            }
          };
        })
      );
      
      res.json(profilesWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Error fetching profiles" });
    }
  });

  app.patch('/api/profiles/:id', async (req, res) => {
    try {
      const profile = await storage.getProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const updatedProfile = await storage.updateProfile(profile.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  // Contact request routes
  app.post('/api/contact-requests', validateRequest(insertContactRequestSchema), async (req, res) => {
    try {
      // Check if users exist
      const fromUser = await storage.getUser(req.body.fromUserId);
      if (!fromUser) {
        return res.status(404).json({ message: "From user not found" });
      }

      const toUser = await storage.getUser(req.body.toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "To user not found" });
      }

      // Check if there's already a match, in which case we can directly share contact info
      const alreadyMatched = await storage.checkIfMatched(req.body.fromUserId, req.body.toUserId);
      
      const contactRequest = await storage.createContactRequest(req.body);
      
      // Return different response based on match status
      if (alreadyMatched) {
        res.status(201).json({
          ...contactRequest,
          alreadyMatched: true,
          contactEmail: toUser.email
        });
      } else {
        res.status(201).json(contactRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Error creating contact request" });
    }
  });

  app.patch('/api/contact-requests/:id/status', async (req, res) => {
    try {
      const status = req.body.status;
      if (!status || !["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const contactRequest = await storage.getContactRequest(parseInt(req.params.id));
      if (!contactRequest) {
        return res.status(404).json({ message: "Contact request not found" });
      }

      const updatedRequest = await storage.updateContactRequestStatus(contactRequest.id, status);
      
      // If the request is accepted, create a match
      if (status === "accepted") {
        await storage.createMatch({
          user1Id: contactRequest.fromUserId,
          user2Id: contactRequest.toUserId
        });
        
        // Get the users to return their emails
        const fromUser = await storage.getUser(contactRequest.fromUserId);
        const toUser = await storage.getUser(contactRequest.toUserId);
        
        if (fromUser && toUser) {
          return res.json({
            ...updatedRequest,
            fromUserEmail: fromUser.email,
            toUserEmail: toUser.email
          });
        }
      }

      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Error updating contact request" });
    }
  });

  app.get('/api/contact-requests/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const requests = await storage.getContactRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contact requests" });
    }
  });

  // Match routes
  app.get('/api/matches/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const matches = await storage.getMatchesByUserId(userId);
      
      // Enhance match data with user information
      const enhancedMatches = await Promise.all(
        matches.map(async (match) => {
          const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
          const otherUser = await storage.getUser(otherUserId);
          const otherProfile = await storage.getProfileByUserId(otherUserId);
          
          if (!otherUser || !otherProfile) return match;
          
          return {
            ...match,
            otherUser: {
              id: otherUser.id,
              username: otherUser.username,
              email: otherUser.email
            },
            otherProfile: {
              id: otherProfile.id,
              displayName: otherProfile.displayName,
              age: otherProfile.age,
              imageUrl: otherProfile.imageUrl,
              location: otherProfile.location
            }
          };
        })
      );
      
      res.json(enhancedMatches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching matches" });
    }
  });

  // Interest routes
  app.get('/api/interests', async (req, res) => {
    try {
      const interests = await storage.getInterests();
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching interests" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
