import FloodLevelTable from "./flood-level-table";
import TideLevelChart from "./tide-chart-hourly";
import { ScrollArea } from "@/components/ui/scroll-area";

const LevelsContent = () => {
    return (
        <div className="h-[80vh]"> 
            <ScrollArea className="w-full sm:h-full h-[90vh]"> 
                <div className="grid gap-2">
                    <FloodLevelTable />
                    <TideLevelChart />
                </div>
            </ScrollArea>
        </div>
    );
};

export default LevelsContent;
