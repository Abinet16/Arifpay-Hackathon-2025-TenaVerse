import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  History, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Download,
  Sparkles,
  X,
  ChevronDown,
  Wallet
} from 'lucide-react';
import { claimService } from '../services/claimService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Claims = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    phone: user?.phone || '251',
    description: '',
    category: 'medical'
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await claimService.getClaimHistory();
      setClaims(response.transactions || []);
    } catch (error) {
      toast.error('Failed to load claims history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await claimService.requestClaim({
        amount: parseFloat(formData.amount),
        phone: formData.phone,
        description: formData.description,
        category: formData.category
      });
      
      toast.success('🎉 Claim request submitted successfully!');
      setShowForm(false);
      setFormData({ amount: '', phone: user?.phone || '251', description: '', category: 'medical' });
      fetchClaims();
    } catch (error) {
      toast.error(error.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value.startsWith('251')) {
      value = '251' + value.replace(/^251/, '');
    }
    if (value.length <= 12) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'rejected': return <XCircle size={16} className="text-red-500" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const claimCategories = [
    { value: 'medical', label: '🏥 Medical', description: 'Hospital & clinics' },
    { value: 'pharmacy', label: '💊 Pharmacy', description: 'Medicines' },
    { value: 'dental', label: '🦷 Dental', description: 'Teeth care' },
    { value: 'vision', label: '👁️ Vision', description: 'Eye care' },
    { value: 'emergency', label: '🚑 Emergency', description: 'Urgent care' }
  ];

  const selectedCategory = claimCategories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Claims</h1>
            <p className="text-gray-600">Manage and track your medical expense reimbursements</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Plus size={20} className="mr-2" />
            New Claim Request
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{claims.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {claims.filter(c => c.status === 'approved').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-emerald-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {claims.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Claims History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <History className="text-emerald-600 mr-3" size={24} />
                Claims History
              </h2>
              <button className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              ) : claims.length > 0 ? (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          claim.type === 'CREDIT' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="font-semibold text-gray-900">{claim.description || 'Medical Claim'}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(claim.status || 'pending')}`}>
                              {getStatusIcon(claim.status || 'pending')}
                              <span className="ml-1 capitalize">{claim.status || 'pending'}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </span>
                            <span>Ref: {claim.reference || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          claim.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {claim.type === 'CREDIT' ? '+' : '-'}ETB {claim.amount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {claim.type === 'CREDIT' ? 'Reimbursement' : 'Claim Request'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims yet</h3>
                  <p className="text-gray-500 mb-6">Submit your first claim to get started with reimbursements</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Plus size={20} className="mr-2" />
                    Submit First Claim
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Guide */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="text-amber-500 mr-2" size={20} />
              Claim Process
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Submit Claim</p>
                  <p className="text-xs text-gray-600">Fill out the claim form with details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Review</p>
                  <p className="text-xs text-gray-600">Our team verifies your claim</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Approval</p>
                  <p className="text-xs text-gray-600">Get approved within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment</p>
                  <p className="text-xs text-gray-600">Receive funds instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-3">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Our support team is here to assist with your claims
            </p>
            <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-3">💡 Quick Tips</h3>
            <div className="space-y-2 text-sm text-emerald-100">
              <p>• Keep medical receipts for verification</p>
              <p>• Submit claims within 30 days</p>
              <p>• Ensure correct phone number for payments</p>
              <p>• Check claim status regularly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compressed Claim Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto border border-gray-200">
            {/* Compact Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center text-white mr-2">
                  <Plus size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">New Claim</h2>
                  <p className="text-xs text-gray-600">Quick reimbursement</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-white rounded-lg transition-colors border border-gray-200"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            {/* Compact Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Category Dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                    formData.category === 'medical' ? 'bg-blue-50 border-blue-200' :
                    formData.category === 'pharmacy' ? 'bg-purple-50 border-purple-200' :
                    formData.category === 'dental' ? 'bg-cyan-50 border-cyan-200' :
                    formData.category === 'vision' ? 'bg-indigo-50 border-indigo-200' :
                    'bg-red-50 border-red-200'
                  } ${showCategoryDropdown ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{selectedCategory?.label.split(' ')[0]}</span>
                    <span className="text-xs text-gray-500 opacity-75">{selectedCategory?.description}</span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={`text-gray-500 transition-transform duration-200 ${
                      showCategoryDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {claimCategories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: category.value }));
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full p-2 text-left transition-colors hover:bg-gray-50 text-sm ${
                          formData.category === category.value ? 'bg-emerald-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.label}</span>
                          <span className="text-xs text-gray-500">{category.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Amount (ETB)
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={16} />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base font-semibold bg-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none bg-white text-sm"
                  rows="2"
                  placeholder="Brief description..."
                  maxLength={80}
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.description.length}/80
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
                  placeholder="251XXXXXXXXX"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-md disabled:opacity-50 transition-all flex items-center justify-center text-sm"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText size={14} className="mr-1" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;