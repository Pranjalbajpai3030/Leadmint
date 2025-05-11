
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import XenoLogo from '@/components/XenoLogo';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoogleLogin = () => {
    // Mock login flow - in a real app, this would be an OAuth redirect
    toast.loading('Logging in with Google...', { duration: 2000 });
    
    // Simulate successful login after 2 seconds
    setTimeout(() => {
      // Store fake token and user info
      localStorage.setItem('xenoAuth', JSON.stringify({
        userId: 'user123',
        token: 'mock-google-token-xyz',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        picture: 'https://i.pravatar.cc/300'
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-xeno-secondary to-white">
      <div className="xeno-card max-w-md w-full flex flex-col items-center p-8">
        <div className="mb-8">
          <XenoLogo />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome to Xeno CRM</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to access your customer management platform</p>
        
        <Button 
          onClick={handleGoogleLogin}
          className="w-full py-6 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.0625 10.2271C19.0625 9.60156 19.0117 8.98047 18.9058 8.37891H10.2083V11.8813H15.1367C14.9169 13.0042 14.2617 13.9813 13.2754 14.6365V16.9715H16.2559C18.0508 15.3174 19.0625 12.9912 19.0625 10.2271Z" fill="#4285F4"/>
            <path d="M10.2077 19.0625C12.7142 19.0625 14.8359 18.2539 16.2552 16.9717L13.2748 14.6367C12.4326 15.1917 11.3701 15.5156 10.2077 15.5156C7.72889 15.5156 5.62913 13.8784 4.85913 11.6582H1.79004V14.0605C3.20507 17.0156 6.44944 19.0625 10.2077 19.0625Z" fill="#34A853"/>
            <path d="M4.86003 11.6582C4.67636 11.1032 4.57812 10.5137 4.57812 9.90625C4.57812 9.29883 4.67636 8.70931 4.86003 8.15433V5.75195H1.79094C1.17871 7.01433 0.833008 8.42936 0.833008 9.90625C0.833008 11.3831 1.17871 12.7982 1.79094 14.0605L4.86003 11.6582Z" fill="#FBBC05"/>
            <path d="M10.2077 4.29688C11.5378 4.29688 12.7368 4.7493 13.6728 5.64445L16.3134 3.0039C14.8306 1.63378 12.7089 0.75 10.2077 0.75C6.44944 0.75 3.20507 2.79695 1.79004 5.75195L4.85913 8.15433C5.62913 5.93414 7.72889 4.29688 10.2077 4.29688Z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </Button>
        
        <p className="mt-6 text-xs text-gray-500">
          By signing in, you agree to Xeno CRM's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
