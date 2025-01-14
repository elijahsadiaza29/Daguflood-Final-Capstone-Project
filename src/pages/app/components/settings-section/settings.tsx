
import { useNotifications } from './../notificationContext/noticationContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/theme-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import lightModeImage from '../../../../assets/light-mode.png';
import darkModeImage from '../../../../assets/dark-mode.png';
import SystemDefaultImage from '../../../../assets/system-default.png';


export function Settings() {
    const { theme, setTheme, mapTheme, setMapTheme } = useThemeContext();
    const { notificationsEnabled, toggleNotifications } = useNotifications();

    return (
        <div className="grid gap-2">
            <Separator className="my-2" />
            <Card className="p-2 px-4">
                <div className="grid grid-cols-2">
                    <div className="header text-left text-xs text-muted-foreground">
                        <Label className="text-foreground font-semibold text-base flex gap-2">
                            Notification
                        </Label>
                        Allow notification to receive alerts.
                    </div>
                    <div className="toggle-btn my-auto text-right w-full">
                        <Switch
                            checked={notificationsEnabled}
                            onCheckedChange={toggleNotifications}
                        />
                    </div>
                </div>
            </Card>
            <Card className="p-2 px-4">
                <div className="header text-left">
                    <Label className="text-foreground font-semibold text-base flex gap-2">
                        Interface Theme
                    </Label>
                    <Label className="text-xs text-muted-foreground">Select preferred UI theme:</Label>
                </div>
                <div className="grid mt-3">
                    {/* img */}
                    <div className="grid grid-cols-3">
                        <div className="system-default-theme grid grid-rows-[1fr_auto] h-[100px] sm:h-[130px] bg-background">
                            <div className="img h-full p-1">
                                <img src={SystemDefaultImage} className="w-full h-full rounded-md" alt="System Default" />
                            </div>
                        </div>
                        <div className="light-mode-theme grid grid-rows-[1fr_auto] h-[100px] sm:h-[130px] bg-background">
                            <div className="img h-full p-1">
                                <img src={lightModeImage} className="w-full h-full rounded-md" alt="Light Mode" />
                            </div>
                        </div>
                        <div className="dark-mode-theme grid grid-rows-[1fr_auto] h-[100px] sm:h-[130px] bg-background">
                            <div className="img h-full p-1">
                                <img src={darkModeImage} className="w-full h-full rounded-md" alt="Dark Mode" />
                            </div>
                        </div>
                    </div>
                    <div className="radio-btn grid-rows-1 mt-2">
                        <RadioGroup
                            defaultValue={theme}
                            onValueChange={(value) => setTheme(value as 'system' | 'light' | 'dark')}
                        >
                            <div className="grid grid-cols-3 place-items-center">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="system" id="system" />
                                    <Label htmlFor="system" className="text-foreground text-xs sm:text-md">
                                        Default
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="light" id="light" />
                                    <Label htmlFor="light" className="text-foreground text-xs sm:text-md">
                                        Light
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dark" id="dark" />
                                    <Label htmlFor="dark" className="text-foreground text-xs sm:text-md">
                                        Dark
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </Card>
            <Card className="p-2 px-4">
                <div className="grid grid-cols-2">
                    <div className="header gap-2 text-left">
                        <Label className="text-foreground flex font-semibold text-base">Map Style</Label>
                        <Label className="text-xs text-muted-foreground">Select map theme:</Label>
                    </div>
                    <div className="map-style justify-self-end">
                        <Select value={mapTheme} onValueChange={(value) => setMapTheme(value as 'light' | 'dark')}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    );
}


