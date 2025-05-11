import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and basic user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interest tags that users can select
export const interestTags = pgTable("interest_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Profiles table with detailed user information for the dating site
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  displayName: text("display_name").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  history: text("history").notNull(),
  imageUrl: text("image_url").notNull(),
  divorcedYears: integer("divorced_years"),
  interests: json("interests").$type<string[]>().notNull(),
  isPublic: boolean("is_public").default(true),
});

// Contact requests table for securely sharing contact information
export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Match table for mutual interest
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id),
  user2Id: integer("user2_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define insert schemas with zod
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ 
  id: true 
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({ 
  id: true,
  createdAt: true,
  status: true
});

export const insertMatchSchema = createInsertSchema(matches).omit({ 
  id: true,
  createdAt: true
});

// Define types for use in the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

// Extended types for frontend use
export type ProfileWithUser = Profile & {
  user: {
    email: string;
    username: string;
  }
};

// Predefined interests for the application
export const predefinedInterests = [
  "Creative Writing", "Travel Blogging", "Flamenco Dance", "Vegan Cooking", 
  "Sustainability", "Candle Making", "Photography", "Hiking", "Yoga", 
  "Jazz Music", "Painting", "Reading", "Gardening", "Meditation",
  "Running", "Dancing", "Cooking", "Wine Tasting", "Theater",
  "Movies", "Tech", "Fitness", "Art", "Astronomy"
];
