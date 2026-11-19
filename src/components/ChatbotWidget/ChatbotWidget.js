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
  const [, setRefreshChatbot] = useState(false);
  const [chatbotKey, setChatbotKey] = useState(0);

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
  };
  
  const saveMessages = (messages, HTMLString) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('chat_messages'));
    return messages;
  };

  const refreshChat = () => {
    try{
    localStorage.clear();
    console.log('Local storage cleared!');
    setRefreshChatbot(prev => !prev);
    } catch (error) {
      console.error('Error clearing local storage');
    }
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
            key = {chatbotKey}
          />
        )}
      </div>
  );
};

export default ChatbotWidget;


