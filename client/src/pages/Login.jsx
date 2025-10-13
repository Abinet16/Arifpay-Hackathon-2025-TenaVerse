import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Centered Login Card - Smaller Size */}
      <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-sm">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white p-6 transform hover:shadow-2xl transition-all duration-500">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl shadow-lg mb-3">
                <Lock size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-sm text-gray-600">
                Access your health fund account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="block w-full pl-9 pr-3 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full pl-9 pr-10 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Forgot your password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight 
                        size={16} 
                        className={`ml-2 transition-transform duration-200 ${
                          isHovered ? 'translate-x-1' : ''
                        }`} 
                      />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">New to TenaPay?</span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Create your account
              </Link>
            </div>

            {/* Security Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <Shield size={10} className="mr-1" />
                Your data is securely encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;