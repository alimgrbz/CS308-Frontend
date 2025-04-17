import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import OrderPreviewList from './OrderList'; 

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fakeOrders = [
      {
        id: 1,
        date: '2025-04-10',
        status: 'delivered',
        total: '450.00 TL',
        items: ['Red Dress', 'Sneakers'],
        product: { name: 'Red Dress', image: '/images/red-dress.jpg' },
      },
      {
        id: 2,
        date: '2025-04-14',
        status: 'preparing',
        total: '200.00 TL',
        items: ['Wireless Mouse'],
        product: { name: 'Wireless Mouse', image: '/images/mouse.jpg' },
      },
    ];

    setOrders(fakeOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ongoing') return order.status !== 'delivered';
    if (activeTab === 'past') return order.status === 'delivered';
    return true; // all
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['all', 'ongoing', 'past'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all'
                ? 'All Orders'
                : tab === 'ongoing'
                ? 'Ongoing Orders'
                : 'Past Orders'}
            </button>
          ))}
        </div>

        {/* Preview List */}
        <OrderPreviewList orders={filteredOrders} />
      </div>
    </div>
  );
};

export default Profile;
