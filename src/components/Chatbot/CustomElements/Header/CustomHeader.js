import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

const CustomHeader = ({refreshChat}) => {
    const handleRefresh = () => {
        refreshChat();
    };

  return (
    <div className="custom-header">
      <div>Travel Bot</div>
      <div className="refresh-icon" onClick={handleRefresh}>
        <RefreshIcon />
      </div>
    </div>
  );
};

export default CustomHeader;

