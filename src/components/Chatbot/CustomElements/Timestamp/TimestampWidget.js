import React from 'react';

const TimestampWidget = (message) => {
    return (
      <div className = "timestamp-widget">
        {message.payload}
      </div>
    );
};

export default TimestampWidget;

