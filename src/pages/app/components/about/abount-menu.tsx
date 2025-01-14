import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Logo from '../../../../assets/logo.svg';
import SettingsIcon from '@mui/icons-material/Settings'; // Import settings icon
import CallIcon from '@mui/icons-material/Call';
import { Button } from "@/components/ui/button" // Assuming you're using shadcn Button
import { Label } from '@/components/ui/label';
import InfoIcon from '@mui/icons-material/Info';
import { IconShare2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import HelpIcon from '@mui/icons-material/Help';
// Add prop types
interface AboutMenuProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAll: () => void;
    onOpenSettings: () => void; // New prop to open settings
    onOpenAbout: () => void;
    onOpenShare: () => void;
    onOpenCall: () => void;
}

const AboutMenu: React.FC<AboutMenuProps> = ({
    isOpen,
    onOpenChange,
    onCloseAll,
    onOpenSettings, // Add this prop
    onOpenAbout,
    onOpenShare,
    onOpenCall


}) => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/help-center"); // Replace "/new-path" with the desired path
    };

    return (

        <div className="absolute top-10 left-4 block sm:hidden items-center gap-2 ">
            <Popover
                open={isOpen}
                onOpenChange={(open) => {
                    if (open) {
                        onCloseAll();
                    }
                    onOpenChange(open);
                }}
            >
                <PopoverTrigger>
                    <div id="logo" className="flex items-center justify-center">
                        <img src={Logo} alt="Logo" className="w-10 h-10" />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="p-2 w-auto rounded-xl"
                    align="start"
                    side="bottom"
                    sideOffset={10}
                >
                    <Button
                        className="text-white flex gap-2"
                        variant="ghost"
                        onClick={onOpenSettings}
                    >
                        <SettingsIcon className="w-6 h-6" />
                        <Label className="text-base">
                            Settings
                        </Label>
                    </Button>
                    <Button
                        className="text-white flex gap-2"
                        variant="ghost"
                        onClick={onOpenAbout}
                    >
                        <InfoIcon className="w-6 h-6" />
                        <Label className="text-base">
                            About
                        </Label>
                    </Button>
                    <Button
                        className="text-white flex gap-2"
                        variant="ghost"
                        onClick={onOpenShare}
                    >
                        <IconShare2 stroke={2.5} className="w-6 h-6 sm:w-6 sm:h-6" />
                        <Label className="text-base">
                            Share
                        </Label>
                    </Button>
                    <Button
                        className="text-white flex gap-2"
                        variant="ghost"
                        onClick={handleClick}
                    >
                        <HelpIcon />
                        {/* <IconShare2 stroke={2.5} className="w-6 h-6 sm:w-6 sm:h-6" /> */}
                        <Label className="text-base">
                            Help
                        </Label>
                    </Button>
                    <Button
                        className="text-white flex gap-2"
                        variant="ghost"
                        onClick={onOpenCall}
                    >
                        <CallIcon className="w-6 h-6 sm:w-6 sm:h-6" />
                        <Label className="text-base">
                            Emergency
                        </Label>
                    </Button>
                </PopoverContent>
            </Popover>


        </div>
    )
}

export default AboutMenu;