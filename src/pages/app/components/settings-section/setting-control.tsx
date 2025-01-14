
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { IconX } from "@tabler/icons-react";
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useThemeContext } from "@/theme-context";
import { useNotifications } from './../notificationContext/noticationContext';


interface SettingControlProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAll: () => void;
}

const SettingControl: React.FC<SettingControlProps> = ({
    isOpen,
    onOpenChange,
    onCloseAll
}) => {

    // const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme, mapTheme, setMapTheme } = useThemeContext();
    const { notificationsEnabled, toggleNotifications } = useNotifications();


    return (
        <div className="absolute top-80 right-2 z-50 hidden sm:block">
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <Popover
                        open={isOpen}
                        onOpenChange={(open) => {
                            if (open) {
                                onCloseAll();
                            }
                            onOpenChange(open);
                        }}
                    >
                        <TooltipTrigger>
                            <PopoverTrigger>
                                <Button
                                    variant="opaque"
                                    className="text-foreground sm:rounded-full rounded-full w-11 h-11"
                                    size="icon"
                                >
                                    {isOpen ? (
                                        <IconX className="text-white w-6 h-6 sm:w-5 sm:h-5" />
                                    ) : (
                                        <SettingsIcon className="text-white w-6 h-6 sm:w-6 sm:h-6" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <PopoverContent
                            className="relative sm:left-auto left-[-0.22222rem] sm:w-[28rem] w-screen sm:h-auto h-[100vh] sm:rounded-xl rounded-none flex flex-col"
                            side="left"
                            sideOffset={4}
                            align="start"
                        >
                            <div className="grid gap-2">
                                <div id="label" className="flex gap-2 items-center">
                                    <SettingsIcon className="text-white w-5 h-5 sm:w-5 sm:h-5" />
                                    <Label className="text-lg text-white">
                                        Settings
                                    </Label>
                                    <div className="ml-auto block sm:hidden">
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            className="hover:bg-transparent text-right"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            <IconX className="text-white w-5 h-5 sm:w-5 sm:h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div id="notification-container" className="grid gap-1">
                                    <div>
                                        <Label className="text-xs font-bold text-white ">
                                            NOTIFICATIONS
                                        </Label>
                                    </div>
                                    <Card className="bg-white/5">
                                        <CardContent className="grid p-4 gap-2 text-white ">
                                            <div className="grid grid-cols-2">
                                                <div className="flex gap-2">
                                                    <NotificationsActiveIcon className="w-5 h-5 my-1" />
                                                    <div>
                                                        <Label className="text-md font-semibold">Notification</Label>

                                                        <p className="text-xs text-white">
                                                            Allow to receive alerts.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="toggle-btn my-auto text-right w-full">
                                                    <Switch
                                                        checked={notificationsEnabled}
                                                        onCheckedChange={toggleNotifications}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div id="theme-container" className="grid gap-1">
                                    <div>
                                        <Label className="text-xs font-bold text-white ">
                                            CUSTOMIZATION
                                        </Label>
                                    </div>
                                    <Card className="bg-white/5">
                                        <CardContent className="grid p-4 gap-2">

                                            {/* Appearance theme */}
                                            <div className="flex gap-2 items-center ">
                                                <VisibilityIcon className="text-white w-5 h-5" />
                                                <Label className="text-md font- text-white ">Appearance</Label>
                                            </div>
                                            <div className="flex gap-2 w-full bg-gray-600/40  rounded-full">
                                                <Button
                                                    className={`w-full  rounded-full ${theme === "dark" ? "border-none bg-white text-black/70 hover:bg-white hover:text-black/70" : "bg-transparent text-white hover:bg-transparent hover:text-white border-none"}`}
                                                    size="sm"
                                                    value="dark"
                                                    id="dark"
                                                    variant={"opaque"}
                                                    defaultValue={theme}
                                                    onClick={() => setTheme("dark")}
                                                >
                                                    Dark
                                                </Button>
                                                <Button
                                                    className={`w-full rounded-full ${theme === "light" ? "border-none bg-white text-black/70 hover:bg-white hover:text-black/70" : "bg-transparent text-white hover:bg-transparent hover:text-white border-none"}`}
                                                    size="sm"
                                                    value="light"
                                                    id="light"
                                                    variant={"opaque"}
                                                    onClick={() => setTheme("light")}
                                                >
                                                    Translucent
                                                </Button>
                                            </div>

                                            {/* Map theme */}
                                            <div className="flex gap-2 items-center">
                                                <ColorLensIcon className="text-white w-5 h-5" />
                                                <Label className="text-white text-md font-semibold">Map Theme</Label>
                                            </div>
                                            <div className="flex gap-2 w-full bg-gray-600/40 rounded-full">
                                                <Button
                                                    className={`w-full border-none rounded-full ${mapTheme === "light" ? "border-none bg-white text-black/70 hover:bg-white hover:text-black/70" : "bg-transparent text-white hover:bg-transparent hover:text-white border-none"}`}
                                                    size="sm"
                                                    value="light"
                                                    id="light"
                                                    onClick={() => {
                                                        setMapTheme("light"); // Sets map theme to light
                                                        console.log('Map theme changed to light'); // Debugging output
                                                    }}
                                                >
                                                    Light
                                                </Button>

                                                <Button
                                                    className={`w-full rounded-full ${mapTheme === "dark" ? "border-none bg-white text-black/70 hover:bg-white hover:text-black/70" : "bg-transparent text-white hover:bg-transparent hover:text-white border-none"}`}
                                                    size="sm"
                                                    value="dark"
                                                    id="dark"
                                                    onClick={() => {
                                                        setMapTheme("dark"); // Sets map theme to dark
                                                        console.log('Map theme changed to dark'); // Debugging output
                                                    }}
                                                >
                                                    Dark
                                                </Button>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </div>


                            </div>
                        </PopoverContent>
                    </Popover>
                    <TooltipContent side="left">
                        <p>Setting</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
export default SettingControl;