import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { IconDots, IconPhoneCall } from "@tabler/icons-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import LevelsContent from "../status-levels-section/chart-container";
import SheetToggleHotlines from "../map-section/map-hotline-container/sheet-toggle-hotlines";
import { ChartArea } from "lucide-react";


const ToolsNavLinks = [
    {
        label: "Status",
        to: "/",
        icon: <ChartArea className="w-6 h-6 text-muted-foreground hover:text-blue-500 transition-colors ease-in-out duration-200" />,
        dialogContent: <LevelsContent />
    },
];

const SubNavLinks = [
    {
        label: "Hotlines",
        to: "/",
        icon: <IconPhoneCall className="w-6 h-6 text-muted-foreground hover:text-blue-500 transition-colors ease-in-out duration-200" />,
    },
];

const More = [
    {
        label: "More",
        to: "",
        icon: <IconDots className="w-6 h-6 text-muted-foreground hover:text-blue-500 transition-colors ease-in-out duration-200" />,

    },
]


const Sidebar = () => {
    return (
        <div id="sidebar" className="flex-col h-full w-full rounded-sm lg:block hidden">
            <div className="flex justify-center items-center mt-4 2xl:mt-4 ">
                <img src="/src/assets/logo.svg" alt="Logo" className="w-9 h-9 2xl:w-10 2xl:h-10" />
            </div>
            <div className="my-6 ">
                <ul className="flex flex-col gap-2">
                    {ToolsNavLinks.map((item, i) => (
                        <li key={i}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Link
                                        to={item.to || "/"}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "default",
                                                className: "flex flex-col border-none bg-transparent hover:bg-transparent justify-start items-center text-muted-foreground px-2"
                                            })
                                        )}
                                    >
                                        {item.icon}
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
                            <div className="text-muted-foreground text-xs font-medium text-center">{item.label}</div>
                        </li>
                    ))}
                </ul>
                {/* Emergency Hotlines */}
                <ul className="flex flex-col mt-2">
                    {SubNavLinks.map((item, i) => (
                        <li key={i}>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Link
                                        to={item.to || "/"}
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "default",
                                                className: "flex flex-col border-none bg-transparent hover:bg-transparent justify-start items-center text-muted-foreground px-2"
                                            })
                                        )}
                                    >
                                        {item.icon}
                                    </Link>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:w-[600px]">
                                    <SheetHeader>
                                        <SheetTitle className="text-sm text-muted-foreground" style={{ fontFamily: "Inter, sans-serif" }}>Emergency Hotlines</SheetTitle>
                                        <SheetToggleHotlines />
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>

                            <div className="text-muted-foreground text-xs font-medium text-center">{item.label}</div>
                        </li>
                    ))}
                </ul>

                {/* More Links */}
                <ul className="flex flex-col mt-2">
                    {More.map((item, i) => (
                        <li key={i}>
                            <Link
                                to={item.to || "/"}
                                className={cn(
                                    buttonVariants({
                                        variant: "outline",
                                        size: "default",
                                        className: "flex flex-col border-none bg-transparent hover:bg-transparent justify-start items-center text-muted-foreground px-2"
                                    })
                                )}
                            >
                                {item.icon}
                            </Link>
                            <div className="text-muted-foreground text-xs font-medium text-center">{item.label}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar