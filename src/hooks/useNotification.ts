// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { NotificationService } from '../services/notificationService';

export function useNotifications() {
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });

  useEffect(() => {
    if (isEnabled) {
      NotificationService.setupNotifications();
    }

    return () => {
      NotificationService.cleanup();
    };
  }, [isEnabled]);

  const toggleNotifications = async () => {
    if (!isEnabled) {
      const success = await NotificationService.setupNotifications();
      if (success) {
        setIsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
      }
    } else {
      setIsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      NotificationService.cleanup();
    }
  };

  return {
    isEnabled,
    toggleNotifications
  };
}