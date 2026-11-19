import TimestampWidget from "../Timestamp/TimestampWidget";
import "./options.css";
import React, { useState } from "react";

const Options = (props) => {

  const [message, setMessage] = useState('');
  const[cities, setCities] = useState([]);
  
  const options = [
    {
      text: "Tropical Paradise",
      handler: () => {
       setMessage("Great choice! Here are some suggestions: ");
       setCities(["Costa Rica", "Fiji", "Bora Bora"])
      },
      id: 1,
    },
    { text: "Mountain Retreat", 
      handler: () => {
        setMessage("Great choice! Here are some suggestions: ");
        setCities(["Swiss Alps", "Rocky Mountains", "Andes"])
    },
      id: 2,
    },
    { text: "City Adventure", 
      handler: () => {
        setMessage("Great choice! Here are some suggestions: ");
        setCities(["New York", "Tokyo", "Paris"])
    },
      id: 3 
    },
  ];

  return (
    <div className="options-container">
      {options.map((option) => (
        <button className="option-button" key={option.id} onClick={option.handler}>
          {option.text}
        </button>
      ))}

      <p><b>{message}</b></p>

      {cities.map((city, index) => (
        <button className="option-button" key={index}>
          {city}
        </button>
        ))}
         <TimestampWidget {...props} />
      </div>
  );
};

export default Options;
