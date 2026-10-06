import React, { useState } from 'react';
import FrontDeskSidebar from '../components/FrontDeskSidebar';
import FrontNavbar from '../components/FrontNavbar';
import { Outlet } from 'react-router';

const FrontRoot = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle */}
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        checked={isSidebarOpen}
        readOnly
      />

      {/* Main content */}
      <div className="drawer-content flex min-h-screen flex-col">
        {/* Navbar */}
        <FrontNavbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Nested admin pages */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <FrontDeskSidebar isOpen={isSidebarOpen} />
    </div>
  );
};

export default FrontRoot;