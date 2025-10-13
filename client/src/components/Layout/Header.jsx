import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut, Settings, HelpCircle, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';

const Header = ({ onMenuClick, onNotificationClick }) => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Format username
  const getDisplayName = () => {
    return user?.name || user?.email?.split('@')[0] || 'User';
  };

  // Get current time for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left section - Brand and Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 lg:hidden active:scale-95"
          >
            <Menu size={20} />
          </button>

          {/* Welcome message with context */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">
                {getTimeBasedGreeting()}, {getDisplayName()} 👋
              </h1>
              {user?.role === 'ADMIN' && (
                <Shield size={16} className="text-purple-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span>{
                user?.role === 'ADMIN' 
                  ? 'System Administrator' 
                  : 'Health Fund Member'
              }</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Active
              </span>
            </p>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications with enhanced interaction */}
          <button
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 group active:scale-95"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform duration-200" />
            
            {unreadCount > 0 && (
              <>
                {/* Animated ping effect */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                {/* Count badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </>
            )}
          </button>

          {/* Enhanced User menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95 group"
              aria-label="User menu"
            >
              {/* User avatar with status indicator */}
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {getUserInitials()}
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* User info - hidden on mobile */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
                </p>
              </div>
              
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/80 backdrop-blur-sm z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User profile section */}
                <div className="p-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-white/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user?.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="p-2 space-y-1">
                  <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 group">
                    <User size={16} className="mr-3 text-gray-400 group-hover:text-gray-600" />
                    My Profile
                  </button>
                  
                  <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 group">
                    <Settings size={16} className="mr-3 text-gray-400 group-hover:text-gray-600" />
                    Account Settings
                  </button>
                  
                  <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 group">
                    <HelpCircle size={16} className="mr-3 text-gray-400 group-hover:text-gray-600" />
                    Help & Support
                  </button>
                </div>

                {/* Sign out section */}
                <div className="p-2 border-t border-gray-200/60">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
                  >
                    <LogOut size={16} className="mr-3 group-hover:scale-110 transition-transform" />
                    Sign Out
                    <span className="ml-auto text-xs text-gray-400">
                      {user?.email?.split('@')[1]}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;