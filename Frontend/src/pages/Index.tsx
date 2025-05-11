
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated (in a real app)
    const isAuthenticated = localStorage.getItem('xenoAuth');
    
    // Redirect to login or dashboard based on auth status
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold text-xeno-primary mb-2">Xeno CRM</h1>
          <p className="text-gray-600">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
