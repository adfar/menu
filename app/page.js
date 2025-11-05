'use client';
import { useEffect, useState } from 'react';

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
  }, []);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Concessions Menu</h1>
      <ul className="space-y-4">
        {items.length === 0 && <p>No menu items yet.</p>}
        {items.map(item => (
          <li
            key={item.id}
            className="flex justify-between border rounded-lg p-3 shadow-sm bg-white"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              {!item.available && (
                <p className="text-sm text-red-600">Currently unavailable</p>
              )}
            </div>
            <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
