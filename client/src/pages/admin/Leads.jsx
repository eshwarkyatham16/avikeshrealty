import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Trash2,
  Download,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';

const API_BASE = '/api';
const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted'];

export default function Leads() {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        sort: '-createdAt',
      });
      if (search) params.set('search', search);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`${API_BASE}/leads?${params}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, filterStatus]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) fetchLeads();
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;

    const csvHeaders = [
      'Name',
      'Phone',
      'Email',
      'Budget',
      'Property Type',
      'Message',
      'Source',
      'Status',
      'Date',
    ];
    const csvRows = leads.map((l) => [
      l.name,
      l.phone,
      l.email || '',
      l.budget || '',
      l.propertyType || '',
      (l.message || '').replace(/"/g, '""'),
      l.source || '',
      l.status,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) =>
        row.map((cell) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} total leads
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No leads found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        via {lead.source}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {lead.budget || '-'}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {lead.propertyType || '-'}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-600 max-w-[200px] truncate">
                        {lead.message || '-'}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${statusStyle(lead.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

function statusStyle(status) {
  const styles = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Qualified: 'bg-green-50 text-green-700 border-green-200',
    Converted: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
}
