import React from 'react';

const CustomMessage = (message) => {
  return (
    <div className = "usertimestamp-widget">
        {message.payload}
      </div>
  );
};

export default CustomMessage;



