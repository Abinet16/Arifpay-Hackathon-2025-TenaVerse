import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Activity, 
  Shield,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [overviewData, usersData, auditData] = await Promise.all([
        adminService.getOverview(),
        adminService.getUsers(),
        adminService.getAuditLogs()
      ]);

      setOverview(overviewData.metrics);
      setUsers(usersData.users || []);
      setAuditLogs(auditData.logs || []);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  // Calculate additional metrics
  const metrics = overview ? {
    claimRate: overview.totalCollected > 0 ? (overview.totalClaimed / overview.totalCollected) * 100 : 0,
    netFlow: overview.totalCollected - overview.totalClaimed,
    reserveRatio: overview.totalClaimed > 0 ? (overview.totalBalance / overview.totalClaimed) * 100 : 100,
    avgUserBalance: overview.totalUsers > 0 ? overview.totalBalance / overview.totalUsers : 0
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = overview ? [
    {
      name: 'Total Users',
      value: overview.totalUsers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      name: 'Total Collected',
      value: `ETB ${overview.totalCollected.toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
    },
    {
      name: 'Total Claims',
      value: `ETB ${overview.totalClaimed.toLocaleString()}`,
      change: '+3.1%',
      trend: 'up',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      name: 'Fund Pool',
      value: `ETB ${overview.totalBalance.toLocaleString()}`,
      change: '+5.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    },
  ] : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE': return <CheckCircle size={16} className="text-green-500" />;
      case 'UPDATE': return <Activity size={16} className="text-blue-500" />;
      case 'DELETE': return <XCircle size={16} className="text-red-500" />;
      default: return <Shield size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor platform health and manage operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} className="mr-2" />
              Export Report
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className={`flex items-center text-xs font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <TrendingUp size={14} className="mr-1" />
                    {stat.change} from last month
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', name: 'Platform Overview', icon: BarChart3 },
              { id: 'users', name: 'User Management', icon: Users },
              { id: 'audit', name: 'Audit Trail', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-8 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Health */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="mr-2 text-blue-600" />
                    Platform Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-gray-700">Active Users</span>
                      <span className="text-lg font-bold text-blue-600">{overview?.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-gray-700">Total Volume</span>
                      <span className="text-lg font-bold text-cyan-600">ETB {overview?.totalCollected?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-sm font-medium text-gray-700">Claim Rate</span>
                      <span className="text-lg font-bold text-purple-600">
                        {metrics?.claimRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="mr-2 text-emerald-600" />
                    Financial Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="text-sm font-medium text-gray-700">Net Flow</span>
                      <span className={`text-lg font-bold ${
                        metrics?.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        ETB {metrics?.netFlow.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="text-sm font-medium text-gray-700">Available Funds</span>
                      <span className="text-lg font-bold text-green-600">
                        ETB {overview?.totalBalance?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-emerald-100">
                      <span className="text-sm font-medium text-gray-700">Reserve Ratio</span>
                      <span className="text-lg font-bold text-orange-600">
                        {metrics?.reserveRatio.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90">Avg. User Balance</div>
                  <div className="text-2xl font-bold mt-1">
                    ETB {metrics?.avgUserBalance.toFixed(2)}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90">Claims Processed</div>
                  <div className="text-2xl font-bold mt-1">
                    {users.reduce((acc, user) => acc + user.transactions.filter(t => t.type === 'DEBIT').length, 0)}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90">Active Policies</div>
                  <div className="text-2xl font-bold mt-1">
                    {users.filter(user => user.balance > 0).length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            ETB {user.balance.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.transactions.length} transactions
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status || 'ACTIVE')}`}>
                            {user.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white transition-colors">
                    <div className="flex-shrink-0">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {log.admin?.email || 'System'}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm font-medium text-emerald-600 capitalize">{log.action.toLowerCase()}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {log.meta && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(log.meta, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;