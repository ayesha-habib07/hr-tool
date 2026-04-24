import dotenv from "dotenv";
dotenv.config();

import clientPromise from './lib/connectDB.js'
async function testConnection() {
  try {
    console.log("uriii:", process.env.MONGO_URI);
    const client = await clientPromise;
    console.log("✅ MongoDB connected successfully!");
    const db = client.db(process.env.MONGODB_ATLAS_DB_NAME);
    console.log("📁 DB name:", db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

testConnection();