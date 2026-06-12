"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircleMore, X, SendHorizontal, Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}

const STORAGE_KEY = "nisir_chat";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleChatOpen = () => {
    setIsOpen(!isOpen);
  };

  // Load conversation
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setConversationId(parsed.conversationId || null);

        setMessages(parsed.messages || []);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Save conversation
  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        conversationId,
        messages,
      }),
    );
  }, [conversationId, messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";

      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const clearChat = () => {
    sessionStorage.removeItem(STORAGE_KEY);

    setMessages([]);
    setConversationId(null);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (loading) return;

    const userMessage: ChatMessage = {
      // Generates a UUID if available, otherwise falls back to a random string
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15),
      sender: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message.trim();

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    setLoading(true);

    try {
      const payload = conversationId
        ? {
            message: currentMessage,
            conversation_id: conversationId,
          }
        : {
            message: currentMessage,
          };

      const response = await fetch("http://172.20.20.190:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      /**
       * Expected backend response
       *
       * {
       *   conversation_id: "123",
       *   response: "Hello user"
       * }
       */

      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      const botMessage: ChatMessage = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15),
        sender: "bot",
        content: data.response || "No response received.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2, 15),
          sender: "bot",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {!isOpen ? (
        <button
          className="text-white p-4 bg-[#22348A] hover:bg-[#1a2a6c] shadow-lg rounded-full transition-all duration-200 hover:scale-105 border border-gray-50"
          onClick={handleChatOpen}
        >
          <MessageCircleMore className="h-6 w-6" />
        </button>
      ) : (
        <div className="w-[350px] h-[550px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#22348A] text-white p-4 relative">
            <button
              onClick={handleChatOpen}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-base">Fly Bot</h3>

            <p className="text-[10px] text-gray-300 mt-1 pr-12">
              This bot is designed only to provide information about Nisir
              Microfinance.
            </p>

            <button
              onClick={clearChat}
              className="absolute top-4 right-12 text-gray-300 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-blue-50 text-blue-950 rounded-full mb-2">
                  <MessageCircleMore className="h-5 w-5" />
                </div>

                <p className="text-xs font-semibold text-gray-700">
                  Welcome to Nisir Support
                </p>

                <p className="text-[11px] text-gray-500 max-w-[220px] mt-1">
                  Ask us anything about our microfinance programs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                        msg.sender === "user"
                          ? "bg-[#22348A] text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">
                      Thinking...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-white border-t border-gray-100"></div>
          <div className="border border-gray-200 flex items-end p-2 pl-3 w-full rounded-xl focus-within:border-blue-950 bg-gray-50">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              disabled={loading}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                loading ? "Waiting for response..." : "Enter your question"
              }
              className="flex-1 bg-transparent py-0.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none min-h-[24px] max-h-[100px] overflow-y-auto disabled:opacity-60"
            />

            <button
              disabled={!message.trim() || loading}
              className="p-1.5 bg-blue-950 hover:bg-blue-900 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg transition-colors flex items-center justify-center ml-2 self-end"
              onClick={handleSend}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
