import React, { useState } from 'react';

const ordersData = [
  {
    date: '29 May 2025',
    status: 'Shipped',
    total: '₦41,507',
    orderNo: 'F601098812001',
    payment: 'Pay On Collection',
    address: '65B Mbaise Road Owerri',
    items: ['2720 Flip - 2 8" -'],
  },
  {
    date: '8 Aug 2022',
    status: 'Delivered',
    total: '₦5,379',
    orderNo: 'F888552130001',
    payment: 'Pay On Collection',
    address: '12 cmd road magodo shangisha',
    items: ['Travel Laptop Backpack'],
  },
  {
    date: '31 May 2022',
    status: 'Delivered',
    total: '₦54,600',
    orderNo: 'F755205516001',
    payment: 'Pay On Collection',
    address: 'Note 7 Plus',
    items: ['Note 7 Plus'],
  },
];

function MyOrders() {
  const [tab, setTab] = useState('ongoing');

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-10">
      <div className="flex w-full max-w-5xl gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded p-6 flex flex-col gap-6">
          <div>
            <div className="font-bold text-lg mb-2">My Profile</div>
            <div className="text-gray-600 text-sm">Account Information</div>
            <div className="text-gray-600 text-sm">Delivery Address</div>
          </div>
          <div>
            <div className="font-bold text-lg mb-2">My Orders</div>
            <div
              className={`cursor-pointer mb-1 ${tab === 'ongoing' ? 'text-pink-600 font-semibold' : 'text-gray-600'}`}
              onClick={() => setTab('ongoing')}
            >
              Order History
            </div>
            <div className="text-gray-600 text-sm">Pending Ratings</div>
          </div>
          <div>
            <div className="font-bold text-lg mb-2">My Wallet</div>
            <div className="text-gray-600 text-sm">Wallet</div>
          </div>
          <div>
            <div className="font-bold text-lg mb-2">Delete Account</div>
            <div className="text-gray-600 text-sm">Delete Account</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded p-8">
          <div className="font-bold text-xl mb-4">My Orders</div>
          <div className="flex gap-8 border-b mb-4">
            <button
              className={`pb-2 border-b-2 ${tab === 'ongoing' ? 'border-pink-500 text-pink-600 font-bold' : 'border-transparent text-gray-600'}`}
              onClick={() => setTab('ongoing')}
            >
              ONGOING / DELIVERED (4)
            </button>
            <button
              className={`pb-2 border-b-2 ${tab === 'cancelled' ? 'border-pink-500 text-pink-600 font-bold' : 'border-transparent text-gray-600'}`}
              onClick={() => setTab('cancelled')}
            >
              CANCELLED (2)
            </button>
          </div>
          {/* Orders List */}
          {ordersData.map((order, idx) => (
            <div key={idx} className="border-b py-6 flex justify-between items-start">
              <div>
                <div className="mb-1">
                  <span className="font-semibold">Order Date :</span> {order.date} |{' '}
                  <span className={order.status === 'Shipped' ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}>
                    {order.status}
                  </span>
                </div>
                <div className="text-gray-700 text-sm mb-1">Total: {order.total}</div>
                <div className="text-gray-700 text-sm mb-1">Order No: {order.orderNo}</div>
                <div className="text-gray-700 text-sm mb-1">Payment Method: {order.payment}</div>
                <div className="text-gray-700 text-sm mb-1">{order.items.join(', ')}</div>
              </div>
              <div className="flex flex-col items-end">
                <button className="bg-pink-100 text-pink-600 px-4 py-2 rounded mb-2 font-semibold">View Details</button>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold">Delivery Address:</span> {order.address}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default MyOrders;