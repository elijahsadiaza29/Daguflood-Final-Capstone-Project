import { ref, get } from "firebase/database";
import { database } from "../../../../../firebaseConfig"; // Adjust the path as needed

// FloodData type definition
export interface FloodData {
  width: string | number | undefined;
  station: string;
  waterLevel: number;
  highestWaterLevel: number;
}

export const fetchHighestWaterLevels = async (): Promise<FloodData[]> => {
  try {
    const markersRef = ref(database, "floodData");
    const snapshot = await get(markersRef);

    if (!snapshot.exists()) {
      console.error("No data available in Firebase");
      return [];
    }

    const highestLevels: FloodData[] = [];

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const station = data.current?.station || "Unknown";

      // Fetch the highestWaterLevel from the database
      const highestWaterLevel = data.highestWaterLevel || 0; // Adjusted to fetch from the root of the station data
      highestLevels.push({
        width: undefined,
        station,
        waterLevel: parseFloat(highestWaterLevel.toFixed(2)),
        highestWaterLevel: parseFloat(highestWaterLevel.toFixed(2)),
      });
    });

    return highestLevels;
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return [];
  }
};

// import { ref, get } from "firebase/database";
// import { database } from "../../../../../firebaseConfig"; // Adjust the path as needed

// // FloodData type definition
// export interface FloodData {
//   width: string | number | undefined;
//   station: string;
//   waterLevel: number;
//   highestWaterLevel: number;
//   latitude?: number;
//   longitude?: number;
// }

// export const fetchHighestWaterLevels = async (): Promise<FloodData[]> => {
//   try {
//     const markersRef = ref(database, "floodData");
//     const snapshot = await get(markersRef);

//     if (!snapshot.exists()) {
//       console.error("No data available in Firebase");
//       return [];
//     }

//     const highestLevels: FloodData[] = [];

//     snapshot.forEach((childSnapshot) => {
//       const data = childSnapshot.val();
//       const station = data.current?.station || "Unknown";
//       const latitude = data.current?.lat || 0;
//       const longitude = data.current?.lng || 0;

//       // Fetch the highestWaterLevel from the database
//       const highestWaterLevel = data.highestWaterLevel || 0; // Adjusted to fetch from the root of the station data

//       highestLevels.push({
//         station,
//         waterLevel: parseFloat(highestWaterLevel.toFixed(2)),
//         latitude,
//         longitude,
//         highestWaterLevel: parseFloat(highestWaterLevel.toFixed(2)),
//       });
//     });

//     return highestLevels;
//   } catch (error) {
//     console.error("Error fetching data from Firebase:", error);
//     return [];
//   }
// };
