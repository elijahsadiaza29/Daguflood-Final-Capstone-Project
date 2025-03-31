import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconTimeline } from "@tabler/icons-react";
import { useState, useEffect } from 'react';

const StatusControl = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            setShowTooltip(true);
            setIsTooltipVisible(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        let tooltipTimer: string | number | NodeJS.Timeout | undefined;
        let fadeTimer: string | number | NodeJS.Timeout | undefined;
        
        if (isMobile && showTooltip) {
            // Start fade out 500ms before hiding completely
            tooltipTimer = setTimeout(() => {
                setIsTooltipVisible(false);
            }, 9500); // 9.5 seconds

            // Hide tooltip completely after fade
            fadeTimer = setTimeout(() => {
                setShowTooltip(false);
            }, 10000); // 10 seconds
        }

        return () => {
            if (tooltipTimer) clearTimeout(tooltipTimer);
            if (fadeTimer) clearTimeout(fadeTimer);
        };
    }, [isMobile, showTooltip]);

    const handleClick = () => {
        if (isMobile) {
            setIsTooltipVisible(false);
            // Wait for fade out before hiding
            setTimeout(() => {
                setShowTooltip(false);
            }, 500);
        }
        navigate("/data");
    };

    return (
        <div className="absolute top-[88%] sm:top-52 right-2 z-50">
            <TooltipProvider delayDuration={50}>
                <Tooltip
                    open={isMobile ? showTooltip : undefined}
                >
                    <TooltipTrigger asChild>
                        <Button
                            variant="opaque"
                            className="text-white bg-blue-500 sm:bg-[#202730] sm:rounded-full rounded-full w-11 h-11
                                     sm:shadow-none    
                                     shadow-[0_0_15px_rgba(255,255,255,0.5)]
                                     transition-shadow duration-300"
                            size="icon"
                            onClick={handleClick}
                        >
                            <IconTimeline strokeWidth={2.5} className="w-6 h-6 sm:w-6 sm:h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                        side="left" 
                        className={`max-w-[180px] bg-blue-500 sm:bg-[#202730]
                                  transition-opacity duration-500 ease-in-out
                                  ${isTooltipVisible ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <p>{isMobile
                            ? "Tap this button to access\nflood data and more"
                            : "View Status Levels"}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default StatusControl;