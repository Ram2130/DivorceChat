import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { z } from "zod";
import {
  insertUserSchema,
  insertProfileSchema,
  insertContactRequestSchema,
  insertMatchSchema
} from "../shared/schema.ts";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import express from 'express';


import { getAllUsers, getSingleUser, Search ,registerUser, verifyOtp, requestOtp, loginWithOtp, sendInvitationEmail, getUserProfile } from './controllers/authController.ts';
import { authenticateToken } from "./authMiddleware/authMiddleware.ts";

 
export async function registerRoutes(app: Express): Promise <Server> {


  // Middleware to handle zod validation errors
  // const validateRequest = (schema: z.ZodType<any, any>) => {
  //   return (req: Request, res: Response, next: Function) => {
  //     try {
  //       req.body = schema.parse(req.body);
  //       next();
  //     } catch (error) {
  //       if (error instanceof ZodError) {
  //         const validationError = fromZodError(error);
  //         return res.status(400).json({
  //           message: "Validation error",
  //           errors: validationError.details
  //         });
  //       }
  //       next(error);
  //     }
  //   };
  // };

 
    app.post('/api/login',loginWithOtp );
 app.post('/api/send-otp', requestOtp);
app.post('/api/verify-otp', verifyOtp);
 
   
  app.post('/api/profiles',registerUser);

//  app.post('/api/verifyotp',verifyOtp);
     
 app.get('/api/profiles/:id' ,getSingleUser);
 app.get('/api/myprofiles',authenticateToken,getUserProfile);
 app.get('/api/profiles' ,getAllUsers);
 app.get('/api/users/search',authenticateToken,Search)
   
  app.post('/api/contact-requests',authenticateToken ,sendInvitationEmail);

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

  // app.get('/api/contact-requests/user/:userId', async (req, res) => {
  //   try {
  //     const userId = parseInt(req.params.userId);
  //     const user = await storage.getUser(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     const requests = await storage.getContactRequestsByUser(userId);
  //     res.json(requests);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error fetching contact requests" });
  //   }
  // });

  // Match routes
  // app.get('/api/matches/user/:userId', async (req, res) => {
  //   try {
  //     const userId = parseInt(req.params.userId);
  //     const user = await storage.getUser(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     const matches = await storage.getMatchesByUserId(userId);
      
  //     // Enhance match data with user information
  //     const enhancedMatches = await Promise.all(
  //       matches.map(async (match) => {
  //         const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
  //         const otherUser = await storage.getUser(otherUserId);
  //         const otherProfile = await storage.getProfileByUserId(otherUserId);
          
  //         if (!otherUser || !otherProfile) return match;
          
  //         return {
  //           ...match,
  //           otherUser: {
  //             id: otherUser.id,
  //             username: otherUser.username,
  //             email: otherUser.email
  //           },
  //           otherProfile: {
  //             id: otherProfile.id,
  //             displayName: otherProfile.displayName,
  //             age: otherProfile.age,
  //             imageUrl: otherProfile.imageUrl,
  //             location: otherProfile.location
  //           }
  //         };
  //       })
  //     );
      
  //     res.json(enhancedMatches);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error fetching matches" });
  //   }
  // });

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
