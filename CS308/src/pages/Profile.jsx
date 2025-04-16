import React from 'react';
import Sidebar from '../components/SideBar';
import Orders from '../components/Orders';

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <Orders />
      </div>
    </div>
  );
};

export default Profile;
