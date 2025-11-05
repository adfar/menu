'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', available: true });
  const [editingId, setEditingId] = useState(null);

  // Load menu items
  async function load() {
    const res = await fetch('/api/menu', { cache: 'no-store' });
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  // Add or update an item
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (editingId) {
      // Update existing item
      await fetch(`/api/menu/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          available: form.available,
        }),
      });
    } else {
      // Create new item
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          available: form.available,
        }),
      });
    }
    
    setForm({ name: '', price: '', available: true });
    setEditingId(null);
    load();
  }

  // Delete an item
  async function handleDelete(id) {
  // Remove the item locally first (optimistic update)
  setItems(prev => prev.filter(item => item.id !== id));

  try {
    const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      // If the request failed, reload from the server to restore correct data
      console.error('Delete failed on server, reloading list...');
      await load();
    }
  } catch (err) {
    console.error('Delete request error:', err);
    // If network error, restore the full list from the server
    await load();
  }
}

  // Edit an item
  function handleEdit(item) {
    setForm({
      name: item.name,
      price: item.price.toString(),
      available: item.available
    });
    setEditingId(item.id);
  }

  // Cancel edit
  function handleCancel() {
    setForm({ name: '', price: '', available: true });
    setEditingId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Menu Admin Dashboard</h1>
            <p className="text-gray-600">Manage your restaurant menu items</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Item Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className={`p-2 rounded-full mr-3 ${editingId ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                  </svg>
                </span>
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    placeholder="Enter item name..."
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={form.available}
                    onChange={e => setForm({ ...form, available: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                    Available for customers
                  </label>
                </div>
                
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    {editingId ? 'Update Item' : 'Add Menu Item'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Menu Items List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Current Menu ({items.length} items)
                </span>
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No menu items yet</p>
                    <p className="text-sm">Add your first item using the form</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center mt-1 space-x-3">
                          <span className="text-lg font-semibold text-green-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                          title="Edit item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                          title="Delete item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
