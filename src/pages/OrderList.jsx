import React from 'react';
import { Link } from 'react-router-dom';

const OrderPreviewList = ({ orders }) => {
  return (
    <div className="grid gap-4">
      {orders.map(order => (
        <Link
          to={`/profile/orders/${order.id}`}
          key={order.id}
          className="flex items-center justify-between border p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <img
              src={order.product.image}
              alt={order.product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <div className="font-semibold">{order.product.name}</div>
              <div className="text-sm text-gray-500">{order.date}</div>
            </div>
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
              {order.status === 'delivered' ? 'Delivered' : 'In Preparation'}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderPreviewList;
