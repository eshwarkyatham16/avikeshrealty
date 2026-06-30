import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  UserCircle,
  Globe,
  Link as LinkIcon,
  AtSign,
} from 'lucide-react';

const API_BASE = '/api';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  image: '',
  order: 0,
  instagram: '',
  linkedin: '',
  twitter: '',
};

export default function TeamMembers() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
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

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/team`, { headers });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data);
      }
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditingId(m._id);
    setForm({
      name: m.name || '',
      role: m.role || '',
      bio: m.bio || '',
      image: m.image || '',
      order: m.order || 0,
      instagram: m.social?.instagram || '',
      linkedin: m.social?.linkedin || '',
      twitter: m.social?.twitter || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      name: form.name,
      role: form.role,
      bio: form.bio,
      image: form.image,
      order: Number(form.order) || 0,
      social: {
        instagram: form.instagram,
        linkedin: form.linkedin,
        twitter: form.twitter,
      },
    };

    try {
      const url = editingId
        ? `${API_BASE}/team/${editingId}`
        : `${API_BASE}/team`;
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
        fetchMembers();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to save team member');
      }
    } catch {
      alert('Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await fetch(`${API_BASE}/team/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) fetchMembers();
    } catch {
      alert('Failed to delete team member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            {members.length} team members
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    placeholder="e.g. Head of Sales"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: e.target.value })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Social Links
                </p>
                <div className="flex items-center gap-3">
                  <AtSign className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) =>
                      setForm({ ...form, instagram: e.target.value })
                    }
                    placeholder="Instagram URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm({ ...form, linkedin: e.target.value })
                    }
                    placeholder="LinkedIn URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={form.twitter}
                    onChange={(e) =>
                      setForm({ ...form, twitter: e.target.value })
                    }
                    placeholder="Twitter URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
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
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards/Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              No team members yet. Add your first one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Bio</th>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Social</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCircle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-400">{m.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-600 max-w-[250px] truncate">
                        {m.bio || '-'}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {m.order}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {m.social?.instagram && (
                          <a
                            href={m.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-500 transition"
                          >
                            <AtSign className="w-4 h-4" />
                          </a>
                        )}
                        {m.social?.linkedin && (
                          <a
                            href={m.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                        {m.social?.twitter && (
                          <a
                            href={m.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-sky-500 transition"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {!m.social?.instagram &&
                          !m.social?.linkedin &&
                          !m.social?.twitter && (
                            <span className="text-xs text-gray-300">None</span>
                          )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
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
