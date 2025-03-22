import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoMdSend } from 'react-icons/io';
import { FaRobot } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { FiMessageSquare } from 'react-icons/fi';
import { MdOutlineWavingHand } from 'react-icons/md';
import API_BASE_URL from '../../apiConfig';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const Chatbot = ({ productId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "👋 Hi there! I'm ShareSpace Assistant. Ask me anything about our products!", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send request to backend
      const { data } = await axios.post(`${API_BASE_URL}/api/chatbot/query`, {
        query: input,
        productId: productId
      });
      
      // Add bot response to chat
      if (data.success) {
        setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "Sorry, I couldn't process your request. Please try again.", 
          sender: 'bot' 
        }]);
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Safe rendering of markdown content
  const renderMessageContent = (message) => {
    if (message.sender === 'bot') {
      try {
        return (
          <div className="markdown-content">
            <ReactMarkdown>
              {message.text || ''}
            </ReactMarkdown>
          </div>
        );
      } catch (error) {
        console.error('Error rendering markdown:', error);
        return <div>{message.text}</div>;
      }
    } else {
      return message.text;
    }
  };

  // Quick suggestions for common questions
  const quickSuggestions = [
    "What products are available?",
    "How does the points system work?",
    "How can I contact a seller?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot className="chatbot-icon" />
              <span>ShareSpace Assistant</span>
            </div>
            <button className="close-button" onClick={toggleChatbot}>
              <IoClose />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.sender === 'bot' && <FaRobot className="message-icon" />}
                <div className="message-content">
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <FaRobot className="message-icon" />
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length === 1 && (
            <div className="quick-suggestions">
              <p>Try asking:</p>
              <div className="suggestions-container">
                {quickSuggestions.map((suggestion, index) => (
                  <button 
                    key={index} 
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FiMessageSquare /> {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <IoMdSend />
            </button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={toggleChatbot}>
          <MdOutlineWavingHand className="wave-icon" />
          <span>Chat with Assistant</span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
