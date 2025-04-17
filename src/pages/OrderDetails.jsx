import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = ({ orders }) => {
  const { orderId } = useParams();
  const order = orders.find(o => o.id === parseInt(orderId));

  if (!order) return <p>Order not found.</p>;

  return (
    <div className="max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id} Details</h1>
      <p className="text-sm text-gray-500 mb-2">Date: {order.date}</p>
      <p className="mb-2 font-medium text-gray-700">
        Status:{' '}
        <span
          className={
            order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'
          }
        >
          {order.status}
        </span>
      </p>
      <p className="mb-2">
        Total:{' '}
        <span className="text-orange-600 font-semibold">{order.total}</span>
      </p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Items:</h2>
        <ul className="list-disc list-inside text-gray-700">
          {order.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
