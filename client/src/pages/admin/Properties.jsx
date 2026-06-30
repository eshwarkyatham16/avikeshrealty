import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  StarOff,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

const API_BASE = '/api';

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Commercial', 'Plot', 'Luxury'];
const STATUS_OPTIONS = ['Available', 'Sold', 'Upcoming'];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  priceNumeric: '',
  location: '',
  propertyType: 'Villa',
  bedrooms: '',
  bathrooms: '',
  area: '',
  amenities: '',
  featured: false,
  status: 'Available',
};

export default function Properties() {
  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [page, setPage] = useState(1);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        sort: '-createdAt',
      });
      if (search) params.set('search', search);
      if (filterType) params.set('propertyType', filterType);

      const res = await fetch(`${API_BASE}/properties?${params}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setPagination({
          page: data.page,
          pages: data.pages,
          total: data.total,
        });
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  }, [headers, page, search, filterType]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (property) => {
    setEditingId(property._id);
    setForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      priceNumeric: property.priceNumeric || '',
      location: property.location || '',
      propertyType: property.propertyType || 'Villa',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area || '',
      amenities: (property.amenities || []).join(', '),
      featured: property.featured || false,
      status: property.status || 'Available',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      ...form,
      priceNumeric: Number(form.priceNumeric) || 0,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      amenities: form.amenities
        ? form.amenities.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      const url = editingId
        ? `${API_BASE}/properties/${editingId}`
        : `${API_BASE}/properties`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchProperties();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save property');
      }
    } catch {
      alert('Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) fetchProperties();
    } catch {
      alert('Failed to delete property');
    }
  };

  const toggleFeatured = async (property) => {
    try {
      await fetch(`${API_BASE}/properties/${property._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ featured: !property.featured }),
      });
      fetchProperties();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const handleImageUpload = async (propertyId, files) => {
    if (!files || files.length === 0) return;
    setUploadingId(propertyId);

    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    try {
      const res = await fetch(`${API_BASE}/properties/${propertyId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) fetchProperties();
    } catch {
      alert('Failed to upload images');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total properties
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Property' : 'Add Property'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (display) *
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="e.g. 5.8 Cr"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (numeric)
                  </label>
                  <input
                    type="number"
                    value={form.priceNumeric}
                    onChange={(e) =>
                      setForm({ ...form, priceNumeric: e.target.value })
                    }
                    placeholder="e.g. 58000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) =>
                      setForm({ ...form, propertyType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) =>
                      setForm({ ...form, bedrooms: e.target.value })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) =>
                      setForm({ ...form, bathrooms: e.target.value })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) =>
                      setForm({ ...form, area: e.target.value })
                    }
                    placeholder="e.g. 4,500 sq ft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.amenities}
                    onChange={(e) =>
                      setForm({ ...form, amenities: e.target.value })
                    }
                    placeholder="Pool, Gym, Garden"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured Property
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Update Property'
                      : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No properties found. Add your first property to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {property.bedrooms ? `${property.bedrooms} BD` : ''}{' '}
                            {property.bathrooms ? `${property.bathrooms} BA` : ''}{' '}
                            {property.area || ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {property.propertyType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {property.price}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {property.location}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleFeatured(property)}
                        className="text-gray-400 hover:text-amber-500 transition"
                        title={
                          property.featured
                            ? 'Remove from featured'
                            : 'Mark as featured'
                        }
                      >
                        {property.featured ? (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <label
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                          title="Upload images"
                        >
                          {uploadingId === property._id ? (
                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingId === property._id}
                            onChange={(e) =>
                              handleImageUpload(property._id, e.target.files)
                            }
                          />
                        </label>
                        <button
                          onClick={() => openEdit(property)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="p-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Available: 'bg-green-50 text-green-700 border-green-200',
    Sold: 'bg-red-50 text-red-700 border-red-200',
    Upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
        styles[status] || 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}
