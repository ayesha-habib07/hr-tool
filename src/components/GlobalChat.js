"use client"; // tells Next.js this runs in the browser

import { useState } from "react";
import { MessageSquareMore, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatPage from "./Chatbot"; 

export default function GlobalChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="cursor-pointer p-3 rounded-full bg-secondary-light50 hover:bg-secondary-dark600 hover:text-white shadow-lg hover:scale-105 transition duration-300"
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <MessageSquareMore className="w-5 h-5" />}
        </button>
      </div>

      {/* Chat Box with animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bottom-20 right-6 w-96 h-[500px] bg-white border rounded-2xl shadow-2xl overflow-hidden z-40"
          >
            <ChatPage />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
