"use client";

import React, { useState } from "react";
import './styles.css';
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const QNAComponent: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { text: question, sender: "user" }]);

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch answer.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "An error occurred while fetching the answer.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }

    setQuestion("");
  };

  return (
    <div className="main-window">
        <div className="chat-container">
        {/* Chat Window */}
        <div className="chat-window">
            <div className="chat-header">AI Chat Assistant</div>
            <div className="chat-messages">
            {messages.map((msg, index) => (
                <div
                key={index}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
                >
                <div className="message-content">
                    <p>{msg.text}</p>
                </div>
                </div>
            ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
            <div className="input-container">
                <input
                type="text"
                value={question}
                onChange={handleQuestionChange}
                placeholder="Type your question here"
                required
                className="question-input"
                />
                <button
                type="submit"
                disabled={loading}
                className="submit-button"
                >
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <Send className="send-icon" />
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
  );
};

export default QNAComponent;
