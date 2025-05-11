
import React from 'react';
import { Link } from 'react-router-dom';

const XenoLogo: React.FC = () => {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <img 
        src="/xeno-logo.jpeg" 
        alt="Xeno CRM" 
        className="h-8 w-auto"
      />
    </Link>
  );
};

export default XenoLogo;
