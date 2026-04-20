// "use client";

// import { useState, useRef, useEffect } from "react";

// export default function ChatPage() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "👋 Hi! I'm Genius AI — how can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId] = useState(() => crypto.randomUUID());
//   const messagesEndRef = useRef(null);

  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle user message submission
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);
 
//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input, sessionId }),
//       });

//       const data = await response.json();
//       // const aiReply = data.reply.trim();
//       const aiReply = data?.reply ? data.reply.trim() : "⚠️ Sorry, I didn’t get a valid response.";


//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: aiReply },
//       ]);
//     }catch (error) {
//       console.error("Chat error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "❌ Sorry, something went wrong." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//   <main className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-50 to-gray-200">
//     <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">

//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 flex items-center justify-between shadow">
//         <h1 className="text-lg font-semibold tracking-wide">💡 Genius AI Chatbot</h1>
//         <span className="text-xs opacity-80">Powered by OpenAI</span>
//       </header>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50 scroll-smooth scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm transition-all duration-200 ${
//                 msg.role === "user"
//                   ? "bg-blue-600 text-white rounded-br-none"
//                   : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
//               }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Bar */}
//       <form
//         onSubmit={sendMessage}
//         className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white"
//       >
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border border-gray-300 text-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
//         >
//           {loading ? (
//             <div className="flex items-center gap-2">
//               <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//               Sending
//             </div>
//           ) : (
//             "Send"
//           )}
//         </button>
//       </form>
//     </div>
//   </main>
// );

// }










"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// export default function ChatPage() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "👋 Hi! I'm Genius AI — how can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId] = useState(() => crypto.randomUUID());
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input, sessionId }),
//       });

//       const data = await response.json();
//       const aiReply = data?.reply ? data.reply.trim() : "⚠️ Sorry, I didn’t get a valid response.";

//       setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
//     } catch (error) {
//       console.error("Chat error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "❌ Sorry, something went wrong." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.main
//       initial={{ opacity: 0, y: 80 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 80 }}
//       transition={{ duration: 0.4, ease: "easeInOut" }}
//       className="flex flex-col h-full w-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl overflow-hidden"
//     >
//       {/* Header */}
//       <header className="bg-gradient-to-r from-secondary-main to-secondary-light200 text-white py-3 px-5 flex items-center justify-between shadow">
//         <h1 className="text-sm font-semibold tracking-wide">💡 Genius AI</h1>
//         <span className="text-[10px] opacity-80">Powered by OpenAI</span>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${
//               msg.role === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm transition-all duration-200 ${
//                 msg.role === "user"
//                   ? "bg-blue-600 text-white rounded-br-none"
//                   : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
//               }`}
//             >
//               {msg.content}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <form
//         onSubmit={sendMessage}
//         className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
//       >
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border border-gray-300 text-gray-700 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-primary-dark600 text-white px-4 py-1.5 cursor-pointer rounded-full font-medium text-xs hover:bg-primary-dark800 active:scale-95 transition-all disabled:opacity-50"
//         >
//           {loading ? (
//             <div className="flex items-center gap-2">
//               <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
//               Sending
//             </div>
//           ) : (
//             "Send"
//           )}
//         </button>
//       </form>
//     </motion.main>
//   );
// }





export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm Genius AI — how can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Add temporary AI typing placeholder
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      const data = await response.json();
      const aiReply = data?.reply?.trim() || "⚠️ Sorry, I didn’t get a valid response.";

      // Replace the typing placeholder with actual reply
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: aiReply };
        return updated;
      });
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "❌ Sorry, something went wrong." };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex flex-col h-full w-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary-main to-secondary-light200 text-white py-3 px-5 flex items-center justify-between shadow">
        <h1 className="text-sm font-semibold tracking-wide">💡 Genius AI</h1>
        <span className="text-[10px] opacity-80"></span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm transition-all duration-200
                ${
                  msg.role === "user"
                    ? "bg-secondary-light50 text-gray-800 rounded-br-none"
                    : msg.content === "..."
                    ? "bg-primary-light50 text-gray-500 italic rounded-bl-none animate-pulse"
                    : "bg-primary-light50 text-gray-900 rounded-bl-none"
                }`}
            >
              {msg.content}
            </motion.div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 text-gray-700 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark600 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-dark600 text-white px-4 py-1.5 cursor-pointer rounded-full font-medium text-xs hover:bg-primary-dark800 active:scale-95 transition-all disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </motion.main>
  );
}






