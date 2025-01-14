import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import Maplegend from './legend-map/map-legend-gradient-parent';
import { ref, onValue, off } from "firebase/database";
import ShadCNPopover from './map-infowindow/info-window';
import { database } from '../../../../firebaseConfig';
import './mapstyle.css';
import { lightMapStyle, darkMapStyle, LocationBounds, mapDefaultCenter } from './mapConfig';
import { getMarkerColor, getMarkerIconUrl } from './mapUtils';
import { useThemeContext } from '../../../../theme-context';
import About from '../about/about-logo';
import MapType from './map-type-control/map-type';
import SearchControl from './searchbox-map/search-control-btn';
import ShareControl from '../share/share-control';
import SettingControl from '../settings-section/setting-control';
import AboutControl from '../about/about-control';
import MapPositionControl from './center-location-button/map-center-control';
import AboutMenu from '../about/abount-menu';
import CallControl from './map-hotline-container/call-control';
import StatusControl from '../status-levels-section/stat-control-btn';
import Weather from '../weather/hourly-weatherforecast/weather';
import HelpButton from './map-help-btn/help-button';

interface LatLng {
    lat: number;
    lng: number;
}

interface MarkerData {
    lat: number;
    lng: number;
    station: string;
    waterLevel: number;
    status: string;
    latestUpdate: string;
    address: string;
}

const MyMap: React.FC = () => {
    // Refs
    const mapRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    // State
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [overlayView, setOverlayView] = useState<google.maps.OverlayView | null>(null);
    const [center, setCenter] = useState<LatLng>(mapDefaultCenter);
    const [userLocationMarker, setUserLocationMarker] = useState<google.maps.Marker | null>(null);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [selectedMarkerData, setSelectedMarkerData] = useState<MarkerData | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [, setIsInputActive] = useState(false);
    const { mapTheme } = useThemeContext();
    // Create state for managing popover opens
    const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
    const [isAboutControlOpen, setIsAboutControlOpen] = useState(false);
    const [isSettingControlOpen, setIsSettingControlOpen] = useState(false);
    const [isShareControlOpen, setIsShareControlOpen] = useState(false);
    const [isCallControlOpen, setIsCallControlOpen] = useState(false);

    // Function to close all popovers
    const closeAllPopovers = () => {
        setIsAboutMenuOpen(false);
        setIsSettingControlOpen(false);
    };

    const openSettings = () => {
        setIsAboutMenuOpen(false);
        setIsSettingControlOpen(true);
    };

    const openAbout = () => {
        setIsAboutMenuOpen(false);
        setIsAboutControlOpen(true);
    }

    const openShare = () => {
        setIsAboutMenuOpen(false);
        setIsShareControlOpen(true);
    }
    const openCall = () => {
        setIsAboutMenuOpen(false);
        setIsCallControlOpen(true);
    }

    const initMap = useCallback(async () => {
        if (map) return;
        if (!mapRef.current) return;

        try {
            const loader = new Loader({
                apiKey: 'AIzaSyD5vVnzoPuFc0QJbVhxb4u-tJhDJkW2AhM',
                version: "weekly",
                libraries: ["places"],
                authReferrerPolicy: 'origin',
            });

            const google = await loader.load();

            const mapInstance = new google.maps.Map(mapRef.current, {
                center: mapDefaultCenter,
                zoom: 16,
                styles: mapTheme === 'dark' ? darkMapStyle : lightMapStyle,
                mapTypeId: "roadmap",
                restriction: {
                    latLngBounds: LocationBounds,
                    strictBounds: false,
                },
                fullscreenControl: false,
                streetViewControl: true,
                mapTypeControl: false,
                zoomControl: false,
            });


            // Create Street View panorama, but don't set it immediately
            const panorama = new google.maps.StreetViewPanorama(mapRef.current, {
                enableCloseButton: true,
                fullscreenControl: false,
                visible: false, // Initially invisible
            });


            mapInstance.setStreetView(panorama);


            // Error handling for map
            google.maps.event.addListenerOnce(mapInstance, 'error', () => {
                setMapError('Failed to load Google Maps. Please try again later.');
            });

            setMap(mapInstance);

            // Create overlay view
            const overlay = new google.maps.OverlayView();
            overlay.onAdd = () => { };
            overlay.draw = () => { };
            overlay.onRemove = () => { };
            overlay.setMap(mapInstance);
            setOverlayView(overlay);

            // Initialize user location marker
            const initialUserMarker = new google.maps.Marker({
                position: center,
                map: mapInstance,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                },
                title: "Your Location",
            });
            setUserLocationMarker(initialUserMarker);

            // Set up markers
            setupMarkersListener(mapInstance);

        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Check.');
        }
    }, [center, mapTheme,]);

    useEffect(() => {
        if (map) {
            map.setOptions({
                styles: mapTheme === 'dark' ? darkMapStyle : lightMapStyle
            });
        }
    }, [mapTheme, map]);

    const setupMarkersListener = useCallback((mapInstance: google.maps.Map) => {
        const markersRef = ref(database, 'floodData');
        const markersMap = new Map<string, google.maps.Marker>();

        const handleMarkerData = (snapshot: any) => {
            if (!snapshot.exists()) {
                console.warn("No flood data available");
                return;
            }

            // Clear old markers
            markersMap.forEach((marker, stationId) => {
                if (!snapshot.hasChild(stationId)) {
                    marker.setMap(null);
                    markersMap.delete(stationId);
                }
            });

            // Update markers
            snapshot.forEach((childSnapshot: any) => {
                const stationId = childSnapshot.key;
                const data = childSnapshot.val();
                const currentData = data.current;

                if (currentData?.lat !== undefined && currentData?.lng !== undefined) {
                    const markerData: MarkerData = {
                        lat: currentData.lat,
                        lng: currentData.lng,
                        station: stationId,
                        waterLevel: currentData.waterLevel,
                        status: currentData.status,
                        latestUpdate: currentData.timestamp,
                        address: data.address || '',
                    };

                    if (markersMap.has(stationId)) {
                        // Update existing marker
                        const existingMarker = markersMap.get(stationId);
                        if (existingMarker) {
                            existingMarker.setPosition({ lat: markerData.lat, lng: markerData.lng });
                            existingMarker.setIcon(getMarkerIconUrl(getMarkerColor(markerData.status), 'animate-pulse'));
                            existingMarker.set('markerData', markerData);
                        }
                    } else {
                        // Create new marker
                        const marker = createMarker(mapInstance, markerData);
                        setupMarkerListeners(marker);
                        markersMap.set(stationId, marker);
                    }
                }
            });
        };

        onValue(markersRef, handleMarkerData, (error) => {
            console.error('Error loading flood data:', error);
        });

        return () => {
            off(markersRef);
            markersMap.forEach(marker => marker.setMap(null));
            markersMap.clear();
        };
    }, []);

    const createMarker = (mapInstance: google.maps.Map, markerData: MarkerData) => {
        const markerColor = getMarkerColor(markerData.status);
        const marker = new google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map: mapInstance,
            title: markerData.station,
            icon: getMarkerIconUrl(markerColor, 'animate-pulse'),
        });
        marker.set('markerData', markerData);
        return marker;
    };

    const setupMarkerListeners = (marker: google.maps.Marker) => {
        marker.addListener("click", () => {
            const markerData = marker.get('markerData') as MarkerData;
            setSelectedMarkerData(markerData);
            setPopoverOpen(true);

            const markerPosition = marker.getPosition();
            if (markerPosition && overlayView) {
                const point = overlayView.getProjection().fromLatLngToDivPixel(markerPosition);
                if (point && anchorRef.current) {
                    anchorRef.current.style.left = `${point.x - 25}px`;
                    anchorRef.current.style.top = `${point.y - 50}px`;
                }
            }
        });
    };

    const handleCenterMap = useCallback(() => {
        if (!map) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(userLocation);
                    map.panTo(userLocation);
                    map.setZoom(15);
                    updateUserLocationMarker(userLocation);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Handle geolocation error (optional)
                }
            );
        }
    }, [map]);

    const updateUserLocationMarker = (position: LatLng) => {
        if (userLocationMarker) {
            userLocationMarker.setPosition(position);
        } else if (map) {
            const newMarker = new google.maps.Marker({
                position: position,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 2,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                },
                title: "Your Location",
            });
            setUserLocationMarker(newMarker);
        }
    };

    // Effects
    useEffect(() => {
        initMap();
        return () => {
            if (map) {
                google.maps.event.clearInstanceListeners(map);
            }
        };
    }, [initMap]);

    useEffect(() => {
        if (map) {
            map.setCenter(center);
            userLocationMarker?.setPosition(center);
            map.fitBounds(LocationBounds);
        }
    }, [center, map, userLocationMarker]);

    if (mapError) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                <div className="text-center p-4">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                        Map Error
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{mapError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full">
            <div ref={mapRef} className="h-full rounded-none" />
            <div ref={anchorRef} className="absolute" style={{ width: 0, height: 0 }} />

            {/* Logo */}
            <About />


            <Maplegend />




            <div id="controls">
                <AboutMenu
                    isOpen={isAboutMenuOpen}
                    onOpenChange={setIsAboutMenuOpen}
                    onCloseAll={closeAllPopovers}
                    onOpenSettings={openSettings}
                    onOpenAbout={openAbout}
                    onOpenShare={openShare}
                    onOpenCall={openCall}

                />

                <SearchControl
                    map={map}
                    onInputActiveChange={setIsInputActive}
                />
                <MapPositionControl
                    onCenterMap={handleCenterMap}
                />
                {map && <MapType map={map} />}

                <StatusControl />

                <AboutControl
                    isOpen={isAboutControlOpen}
                    onOpenChange={setIsAboutControlOpen}
                    onCloseAll={closeAllPopovers}
                />

                <SettingControl
                    isOpen={isSettingControlOpen}
                    onOpenChange={setIsSettingControlOpen}
                    onCloseAll={closeAllPopovers}
                />
                <ShareControl
                    isOpen={isShareControlOpen}
                    onOpenChange={setIsShareControlOpen}
                    onCloseAll={closeAllPopovers} />

                <CallControl
                    isOpen={isCallControlOpen}
                    onOpenChange={setIsCallControlOpen}
                    onCloseAll={closeAllPopovers}
                />
                <Weather />
                <HelpButton />
            </div>


            <ShadCNPopover
                isOpen={isPopoverOpen}
                onClose={() => setPopoverOpen(false)}
                markerData={selectedMarkerData}
                anchorEl={anchorRef.current}
            />
        </div>
    );
};

export default MyMap;