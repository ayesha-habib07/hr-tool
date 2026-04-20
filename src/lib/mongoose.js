// import mongoose from "mongoose";
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGO_URI;
// const DB_NAME = process.env.MONGODB_ATLAS_DB_NAME || "hr-tool"; // ✅ fallback added

// if (!uri) throw new Error("❌ Please define MONGO_URI in .env.local");

// // Singleton cache (shared across hot reloads)
// let cached = global._mongoCached;
// if (!cached) {
//   cached = global._mongoCached = { conn: null, promise: null, client: null };
// }

// /**
//  * 📌 Unified connection (Mongoose + MongoClient)
//  */
// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {a
//     const client = new MongoClient(uri);
//     cached.promise = client.connect().then(async (connectedClient) => {
//       cached.client = connectedClient;
//       console.log("✅ Connected to MongoDB via native client");

//       // ✅ Make sure mongoose uses same cluster
//       if (!mongoose.connection.readyState) {
//         await mongoose.connect(uri, {
//           bufferCommands: false,
//           serverSelectionTimeoutMS: 5000,
//           dbName: DB_NAME, // ✅ ensure mongoose uses same DB
//         });
//         console.log("✅ Connected to MongoDB via Mongoose");
//       }

//       // ✅ use DB name (fallback if env not set)
//       const db = connectedClient.db(DB_NAME);

//       return { client: connectedClient, db };
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }


import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGO_URI in .env.local");
}

let cached = global._mongooseCached;
if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }
  return cached.conn;
}