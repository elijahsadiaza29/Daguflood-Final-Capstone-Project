import { ScrollArea } from "@/components/ui/scroll-area";
import FloodLevelTable from "./flood-level-table";
import TideLevelChart from "./tide-chart-hourly";
import TideChartDaily from "./tide-chart-daily";
import FloodGraph from "./flood-graph";
import Logo from '../../../../assets/logo.svg';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


const FloodLayout = () => {
    return (

        <div className="grid gap-4 sm:w-8/12 w-screen mx-auto h-screen sm:p-4 p-0 border">



            <ScrollArea className="w-full sm:h-full h-[100vh]">
                <div className="grid grid-cols-[auto_1fr] gap-2 sm:px-4 p-4 pb-0">
                    <div className="p-2 h-fit px-3 bg-[#202730] rounded-lg border border-white/10 cursor-pointer hidden sm:block"
                    >
                        <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
                            {/* Logo Section */}
                            <div id="logo" className="flex items-center justify-center">
                                <img src={Logo} alt="Logo" className="w-8 h-8" />
                            </div>

                            {/* Text Section */}
                            <div id="text" className="flex flex-col justify-center">
                                <div className="font-bold text-md text-white leading-none">
                                    DAGU
                                </div>
                                <div className="text-gray-400 font-bold text-sm text-center leading-none">
                                    FLOOD
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                        <Button
                            variant={"ghost"}
                            className="flex items-center gap-2 text-lg"
                            size={"sm"}
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <a href="/" >Back</a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-2 p-4">
                    <FloodLevelTable/>
                    <FloodGraph />
                    <TideLevelChart />
                    <TideChartDaily />
                </div>
            </ScrollArea >
        </div >
    )
}

export default FloodLayout;