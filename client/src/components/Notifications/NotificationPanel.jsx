import React from 'react';
import { X, Bell, Check, Trash2, CheckCircle, AlertCircle, Info, Clock, Settings } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  // Group notifications by type
  const groupedNotifications = {
    unread: notifications.filter(n => !n.read),
    read: notifications.filter(n => n.read)
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const icons = {
      success: <CheckCircle size={16} className="text-emerald-500" />,
      warning: <AlertCircle size={16} className="text-amber-500" />,
      error: <AlertCircle size={16} className="text-red-500" />,
      info: <Info size={16} className="text-blue-500" />,
      default: <Bell size={16} className="text-gray-500" />
    };
    return icons[type] || icons.default;
  };

  // Get notification style based on type
  const getNotificationStyle = (type) => {
    const styles = {
      success: 'border-l-4 border-l-emerald-400 bg-emerald-50/50',
      warning: 'border-l-4 border-l-amber-400 bg-amber-50/50',
      error: 'border-l-4 border-l-red-400 bg-red-50/50',
      info: 'border-l-4 border-l-blue-400 bg-blue-50/50',
      default: 'border-l-4 border-l-gray-300'
    };
    return styles[type] || styles.default;
  };

  // Format time relative to now
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Enhanced Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/30  transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Enhanced Panel with Slide Animation */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-96 max-w-md transform transition-transform duration-300 ease-out">
          <div className="h-full flex flex-col bg-white/95  shadow-2xl border-l border-gray-200/60">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/60">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Bell size={20} className="text-white" />
                  </div>
                  {groupedNotifications.unread.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {groupedNotifications.unread.length}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-500">
                    {notifications.length} total • {groupedNotifications.unread.length} unread
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <Settings size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50/80 border-b border-gray-200/40">
                <button
                  onClick={markAllAsRead}
                  disabled={groupedNotifications.unread.length === 0}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    groupedNotifications.unread.length === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Check size={16} />
                  <span>Mark all read</span>
                </button>
                
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                >
                  <Trash2 size={16} />
                  <span>Clear all</span>
                </button>
              </div>
            )}

            {/* Enhanced Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Bell size={24} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications</h3>
                  <p className="text-sm text-gray-400 text-center">
                    You're all caught up! We'll notify you when something new arrives.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {/* Unread Notifications */}
                  {groupedNotifications.unread.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 px-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Unread ({groupedNotifications.unread.length})
                        </h3>
                      </div>
                      {groupedNotifications.unread.map((notification) => (
                        <div
                          key={notification.id}
                          className={`relative p-4 rounded-xl transition-all duration-200 hover:shadow-md group ${getNotificationStyle(notification.type)}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <Clock size={12} />
                                <span>{getRelativeTime(notification.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-150"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Read Notifications */}
                  {groupedNotifications.read.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 px-2 mt-4">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Earlier ({groupedNotifications.read.length})
                        </h3>
                      </div>
                      {groupedNotifications.read.map((notification) => (
                        <div
                          key={notification.id}
                          className="relative p-4 rounded-xl transition-all duration-200 hover:shadow-md group bg-white border border-gray-200/60"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5 opacity-60">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-700 mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <Clock size={12} />
                                <span>{getRelativeTime(notification.createdAt)}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-200/40">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Notification settings</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;