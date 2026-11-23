import { createChatBotMessage } from 'react-chatbot-kit';
import CustomHeader from './CustomElements/Header/CustomHeader.js';
import MyAvatar from './CustomElements/BotAvatar/MyAvatar.js';
import UserAvatar from './CustomElements/UserAvatar/UserAvatar.js';

const config = {
  initialMessages: [
    createChatBotMessage('Hi! Ask me a question about the posts on this blog.'),
  ],
  botName: 'Blog Assistant',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#776B5D',
    },
    chatButton: {
      backgroundColor: '#776B5D',
    },
  },
  customComponents: {
    header: (props) => <CustomHeader {...props} />,
    botAvatar: (props) => <MyAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
  },
};

export default config;
