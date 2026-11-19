import React from 'react';
import {ReactComponent as User} from '../../../../assets/user.svg';

const UserAvatar = () => {
  return (
    <div className = "user-avatar">
     <User className="user-icon"/>
    </div>
  );
};

export default UserAvatar;

