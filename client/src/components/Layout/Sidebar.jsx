import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  FileText, 
  Users, 
  Settings, 
  X,
  Shield,
  Heart,
  Sparkles
} from 'lucide-react';
import image from '../../assets/image/image.png';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Make Payment', href: '/payments', icon: CreditCard },
    { name: 'Claims', href: '/claims', icon: FileText },
    ...(user?.role === 'ADMIN' 
      ? [{ name: 'Admin', href: '/admin', icon: Users }]
      : []
    ),
    { name: 'Profile', href: '/profile', icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-gray-50/80 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/60
        ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
      `}>
        {/* Header with Enhanced Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/60 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex items-center space-x-3">
            {/* Logo Container with Gradient Border */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-xl p-2 border border-gray-200/80 shadow-sm">
                <img 
                  src={image} 
                  alt="TenaPay Logo" 
                  className="w-10 h-10 object-contain drop-shadow-sm"
                />
              </div>
            </div>
            
            {/* Brand Name with Gradient Text */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                TenaPay
              </h1>
              <div className="flex items-center space-x-1">
                <Heart size={10} className="text-red-500" />
                <span className="text-xs text-gray-500 font-medium">Health Fund</span>
                <Shield size={10} className="text-emerald-500" />
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Welcome Section */}
        <div className="px-6 py-4 border-b border-gray-200/40 bg-gradient-to-r from-emerald-50/50 to-cyan-50/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`
                  group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${isItemActive
                    ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 text-emerald-700 shadow-sm border border-emerald-200/50'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md border border-transparent'
                  }
                `}
              >
                {/* Animated Background Effect */}
                {isItemActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-xl"></div>
                )}
                
                {/* Icon with Animation */}
                <div className={`
                  relative z-10 p-2 rounded-lg transition-all duration-200
                  ${isItemActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gradient-to-r group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 group-hover:text-emerald-600'
                  }
                `}>
                  <Icon size={18} />
                </div>
                
                {/* Text */}
                <span className="relative z-10 ml-3 font-medium">
                  {item.name}
                </span>
                
                {/* Active Indicator */}
                {isItemActive && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-sm"></div>
                  </div>
                )}

                {/* Admin Badge */}
                {item.name === 'Admin' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-sm">
                      PRO
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-gray-200/40">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles size={14} className="text-amber-500" />
              <p className="text-xs font-semibold text-gray-700">Health Coverage</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: '85%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Active until Dec 2027</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;