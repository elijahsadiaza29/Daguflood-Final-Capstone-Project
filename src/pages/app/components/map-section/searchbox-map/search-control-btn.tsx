import React, { useState, useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { IconSearch, IconX } from "@tabler/icons-react";
import SearchBox from './map-searchbox';
import { Label } from "@/components/ui/label";
import WaterLevel from '../map-status-stats/water-level-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import TideLevelDaily from '../map-status-stats/tide-chart-daily-prediction';

interface AboutContentProps {
    map: google.maps.Map | null;
    onInputActiveChange: (active: boolean) => void;
}

const SearchControl: React.FC<AboutContentProps> = ({ map, onInputActiveChange }) => {
    const [popoverOpen, setPopoverOpen] = useState(() => {
        return typeof window !== 'undefined' ? window.innerWidth >= 640 : true;
    });

    useEffect(() => {
        const checkScreenSize = () => {
            setPopoverOpen(window.innerWidth >= 640);
        };

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);

    }, []);

    // Function to explicitly close the popover
    const handleLocationSelect = () => {
        // Close the popover after a location is selected
        setPopoverOpen(false);
    };

    return (
        <div className="absolute sm:top-6 bottom-[9.5rem] sm:bottom-48 right-2 z-40">
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <Popover
                        open={popoverOpen}
                        onOpenChange={setPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <TooltipTrigger>
                                <Button
                                    className="sm:rounded-full rounded-full w-11 h-11"
                                    size="icon"
                                    variant="opaque"
                                    onClick={() => setPopoverOpen(!popoverOpen)}  // Toggle popover visibility on button click
                                >
                                    {popoverOpen ? (
                                        <IconX className="text-white w-6 h-6 sm:w-5 sm:h-5" />
                                    ) : (
                                        <IconSearch stroke={2.5} className="text-white w-5 h-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                        </PopoverTrigger>
                        <PopoverContent
                            className={`relative transition-all duration-300 ease-in-out ${popoverOpen && window.innerWidth < 640
                                    ? 'left-[3.5rem] w-screen h-[100vh] rounded-none'
                                    : 'sm:left-auto left-[3.5rem] sm:w-[28rem] sm:h-[88vh] sm:rounded-xl'
                                } flex flex-col`}
                            side="left"
                            sideOffset={4}
                            align="start"
                        >
                            <div className="py-1 mb-1">
                                <div className="grid grid-cols-2 mb-2 items-center ">
                                    <div className="flex">
                                        <Label className="text-white font-semibold text-base p-0 h-full ">
                                            Search
                                        </Label>
                                    </div>
                                    <div className="ml-auto block sm:hidden">
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            className="hover:bg-transparent text-right"
                                            onClick={() => setPopoverOpen(false)}
                                        >
                                            <IconX className="text-white w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                {/* Pass the onLocationSelect to SearchBox */}
                                <SearchBox
                                    map={map}
                                    onInputActiveChange={onInputActiveChange}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>

                            <ScrollArea className="flex h-full py-2 pb-4">
                                <div className="mb-2">
                                    <WaterLevel />
                                </div>
                                <div>
                                    <TideLevelDaily />
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                    <TooltipContent side="left" className="hidden sm:block">
                        <p>Search</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default SearchControl;
