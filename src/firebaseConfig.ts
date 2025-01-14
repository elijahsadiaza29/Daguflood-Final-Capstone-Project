
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore'; 
import { getMessaging, getToken } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyAdMm1Dbd9X6tfdvRPAHPcGE44txQuGtc8",
  authDomain: "dagufloodv2.firebaseapp.com",
  databaseURL:  
    "https://dagufloodv2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dagufloodv2",
  storageBucket: "dagufloodv2.appspot.com",
  messagingSenderId: "77759524481",
  appId: "1:77759524481:web:6b7d0fb0cb79a1c5366780",
  measurementId: "G-HXN9P5244V",
};

const app = initializeApp(firebaseConfig);
const feedbackDB = getFirestore(app);  
const database = getDatabase(app);
const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BOHJMDK5-C88K9RNbi5QMAS9ub8flFwL18UwR6jQ4LG9kMuqyVpWOoR-uDFTkbMTmFw9-1R0FKt1INCHlcCeuHA",
      });
      
      if (!token) {
        throw new Error('Failed to generate FCM token');
      }
      
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};
export { database, firebaseConfig, messaging, feedbackDB };
