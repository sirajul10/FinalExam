// AdminNavbar.jsx
import React from 'react';
import { FiMenu } from 'react-icons/fi';

const AdminNavbar = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <nav className="navbar w-full bg-base-300 border-b border-base-300">
      <div className="flex items-center gap-2">
        {/* Toggle button – always visible */}
        <button
          onClick={onToggleSidebar}
          className="btn btn-square btn-ghost"
          aria-label={isSidebarOpen ? 'close sidebar' : 'open sidebar'}
        >
          <FiMenu className="size-5" />
        </button>
        <div className="px-4 text-lg font-semibold">Admin Panel</div>
      </div>
    </nav>
  );
};

export default AdminNavbar;