import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import './hotline.css';

import CDRMMClogo from '../../../../../assets/dagupancity_seal.png';
import CHOlogo from '../../../../../assets/CHO.png';
import DECORPlogo from '../../../../../assets/DECORP.png';
import PNPlogo from '../../../../../assets/PNP.png';
import RedCrosslogo from '../../../../../assets/Red_Cross.svg.png';
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

import { CircleAlert, PhoneCall } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";


import { SmsSubscription } from "../../sms-subscription/smsSubscription";

interface Hotline {
    label: string;
    icon: string;
    phoneNumber: string;
}

interface Todo {
    label: string;
    icon: JSX.Element;
}

const thingstodoLinks: Todo[] = [
    {
        label: "Things to do",
        icon: <CircleAlert className="w-6 h-6 stroke-muted-foreground" />
    }
];

const hotlinesLinks: Hotline[] = [
    {
        label: "540-0363",
        icon: CDRMMClogo,
        phoneNumber: "09123456789",
    },
    {
        label: "632-3296",
        icon: RedCrosslogo,
        phoneNumber: "09123456789",
    },
    {
        label: "522-8206",
        icon: CHOlogo,
        phoneNumber: "09123456789",
    },
    {
        label: "518-2870",
        icon: DECORPlogo,
        phoneNumber: "09123456789",
    },
    {
        label: "529-5604",
        icon: PNPlogo,
        phoneNumber: "09123456789",
    },
];

const Hotlines = () => {
    return (
        <div className="hotline absolute top-16 py-4 sm:top-2 mx-4 sm:mx-[-2rem] sm:translate-x-1/4 w-[380px] sm:w-full overflow-x-auto" style={{ fontFamily: "Inter" }}>
            <ul className="flex gap-4 whitespace-nowrap">
                <li>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                className={cn(buttonVariants({
                                    variant: "ghost",
                                    size: "default",
                                    className: "h-9 rounded-full shadow-md border-none bg-background px-0 ease-in-ou"
                                }))}>
                                <span className="flex gap-2 mx-6 sm:mx-4 font-bold text-xs items-center flex-shrink-0">
                                    SMS
                                </span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] max-w-[350px] sm:rounded-2xl rounded-3xl p-4">
                            <DialogHeader>
                                <DialogDescription>
                                    <SmsSubscription />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </li>
                {thingstodoLinks.map((item, i) => (
                    <li key={i} className="flex items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    className={cn(buttonVariants({
                                        variant: "ghost",
                                        size: "default",
                                        className: "h-9 rounded-full shadow-md border-none bg-background px-0 ease-in-ou"
                                    }))}>
                                    <span className="flex gap-2 mx-6 sm:mx-4 font-bold text-xs items-center flex-shrink-0">
                                        {item.icon}
                                        {item.label}
                                    </span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="w-[380px] sm:w-[580px] max-w-screen-sm sm:max-w-screen-md rounded-3xl sm:rounded-3xl p-4">
                                <DialogHeader>
                                    <DialogTitle>What To Do During Flood?</DialogTitle>
                                    <DialogDescription>
                                        Here are some things you can do in case of an emergency:
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="w-full h-[85vh] p-4">
                                    <div className="grid gap-4">
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
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </li>
                ))}
                {/* call hotlines */}
                {hotlinesLinks.map((item, i) => (
                    <li key={i} className="flex items-center">
                        <Link
                            to={`tel:${item.phoneNumber}`}
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                    size: "default",
                                    className: "h-9 rounded-full shadow-md border-none bg-background px-0",
                                })
                            )}
                        >
                            <span className="flex gap-2 mx-6 sm:mx-4 font-bold text-xs  items-center flex-shrink-0">
                                <PhoneCall className="w-5 h-5 stroke-muted-foreground" />|
                                <img
                                    src={item.icon}
                                    alt={`${item.label} icon`}
                                    className="w-5 h-5"
                                />
                                {item.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default Hotlines