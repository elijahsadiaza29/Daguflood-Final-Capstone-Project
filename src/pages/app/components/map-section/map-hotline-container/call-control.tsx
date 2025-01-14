import { Button, buttonVariants } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardTitle } from "@/components/ui/card";
import CDRMMClogo from '../../../../../assets/dagupancity_seal.png';
import CHOlogo from '../../../../../assets/CHO.png';
import DECORPlogo from '../../../../../assets/DECORP.png';
import PNPlogo from '../../../../../assets/PNP.png';
import RedCrosslogo from '../../../../../assets/Red_Cross.svg.png';


import CallIcon from '@mui/icons-material/Call';
import CycloneIcon from '@mui/icons-material/Cyclone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { SmsSubscription } from "../../sms-subscription/smsSubscription";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

import blanket from '../../../../../assets/blanket.svg';
import cash from '../../../../../assets/cash.svg';
import charger from '../../../../../assets/charger.svg';
import family from '../../../../../assets/family.svg';
import food from '../../../../../assets/food.svg';
import water from '../../../../../assets/water.svg';
import firstaid from '../../../../../assets/first-aid-kit.svg';
import flashlight from '../../../../../assets/flashlight.svg';
import floodboots from '../../../../../assets/flood-boots.svg';
import floodevacuate from '../../../../../assets/flood-evacuate.svg';
import personal from '../../../../../assets/personal.svg';
import medication from '../../../../../assets/medication.svg';
import sanitation from '../../../../../assets/sanitation.svg';
import dontwalk from '../../../../../assets/flood-dont-walk.svg';
import floodswitch from '../../../../../assets/flood-switch.svg';

interface CallControlProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCloseAll: () => void;
}

const Hotlines = [
    {
        label: "CDRRMO",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: CDRMMClogo,
        description: " City Disaster Risk Response Management Office",
        phoneNumber: "09123456789",
        icon: <CycloneIcon />
    },
    {
        label: "CHO",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: CHOlogo,
        description: " City Health Office Dagupan",
        phoneNumber: "09123456789",
        icon: <FavoriteIcon className="text-green-500" />
    },
    {
        label: "DECORP",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: DECORPlogo,
        description: "Dagupan Electric Corporation",
        phoneNumber: "09123456789",
        icon: <ElectricBoltIcon className="text-yellow-400" />
    },
    {
        label: "PNP",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: PNPlogo,
        description: " Dagupan City Police Station",
        phoneNumber: "09123456789",
        icon: <LocalPoliceIcon className="text-blue-500" />
    },
    {
        label: "RED CROSS",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: RedCrosslogo,
        description: "Dagupan City Red Cross",
        phoneNumber: "09123456789",
        icon: <LocalHospitalIcon className="text-red-600" />
    },
];


const CallControl = ({ isOpen: isOpen, onOpenChange, onCloseAll }: CallControlProps) => {
    return (

        <div className="absolute z-50 top-[29rem] right-2 hidden sm:block">
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
                                    size={"icon"}
                                >
                                    {isOpen ? (
                                        <IconX className="text-white w-6 h-6 sm:w-6 sm:h-6" />
                                    ) : (

                                        <CallIcon className="text-white w-6 h-6 sm:w-5 sm:h-5" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <PopoverContent
                            className="text-white relative gap-4 sm:left-auto left-[-0.22222rem] sm:w-[28rem] w-screen sm:h-auto h-[100vh] sm:rounded-xl rounded-none flex flex-col"
                            side="left"
                            alignOffset={8}
                            align="center"
                        >
                            <div className="grid">
                                <div id="label" className="flex gap-2 items-center">
                                    <Label className="text-white text-lg">
                                        Emergency Hotlines
                                    </Label>
                                    <div className="ml-auto block sm:hidden">
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            className="hover:bg-transparent text-right"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            <IconX className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                                <ScrollArea className="h-[88vh] sm:h-[60vh] mt-2 gap-4">
                                    <SmsSubscription />

                                    <ul className="grid gap-2">
                                        {Hotlines.map((hotline, i) => (
                                            <Card key={i} className="text-white ">
                                                <li>
                                                    <div className="grid grid-cols-[1fr_auto] gap-2 px-4 py-2">

                                                        <div className="flex w-full items-center gap-4">
                                                            {hotline.icon}
                                                            <div className="flex flex-col">
                                                                <p className="font-bold text-foreground">
                                                                    {hotline.label}
                                                                </p>
                                                                <p>{hotline.description}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Link to={`tel:${hotline.phoneNumber}`}
                                                                className={cn(
                                                                    buttonVariants({
                                                                        variant: "ghost",
                                                                        size: "default",
                                                                        className: "bg-red-500"

                                                                    })
                                                                )}
                                                            >
                                                                Call Now
                                                            </Link>
                                                        </div>

                                                    </div>
                                                </li>



                                            </Card>

                                        ))}
                                    </ul>
                                    <Card className="mt-4 text-white ">
                                        <CardTitle className="p-4 text-xl">Thing Todo During Flood</CardTitle>
                                        <div className="grid gap-4 p-4">
                                            <div className="flex items-start gap-4">
                                                <img src={floodevacuate} alt="Emergency Evacuation" className="w-12 h-12" />
                                                <p>Be prepared to evacuate immediately when there’s an alert for heavy rainfall.</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={floodboots} alt="Avoid Walking Through Floodwater" className="w-12 h-12" />
                                                <p>Refrain from walking through floodwater, especially without protective gear like boots.</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={dontwalk} alt="Do Not Drive Through Water" className="w-12 h-12" />
                                                <p>Don’t walk or drive through moving water. It can sweep you and your car away.</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={floodswitch} alt="Turn Off Electricity" className="w-12 h-12" />
                                                <p>Turn off all electrical appliances and LPG tanks; turn off the main power switch as needed.</p>
                                            </div>

                                            <h3 className="font-bold mt-6">Survival Kit</h3>
                                            <div className="flex items-start gap-4">
                                                <img src={water} alt="Water Supply" className="w-12 h-12" />
                                                <p>Water: One gallon per person</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={food} alt="Non-Perishable Food" className="w-12 h-12" />
                                                <p>Food: Non-perishable, easy-to-prepare items</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={flashlight} alt="Flashlight" className="w-12 h-12" />
                                                <p>Flashlight</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={firstaid} alt="First-Aid Kit" className="w-12 h-12" />
                                                <p>First-Aid Kit</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={medication} alt="Medications" className="w-12 h-12" />
                                                <p>Medications and medical items</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={sanitation} alt="Sanitation" className="w-12 h-12" />
                                                <p>Sanitation and personal hygiene items</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={personal} alt="Important Documents" className="w-12 h-12" />
                                                <p>Copies of personal documents (IDs, proof of address, passports, insurance policies, birth certificates)</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={charger} alt="Cellphone" className="w-12 h-12" />
                                                <p>Cellphone with chargers</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={family} alt="Emergency Contacts" className="w-12 h-12" />
                                                <p>Family and emergency contact information</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={cash} alt="Extra Cash" className="w-12 h-12" />
                                                <p>Extra cash</p>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <img src={blanket} alt="Emergency Blanket" className="w-12 h-12" />
                                                <p>Emergency blanket(s)</p>
                                            </div>
                                        </div>
                                    </Card>
                                </ScrollArea>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <TooltipContent side="left">
                        <p>Call Emergency</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    )
}

export default CallControl