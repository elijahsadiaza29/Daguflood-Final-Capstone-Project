import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    storeRecentSearch,
    getRecentSearches,
    deleteRecentSearch,
    clearRecentSearches,
    filterSearchResults,
    RecentSearch,
} from './searchUtils';
import { LocationBounds } from '../mapConfig';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { SidebarCommand } from '../../sidebar/sidebar-command';
// import MenuRounded from '@mui/icons-material/MenuRounded';
import { IconBackspaceFilled, IconSearch, IconX } from '@tabler/icons-react';
import { Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import './searchbox.css';


interface SearchBoxProps {
    map: google.maps.Map | null;
    onInputActiveChange: (isActive: boolean) => void;
    onLocationSelect: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ map = null, onInputActiveChange, onLocationSelect }) => {
    const [inputValue, setInputValue] = useState('');
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]); // Updated type
    const [showRecentSearches, setShowRecentSearches] = useState(false);
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

    useEffect(() => {
        setRecentSearches(getRecentSearches());

        if (map) {
            const inputElement = document.getElementById("search-box") as HTMLInputElement;
            searchBoxRef.current = new google.maps.places.SearchBox(inputElement, {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(LocationBounds.south, LocationBounds.west),
                    new google.maps.LatLng(LocationBounds.north, LocationBounds.east)
                )
            });

            searchBoxRef.current.addListener("places_changed", () => {
                const places = searchBoxRef.current?.getPlaces();
                if (places && places.length > 0) {
                    const filteredPlaces = filterSearchResults(
                        places,
                        new google.maps.LatLngBounds(
                            new google.maps.LatLng(LocationBounds.south, LocationBounds.west),
                            new google.maps.LatLng(LocationBounds.north, LocationBounds.east)
                        )
                    );

                    if (filteredPlaces.length > 0) {
                        const place = filteredPlaces[0];
                        const location = place.geometry?.location;
                        const address = place.formatted_address || '';
                        if (location && map) {
                            const lat = location.lat();
                            const lng = location.lng();

                            map.panTo(location);
                            map.setZoom(18);

                            // Store address and coordinates
                            storeRecentSearch(address, lat, lng);
                            setRecentSearches(getRecentSearches());
                            setShowRecentSearches(false);
                            setInputValue(address);
                            onLocationSelect();
                        }
                    } else {
                        alert("No places found within the defined boundaries.");
                    }
                }
            });
        }

        // Cleanup the search box listener when the component is unmounted
        return () => {
            if (searchBoxRef.current) {
                google.maps.event.clearInstanceListeners(searchBoxRef.current);
            }
        };
    }, [map,]);

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        setShowRecentSearches(true);
    }, []);

    const handleClearRecentSearches = useCallback(() => {
        clearRecentSearches();
        setRecentSearches([]);
        setShowRecentSearches(false);
    }, []);

    const handleDeleteSearch = useCallback((address: string) => {
        const updatedSearches = deleteRecentSearch(address);
        setRecentSearches(updatedSearches);
        setShowRecentSearches(updatedSearches.length > 0);
    }, []);
    return (
        <div id="search-box-container" className="flex flex-col">


            <div className="search-box-container grid grid-cols-[auto_1fr] border-2 gap-1 border-blue-300 rounded-xl px-1 md:px-4 md:py-1 items-center w-full bg-red">


                <IconSearch className="text-muted-foreground sm:ml-auto ml-2 w-5 h-5" />
                <Input
                    id="search-box"
                    placeholder="Find a place"
                    className="h-10 w-full pr-8 font-medium border-none shadow-none focus-visible:ring-0"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                        setShowRecentSearches(true);
                        onInputActiveChange(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => setShowRecentSearches(false), 200);
                        onInputActiveChange(false);
                    }}
                />
                {inputValue && (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="cursor-pointer absolute right-7 md:right-8">
                                    <IconBackspaceFilled
                                        className={`w-6 h-6 ${inputValue ? 'text-blue-400' : 'text-muted-foreground'}`}
                                        onClick={() => handleInputChange('')}
                                    />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className='h-8 border-none'
                                side="right"
                                align="center"
                                sideOffset={2}>
                                <p className='text-sm'>Clear</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            {/* Recent Searches */}
            <div>
                {showRecentSearches && recentSearches.length > 0 && (
                    <ul id='recent-search' className="bg-background border rounded-xl mt-2 relative w-full">
                        <li className="p-3 border-b text-sm text-muted-foreground">Recent Searches</li>
                        {recentSearches.map((search, index) => (
                            <li
                                key={index}
                                className="my-2 p-2 pl-4 gap-5 cursor-pointer flex items-center text-sm hover:bg-muted overflow-hidden"
                                onClick={() => {
                                    if (map) {
                                        const location = new google.maps.LatLng(search.lat, search.lng);
                                        map.panTo(location);
                                        map.setZoom(18);
                                        setInputValue(search.address);
                                        setShowRecentSearches(false);
                                        onLocationSelect();
                                    }
                                }}
                            >
                                <Clock className="text-muted-foreground w-4 h-4 min-w-[20px] flex-shrink-0" />
                                <span className="truncate max-w-[260px] sm:max-w-[280px]">{search.address}</span>
                                <div className='absolute right-0 '>
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-pointer right-9 md:right-12">
                                                    <IconX
                                                        className="text-muted-foreground mr-4 w-4 h-4 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteSearch(search.address);
                                                        }}
                                                    />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className='h-8 border-none bg-slate-950 text-white' side="bottom">
                                                <p className='text-sm'>Delete</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </li>
                        ))}

                        <li
                            className="my-2 p-2 cursor-pointer text-sm items-center flex justify-center font-semibold text-blue-500 hover:text-red-500"
                            onClick={handleClearRecentSearches}
                        >
                            Clear recent history
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBox;



{/* <TooltipProvider delayDuration={100}>
<Tooltip>
    <TooltipTrigger asChild>
        <span className="cursor-pointer">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MenuRounded className="text-muted-foreground ml-2 w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='menu-content sm:mx-6 sm:mt-4 mx-4 mt-4 p-0 border-none rounded-2xl w-[380px] sm:w-full '>
                    <SidebarCommand />
                </DropdownMenuContent>
            </DropdownMenu>
        </span>
    </TooltipTrigger>
    <TooltipContent
        className='h-8 border-none'
        side="right"
        align="center"
        sideOffset={4}>
        <p className='text-sm my-auto'>Menu</p>
    </TooltipContent>
</Tooltip>
</TooltipProvider> */}