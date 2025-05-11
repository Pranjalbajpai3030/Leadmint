
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isLoginPage && <Navigation />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Sonner />
      <Toaster />
    </div>
  );
};

export default Layout;
