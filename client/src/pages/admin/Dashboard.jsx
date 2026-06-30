import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Building2,
  Star,
  MessageSquareQuote,
  UserCircle,
  ImageIcon,
} from 'lucide-react';

const API_BASE = '/api';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, propertiesRes] = await Promise.all([
          fetch(`${API_BASE}/dashboard/stats`, { headers }),
          fetch(`${API_BASE}/properties?sort=newest&limit=5`, { headers }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          setRecentProperties(propertiesData.properties || []);
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
          label: 'Featured Properties',
          value: stats.featuredProperties,
          icon: Star,
          color: 'bg-amber-50 text-amber-600',
        },
        {
          label: 'Testimonials',
          value: stats.totalTestimonials,
          icon: MessageSquareQuote,
          color: 'bg-pink-50 text-pink-600',
        },
        {
          label: 'Team Members',
          value: stats.totalTeamMembers,
          icon: UserCircle,
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

      {/* Recently added properties */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recently Added Properties
          </h2>
          <a
            href="/admin/properties"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            View all
          </a>
        </div>

        {recentProperties.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No properties yet. Add your first property to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                      </div>
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
