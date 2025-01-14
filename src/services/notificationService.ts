import { getDatabase, ref, onValue, off, push, get } from "firebase/database";
import axios from "axios";

declare global {
  interface Window {
    OneSignal: any;
  }
}

export class NotificationService {
  private static ONESIGNAL_APP_ID = "2bdb3add-9a07-47d7-8bfb-913ae205a3f4";
  private static LOCATIONS = ["Burgos"]; // add more locations
  private static listeners: { [key: string]: any } = {};
  private static SMS_SERVER_URL = "http://localhost:3001/send-sms";

  static async requestPermission() {
    console.log("Requesting OneSignal permission...");
    try {
      if (!window.OneSignal) {
        console.error("OneSignal not initialized");
        return false;
      }

      await window.OneSignal.showSlidedownPrompt();
      console.log("OneSignal permission granted");
      return true;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  static async setupNotifications() {
    console.log("🚀 Setting up notifications service...");
    try {
      const db = getDatabase();
      console.log("Database initialized");

      for (const location of this.LOCATIONS) {
        console.log(`Setting up listener for ${location}`);
        const floodStatusRef = ref(db, `floodData/${location}/current/status`);

        onValue(floodStatusRef, async (snapshot) => {
          const currentStatus = snapshot.val();
          console.log(`Status update received for ${location}:`, currentStatus);

          if (currentStatus) {
            try {
              const waterLevelRef = ref(
                db,
                `floodData/${location}/current/waterLevel`
              );
              const waterLevelSnap = await get(waterLevelRef);
              const waterLevel = waterLevelSnap.val();
              console.log(`Water level for ${location}:`, waterLevel);

              const title = `⚠️ Flood Warning - ${location}`;
              const message = `Flood status has changed to ${currentStatus} at ${location}. Water level: ${waterLevel}m`;
              console.log("Preparing notifications with message:", message);

              console.log("Sending in-app notification...");
              await this.sendNotification(title, message);
              console.log("Sending SMS notification...");
              await this.sendSMSToAllSubscribers(
                message,
                location,
                currentStatus,
                waterLevel
              );
            } catch (error) {
              console.error("Notification test failed:", error);
            }
          }
        });
      }

      const permission = await this.requestPermission();
      if (!permission) {
        console.log("OneSignal permission not granted");
      }

      const playerId = await window.OneSignal.getUserId();
      console.log("OneSignal Player ID:", playerId);

      this.setupDatabaseListeners();
      console.log("✅ Database listeners setup complete");

      return true;
    } catch (error) {
      console.error("Error setting up notifications:", error);
      return false;
    }
  }

  private static async sendNotification(title: string, message: string) {
    console.log("Sending in-app notification:", { title, message });
    try {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YOUR-REST-API-KEY",
          },
          body: JSON.stringify({
            app_id: this.ONESIGNAL_APP_ID,
            included_segments: ["Subscribed Users"],
            headings: { en: title },
            contents: { en: message },
            web_push_topic: "flood-warnings",
          }),
        }
      );

      const result = await response.json();
      console.log("OneSignal API response:", result);
      return result;
    } catch (error) {
      console.error("Error sending in-app notification:", error);
      return null;
    }
  }

  static async subscribeToSMS(phoneNumber: string) {
    console.log("📱 Subscribing phone number:", phoneNumber);
    try {
      const db = getDatabase();
      await push(ref(db, "smsSubscribers"), {
        phoneNumber,
        subscribedAt: new Date().toISOString(),
      });
      console.log("✅ Successfully subscribed to SMS alerts");
      return { success: true };
    } catch (error) {
      console.error("❌ Error subscribing to SMS:", error);
      return { success: false, error };
    }
  }

  private static async sendSMS(to: string, message: string) {
    console.log("📤 Sending individual SMS to:", to);
    try {
      const formattedNumber = to.replace(/\s+/g, "");
      const phoneNumber = formattedNumber.startsWith("+63")
        ? formattedNumber
        : `+63${formattedNumber.replace(/^0+/, "")}`;

      console.log("Formatted number:", phoneNumber);
      const response = await axios.post(this.SMS_SERVER_URL, {
        to: phoneNumber,
        message,
      });
      console.log("✅ SMS sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("❌ Error sending SMS:", error);
      return false;
    }
  }

  private static async sendSMSToAllSubscribers(
    _message: string,
    location: string,
    status: string,
    waterLevel: number
  ) {
    console.log("📨 Starting bulk SMS process...");
    try {
      const db = getDatabase();
      const snapshot = await get(ref(db, "smsSubscribers"));
      const subscribers = snapshot.val();

      console.log("Found subscribers:", subscribers);

      if (!subscribers) {
        console.log("No subscribers found");
        return;
      }

      const timestamp = new Date().toLocaleString();
      const message = `🚨 FLOOD ALERT 🚨
Location: ${location} Station
Status: ${status}
Water Level: ${waterLevel}m
Time: ${timestamp}`;

      console.log("Formatted message:", message);

      for (const key in subscribers) {
        const subscriber = subscribers[key];
        console.log("Processing subscriber:", subscriber.phoneNumber);
        try {
          await this.sendSMS(subscriber.phoneNumber, message);
        } catch (error) {
          console.error(
            "Failed to send SMS to:",
            subscriber.phoneNumber,
            error
          );
        }
      }
      console.log("✅ Bulk SMS process complete");
    } catch (error) {
      console.error("❌ Error in sendSMSToAllSubscribers:", error);
    }
  }

  private static setupDatabaseListeners() {
    console.log("🎯 Setting up database listeners...");
    const db = getDatabase();

    this.LOCATIONS.forEach((location) => {
      const floodStatusRef = ref(db, `floodData/${location}/current/status`);
      console.log(
        `👀 Monitoring ${location} at path: floodData/${location}/current/status`
      );

      if (this.listeners[location]) {
        console.log(`Removing existing listener for ${location}`);
        off(floodStatusRef, this.listeners[location]);
      }

      this.listeners[location] = onValue(floodStatusRef, async (snapshot) => {
        const status = snapshot.val();
        console.log(`📢 Status change detected for ${location}:`, status);

        if (status) {
          try {
            const waterLevelRef = ref(
              db,
              `floodData/${location}/current/waterLevel`
            );
            const waterLevelSnap = await get(waterLevelRef);
            const waterLevel = waterLevelSnap.val();

            const title = `⚠️ Flood Warning - ${location}`;
            const message = `⚠️ Flood status has changed to ${status} at ${location}. Water level: ${waterLevel}m`;

            console.log("Sending notifications for status change...");
            await this.sendNotification(title, message);
            await this.sendSMSToAllSubscribers(
              message,
              location,
              status,
              waterLevel
            );
          } catch (error) {
            console.error(
              `❌ Error processing status change for ${location}:`,
              error
            );
          }
        }
      });
      console.log(`✅ Listener setup complete for ${location}`);
    });
  }

  static cleanup() {
    console.log("🧹 Cleaning up notification service...");
    const db = getDatabase();
    this.LOCATIONS.forEach((location) => {
      const floodStatusRef = ref(db, `floodData/${location}/current/status`);
      if (this.listeners[location]) {
        off(floodStatusRef, this.listeners[location]);
        delete this.listeners[location];
        console.log(`✅ Cleaned up listener for ${location}`);
      }
    });
    console.log("✨ Cleanup complete");
  }
}
