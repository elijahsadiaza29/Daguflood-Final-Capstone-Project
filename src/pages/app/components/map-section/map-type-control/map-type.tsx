import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { IconMap, IconStackFilled, IconX } from "@tabler/icons-react";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import { useEffect, useState } from "react";

interface MapTypeControlProps {
    map: google.maps.Map;
}

const MapType: React.FC<MapTypeControlProps> = ({ map }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMapType, setCurrentMapType] = useState(() => map.getMapTypeId());
    const [popoverSide, setPopoverSide] = useState<"top" | "left">("top");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)"); // Small screens
        const updateSide = () => {
            setPopoverSide(mediaQuery.matches ? "top" : "left");
        };

        // Initial check and event listener
        updateSide();
        mediaQuery.addEventListener("change", updateSide);

        // Cleanup event listener
        return () => {
            mediaQuery.removeEventListener("change", updateSide);
        };
    }, []);

    const handleSetMapType = (type: google.maps.MapTypeId) => {
        map.setMapTypeId(type);
        setCurrentMapType(type);
    };

    return (
        <div className="absolute bottom-[5rem] sm:top-40 sm:right-2 left-2 sm:left-auto z-50">
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <TooltipTrigger>
                                <Button
                                    className="w-11 h-11 rounded-full"
                                    size="icon"
                                    variant="opaque"
                                    aria-label="Toggle Map Type Options"
                                >
                                    {isOpen ? (
                                        <IconX className="text-white w-6 h-6 sm:w-5 sm:h-5" />
                                    ) : (
                                        <IconStackFilled className="text-white w-6 h-6 sm:w-6 sm:h-6" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                        </PopoverTrigger>
                        <PopoverContent
                            className="relative w-fit grid gap-2 py-4 sm:py-3 px-4 rounded-lg sm:left-auto left-2 shadow-lg"
                            side={popoverSide}
                        >
                            {/* Content */}
                            <div>
                                <Label className="sm:text-xs text-white">Map Overlay</Label>
                            </div>
                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2">

                                {/* Map Button */}
                                <Button
                                    className={`w-fit sm:gap-3 gap-2 text-md font-medium text-muted-foreground ${currentMapType === google.maps.MapTypeId.ROADMAP
                                        ?"bg-gray-500 dark:text-secondary-foreground text-background hover:bg-gray-500 hover:text-background" : ""
                                        }`}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetMapType(google.maps.MapTypeId.ROADMAP)}
                                    aria-label="Switch to Map View"
                                >
                                    <IconMap className="sm:w-6 sm:h-6 " />
                                    Map
                                </Button>

                                {/* Satellite Button */}
                                <Button
                                    className={`w-fit sm:gap-3 gap-2 text-md font-medium text-muted-foreground ${currentMapType === google.maps.MapTypeId.HYBRID
                                        ? "bg-gray-500 dark:text-secondary-foreground text-background hover:bg-gray-500 hover:text-background" : ""
                                        }`}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetMapType(google.maps.MapTypeId.HYBRID)}
                                    aria-label="Switch to Satellite View"
                                >
                                    <SatelliteAltIcon className="sm:w-6 sm:h-6 " />
                                    Satellite
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <TooltipContent side="left" className='hidden sm:block'>
                        <p>Map Overlay</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default MapType;
