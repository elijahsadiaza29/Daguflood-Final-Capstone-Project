import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import MenuRounded from "@mui/icons-material/MenuRounded";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { IconChartBar } from "@tabler/icons-react";
import LevelsContent from "../status-levels-section/chart-container";
import SheetToggleHotlines from "../map-section/map-hotline-container/sheet-toggle-hotlines";
import {Settings} from "../settings-section/settings";

const MainNavLinks = [
    {
        label: "Status",
        to: "/",
        icon: <IconChartBar
            size={22}
            className="text-muted-foreground group-hover:text-blue-500 transition-colors ease-in-out duration-200" />,
        dialogContent: <LevelsContent />
    }
];

const HotlineLinks = [
    {
        label: "Emergency Hotlines",
        to: "/",
        icon: <PhoneCall
            size={22}
            className="text-muted-foreground group-hover:text-blue-500 transition-colors ease-in-out duration-200" />
    }
]
const SubNavLinks = [
    {
        label: "Help center",
        to: "/",
        description: "Get all of your questions answered in our forums or contact support.",
    },
    {
        label: "About us",
        to: "/",
    },
    {
        label: "Settings",
        to: "/",
        DialogContent: <Settings />
    },
];

const SidebarToggle = () => {
    return (
        <div id="sidebar-toggle-container">
            <Sheet>
                <SheetTrigger>
                    <MenuRounded className="text-muted-foreground ml-2 w-5 h-5" />
                </SheetTrigger>
                    <SheetContent side={"left"} className="w-[400px] sm:w-[320px]">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-4 font-bold text-2xl">
                                <img src="/src/assets/logo.svg" alt="Logo" className="w-10 h-10" />
                                Daguflood
                            </SheetTitle>
                            <div className="flex flex-col">
                                <ul className="flex flex-col ml-2 mt-2">
                                    {MainNavLinks.map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Link
                                                        to={item.to || "/"}
                                                        className={cn(
                                                            buttonVariants({
                                                                variant: "outline",
                                                                size: "default",
                                                                className: "flex w-full border-none hover:bg-transparent hover:text-blue-500 group justify-start items-center text-muted-foreground px-2"
                                                            })
                                                        )}
                                                    >
                                                        {item.icon}
                                                        <span className="ml-4 text-xs font-normal" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                                                    </Link>
                                                </DialogTrigger>
                                                <DialogContent
                                                    className="w-[380px] sm:w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl rounded-xl sm:rounded-2xl p-4"
                                                >
                                                    <DialogTitle className="px-4 mt-2 text-2xl text-muted-foreground ">Real time Flood and Tide level Status</DialogTitle>
                                                    <DialogHeader>
                                                        {item.dialogContent}
                                                    </DialogHeader>
                                                    <DialogClose />
                                                </DialogContent>
                                            </Dialog>
                                        </li>
                                    ))}
                                </ul >
                                <ul className="flex flex-col ml-2">
                                    {HotlineLinks.map((item, i) => (
                                        <li key={i}>
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Link
                                                        to={item.to || "/"}
                                                        className={cn(
                                                            buttonVariants({
                                                                variant: "outline",
                                                                size: "default",
                                                                className: "flex w-full border-none bg-transparent hover:bg-transparent hover:text-blue-500 group justify-start items-center text-muted-foreground px-2"
                                                            })
                                                        )}
                                                    >
                                                        {item.icon}
                                                        <span className="ml-4 text-xs font-normal" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>

                                                    </Link>

                                                </SheetTrigger>
                                                <SheetContent className="w-full sm:w-[600px]">
                                                    <SheetHeader>
                                                        <SheetTitle className="text-sm text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>Emergency Hotlines</SheetTitle>
                                                        <SheetToggleHotlines />
                                                    </SheetHeader>
                                                </SheetContent>
                                            </Sheet>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col">
                                    <ul className="flex flex-col">
                                        {SubNavLinks.map((item, i) => (
                                            <li key={i} className="flex items-center">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Link
                                                            to={item.to || "/"}
                                                            className={cn(
                                                                buttonVariants({
                                                                    variant: "outline",
                                                                    size: "default",
                                                                    className: "flex justify-start items-center border-none bg-transparent hover:bg-transparent hover:text-blue-500 px-0 w-full group"
                                                                })
                                                            )}
                                                        >
                                                            <span className="ml-4 text-xs font-normal">{item.label}</span>
                                                        </Link>
                                                    </DialogTrigger>
                                                    <DialogContent
                                                        className="w-[380px] sm:w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl rounded-xl sm:rounded-2xl p-4 bg-primary-foreground"
                                                    >
                                                        {item.DialogContent}
                                                    </DialogContent>
                                                </Dialog>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>


                        </SheetHeader>
                    </SheetContent>
            </Sheet>
        </div>
    );
}

export default SidebarToggle