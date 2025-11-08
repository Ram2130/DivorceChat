// config/db.ts
import { MongoClient, Db } from 'mongodb';


const uri = "mongodb+srv://ram2130:305007Atlas@atlascluster.rlgyyta.mongodb.net/" as string;

if (!uri) {
  throw new Error('❌ MONGO_URI is not defined in .env');
}

let client: MongoClient | null = null;
let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('messaging'); // ✅ your DB name
    console.log('✅ MongoDB connected');
  }
  return db;
};
