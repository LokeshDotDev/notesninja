"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Package,
  IndianRupee,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  title: string;
  price?: number;
}

interface ProductSubject {
  id: string;
  postId: string;
  subjectId: string;
  name: string;
  description?: string;
  price: number;
  isBundle: boolean;
  sortOrder: number;
  isActive: boolean;
}

export default function ProductSubjectsManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [subjects, setSubjects] = useState<ProductSubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for new/edit subject
  const [formData, setFormData] = useState({
    subjectId: '',
    name: '',
    description: '',
    price: '',
    isBundle: false,
    sortOrder: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProducts();
    }
  }, [session]);

  useEffect(() => {
    if (selectedProductId) {
      fetchSubjects(selectedProductId, true); // Force refresh on initial load
    }
  }, [selectedProductId]);

  // Refresh data when window gains focus (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedProductId) {
        fetchSubjects(selectedProductId, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [selectedProductId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSubjects = async (productId: string, forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      const url = forceRefresh 
        ? `/api/admin/product-subjects?productId=${productId}&t=${Date.now()}`
        : `/api/admin/product-subjects?productId=${productId}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !formData.subjectId || !formData.name || !formData.price) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      const url = editingId 
        ? `/api/admin/product-subjects/${editingId}`
        : '/api/admin/product-subjects';
      
      const method = editingId ? 'PUT' : 'POST';
      const payload = {
        postId: selectedProductId,
        ...formData,
        price: parseFloat(formData.price),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showMessage(
          editingId ? 'Subject updated successfully' : 'Subject created successfully',
          'success'
        );
        resetForm();
        fetchSubjects(selectedProductId, true); // Force refresh after create/update
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to save subject', 'error');
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      showMessage('Failed to save subject', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject: ProductSubject) => {
    setFormData({
      subjectId: subject.subjectId,
      name: subject.name,
      description: subject.description || '',
      price: subject.price.toString(),
      isBundle: subject.isBundle,
      sortOrder: subject.sortOrder,
    });
    setEditingId(subject.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/product-subjects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('Subject deleted successfully', 'success');
        fetchSubjects(selectedProductId, true); // Force refresh after delete
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to delete subject', 'error');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      showMessage('Failed to delete subject', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/product-subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        fetchSubjects(selectedProductId, true); // Force refresh after toggle
      } else {
        const error = await response.json();
        showMessage(error.error || 'Failed to update subject', 'error');
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      showMessage('Failed to update subject', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subjectId: '',
      name: '',
      description: '',
      price: '',
      isBundle: false,
      sortOrder: 0,
    });
    setEditingId(null);
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Subjects Manager</h1>
          <p className="mt-2 text-gray-600">Manage subjects and pricing for your products</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection and Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Subject' : 'Add New Subject'}
              </h2>

              {/* Product Selection */}
              <div className="mb-4">
                <Label htmlFor="product">Select Product</Label>
                <select
                  id="product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!!editingId}
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="subjectId">Subject ID</Label>
                    <Input
                      id="subjectId"
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      placeholder="e.g., business_communication"
                      disabled={!!editingId}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Business Communication"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the subject"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="999.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isBundle"
                      checked={formData.isBundle}
                      onChange={(e) => setFormData({ ...formData, isBundle: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="isBundle" className="ml-2">
                      This is a bundle option
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Subjects List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Subjects {selectedProductId && `for ${products.find(p => p.id === selectedProductId)?.title}`}
                </h2>
                {selectedProductId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchSubjects(selectedProductId, true)}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
              </div>

              {!selectedProductId ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a product to view and manage its subjects</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading subjects...</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No subjects found for this product</p>
                  <p className="text-sm mt-2">Add your first subject using the form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className={`border rounded-lg p-4 ${
                        subject.isActive ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{subject.name}</h3>
                            {subject.isBundle && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Bundle
                              </span>
                            )}
                            <span className="text-xs text-gray-500">ID: {subject.subjectId}</span>
                          </div>
                          {subject.description && (
                            <p className="text-sm text-gray-600 mb-2">{subject.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-green-600">
                              <IndianRupee className="w-4 h-4 inline mr-1" />
                              {subject.price.toFixed(2)}
                            </span>
                            <span className="text-gray-500">Order: {subject.sortOrder}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(subject.id, !subject.isActive)}
                            className="p-2 rounded-md hover:bg-gray-100"
                            title={subject.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {subject.isActive ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(subject)}
                            className="p-2 rounded-md hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            className="p-2 rounded-md hover:bg-gray-100"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
