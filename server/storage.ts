import { 
  users, type User, type InsertUser,
  profiles, type Profile, type InsertProfile,
  contactRequests, type ContactRequest, type InsertContactRequest,
  matches, type Match, type InsertMatch,
  predefinedInterests
} from "../shared/schema.ts";

// Storage interface for database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | undefined>;
  listProfiles(limit?: number, offset?: number): Promise<Profile[]>;
  
  // Contact request operations
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequest(id: number): Promise<ContactRequest | undefined>;
  updateContactRequestStatus(id: number, status: string): Promise<ContactRequest | undefined>;
  getContactRequestsByUser(userId: number): Promise<ContactRequest[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByUserId(userId: number): Promise<Match[]>;
  checkIfMatched(user1Id: number, user2Id: number): Promise<boolean>;
  
  // Interest operations
  getInterests(): Promise<string[]>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<number, Profile>;
  private contactRequests: Map<number, ContactRequest>;
  private matches: Map<number, Match>;
  private userIdCounter: number;
  private profileIdCounter: number;
  private contactRequestIdCounter: number;
  private matchIdCounter: number;
  private interests: string[];

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.contactRequests = new Map();
    this.matches = new Map();
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.contactRequestIdCounter = 1;
    this.matchIdCounter = 1;
    this.interests = predefinedInterests;
    
    // Add some initial sample profiles
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create some sample users and profiles
    const sampleUsers: InsertUser[] = [
      { username: 'ankitha', password: 'password123', email: 'ankitha@example.com' },
      { username: 'robert', password: 'password123', email: 'robert@example.com' },
      { username: 'sophia', password: 'password123', email: 'sophia@example.com' },
      { username: 'thomas', password: 'password123', email: 'thomas@example.com' },
      { username: 'maya', password: 'password123', email: 'maya@example.com' }
    ];

    const sampleProfiles = [
      {
        displayName: 'Ankitha',
        age: 30,
        location: 'San Francisco, CA',
        bio: "I'm a passionate soul who believes that every sunset holds a promise of a new beginning. From sipping coffee on rainy mornings to losing myself in books that feel like old friends, I find magic in life's quiet moments. I'm someone who loves meaningful conversations, laughing until it hurts, and exploring hidden cafes in the city. Family, loyalty, and kindness are the values I live by. I dream of traveling the world one story at a time and meeting someone who is excited about the journey ahead.",
        history: "Married for 5 years, I learned a lot about myself and what I truly value in relationships. The divorce was amicable, and we've both moved forward with respect. Today, I'm ready for a new chapter filled with authentic connections and shared adventures.",
        imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true',
        divorcedYears: 2,
        interests: ['Creative Writing', 'Travel Blogging', 'Flamenco Dance', 'Vegan Cooking', 'Sustainability', 'Candle Making']
      },
      {
        displayName: 'Robert',
        age: 42,
        location: 'San Francisco, CA',
        bio: "Professional photographer and outdoors enthusiast. I believe in living life to the fullest and capturing beautiful moments along the way.",
        history: "Was married for 8 years. The divorce taught me the importance of communication and personal growth. Looking forward to sharing new experiences with someone special.",
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true',
        divorcedYears: 3,
        interests: ['Photography', 'Hiking', 'Travel', 'Cooking']
      },
      {
        displayName: 'Sophia',
        age: 36,
        location: 'Oakland, CA',
        bio: "Yoga instructor and culinary enthusiast. I believe in finding balance in life and enjoying the simple pleasures it has to offer.",
        history: "After 6 years of marriage, we decided to go our separate ways. The experience helped me discover my passion for wellness and mindfulness. Now I'm looking for a genuine connection.",
        imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true',
        divorcedYears: 4,
        interests: ['Yoga', 'Cooking', 'Meditation', 'Reading']
      },
      {
        displayName: 'Thomas',
        age: 45,
        location: 'Mountain View, CA',
        bio: "Tech entrepreneur and jazz enthusiast. I enjoy intellectual conversations and exploring new ideas and concepts.",
        history: "My 10-year marriage ended 5 years ago. It was a challenging time, but it led to tremendous personal growth. I've rebuilt my life and am ready to share it with someone who appreciates authenticity.",
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true',
        divorcedYears: 5,
        interests: ['Tech', 'Jazz', 'Reading', 'Travel']
      },
      {
        displayName: 'Maya',
        age: 39,
        location: 'Berkeley, CA',
        bio: "Artist and world traveler. I find inspiration in different cultures and express it through my paintings.",
        history: "Divorced after 7 years. It was a mutual decision as we had different life goals. I've spent the last 3 years rediscovering myself through art and travel, and now I'm open to sharing my journey with someone new.",
        imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&grayscale=true',
        divorcedYears: 3,
        interests: ['Painting', 'Travel', 'Photography', 'Museums']
      }
    ];

    // Create users and profiles
    sampleUsers.forEach((userData, index) => {
      const user = this.createUserInternal(userData);
      
      if (index < sampleProfiles.length) {
        this.createProfileInternal({
          userId: user.id,
          ...sampleProfiles[index],
          isPublic: true
        });
      }
    });
  }

  // Internal methods to avoid async in constructor
  private createUserInternal(insertUser: InsertUser): User {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  private createProfileInternal(insertProfile: InsertProfile): Profile {
    const id = this.profileIdCounter++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.createUserInternal(insertUser);
  }

  // Profile methods
  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    return this.createProfileInternal(insertProfile);
  }

  async updateProfile(id: number, profileUpdate: Partial<Profile>): Promise<Profile | undefined> {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...profileUpdate };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async listProfiles(limit = 50, offset = 0): Promise<Profile[]> {
    const profiles = Array.from(this.profiles.values())
      .filter(profile => profile.isPublic)
      .sort((a, b) => b.id - a.id);
    
    return profiles.slice(offset, offset + limit);
  }

  // Contact request methods
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = this.contactRequestIdCounter++;
    const createdAt = new Date();
    const request: ContactRequest = { 
      ...insertRequest, 
      id, 
      status: "pending",
      createdAt
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async getContactRequest(id: number): Promise<ContactRequest | undefined> {
    return this.contactRequests.get(id);
  }

  async updateContactRequestStatus(id: number, status: string): Promise<ContactRequest | undefined> {
    const request = this.contactRequests.get(id);
    if (!request) return undefined;

    const updatedRequest = { ...request, status };
    this.contactRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getContactRequestsByUser(userId: number): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values()).filter(
      (request) => request.toUserId === userId || request.fromUserId === userId
    );
  }

  // Match methods
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const createdAt = new Date();
    const match: Match = { ...insertMatch, id, createdAt };
    this.matches.set(id, match);
    return match;
  }

  async getMatchesByUserId(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      (match) => match.user1Id === userId || match.user2Id === userId
    );
  }

  async checkIfMatched(user1Id: number, user2Id: number): Promise<boolean> {
    return Array.from(this.matches.values()).some(
      (match) => 
        (match.user1Id === user1Id && match.user2Id === user2Id) ||
        (match.user1Id === user2Id && match.user2Id === user1Id)
    );
  }

  // Interest methods
  async getInterests(): Promise<string[]> {
    return this.interests;
  }
}

export const storage = new MemStorage();
