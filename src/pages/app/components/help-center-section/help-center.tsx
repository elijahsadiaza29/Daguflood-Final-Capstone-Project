import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleUser, PhoneCall, SearchIcon, SquareArrowOutUpRight, TriangleAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconTool } from "@tabler/icons-react";
import { Link } from 'react-router-dom'; // Import Link
import Logo from "../../../../assets/logo.svg";
import imgCover1 from "../../../../assets/undraw_team_collaboration_re_ow29.svg";
import imgCover2 from "../../../../assets/undraw_public_discussion_re_w9up.svg";

export const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // List of help center content for filtering
    const accordionItems = [
        {
            value: "item-1",
            title: "System User Guideline",
            icon: <CircleUser className="h-5 w-5" />,
            contentText: "Real-Time Monitoring Access the Map to view current water levels. Hazard levels are color-coded...",
            content: (
                <AccordionContent className="p-4 text-sm text-gray-400">
                    <p className="font-semibold mb-2 text-white">How to Use:</p>
                    <p className="mb-2">
                        Access the <span className="font-medium text-white">Map</span> and click <span className="font-medium text-white">Markers</span>  to view current water levels.
                    </p>
                    <p className="mb-2 text-white">Hazard levels are color-coded:</p>
                    <ul className="mb-4 ml-4 list-disc list-inside">
                        <li><span className="text-red-500">Red:</span> Critical - Immediate action recommended</li>
                        <li><span className="text-orange-400">Orange:</span> Alert</li>
                        <li><span className="text-yellow-400">Yellow:</span> Warning</li>
                        <li><span className="text-blue-400">Blue:</span> Normal</li>
                    </ul>
                    <p className="font-semibold mb-2 text-white">Notifications</p>
                    <p className="mb-2">
                        Enable notifications under <span className="font-medium text-white">Settings</span> - <span className="font-medium text-white">🚨 Notifications</span>.
                        Enable notifications to get notified when there are alert levels.
                    </p>
                    <p className="font-semibold mb-2">Viewing Past Data</p>
                    <p>
                        Go to <span className="font-medium text-white">Flood Area Status</span> in the menu to review water levels over the past hours.
                    </p>
                </AccordionContent>
            ),
        },
        {
            value: "item-2",
            title: "Troubleshooting Guide",
            icon: <IconTool className="h-5 w-5" />,
            contentText: "Sensor Not Responding: Flood sensor must be ON and connected to the internet. Inaccurate Readings...",
            content: (
                <AccordionContent className="p-4 text-sm text-gray-400">
                    <p className="font-semibold text-white">Common Issues</p>
                    <p className="font-medium mb-1">Sensor Not Responding:</p>
                    <ul className="mb-4 ml-4 list-disc list-inside">
                        <li>Flood sensor must be <span className="font-bold text-white">ON</span> and connected to the internet.</li>
                        <li>Ensure the sensor is <span className="font-bold">working</span>.</li>
                    </ul>
                    <p className="font-medium mb-1">Inaccurate Readings:</p>
                    <ul className="mb-4 ml-4 list-disc list-inside">
                        <li>Ensure the sensor is free of obstructions.</li>
                        <li>Sensor surface must be <span className="font-bold">clear</span>.</li>
                    </ul>
                </AccordionContent>
            ),
        },
        {
            value: "item-3",
            title: "Emergency Contacts",
            icon: <PhoneCall className="h-5 w-5" />,
            contentText: "Local Flood Hotline: 123-456-7890. Emergency Services: 911. Local Shelter Information...",
            content: (
                <AccordionContent className="p-4">
                    <p className="font-semibold mb-2">Emergency Contacts</p>
                    <ul className="ml-4 list-none space-y-2 text-muted-foreground text-xs">
                        <li><span className="font-medium">Local Flood Hotline:</span> 123-456-7890</li>
                        <li><span className="font-medium">Emergency Services:</span> 911</li>
                        <li><span className="font-medium">Local Shelter Information:</span> <a href="#" className="text-blue-500 hover:underline">Find Nearby Shelters</a></li>
                    </ul>
                </AccordionContent>
            ),
        },
        {
            value: "item-4",
            title: "Safety Tips",
            icon: <TriangleAlert className="h-5 w-5" />,
            contentText: "During a Warning Alert: Monitor water levels closely through the app. During a Critical Alert...",
            content: (
                <AccordionContent className="p-4 text-sm text-gray-400">
                    <p className="font-semibold mb-2">Safety Tips</p>
                    <p className="font-medium mb-1">During a Warning Alert:</p>
                    <ul className="mb-4 ml-4 list-disc list-inside space-y-1">
                        <li>Monitor water levels closely through the app.</li>
                        <li>Prepare an emergency kit with essentials like water, food, and first aid supplies.</li>
                        <li>Charge your mobile phone and keep it accessible.</li>
                    </ul>
                    <p className="font-medium mb-1">During a Critical Alert:</p>
                    <ul className="mb-4 ml-4 list-disc list-inside space-y-1">
                        <li>Move to higher ground immediately.</li>
                        <li>Follow local authorities' instructions for evacuation.</li>
                        <li>Avoid walking or driving through floodwaters; even shallow water can be dangerous.</li>
                    </ul>
                </AccordionContent>
            ),
        },

    ];

    // Filter accordion items based on the search query
    const filteredItems = accordionItems.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.contentText.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollArea className="w-full h-screen">
            <div className="grid grid-rows-[auto_auto_1fr] p-4 gap-4">
                <div className="header flex justify-center md:justify-start gap-4">
                    <h1 className="text-xl my-auto text-center md:text-left">Daguflood Help Center</h1>
                </div>
                <Link to="/" className="flex justify-center md:justify-end gap-1 text-sm text-blue-400 hover:underline cursor-pointer text-center">
                    Go back
                    <SquareArrowOutUpRight className="h-5 w-5" />
                </Link>
                <div className="help-center-content mx-auto w-full lg:w-3/4 xl:w-1/2">
                    <div className="mb-2 flex justify-center place-items-end text-2xl font-bold" style={{ fontFamily: 'Inter' }}>
                        <img src={Logo} className="h-10" alt="" />
                        aguflood
                    </div>
                    <h1 className="text-3xl text-center" style={{ fontWeight: 'bold' }}>How can we help you?</h1>
                    <div className="grid grid-rows-[auto_1fr] gap-2">
                        <div className="flex border-2 w-full md:w-3/4 lg:w-2/3 border-blue-300 rounded-3xl px-2 py-1 mx-auto place-items-center bg-background h-fit my-4">
                            <SearchIcon />
                            <Input
                                className="h-10 pr-8 border-none shadow-none focus-visible:ring-0"
                                placeholder="Search topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="search-section relative flex justify-center place-items-end h-fit">
                            <img src={imgCover1} alt="" className="h-[150px] md:h-[200px]" />
                            <img src={imgCover2} alt="" className="h-[150px] md:h-[200px]" />
                        </div>
                        <h1 className="text-md mt-2 text-muted-foreground">Browse Help Topics</h1>
                        <div className="accordion-section">
                            <Card className="w-full px-4">
                                <Accordion type="single" collapsible>
                                    {filteredItems.map((item) => (
                                        <AccordionItem key={item.value} value={item.value}>
                                            <AccordionTrigger>
                                                <div className="grid grid-cols-[auto_1fr] gap-2 place-items-center">
                                                    <span className="text-sm text-muted-foreground">{item.icon}</span>
                                                    {item.title}
                                                </div>
                                            </AccordionTrigger>
                                            {item.content}
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};
