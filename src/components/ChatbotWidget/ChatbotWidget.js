import React, { useState } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import config from '../Chatbot/config.js';
import MessageParser from '../Chatbot/MessageParser.js';
import ActionProvider from '../Chatbot/ActionProvider.js';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import 'react-chatbot-kit/build/main.css';
import './ChatbotWidget.css';


const ChatbotWidget = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotKey, setChatbotKey] = useState(0);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };
  
  const saveMessages = (messages) => {
    localStorage.setItem('blog_chat_messages', JSON.stringify(messages));
  };

  const loadMessages = () => {
    try {
      const messages = JSON.parse(localStorage.getItem('blog_chat_messages'));
      return Array.isArray(messages) ? messages : null;
    } catch (error) {
      console.error('Unable to load saved chat messages:', error);
      return null;
    }
  };

  const refreshChat = () => {
    localStorage.removeItem('blog_chat_messages');
    setChatbotKey(prev => prev + 1);
  };

  return (
      <div>
        {/* Chatbot Icon */}
        <div className={`chatbot-icon ${isChatbotOpen ? 'open' : ''}`} onClick={toggleChatbot}>
          {isChatbotOpen ? <CloseIcon className = 'icon-size'/> : <ChatIcon className = 'icon-size'/>}
        </div>

        {/* Chatbot Widget */}
        {isChatbotOpen && (
          <Chatbot
            config={{
              ...config,
              customComponents: {
                ...config.customComponents,
                header: (props) => <config.customComponents.header {...props} refreshChat={refreshChat} />,
              },
            }}
            messageHistory={loadMessages()}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            saveMessages={saveMessages}
            key={chatbotKey}
          />
        )}
      </div>
  );
};

export default ChatbotWidget;


