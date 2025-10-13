import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Mail, 
  Wallet, 
  Building, 
  Download, 
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [formData, setFormData] = useState({
    phone: '251',
    email: '',
    amount: '',
  });

  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'Telebirr',
      description: 'Fast & Secure Mobile Money',
      icon: Smartphone,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
      speed: 'Instant',
      fee: 'No fees',
      popular: true
    },
    {
      id: 'arifpay',
      name: 'Arifpay',
      description: 'Cards & Mobile Banking',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      speed: '2-5 mins',
      fee: '1.5% fee'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct Bank Deposit',
      icon: Building,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      speed: '1-2 hours',
      fee: 'Bank fees apply'
    }
  ];

  const selectedPayment = paymentMethods.find(method => method.id === selectedMethod);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      let checkoutData;
      
      switch (selectedMethod) {
        case 'arifpay':
          checkoutData = {
            phone: formData.phone,
            email: formData.email,
            nonce: `arifpay-${Date.now()}`,
            items: [{
              price: parseFloat(formData.amount),
              quantity: 1,
            }],
            paymentMethods: ['CARD', 'MOBILE_BANKING'],
          };
          break;

        case 'telebirr':
          checkoutData = {
            phone: formData.phone,
            email: formData.email,
            nonce: `telebirr-${Date.now()}`,
            items: [{
              price: parseFloat(formData.amount),
              quantity: 1,
            }],
            paymentMethods: ['TELEBIRR'],
          };
          break;

        case 'bank':
          toast.success('Bank transfer instructions sent to your email!');
          setLoading(false);
          return;

        default:
          throw new Error('Invalid payment method');
      }

      const response = await paymentService.createCheckout(checkoutData);
      
      if (response.success && response.checkoutUrl) {
        if (selectedMethod === 'bank') {
          toast.success('Payment instructions sent to your email!');
        } else {
          window.location.href = response.checkoutUrl;
        }
      } else {
        toast.error('Failed to create payment session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
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

  const getBankTransferInstructions = () => (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 mt-6">
      <div className="flex items-center mb-4">
        <Building className="text-purple-600 mr-3" size={24} />
        <h3 className="text-lg font-semibold text-purple-800">Bank Transfer Instructions</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
            <span className="text-purple-700">Bank Name:</span>
            <span className="font-semibold text-purple-900">CBE</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
            <span className="text-purple-700">Account Name:</span>
            <span className="font-semibold text-purple-900">TenaPay Health</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
            <span className="text-purple-700">Account Number:</span>
            <span className="font-semibold text-purple-900">100034567890</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-100">
            <span className="text-purple-700">Reference:</span>
            <span className="font-semibold text-purple-900">HF-{Date.now().toString().slice(-6)}</span>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center">
        <Download size={18} className="mr-2" />
        Download Transfer Slip
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
          <Wallet className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Add Funds to Your Health Wallet
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Secure, instant payments to keep your health fund active and ready when you need it most
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Payment Method Selector - Dropdown Version */}
              <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="text-emerald-500 mr-3" size={24} />
                  Choose Payment Method
                </h2>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      showPaymentMethods ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${selectedPayment.bgColor}`}>
                          {React.createElement(selectedPayment.icon, { size: 24 })}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{selectedPayment.name}</h3>
                          <p className="text-sm text-gray-500">{selectedPayment.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                            <span>⚡ {selectedPayment.speed}</span>
                            <span>💰 {selectedPayment.fee}</span>
                            {selectedPayment.popular && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-200 ${
                          showPaymentMethods ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showPaymentMethods && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-10 overflow-hidden">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => {
                              setSelectedMethod(method.id);
                              setShowPaymentMethods(false);
                            }}
                            className={`w-full p-4 text-left transition-all duration-200 hover:bg-gray-50 ${
                              selectedMethod === method.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${method.bgColor}`}>
                                <Icon size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                                  {method.popular && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                  <span>⚡ {method.speed}</span>
                                  <span>💰 {method.fee}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Amount Input */}
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 rounded-2xl border border-emerald-100">
                  <label htmlFor="amount" className="block text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Wallet className="text-emerald-600 mr-3" size={24} />
                    How much would you like to add?
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-emerald-600">
                      ETB
                    </span>
                    <input
                      type="number"
                      id="amount"
                      min="1"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full pl-20 pr-6 py-5 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-2xl font-bold bg-white placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[100, 500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                        className="px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors font-medium"
                      >
                        ETB {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Smartphone className="text-blue-500 mr-2" size={18} />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group-hover:border-gray-300 transition-colors"
                        placeholder="251XXXXXXXXX"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        +251
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Mail className="text-purple-500 mr-2" size={18} />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 group-hover:border-gray-300 transition-colors"
                        placeholder="your@email.com"
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Instructions */}
                {selectedMethod === 'bank' && getBankTransferInstructions()}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${selectedPayment.bgColor} hover:shadow-xl flex items-center justify-center space-x-3`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ETB {formData.amount || '0'}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              {/* Security Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="text-emerald-500" size={18} />
                      <span>Bank-level security</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Zap className="text-blue-500" size={18} />
                      <span>Instant processing</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <CheckCircle className="text-green-500" size={14} />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            {/* Why Add Funds */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="text-amber-500 mr-2" size={20} />
                Why Add Funds?
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '🛡️', text: 'Continuous health coverage' },
                  { icon: '⚡', text: 'Instant claim processing' },
                  { icon: '💰', text: 'No hidden fees' },
                  { icon: '📱', text: 'Mobile-friendly payments' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg">{benefit.icon}</span>
                    <span className="text-sm text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is available 24/7 to assist with payments
              </p>
              <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Payment Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Success Rate</span>
                  <span className="font-bold">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Avg. Time</span>
                  <span className="font-bold">23s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Happy Users</span>
                  <span className="font-bold">10K+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;