import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MapControlsProps {
  onCenterMap: () => void;
}

const MapPositionControl: React.FC<MapControlsProps> = ({ onCenterMap }) => {

  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationOnMessageVisible, setLocationOnMessageVisible] = useState(false);

  const handleGetLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position); // Update state when location is obtained
        onCenterMap(); // Call the map centering function
        setLocationOnMessageVisible(true); // Show "Location On" message
        // Hide "Location On" message after 3 seconds
        setTimeout(() => {
          setLocationOnMessageVisible(false);
        }, 1000);
      },
      (error) => {
        console.error("Error getting location:", error);
        // Optionally handle errors (e.g., show a toast or alert)
      }
    );
  };

  return (
    <div className="absolute bottom-[5.5rem] sm:top-28 right-2 sm:right-2 z-50 mb-3 sm:mb-2">
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              className="text-primary-foreground sm:rounded-full rounded-full sm:w-11 sm:h-11 w-11 h-11"
              size="icon"
              variant="opaque"
              onClick={handleGetLocation}
            >
              <GpsFixedIcon
                className={`w-6 h-6 ${currentLocation ? "text-blue-500" : "text-white"
                  }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="hidden sm:block">
            <p>Show your location</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {locationOnMessageVisible && (
        <div className="absolute bg-accent text-foreground animate-in zoom-in-50 zoom-out-50 top-[-35rem] sm:top-[-6.5rem] right-[7rem] sm:right-[55.5rem] text-center p-2 w-28 sm:w-32 mt-2  font-semibold rounded-full text-md border border-white/10 ">
          Allowed
        </div>
      )}
    </div>
  );
};

export default MapPositionControl;