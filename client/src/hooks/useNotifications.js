import { useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../config/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get(ENDPOINTS.NOTIFICATIONS);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(note =>
          note.id === notificationId ? { ...note, read: true } : note
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}`);
      setNotifications(prev => prev.filter(note => note.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
  };
};