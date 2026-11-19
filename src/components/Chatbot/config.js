import { createChatBotMessage} from 'react-chatbot-kit';
import Options from '../Chatbot/CustomElements/Options/Options.js';
import TimestampWidget from '../Chatbot/CustomElements/Timestamp/TimestampWidget.js';
import CustomMessage from '../Chatbot/CustomElements/Timestamp/customMessage.js';
import CustomHeader from '../Chatbot/CustomElements/Header/CustomHeader.js';
import MyAvatar from '../Chatbot/CustomElements/BotAvatar/MyAvatar.js';
import UserAvatar from '../Chatbot/CustomElements/UserAvatar/UserAvatar.js';


const botName = 'Travel Bot';

const getCurrentTime = () => {
  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return timeString;
};

const timestamp = getCurrentTime();
const config = {
  
  initialMessages: [createChatBotMessage('Hello!',
{
  widget: 'TimestampWidget',
  payload: timestamp
}),

],
  botName: botName,
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
  customMessages: {
    custom: (props) => <CustomMessage {...props} />,
  },
  widgets: [
    {
      widgetName: 'Options',
      widgetFunc: (props) => <Options {...props} />,
    },
    {
      widgetName: 'TimestampWidget',
      widgetFunc: (props) => <TimestampWidget {...props} />,

    },
  ],
};

export default config;




