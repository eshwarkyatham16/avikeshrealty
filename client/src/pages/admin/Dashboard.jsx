import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  UserPlus,
  Star,
  MessageSquareQuote,
  TrendingUp,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

const API_BASE = '/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, leadsRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`, { headers }),
          fetch(`${API_BASE}/leads?limit=5&sort=-createdAt`, { headers }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setRecentLeads(leadsData.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const statCards = stats
    ? [
        {
          label: 'Total Properties',
          value: stats.totalProperties,
          icon: Building2,
          color: 'bg-blue-50 text-blue-600',
        },
        {
          label: 'Leads Received',
          value: stats.totalLeads,
          icon: Users,
          color: 'bg-green-50 text-green-600',
        },
        {
          label: 'New This Month',
          value: stats.newLeadsThisMonth,
          icon: UserPlus,
          color: 'bg-amber-50 text-amber-600',
        },
        {
          label: 'Featured Properties',
          value: stats.featuredProperties,
          icon: Star,
          color: 'bg-purple-50 text-purple-600',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your real estate business
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional stat */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Testimonials
              </p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalTestimonials}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Leads
          </h2>
          <a
            href="/admin/leads"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            View all
            <TrendingUp className="w-4 h-4" />
          </a>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No leads yet. They will appear here when customers reach out.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.name}
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
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
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

function StatusBadge({ status }) {
  const styles = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Qualified: 'bg-green-50 text-green-700 border-green-200',
    Converted: 'bg-purple-50 text-purple-700 border-purple-200',
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
