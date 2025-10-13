import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Plus,
  Zap,
  Calendar,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { claimService } from '../services/claimService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, claimsData] = await Promise.all([
          authService.getProfile(),
          claimService.getClaimHistory()
        ]);
        
        setProfile(profileData.user);
        setRecentClaims(claimsData.transactions?.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate additional metrics
  const totalContributions = recentClaims
    .filter(claim => claim.type === 'CREDIT')
    .reduce((sum, claim) => sum + claim.amount, 0);

  const totalClaims = recentClaims
    .filter(claim => claim.type === 'DEBIT')
    .reduce((sum, claim) => sum + claim.amount, 0);

  const activeMonths = profile ? Math.floor((new Date() - new Date(profile.createdAt)) / (30 * 24 * 60 * 60 * 1000)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Current Balance',
      value: `ETB ${profile?.balance?.toLocaleString() || '0'}`,
      change: '+15% this month',
      trend: 'up',
      icon: CreditCard,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
    },
    {
      name: 'Total Contributions',
      value: `ETB ${totalContributions.toLocaleString()}`,
      change: 'Lifetime total',
      trend: 'neutral',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      name: 'Claims Processed',
      value: recentClaims.filter(c => c.type === 'DEBIT').length,
      change: `${totalClaims.toLocaleString()} ETB total`,
      trend: 'neutral',
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    },
    {
      name: 'Member Since',
      value: activeMonths > 0 ? `${activeMonths} months` : 'New Member',
      change: new Date(profile?.createdAt).toLocaleDateString(),
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  ];

  const quickActions = [
    {
      title: 'Add Funds',
      description: 'Top up your health fund balance',
      icon: Plus,
      color: 'from-emerald-500 to-green-500',
      href: '/payments',
      buttonText: 'Add Money'
    },
    {
      title: 'Submit Claim',
      description: 'Request medical expense reimbursement',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      href: '/claims',
      buttonText: 'Start Claim'
    },
    {
      title: 'View History',
      description: 'Check your transaction history',
      icon: Activity,
      color: 'from-purple-500 to-indigo-500',
      href: '/history',
      buttonText: 'View All'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your TenaPay health fund overview
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} className="mr-2" />
              Export Statement
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.[0]?.toUpperCase()}
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
                    stat.trend === 'up' ? 'text-emerald-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
                    {stat.trend === 'down' && <ArrowDownRight size={14} className="mr-1" />}
                    {stat.change}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <a
                    href={action.href}
                    className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${action.color} text-white rounded-lg hover:shadow-md transition-all transform hover:scale-105`}
                  >
                    <span className="text-sm font-medium">{action.buttonText}</span>
                    <ArrowUpRight size={16} className="ml-2" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="mr-2 text-emerald-600" />
                Recent Transactions
              </h2>
              <a href="/history" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                View All
                <ArrowUpRight size={16} className="ml-1" />
              </a>
            </div>
            <div className="p-6">
              {recentClaims.length > 0 ? (
                <div className="space-y-4">
                  {recentClaims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          claim.type === 'CREDIT' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {claim.type === 'CREDIT' ? <Plus size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{claim.description}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(claim.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        claim.type === 'CREDIT' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {claim.type === 'CREDIT' ? '+' : '-'} ETB {claim.amount?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 mb-2">No recent transactions</p>
                  <p className="text-sm text-gray-400">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Fund Status */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Shield size={24} />
              <span className="text-emerald-100 text-sm font-medium">Active</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Health Fund Status</h3>
            <p className="text-emerald-100 text-sm mb-4">
              Your coverage is active and ready for claims
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">ETB {profile?.balance?.toLocaleString()}</span>
              <div className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="mr-2 text-yellow-500" />
              Quick Tips
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <p className="text-sm text-gray-600">
                  Keep your balance above ETB 100 for continuous coverage
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <p className="text-sm text-gray-600">
                  Submit claims within 30 days of medical service
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <p className="text-sm text-gray-600">
                  Use Telebirr for instant fund transfers
                </p>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Our support team is here to assist you
            </p>
            <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;