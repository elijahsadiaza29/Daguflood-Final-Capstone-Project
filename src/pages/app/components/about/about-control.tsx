import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
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
import { IconCloudFilled, IconX } from "@tabler/icons-react";
import QR from "../../../../assets/qr code.png"
import { ScrollArea } from "@/components/ui/scroll-area";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import InfoIcon from '@mui/icons-material/Info';

interface AboutControlProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAll: () => void;
}

const AboutControl = ({ isOpen, onOpenChange, onCloseAll }: AboutControlProps) => {
    return (
        <div>
            <div className="absolute top-[23rem] right-2 z-50 hidden sm:block">
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
                                            <InfoIcon className="text-white w-6 h-6 sm:w-6 sm:h-6" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <PopoverContent
                                className="relative gap-4 sm:left-auto left-[-0.22222rem] sm:w-[28rem] w-screen sm:h-auto h-[100vh] sm:rounded-xl rounded-none flex flex-col"
                                side="left"
                                sideOffset={4}
                                align="center"
                            >
                                <div className="grid gap-4">
                                    <div id="label" className="flex gap-2 items-center">
                                        <InfoIcon className="text-white w-5 h-5 sm:w-5 sm:h-5" />
                                        <Label className="text-white text-lg">
                                            About
                                        </Label>
                                        <div className="ml-auto block sm:hidden">
                                            <Button
                                                variant="ghost"
                                                size={"sm"}
                                                className="hover:bg-transparent text-right"
                                                onClick={() => onOpenChange(false)}
                                            >
                                                <IconX className="w-5 h-5 sm:w-5 sm:h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <ScrollArea className="h-[90vh] sm:h-[72vh]">
                                    <div className="grid gap-4">
                                        <div id="description" className="text-white flex flex-col gap-2">
                                            <p className="text-md">
                                                <span className="font-semibold text-blue-400 ">DAGUFLOOD</span> is an flood mapping tool for the <span>Dagupan.</span>
                                            </p>
                                            <p>
                                                Explore the power of real-time flood mapping in Dagupan, Philippines.
                                            </p>
                                            <p>
                                                With   <span className="font-semibold">DAGUFLOOD</span> you can also easily access real-time flood data, view historical flood records, access detailed weather forecasts, and stay aware of the latest flood watches, warnings, and emergency notifications.
                                            </p>
                                        </div>
                                        <div id="mobile app" className="hidden sm:block">
                                            <div className="grid gap-3">
                                                <Label className="text-xs font-bold text-white ">
                                                    MOBILE APP
                                                </Label>
                                                <Card>
                                                    <CardContent className="grid grid-cols-[1fr_auto] p-4 gap-2">
                                                        <div className="text-white grid gap-2">
                                                            <p>
                                                                <span className="font-semibold text-blue-400 ">Scan the QR code </span>
                                                                with the camera on your mobile <br />
                                                                device to get the
                                                                app.


                                                            </p>
                                                            <p>
                                                                Coming Soon on Google Play and App Store.
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <img src={QR} alt="" className="w-36 rounded-md" />
                                                            {/* <PWAInstallQR /> */}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                        <div id="contact" className="grid gap-2">
                                            <div>
                                                <Label className="text-white text-xs font-bold ">
                                                    CONTACT
                                                </Label>
                                            </div>
                                            <Card>
                                                <CardContent className="text-white grid grid-cols-[1fr_auto] p-4 gap-2">
                                                    <div>
                                                        <p className="mb-2">
                                                            Please use our <a href="https://mail.google.com/mail/u/0/#inbox?compose=DmwnWsLLkgtHxbvRGPPVRcrMcgWrhmBdKrqLxLSNZDDdFfmhzgZWZRnjZGxTpQHsglrSWlMkvbgQ" className="text-blue-400 font-medium">email</a> to sends us your comments, questions, or suggestions. <br />
                                                        </p>
                                                        <p>
                                                            Follow us on <a href="" className="text-blue-400 font-medium">Facebook </a>, <a href="" className="text-blue-400 font-medium">Instagram</a>, and <a href="" className="text-blue-400 font-medium">Threads</a>.
                                                        </p>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div id="source" className="grid gap-2">
                                            <div>
                                                <Label className="text-white text-xs font-bold ">
                                                    DATA SOURCES
                                                </Label>
                                            </div>
                                            <Card>
                                                <CardContent className="text-white grid p-4 gap-2">
                                                    <div className="flex flex-row gap-2">
                                                        <div>
                                                            <SatelliteAltIcon className="h-6 w-6" />
                                                        </div>
                                                        <p>Live satellite imagery data is provided by  <a href="https://developers.google.com/maps" className="text-blue-400 font-medium">Google Maps API</a>. Satellite imagery updates depending of availability of the satellite.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-row gap-2">
                                                        <div>
                                                            <IconCloudFilled className="h-6 w-6" />
                                                        </div>
                                                        <p>Weather are continually updated with the latest data from <a href="https://openweathermap.org/" className="text-blue-400 font-medium">OpenWeatherMap</a>.
                                                        </p>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div id="footer" className="text-white flex mx-auto mb-4">
                                            <p>
                                                &copy; 2024 <span className="font-semibold text-blue-400 ">DAGUFLOOD</span>
                                            </p>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                        <TooltipContent side="left">
                            <p>About</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div >
    )
}
export default AboutControl;