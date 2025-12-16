import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage, getChatSuggestions } from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load suggestions
    loadSuggestions();
    
    // Initial greeting
    setMessages([{
      text: "Hello! I'm your Prompt assistant for real estate management. I can help you with:\n\n• Querying data (e.g., 'How many pending tickets?')\n• Creating records (e.g., 'Create a new property...')\n• Updating records (e.g., 'Update ticket TKT-123 status...')\n• Viewing analytics and charts\n\nWhat would you like to do?",
      isUser: false,
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const data = await getChatSuggestions();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to backend
      const response = await sendChatMessage(userMessage, conversationId);
      
      // Update conversation ID
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add AI response to chat
      setMessages(prev => [...prev, {
        text: response.response,
        isUser: false,
        chartConfig: response.chart_config,
        data: response.data,
        operation: response.operation,
        success: response.success,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        success: false,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      text: "Chat cleared. How can I help you today?",
      isUser: false,
    }]);
    setConversationId(null);
  };

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-dark-900/50 backdrop-blur-sm border-b border-dark-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center animate-pulse-slow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">
                Prompt Assistant
              </h2>
              <p className="text-xs text-dark-400">
                Powered by VibeCopilot.AI
              </p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isUser={message.isUser}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble-ai">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && suggestions.length > 0 && (
        <div className="px-6 py-4 border-t border-dark-800 bg-dark-900/30">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs text-dark-400 mb-3 font-medium">
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 2).map((category, idx) => (
                category.questions.slice(0, 2).map((question, qIdx) => (
                  <button
                    key={`${idx}-${qIdx}`}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs px-4 py-2 bg-dark-800/50 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-lg text-dark-300 hover:text-dark-100 transition-all"
                  >
                    {question}
                  </button>
                ))
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-dark-900/50 backdrop-blur-sm border-t border-dark-800 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or give me a command..."
                className="input-field resize-none pr-12"
                rows="1"
                style={{
                  minHeight: '52px',
                  maxHeight: '150px',
                }}
                disabled={isLoading}
              />
              {inputMessage && (
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading}
                  className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-dark-500 mt-2">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;