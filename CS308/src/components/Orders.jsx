import React, { useState } from 'react';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    {
      id: 1,
      date: '2025-04-10',
      status: 'delivered',
      items: ['Red Dress', 'Sneakers'],
      total: '450.00 TL',
    },
    {
      id: 2,
      date: '2025-04-14',
      status: 'preparing',
      items: ['Wireless Mouse'],
      total: '200.00 TL',
    },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ongoing') return order.status !== 'delivered';
    if (activeTab === 'past') return order.status === 'delivered';
    return true;
  });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        {['all', 'ongoing', 'past'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all'
              ? 'All'
              : tab === 'ongoing'
              ? 'Ongoing Orders'
              : 'Past Orders'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-medium text-gray-800">Order #{order.id}</div>
                <div className="text-sm text-gray-500">Date: {order.date}</div>
              </div>
              <div className="text-right">
                <div className="text-orange-600 font-semibold">{order.total}</div>
                <div
                  className={`text-sm ${
                    order.status === 'delivered'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.status === 'delivered'
                    ? 'Delivered'
                    : 'In Preparation'}
                </div>
              </div>
            </div>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {order.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <button className="mt-3 text-blue-600 text-sm hover:underline">
              Order Information
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
