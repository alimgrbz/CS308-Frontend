import React from 'react';
import '../styles/SideBar.css'; 
import {
  ClipboardDocumentListIcon,
  StarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="email">usermail@example.com</div>
        <div className="welcome">Welcome back 👋</div>
      </div>

      <div>
        <h2>My Orders</h2>
        <ul>
          <li>
            <div className="icon-text">
              <ClipboardDocumentListIcon className="w-5 h-5" />
              All Orders
            </div>
          </li>
          <li>
            <div className="icon-text">
              <StarIcon className="w-5 h-5 text-gray-500" />
              My Reviews
            </div>
            <span className="badge">8</span>
          </li>
          <li>
            <div className="icon-text">
              <ArrowPathIcon className="w-5 h-5 text-gray-500" />
              Purchase Again
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
