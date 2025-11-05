'use client';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function MenuPage() {
  const [items, setItems] = useState([]);

  // Load menu items from your API
  async function load() {
    const res = await fetch('/api/menu', { cache: 'no-store' });
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    });
    
    const channel = pusher.subscribe('menu-channel');
    channel.bind('menu-updated', () => {
      load();
    });

    return () => {
      pusher.unsubscribe('menu-channel');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h1 className="text-6xl font-bold text-gray-800 mb-2">Our Menu</h1>
              <p className="text-2xl text-gray-600">Fresh concessions made with care</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-3xl font-semibold text-gray-700 mb-2">Menu Coming Soon</h3>
                  <p className="text-xl text-gray-500">We&apos;re preparing something delicious for you!</p>
                </div>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    !item.available ? 'opacity-60' : 'hover:-translate-y-1'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex flex-col items-center text-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-3">{item.name}</h2>
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-green-600 mb-2">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${
                          item.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className={`w-3 h-3 rounded-full mr-2 ${
                            item.available ? 'bg-green-400' : 'bg-red-400'
                          }`}></span>
                          {item.available ? 'Available' : 'Sold Out'}
                        </div>
                      </div>
                    </div>
                    
                    {!item.available && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-lg text-red-700 font-medium">Currently unavailable</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <p className="text-2xl text-gray-600">
                  <span className="font-semibold text-gray-800">{items.filter(item => item.available).length}</span> items available
                  {items.some(item => !item.available) && (
                    <span className="ml-4">• <span className="font-semibold text-red-600">{items.filter(item => !item.available).length}</span> sold out</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
