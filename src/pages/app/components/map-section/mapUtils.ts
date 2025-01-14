// mapUtils.ts

import { MarkerData, Status } from "./types";
import { database } from "../../../../firebaseConfig"; 
import { ref, get } from "firebase/database";


export const fetchMarkersData = async (): Promise<MarkerData[]> => {
  try {
    const markersRef = ref(database, 'floodData');
    const snapshot = await get(markersRef);

    if (!snapshot.exists()) {
      console.error("No data available in Firebase");
      return [];
    }

    const markersData: MarkerData[] = [];

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const currentData = data.current;

      // Check if the lat and lng are present in the current data
      if (currentData && currentData.lat !== undefined && currentData.lng !== undefined) {
        markersData.push({
          lat: currentData.lat,
          lng: currentData.lng,
          station: currentData.station || 'Unknown', // Use station from currentData
          waterLevel: currentData.waterLevel,
          status: currentData.status,
          latestUpdate: currentData.timestamp,
          address: data.address || '', // Adjust if address is also within current
        });
      } else {
        console.warn(`Missing lat/lng for station: ${currentData.station || 'undefined'}`);
      }
    });

    return markersData;
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return [];
  }
};

export const formatTimestamp = (timestamp: number): string => {
  if (timestamp === 0) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use 12-hour format with AM/PM
  });
};

export const getMarkerColor = (status: Status): string => {
  switch (status) {
    case "Critical":
      return "#ff0000";
    case "Warning":
      return "#ffe500";
    case "Alert":
      return "#ff8000";
    default:
      return "#0055ff"; // blue for normal
  }
};

export const getMarkerIconUrl = (color: string, className: string): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg class="${className}" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .pulse {
          animation: pulse 2s infinite;
        }
        .pulse-delay {
          animation-delay: 2s;
        }
        @keyframes pulse {
          0% { r: 10; opacity: 0.2; }
          50% { r: 8; opacity: 0.9; }
          100% { r: 10; opacity: 0.2; }
        }
      </style>
      <circle class="pulse" cx="20" cy="20" r="10" fill="${color}"/>
      <circle class="pulse" cx="20" cy="20" r="15" stroke="${color}" stroke-opacity="0.2" stroke-width="10"/>
    </svg>
  `)}`;
};

export const storeRecentSearch = (search: string): void => {
  const recentSearches = getRecentSearches();
  if (!recentSearches.includes(search)) {
    if (recentSearches.length >= 5) {
      recentSearches.pop();
    }
    recentSearches.unshift(search);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
};

export const getRecentSearches = (): string[] => {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
};

export const deleteRecentSearch = (search: string): string[] => {
  let recentSearches = getRecentSearches();
  recentSearches = recentSearches.filter((item) => item !== search);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  return recentSearches;
};
