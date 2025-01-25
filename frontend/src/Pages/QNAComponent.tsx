"use client";

import React, { useState } from "react";
import './styles.css';
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
  keywords?: string[]; // Optional keywords array
}

const QNAComponent: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeywordClick = async (keyword: string) => {
    setQuestion(keyword);
    await handleSubmit(keyword); // Reuse handleSubmit logic
  };

  const handleSubmit = async (inputQuestion: string = question) => {
    if (!inputQuestion.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { text: inputQuestion, sender: "user" }]);

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: inputQuestion }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch answer.");
      }

      const data = await response.json();

      // Add structured answer to messages
      setMessages((prev) => [
        ...prev,
        { text: data.answer, sender: "bot", keywords: data.prompts.map((p: any) => p.displayText) },
      ]);

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
                  {msg.keywords && msg.keywords.length > 0 && (
                    <div className="keywords">
                      {msg.keywords.map((keyword, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleKeywordClick(keyword)}
                          className="keyword-button"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="chat-form"
          >
            <div className="input-container">
              <input
                type="text"
                value={question}
                onChange={handleQuestionChange}
                placeholder="Type your question here"
                required
                className="question-input"
              />
              <button type="submit" disabled={loading} className="submit-button">
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
