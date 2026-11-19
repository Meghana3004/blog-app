import React from 'react';
import { createCustomMessage } from 'react-chatbot-kit';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const getCurrentTime = () => {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return timeString;
    };

    const timestamp = getCurrentTime();
    const botMessage = createChatBotMessage('Where would you like to explore today?', 
    {
      widget: 'Options',
      payload: timestamp,
    }
    );

    const newMessage = createCustomMessage('Test', 'custom', {
      payload: timestamp,
    });
    
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage, botMessage],
    }));  
  };
  

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;




// import React from 'react';

// const ActionProvider = ({ createChatBotMessage, setState, children }) => {
//   const handleResponse = (responseData) => {
//     const botMessage = createChatBotMessage(responseData.answer);
    
//     setState((prev) => ({
//       ...prev,
//       messages: [...prev.messages, botMessage],
//     }));
//   };

//   return (
//     <div>
//       {React.Children.map(children, (child) => {
//         return React.cloneElement(child, {
//           actions: {
//             handleResponse,
//           },
//         });
//       })}
//     </div>
//   );
// };

// export default ActionProvider;




