// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";


// import * as z from "zod";
// import { tool } from "@langchain/core/tools";
// import clientPromise from "./connectdb";
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";



// export async function getVectorStore() {
//   try {
//     console.log("🟢 Connecting to MongoDB client...");
//   //  const client = new MongoClient(process.env.MONGO_URI || "mongodb+srv://ayeshahabib77:tool77@cluster0.kri2j01.mongodb.net/hr-tool?retryWrites=true&w=majority&appName=Cluster0");
//   const client = await clientPromise;
//     // const client = await clientPromise;
//     console.log("✅ MongoDB client connected");

//    const dbName = process.env.MONGODB_ATLAS_DB_NAME;
//     const collectionName = process.env.MONGODB_ATLAS_COLLECTION_NAME;

//     console.log("📁 DB:", dbName);
//     console.log("📄 Collection:", collectionName);

//     const database = client.db(dbName);
//     const collection = database.collection(collectionName);


//     if (!collection) throw new Error("❌ MongoDB collection undefined");
//     console.log("📦 Using collection:", collectionName);


//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004",
//       apiKey: process.env.GOOGLE_API_KEY,
//     });



//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//       collection,
//       indexName: "vector_index",
//       textKey: "embeddingText",
//       embeddingKey: "embedding",
//     });

//     console.log("✅ Vector store created", vectorStore);
//     return vectorStore;

//   }
//   catch (err) {
//     console.error("Error creating vector store :", err);
//     throw err;
//   }
// }



// src/lib/vectorStore.js


// export async function getVectorStore() {
//   try {
//     console.log("🟢 Connecting to MongoDB client...");
//     const client = await clientPromise;
//     console.log("✅ MongoDB client connected");

//     const db = client.db("hr-tool");
//     const collection = db.collection("employees");
//     console.log("📁 DB:", db.databaseName);
//     console.log("📄 Collection:", collection.collectionName);

//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004",
//       apiKey: process.env.GOOGLE_API_KEY,
//     });

//     // const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     //   collection,
//     //   indexName: "vector_index",
//     //   textKey: "embeddingText",
//     //   embeddingKey: "embedding",
//     // });

//      const vectorStore = new MongoDBAtlasVectorSearch({
//       collection,
//       embedding: embeddings,
//       indexName: "vector_index",
//       textKey: "embeddingText",
//       embeddingKey: "embedding",
//     });

//     return vectorStore;
//   } catch (err) {
//     console.error("❌ Error creating vector store:", err);
//     throw err;
//   }
// }


// export async function getVectorStore() {
//   try {
//     console.log("🟢 Connecting to MongoDB client...");
//     const client = await clientPromise;
//     console.log("✅ MongoDB client connected");

//     const dbName = process.env.MONGODB_ATLAS_DB_NAME || 'hr-tool';
//     const collectionName = process.env.MONGODB_ATLAS_COLLECTION_NAME || "employees";

//     console.log("📁 DB:", dbName);
//     console.log("📄 Collection:", collectionName);

//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     if (!collection) {
//       throw new Error("❌ MongoDB collection is undefined!");
//     }

//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004",
//       apiKey: process.env.GOOGLE_API_KEY,
//     });

//     const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//       collection,
//       indexName: "vector_index",
//       textKey: "embeddingText",
//       embeddingKey: "embedding",
//     });

//     console.log("✅ Vector store created successfully!");
//     return vectorStore;
//   } catch (error) {
//     console.error("❌ Error creating vector store:", error);
//     throw error;
//   }
// }




// export async function getVectorStore() {
//   try {
//     console.log("🟢 Connecting to MongoDB client...");
//     const client = await clientPromise;
//     console.log("✅ MongoDB client connected");

//     const dbName = process.env.MONGODB_ATLAS_DB_NAME || 'hr-tool';
//     const collectionName = process.env.MONGODB_ATLAS_COLLECTION_NAME || "employees";

//     console.log("📁 DB:", dbName);
//     console.log("📄 Collection:", collectionName);

//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     // ✅ Attach client to collection object
//     collection.client = client;

//     if (!collection) {
//       throw new Error("❌ MongoDB collection is undefined!");
//     }

//     const embeddings = new GoogleGenerativeAIEmbeddings({
//       model: "text-embedding-004",
//       apiKey: process.env.GOOGLE_API_KEY,
//     });

//     const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//       collection,
//       indexName: "vector_index",
//       textKey: "embeddingText",
//       embeddingKey: "embedding",
//     });

//     console.log("✅ Vector store created successfully!");
//     return vectorStore;
//   } catch (error) {
//     console.error("❌ Error creating vector store:", error);
//     throw error;
//   }
// }
// const retrieveSchema = z.object({
//   query: z.string(),
// });

// export const retrieve = tool(
//   async ({ query }) => {

//     console.log(query, "search query")
//     try {
//       const vectorStore = await getVectorStore();

//       console.log(vectorStore, "vectorStore")
//       const results = await vectorStore.maxMarginalRelevanceSearch(query, 3);



//       if (!results || results.length === 0) {
//         console.log("⚠️ No vector matches, doing keyword fallback...");

//         // ✅ use the same Mongo client promise
//         const client = await clientPromise;
//         const db = client.db(process.env.MONGODB_ATLAS_DB_NAME || "hr-tool");
//         const collection = db.collection("employees");

//         // ✅ fallback: text search using regex
//         const keywordResults = await collection
//           .find({ text: { $regex: query, $options: "i" } })
//           .limit(3)
//           .toArray();

//         if (keywordResults.length === 0) {
//           return "No matching employees found.";
//         }

//         const formatted = keywordResults
//           .map((data) => `
//               🔹 **${data.personalInfo?.firstName || "Unknown"} ${data.personalInfo?.lastName || ""}**
//               💼 ${data.jobInfo?.title || "N/A"} | 🏢 ${data.jobInfo?.departmentId || "N/A"}
//               🧠 Skills: ${(data.jobInfo?.skills || []).join(", ") || "Not listed"}
//               📄 ${data.embeddingText?.slice(0, 120) || "No summary"}`
//           )
//           .join("\n\n");
//         console.log(formatted, "formated input")

//         return formatted.trim();
//       }

//       // format vector search results
//       const serialized = results
//         .map((doc) => {
//           const data = doc.metadata || doc;
//           console.log(data, "from vectorStore")
//           return `
//             🔹 **${data.personalInfo?.firstName || "Unknown"} ${data.personalInfo?.lastName || ""}**
//             💼 ${data.jobInfo?.title || "N/A"} | 🏢 ${data.jobInfo?.departmentId || "N/A"}
//             🧠 Skills: ${(data.jobInfo?.skills || []).join(", ") || "Not listed"}
//             📄 ${doc.pageContent?.slice(0, 120) || "No summary"}`;
//         })
//         .join("\n\n");

//       return serialized.trim();
//     } catch (error) {

//       console.error("❌ Retrieval error:", error);
//       return "I encountered a problem while retrieving data. Please try again later.";
//     }
//   },
//   {
//     name: "retrieve",
//     description:"Retrieve employees or information from MongoDB Atlas Vector Search based on semantic similarity to the user's query. Includes keyword fallback if no vector matches are found.",
//     schema: retrieveSchema,
//     responseFormat: "content",
//   }
// );
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import clientPromise from "./connectdb.js";

export async function getVectorStore() {
  try {
    console.log("🟢 Connecting to MongoDB client...");

    const client = await clientPromise;
    console.log("✅ MongoDB client connected");

    const dbName = process.env.MONGODB_ATLAS_DB_NAME || 'hr-tool';
    const collectionName = process.env.MONGODB_ATLAS_COLLECTION_NAME || "employees";

    console.log("📁 DB:", dbName);
    console.log("📄 Collection:", collectionName);

    const collection = client.db(dbName).collection(collectionName);

    console.log("✅ Collection object created");

    if (!collection) {
      throw new Error("❌ MongoDB collection is undefined!");
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    console.log("✅ Embeddings model initialized");

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "embeddingText",
      embeddingKey: "embedding",
    });

    console.log("✅ Vector store created successfully!");
    return vectorStore;
  } catch (error) {
    console.error("❌ Error creating vector store:", error);
    console.error("Stack trace:", error.stack);
    throw error;
  }
}

// Helper function to get department name
async function getDepartmentName(client, departmentId) {
  if (!departmentId) return "N/A";

  try {
    const db = client.db(process.env.MONGODB_ATLAS_DB_NAME || "hr-tool");
    const departmentsCollection = db.collection("departments");

    const department = await departmentsCollection.findOne({
      _id: typeof departmentId === 'string'
        ? new (await import('mongodb')).ObjectId(departmentId)
        : departmentId
    });

    return department?.name || department?.departmentName || "Unknown Department";
  } catch (error) {
    console.error("Error fetching department:", error);
    return "Unknown Department";
  }
}

//  Helper function to format employee data
async function formatEmployeeData(client, data, pageContent = null) {
  const departmentName = await getDepartmentName(client, data.jobInfo?.departmentId);

  // Format experience
  const experience = data.jobInfo?.experiences?.[0]?.yearsOfExperience
    ? `${data.jobInfo.experiences[0].yearsOfExperience} years`
    : "Not specified";

  // Format expertise level
  const expertiseLevel = data.jobInfo?.experiences?.[0]?.expertiseLevel || "Not specified";

  // Format past projects
  const projects = data.jobInfo?.pastProjects?.length
    ? `\n📊 Recent Project: ${data.jobInfo.pastProjects[0].name} (${data.jobInfo.pastProjects[0].technologies?.join(", ")})`
    : "";

  return `
    🔹 **${data.personalInfo?.firstName || "Unknown"} ${data.personalInfo?.lastName || ""}**
    💼 ${data.jobInfo?.title || "N/A"} | 🏢 ${departmentName}
    📧 ${data.personalInfo?.email || "N/A"} | 📱 ${data.personalInfo?.contactNumber || "N/A"}
    🧠 Skills: ${(data.jobInfo?.skills || []).join(", ") || "Not listed"}
    ⏱️ Experience: ${experience} | 🎯 Level: ${expertiseLevel}
    📍 Location: ${data.jobInfo?.location || "N/A"}${projects}
    ${pageContent ? `📄 ${pageContent.slice(0, 150)}...` : ""}`;
}

const retrieveSchema = z.object({
  query: z.string().describe("The search query to find employees"),
});

export const retrieve = new DynamicStructuredTool({
  name: "retrieve",
  description: "Retrieve employees or information from MongoDB Atlas Vector Search based on semantic similarity to the user's query. Includes keyword fallback if no vector matches are found.",
  schema: retrieveSchema,
  func: async ({ query }) => {
    console.log(query, "search query");

    try {
      const vectorStore = await getVectorStore();
      const client = await clientPromise;

      console.log("🔍 Performing vector search...");

      const results = await vectorStore.maxMarginalRelevanceSearch(query, {
        k: 3,
        fetchK: 10,
      });

      if (!results || results.length === 0) {
        console.log("⚠️ No vector matches, doing keyword fallback...");

        const db = client.db(process.env.MONGODB_ATLAS_DB_NAME || "hr-tool");
        const collection = db.collection("employees");

        // ✅ Improved keyword search with aggregation pipeline
        const keywordResults = await collection.aggregate([
          {
            $match: {
              $or: [
                { embeddingText: { $regex: query, $options: "i" } },
                { "jobInfo.title": { $regex: query, $options: "i" } },
                { "jobInfo.skills": { $regex: query, $options: "i" } },
                { "personalInfo.firstName": { $regex: query, $options: "i" } },
                { "personalInfo.lastName": { $regex: query, $options: "i" } },
                { "jobInfo.experiences.role": { $regex: query, $options: "i" } },
              ],
            },
          },
          {
            $lookup: {
              from: "departments",
              localField: "jobInfo.departmentId",
              foreignField: "_id",
              as: "department",
            },
          },
          {
            $limit: 3,
          },
        ]).toArray();

        if (keywordResults.length === 0) {
          return "No matching employees found.";
        }

        const formatted = await Promise.all(
          keywordResults.map(async (data) => {
            // Extract department name from lookup result
            const departmentName = data.department?.[0]?.name
              || data.department?.[0]?.departmentName
              || "Unknown Department";

            const experience = data.jobInfo?.experiences?.[0]?.yearsOfExperience
              ? `${data.jobInfo.experiences[0].yearsOfExperience} years`
              : "Not specified";

            const expertiseLevel = data.jobInfo?.experiences?.[0]?.expertiseLevel || "Not specified";

            const projects = data.jobInfo?.pastProjects?.length
              ? `\n📊 Recent Project: ${data.jobInfo.pastProjects[0].name} (${data.jobInfo.pastProjects[0].technologies?.join(", ")})`
              : "";

            return `
              🔹 **${data.personalInfo?.firstName || "Unknown"} ${data.personalInfo?.lastName || ""}**
              💼 ${data.jobInfo?.title || "N/A"} | 🏢 ${departmentName}
              📧 ${data.personalInfo?.email || "N/A"} | 📱 ${data.personalInfo?.contactNumber || "N/A"}
              🧠 Skills: ${(data.jobInfo?.skills || []).join(", ") || "Not listed"}
              ⏱️ Experience: ${experience} | 🎯 Level: ${expertiseLevel}
              📍 Location: ${data.jobInfo?.location || "N/A"}${projects}`;
          })
        );

        return formatted.join("\n\n").trim();
      }

      // ✅ Format vector search results with department names
      const serialized = await Promise.all(
        results.map(async (doc) => {
          const data = doc.metadata || doc;
          return await formatEmployeeData(client, data, doc.pageContent);
        })
      );

      return serialized.join("\n\n").trim();
    } catch (error) {
      console.error("❌ Retrieval error:", error);
      console.error("Error stack:", error.stack);
      return "I encountered a problem while retrieving data. Please try again later.";
    }
  },
});