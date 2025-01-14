import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useRef } from 'react';
import mapImg1 from '/src/assets/google-map-satellite-imagery.png';
import mapImg2 from '/src/assets/image (4).png'; // This will now be your hybrid map icon
import { IconStackFilled, IconX } from '@tabler/icons-react';

interface MapTypeControlProps {
    map: google.maps.Map;
}

const MapTypeControl: React.FC<MapTypeControlProps> = ({ map }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [btnOpen, setbtnOpen] = useState(false);
    const controlDivRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (controlDivRef.current) {
            controlDivRef.current.remove();
        }

        if (!isVisible) return;

        const controlDiv = document.createElement('div');
        controlDiv.className = 'absolute sm:bottom-20 bottom-20 sm:right-16 right-14 p-0.5 bg-white shadow-lg rounded-md z-50';
        controlDivRef.current = controlDiv;

        // Create the image element for toggling
        const toggleImage = document.createElement('img');
        toggleImage.src = mapImg1; // Initial image (Roadmap)
        toggleImage.className = 'w-16 h-16 cursor-pointer rounded-sm';

        // Create labels
        const mapLabel = document.createElement('div');
        mapLabel.innerText = 'Map';
        mapLabel.className = 'absolute mx-1 my-1 rounded-sm inset-0 flex items-center justify-center text-white bg-black bg-opacity-20 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none';

        const hybridLabel = document.createElement('div');
        hybridLabel.innerText = 'Satellite';
        hybridLabel.className = 'absolute mx-1 my-1 rounded-sm inset-0 flex items-center justify-center text-white bg-black bg-opacity-20 opacity-100 transition-opacity duration-300 pointer-events-none';

        // Append labels to the image container
        controlDiv.appendChild(toggleImage);
        controlDiv.appendChild(mapLabel);
        controlDiv.appendChild(hybridLabel);

        // Add click event listener to switch between Map and Hybrid
        toggleImage.onclick = () => {
            const currentMapType = map.getMapTypeId();
            if (currentMapType === google.maps.MapTypeId.ROADMAP) {
                map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                toggleImage.src = mapImg2;
                mapLabel.classList.remove('opacity-0');
                mapLabel.classList.add('opacity-100');
                hybridLabel.classList.remove('opacity-100');
                hybridLabel.classList.add('opacity-0');
            } else {
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                toggleImage.src = mapImg1;
                mapLabel.classList.remove('opacity-100');
                mapLabel.classList.add('opacity-0');
                hybridLabel.classList.remove('opacity-0');
                hybridLabel.classList.add('opacity-100');
            }
        };
        // Append the control to the map container directly
        map.getDiv().appendChild(controlDiv);

        // Clean up when the component unmounts
        return () => {
            if (controlDivRef.current) {
                controlDivRef.current.remove();
            }
        };
    }, [map, isVisible]);

    return (
        <div>
            <Button
                className="absolute sm:bottom-[5rem] bottom-10 sm:right-2 left-2 sm:left-auto shadow-xl  w-11 h-11 sm:rounded-full rounded-full hover:bg-background"
                size="icon"
                variant="outline"
                onClick={() => {
                    setIsVisible(!isVisible);
                    setbtnOpen(!btnOpen);
                }}
            >
                {btnOpen ? (
                    <IconX className="text-foreground w-6 h-6 sm:w-5 sm:h-5" />
                ) : (
                    <IconStackFilled className="text-foreground w-6 h-6 sm:w-5 sm:h-5" />
                )}
            </Button>
        </div>
    );
};

export default MapTypeControl;