import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { MarkerData } from './../types';
import { InfowindowChart } from '../map-infowindow/window-chart';
import { Button } from '@/components/ui/button'; // Adjust the path as needed
import { X } from 'lucide-react';
import './infowindow.css';


interface ShadCNPopoverProps {
    isOpen: boolean;
    markerData: MarkerData | null;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

const ShadCNPopover: React.FC<ShadCNPopoverProps> = ({ isOpen, markerData, onClose, anchorEl }) => {
    if (!markerData || !anchorEl) return null;

    return (
        <Popover open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
            <PopoverTrigger asChild>
                <span ref={(el) => anchorEl && el && (el.style.display = 'none')}></span>
            </PopoverTrigger>
            <PopoverContent
                className="p-0 border-none infowindow max-w-md rounded-3xl text-foreground absolute lg:top-[18rem] lg:left-[52rem] sm:top-60 sm:left-[25rem] left-16 top-72"
            >
                <div className="flex justify-end absolute mb-2 right-2 top-2">
                    <Button variant="ghost" className='hover:bg-transparent' size="sm" onClick={onClose}>
                        <X />
                    </Button>
                </div>
                <InfowindowChart markerData={{ ...markerData, latestUpdate: String(markerData.latestUpdate) }} />

            </PopoverContent>
        </Popover>
    );
};

export default ShadCNPopover;
