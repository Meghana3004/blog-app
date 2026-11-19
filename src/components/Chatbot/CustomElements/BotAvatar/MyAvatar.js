import React from 'react';
import {ReactComponent as Robot} from '../../../../assets/robot.svg';

const MyAvatar = () => {
  return (
    <div className = "avatar">
     <Robot className="bot-icon"/>
    </div>
  );
};

export default MyAvatar;

