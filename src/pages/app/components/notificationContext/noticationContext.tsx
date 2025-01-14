import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateToken, messaging } from '../../../../firebaseConfig';
import { deleteToken, onMessage } from 'firebase/messaging';
import { getDatabase, ref, onValue, off } from 'firebase/database';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

interface NotificationState {
  [location: string]: {
    lastStatus: string;
    timeoutId?: NodeJS.Timeout;
  };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const LOCATIONS = ['Burgos'];
const NOTIFICATION_DELAY = 30000; // 30 seconds delay before showing notification

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const savedState = localStorage.getItem('notificationsEnabled');
    return savedState === 'true';
  });

  const [listenersActive, setListenersActive] = useState(false);
  const notificationStateRef = useRef<NotificationState>({});
  const activeNotifications = useRef<{ [key: string]: Notification }>({});

  // Handle foreground messages from FCM
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      if (notificationsEnabled && Notification.permission === 'granted') {
        const title = payload.notification?.title || 'Flood Warning';
        const body = payload.notification?.body || '';
        sendNotification(title, body);
      }
    });

    return () => unsubscribe();
  }, [notificationsEnabled]);

  useEffect(() => {
    const manageNotifications = async () => {
      if (notificationsEnabled) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            generateToken();

            localStorage.setItem('notificationsEnabled', 'true');
            if (!listenersActive) {
              setupNotificationListeners();
              setListenersActive(true);
            }
          } else {
            setNotificationsEnabled(false);
            localStorage.setItem('notificationsEnabled', 'false');
          }
        } catch (error) {
          console.error('Error setting up notifications:', error);
          setNotificationsEnabled(false);
        }
      } else {
        try {
          if (messaging) {
            await deleteToken(messaging);
          }
          localStorage.setItem('notificationsEnabled', 'false');
          cleanupNotificationListeners();
        } catch (error) {
          console.error('Error deleting token:', error);
        }
      }
    };

    manageNotifications();

    return () => {
      Object.values(activeNotifications.current).forEach(notification => {
        notification.close();
      });
      // Clear any pending timeouts
      Object.values(notificationStateRef.current).forEach(state => {
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
        }
      });
    };
  }, [notificationsEnabled]);

  const setupNotificationListeners = () => {
    const db = getDatabase();

    LOCATIONS.forEach((location) => {
      const floodStatusRef = ref(db, `floodData/${location}/current/status`);
      onValue(floodStatusRef, (snapshot) => {
        if (notificationsEnabled && Notification.permission === 'granted') {
          const floodStatus = snapshot.val();
          if (floodStatus) {
            // Clear any existing timeout for this location
            if (notificationStateRef.current[location]?.timeoutId) {
              clearTimeout(notificationStateRef.current[location].timeoutId);
            }

            // Only send notification if status has changed
            const currentState = notificationStateRef.current[location];
            if (!currentState || currentState.lastStatus !== floodStatus) {
              // Set up new delayed notification
              const timeoutId = setTimeout(() => {
                // Check if the status is still the same after the delay
                const currentStatus = notificationStateRef.current[location]?.lastStatus;
                if (currentStatus === floodStatus) {
                  sendNotification(
                    `⚠️ Flood Warning - ${location}`,
                    `Flood status has changed to ${floodStatus} at ${location}.`,
                    location
                  );
                }
              }, NOTIFICATION_DELAY);

              // Update the state immediately
              notificationStateRef.current[location] = {
                lastStatus: floodStatus,
                timeoutId
              };
            }
          }
        }
      });
    });
  };

  const cleanupNotificationListeners = () => {
    const db = getDatabase();
    LOCATIONS.forEach((location) => {
      const floodStatusRef = ref(db, `floodData/${location}/current/status`);
      off(floodStatusRef);
      
      if (activeNotifications.current[location]) {
        activeNotifications.current[location].close();
        delete activeNotifications.current[location];
      }

      // Clear any pending timeouts
      if (notificationStateRef.current[location]?.timeoutId) {
        clearTimeout(notificationStateRef.current[location].timeoutId);
      }
    });

    notificationStateRef.current = {};
    setListenersActive(false);
  };

  const sendNotification = (title: string, body: string, location?: string) => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      try {
        const uniqueTag = location ? `flood-warning-${location}-${Date.now()}` : `flood-warning-${Date.now()}`;

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.getNotifications().then((notifications) => {
              notifications.forEach(notification => notification.close());
              
              registration.showNotification(title, {
                body,
                icon: '/path/to/your/icon.png',
                tag: uniqueTag,
                requireInteraction: true
              });
            });
          });
        } else {
          if (location && activeNotifications.current[location]) {
            activeNotifications.current[location].close();
            delete activeNotifications.current[location];
          }

          const notification = new Notification(title, {
            body,
            icon: '/path/to/your/icon.png',
            tag: uniqueTag,
            requireInteraction: true
          });

          if (location) {
            activeNotifications.current[location] = notification;
            notification.onclose = () => {
              delete activeNotifications.current[location];
            };
          }
        }
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  return (
    <NotificationContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { generateToken, messaging } from '../../../../firebaseConfig';
// import { deleteToken, onMessage } from 'firebase/messaging';
// import { getDatabase, ref, onValue, off } from 'firebase/database';

// interface NotificationContextType {
//   notificationsEnabled: boolean;
//   toggleNotifications: () => void;
// }

// interface NotificationState {
//   [location: string]: {
//     lastStatus: string;
//   };
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// const LOCATIONS = ['Amado', 'Burgos'];

// export function NotificationProvider({ children }: { children: React.ReactNode }) {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
//     const savedState = localStorage.getItem('notificationsEnabled');
//     return savedState === 'true';
//   });

//   const [listenersActive, setListenersActive] = useState(false);
//   const notificationStateRef = useRef<NotificationState>({});
//   const activeNotifications = useRef<{ [key: string]: Notification }>({});

//   // Handle foreground messages from FCM
//   useEffect(() => {
//     if (!messaging) return;

//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Received foreground message:', payload);
//       if (notificationsEnabled && Notification.permission === 'granted') {
//         const title = payload.notification?.title || 'Flood Warning';
//         const body = payload.notification?.body || '';
//         sendNotification(title, body);
//       }
//     });

//     return () => unsubscribe();
//   }, [notificationsEnabled]);

//   useEffect(() => {
//     const manageNotifications = async () => {
//       if (notificationsEnabled) {
//         try {
//           const permission = await Notification.requestPermission();
//           if (permission === 'granted') {
//             const token = await generateToken();
//             console.log('FCM Token:', token);
            
//             localStorage.setItem('notificationsEnabled', 'true');
//             if (!listenersActive) {
//               setupNotificationListeners();
//               setListenersActive(true);
//             }
//           } else {
//             setNotificationsEnabled(false);
//             localStorage.setItem('notificationsEnabled', 'false');
//           }
//         } catch (error) {
//           console.error('Error setting up notifications:', error);
//           setNotificationsEnabled(false);
//         }
//       } else {
//         try {
//           if (messaging) {
//             await deleteToken(messaging);
//           }
//           localStorage.setItem('notificationsEnabled', 'false');
//           cleanupNotificationListeners();
//         } catch (error) {
//           console.error('Error deleting token:', error);
//         }
//       }
//     };

//     manageNotifications();

//     return () => {
//       Object.values(activeNotifications.current).forEach(notification => {
//         notification.close();
//       });
//     };
//   }, [notificationsEnabled]);

//   const setupNotificationListeners = () => {
//     const db = getDatabase();

//     LOCATIONS.forEach((location) => {
//       const floodStatusRef = ref(db, `floodData/${location}/current/status`);
//       onValue(floodStatusRef, (snapshot) => {
//         if (notificationsEnabled && Notification.permission === 'granted') {
//           const floodStatus = snapshot.val();
//           if (floodStatus) {
//             // Always send notification for status changes
//             sendNotification(
//               `⚠️ Flood Warning - ${location}`,
//               `Flood status has changed to ${floodStatus} at ${location}.`,
//               location
//             );
            
//             // Update the state after sending notification
//             notificationStateRef.current[location] = {
//               lastStatus: floodStatus
//             };
//           }
//         }
//       });
//     });
//   };

//   const cleanupNotificationListeners = () => {
//     const db = getDatabase();
//     LOCATIONS.forEach((location) => {
//       const floodStatusRef = ref(db, `floodData/${location}/current/status`);
//       off(floodStatusRef);
      
//       if (activeNotifications.current[location]) {
//         activeNotifications.current[location].close();
//         delete activeNotifications.current[location];
//       }
//     });

//     notificationStateRef.current = {};
//     setListenersActive(false);
//   };

//   const sendNotification = (title: string, body: string, location?: string) => {
//     if (notificationsEnabled && Notification.permission === 'granted') {
//       try {
//         // Generate a unique tag for each notification
//         const uniqueTag = location ? `flood-warning-${location}-${Date.now()}` : `flood-warning-${Date.now()}`;

//         // First try using the service worker for better mobile support
//         if ('serviceWorker' in navigator) {
//           navigator.serviceWorker.ready.then((registration) => {
//             // Close any existing notifications first
//             registration.getNotifications().then((notifications) => {
//               notifications.forEach(notification => notification.close());
              
//               // Show the new notification
//               registration.showNotification(title, {
//                 body,
//                 icon: '/path/to/your/icon.png',
//                 tag: uniqueTag,
//                 requireInteraction: true
//               });
//             });
//           });
//         } else {
//           // Fallback to native Notification API
//           // Close existing notification for this location if it exists
//           if (location && activeNotifications.current[location]) {
//             activeNotifications.current[location].close();
//             delete activeNotifications.current[location];
//           }

//           const notification = new Notification(title, {
//             body,
//             icon: '/path/to/your/icon.png',
//             tag: uniqueTag,
//             requireInteraction: true
//           });

//           if (location) {
//             activeNotifications.current[location] = notification;
//             notification.onclose = () => {
//               delete activeNotifications.current[location];
//             };
//           }
//         }
//       } catch (error) {
//         console.error('Error showing notification:', error);
//       }
//     }
//   };

//   const toggleNotifications = () => {
//     setNotificationsEnabled(prev => !prev);
//   };

//   return (
//     <NotificationContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error('useNotifications must be used within a NotificationProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { generateToken, messaging } from '../../../../firebaseConfig';
// import { deleteToken, onMessage } from 'firebase/messaging';
// import { getDatabase, ref, onValue, off } from 'firebase/database';

// interface NotificationContextType {
//   notificationsEnabled: boolean;
//   toggleNotifications: () => void;
// }

// interface NotificationState {
//   [location: string]: {
//     lastStatus: string;
//   };
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// const LOCATIONS = ['Amado', 'Burgos'];

// export function NotificationProvider({ children }: { children: React.ReactNode }) {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
//     const savedState = localStorage.getItem('notificationsEnabled');
//     return savedState === 'true';
//   });

//   const [listenersActive, setListenersActive] = useState(false);
//   const notificationStateRef = useRef<NotificationState>({});
//   const activeNotifications = useRef<{ [key: string]: Notification }>({});

//   // Handle foreground messages from FCM
//   useEffect(() => {
//     if (!messaging) return;

//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log('Received foreground message:', payload);
//       if (notificationsEnabled && Notification.permission === 'granted') {
//         const title = payload.notification?.title || 'Flood Warning';
//         const body = payload.notification?.body || '';
//         sendNotification(title, body);
//       }
//     });

//     return () => unsubscribe();
//   }, [notificationsEnabled]);

//   useEffect(() => {
//     const manageNotifications = async () => {
//       if (notificationsEnabled) {
//         try {
//           const permission = await Notification.requestPermission();
//           if (permission === 'granted') {
//             const token = await generateToken();
//             console.log('FCM Token:', token);
            
//             localStorage.setItem('notificationsEnabled', 'true');
//             if (!listenersActive) {
//               setupNotificationListeners();
//               setListenersActive(true);
//             }
//           } else {
//             setNotificationsEnabled(false);
//             localStorage.setItem('notificationsEnabled', 'false');
//           }
//         } catch (error) {
//           console.error('Error setting up notifications:', error);
//           setNotificationsEnabled(false);
//         }
//       } else {
//         try {
//           if (messaging) {
//             await deleteToken(messaging);
//           }
//           localStorage.setItem('notificationsEnabled', 'false');
//           cleanupNotificationListeners();
//         } catch (error) {
//           console.error('Error deleting token:', error);
//         }
//       }
//     };

//     manageNotifications();

//     return () => {
//       Object.values(activeNotifications.current).forEach(notification => {
//         notification.close();
//       });
//     };
//   }, [notificationsEnabled]);

//   const shouldSendNotification = (location: string, status: string) => {
//     const state = notificationStateRef.current[location] || {
//       lastStatus: ''
//     };

//     const isNewStatus = state.lastStatus !== status;
    
//     if (isNewStatus) {
//       notificationStateRef.current[location] = {
//         lastStatus: status
//       };
//       return true;
//     }

//     return false;
//   };

//   const setupNotificationListeners = () => {
//     const db = getDatabase();

//     LOCATIONS.forEach((location) => {
//       const floodStatusRef = ref(db, `floodData/${location}/current/status`);
//       onValue(floodStatusRef, (snapshot) => {
//         if (notificationsEnabled && Notification.permission === 'granted') {
//           const floodStatus = snapshot.val();
//           if (floodStatus && shouldSendNotification(location, floodStatus)) {
//             if (activeNotifications.current[location]) {
//               activeNotifications.current[location].close();
//             }
//             sendNotification(
//               `⚠️ Flood Warning - ${location}`,
//               `Flood status has changed to ${floodStatus} at ${location}.`,
//               location
//             );
//           }
//         }
//       });
//     });
//   };

//   const cleanupNotificationListeners = () => {
//     const db = getDatabase();
//     LOCATIONS.forEach((location) => {
//       const floodStatusRef = ref(db, `floodData/${location}/current/status`);
//       off(floodStatusRef);
      
//       if (activeNotifications.current[location]) {
//         activeNotifications.current[location].close();
//         delete activeNotifications.current[location];
//       }
//     });

//     notificationStateRef.current = {};
//     setListenersActive(false);
//   };

//   const sendNotification = (title: string, body: string, location?: string) => {
//     if (notificationsEnabled && Notification.permission === 'granted') {
//       try {
//         // First try using the service worker for better mobile support
//         if ('serviceWorker' in navigator) {
//           navigator.serviceWorker.ready.then((registration) => {
//             registration.showNotification(title, {
//               body,
//               icon: '/path/to/your/icon.png',
//               tag: location ? `flood-warning-${location}` : 'flood-warning',
//               requireInteraction: true
//             });
//           });
//         } else {
//           // Fallback to native Notification API
//           const notification = new Notification(title, {
//             body,
//             icon: '/path/to/your/icon.png',
//             tag: location ? `flood-warning-${location}` : 'flood-warning',
//             requireInteraction: true
//           });

//           if (location) {
//             activeNotifications.current[location] = notification;
//             notification.onclose = () => {
//               delete activeNotifications.current[location];
//             };
//           }
//         }
//       } catch (error) {
//         console.error('Error showing notification:', error);
//       }
//     }
//   };

//   const toggleNotifications = () => {
//     setNotificationsEnabled(prev => !prev);
//   };

//   return (
//     <NotificationContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// }

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error('useNotifications must be used within a NotificationProvider');
//   }
//   return context;
// };