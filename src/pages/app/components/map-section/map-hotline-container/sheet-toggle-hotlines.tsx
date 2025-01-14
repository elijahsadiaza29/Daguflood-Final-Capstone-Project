import { ScrollArea } from "@/components/ui/scroll-area";

import CDRMMClogo from '../../../../../assets/dagupancity_seal.png';
import CHOlogo from '../../../../../assets/CHO.png';
import DECORPlogo from '../../../../../assets/DECORP.png';
import PNPlogo from '../../../../../assets/PNP.png';
import RedCrosslogo from '../../../../../assets/Red_Cross.svg.png';


const Hotlines = [
    {
        label: "CDRRMO",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: CDRMMClogo,
        description: " City Disaster Risk Response Management Office",
        phoneNumber: "09123456789",
    },
    {
        label: "CHO",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: CHOlogo,
        description: " City Health Office (CHO) - Dagupan",
        phoneNumber: "09123456789",
    },
    {
        label: "DECORP",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: DECORPlogo,
        description: "Dagupan Electric Corporation",
        phoneNumber: "09123456789",
    },
    {
        label: "PNP",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: PNPlogo,
        description: " Dagupan City Police Station",
        phoneNumber: "09123456789",
    },
    {
        label: "RED CROSS",
        link: "https://www.facebook.com/profile.php?id=61555928097649",
        img: RedCrosslogo,
        description: "Dagupan City Red Cross",
        phoneNumber: "09123456789",
    },
];


export default function SheetToggleHotlines() {
    return (
        <div className="grid grid-rows-[auto_1fr] gap-2">
            <div className="rounded-full w-full bg-red-600">
                <h1 className="text-center font-bold text-md text-white">
                    Emergency Hotlines & Social Media Accounts
                </h1>
            </div>

            <ScrollArea className="h-[88vh] mt-2"> 
                <ul className="grid gap-2">
                    {Hotlines.map((hotline, i) => (
                        <li key={i} className="grid grid-cols-[120px_1fr] bg-primary-foreground py-2 pr-2 rounded-3xl">
                            <div className="grid mx-auto my-auto gap-2">
                                <img src={hotline.img} alt="Logo" className="w-16 mx-auto" />
                                <span className="text-sm font-bold text-center">{hotline.label}</span>
                            </div>
                            <div className="grid py-2 text-left">
                                <div>
                                    <span className="text-red-600 font-semibold text-sm">Contact No.</span>
                                    <p className="font-bold text-foreground">{hotline.phoneNumber}</p>
                                </div>
                                
                                <div>
                                    <span className="text-red-600 font-semibold text-sm">Facebook :</span>
                                    <p className="font-bold text-xs">
                                        {hotline.link ? (
                                            <a
                                                href={hotline.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-600 hover:underline"
                                            >
                                                {hotline.description}
                                            </a>
                                        ) : (
                                            <span>{hotline.description}</span>
                                        )}
                                    </p>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
}
