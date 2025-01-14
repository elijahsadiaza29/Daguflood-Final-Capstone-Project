export interface LatLng {
    lat: number;
    lng: number;
  }

export interface MarkerData {
    lat: number;
    lng: number;
    station: string;
    waterLevel: number;
    status: Status;
    latestUpdate: string | number; 
    address: string;
}


export type Status = 'Critical' | 'Warning' | 'Alert' | 'Normal' | string;