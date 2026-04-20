// import { NextResponse } from "next/server";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// // import { TavilySearch } from "@langchain/tavily";
// import { Calculator } from "@langchain/community/tools/calculator";
// import { createAgent } from "langchain";
// import { MemorySaver } from "@langchain/langgraph";


// import { retrieve } from "../../../lib/vectorStore";



// const sessions = new Map();
// export async function POST(req) {
//     try {
//         const { message, sessionId } = await req.json();
//         if (!message) {
//             return NextResponse.json({ error: 'Message is required' }, { status: 400 });
//         }
//         // model
//         const model = new ChatGoogleGenerativeAI({
//             model: "gemini-2.0-flash",
//             temperature: 0.7,
//             apiKey: process.env.GOOGLE_API_KEY,
//         });
//         let memory = sessions.get(sessionId);
//         if (!memory) {
//             memory = new MemorySaver();
//             sessions.set(sessionId, memory);
//         }

//         //  calling tools
//         const tools = [
//             retrieve,
//             new Calculator(),
//         ]
//         // agent
//         const agent = createAgent({
//             model,
//             tools,
//             checkpointer: memory,
//         });
//         // message structure
//         const inputMessages = [
//             {
//                 role: 'user', content: message,
//             }
//         ];
//         console.log(inputMessages);

//         // invokke agent
//         const result = agent.invoke(
//             { messages: inputMessages },
//             { configurable: { thread_id: sessionId || "default-thread" } }
//         );
//         // extract reply 
//         const reply =
//             result?.messages?.[result.messages.length - 1].content ||
//             result?.content ||
//             result?.output ||
//             "Sorry, I couldn’t generate a response.";
//         console.log("AI reply:", reply);
//         return NextResponse.json({ reply });

//     } catch (err) {
//         console.error("Chat API error", err);
//         return NextResponse.json({ error: "Something went wrong in chat route" }, { status: 500 });
//     }

// }




import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Calculator } from "@langchain/community/tools/calculator";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { retrieve } from "../../../lib/vectorStore"; 

// Store memory sessions
const sessions = new Map();

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    //  Setup model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    //  Manage memory
    let memory = sessions.get(sessionId);
    if (!memory) {
      memory = new MemorySaver();
      sessions.set(sessionId, memory);
    }

    // Register tools
    const tools = [retrieve, new Calculator()];

    // Create agent
    const agent = createAgent({
      model,
      tools,
      checkpointer: memory,
    });

    //  User input
    const inputMessages = [
      {
        role: "user",
        content: message,
      },
    ];

    console.log("📨 User:", message);

 
    const result = await agent.invoke(
      { messages: inputMessages },
      { configurable: { thread_id: sessionId || "default-thread" } }
    );

    //  Extract reply safely
    const reply =
      result?.messages?.[result.messages.length - 1]?.content ||
      result?.content ||
      result?.output ||
      "Sorry, I couldn’t generate a response.";

    console.log("🤖 AI reply:", reply);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("💥 Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong in chat route" }, { status: 500 });
  }
}
