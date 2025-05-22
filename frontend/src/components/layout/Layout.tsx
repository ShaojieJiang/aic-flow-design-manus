import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex flex-col flex-1 w-full">
        <Navbar />
        
        <main className="h-full overflow-y-auto pt-16 px-6">
          <div className="container mx-auto grid">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
