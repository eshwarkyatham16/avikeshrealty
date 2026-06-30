import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  X,
  MessageSquareQuote,
} from 'lucide-react';

const API_BASE = '/api';

const emptyForm = {
  name: '',
  role: '',
  content: '',
  rating: 5,
  image: '',
  featured: true,
};

export default function Testimonials() {
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/testimonials`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name || '',
      role: t.role || '',
      content: t.content || '',
      rating: t.rating || 5,
      image: t.image || '',
      featured: t.featured !== false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const body = { ...form, rating: Number(form.rating) };

    try {
      const url = editingId
        ? `${API_BASE}/testimonials/${editingId}`
        : `${API_BASE}/testimonials`;
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
        fetchTestimonials();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save testimonial');
      }
    } catch {
      alert('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) fetchTestimonials();
    } catch {
      alert('Failed to delete testimonial');
    }
  };

  const toggleFeatured = async (t) => {
    try {
      await fetch(`${API_BASE}/testimonials/${t._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ featured: !t.featured }),
      });
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {testimonials.length} testimonials
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Business Owner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Testimonial Content *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

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
                  Featured on website
                </span>
              </label>

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
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
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
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquareQuote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              No testimonials yet. Add your first one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-5 py-3">Person</th>
                  <th className="px-5 py-3">Content</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {t.name}
                      </p>
                      {t.role && (
                        <p className="text-xs text-gray-400">{t.role}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-600 max-w-[300px] truncate">
                        {t.content}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < t.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleFeatured(t)}
                        className="text-gray-400 hover:text-amber-500 transition"
                      >
                        {t.featured ? (
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
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
      </div>
    </div>
  );
}
