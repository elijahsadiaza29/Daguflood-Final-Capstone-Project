import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    GearIcon,
    QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { ChartArea, PhoneCall} from "lucide-react";
import { Settings } from '../settings-section/settings';
import LevelsContent from "../status-levels-section/chart-container";
import SheetToggleHotlines from "../map-section/map-hotline-container/sheet-toggle-hotlines";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function SidebarCommand() {
    const navigate = useNavigate();

    return (
        <Command className="rounded-2xl border shadow-md md:min-w-[340px] py-2">
            <CommandInput placeholder="Search controls..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Menu">
                    <CommandItem className="p-0">
                        <Dialog>
                            <DialogTrigger className="w-full">
                                <CommandItem>
                                    <ChartArea className="mr-2 h-4 w-4" />
                                    <span>Flood Area Status</span>
                                </CommandItem>
                            </DialogTrigger>
                            <DialogContent className="w-[380px] sm:w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl rounded-xl sm:rounded-2xl p-4">
                                <DialogHeader>
                                    <DialogTitle className="px-4 mt-2 text-2xl text-muted-foreground">Real-time Flood and Tide Level Status</DialogTitle>
                                    <DialogDescription>
                                        <LevelsContent />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </CommandItem>
                    <CommandItem className="p-0">
                    <Sheet>
                            <SheetTrigger className="w-full">
                                <CommandItem>
                                    <PhoneCall className="mr-2 h-4 w-4" />
                                    <span>Emergency Hotlines</span>
                                </CommandItem>
                            </SheetTrigger>
                            <SheetContent className="w-[380px] sm:w-full max-w-screen-sm">
                                <SheetHeader>
                                    <SheetTitle className="text-sm text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>Emergency Hotlines</SheetTitle>
                                    <SheetToggleHotlines />
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem className="p-0">
                        <Dialog>
                            <DialogTrigger className="w-full">
                                <CommandItem>
                                    <GearIcon className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </CommandItem>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl sm:rounded-3xl w-[380px] sm:w-full max-w-screen-sm">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl text-left">Settings</DialogTitle>
                                    <DialogDescription>
                                        <Settings />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </CommandItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CommandItem className="w-full">
                                <QuestionMarkCircledIcon className="mr-2 h-4 w-4" />
                                <span>Help</span>
                            </CommandItem>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mx-[-5px]">
                            <DropdownMenuLabel>Help</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-xs"
                                onClick={() => navigate('/help-center')}
                            >
                                Help center
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
