import { useState, useEffect, useRef } from "react";
import { SquareArrowOutUpRight, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { database } from "../../../../../firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const chartConfig: ChartConfig = {
  WaterLevel: {
    label: "Meter :",
    color: "hsl(var(--chart-1))",
  },
};

export interface FloodData {
  width: string | number | undefined;
  station: string;
  waterLevel: number;
  highestWaterLevel: number;
  lastUpdate?: number;
}

const isDataStale = (timestamp: number | undefined): boolean => {
  if (!timestamp) return true;

  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;
  const stallThreshold = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  return timeDifference > stallThreshold;
};


const WaterLevel = () => {
  const [chartData, setChartData] = useState<FloodData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const markersRef = ref(database, "floodData");

    const unsubscribe = onValue(markersRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.error("No data available in Firebase");
        setChartData([]);
        setLoading(false);
        return;
      }

      const highestLevels: FloodData[] = [];

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const station = data.current?.station || "Unknown";
        const highestWaterLevel = data.highestWaterLevel || 0;
        const lastUpdate = data.current?.timestamp || Date.now();

        // Only add non-stale data or reset to 0 if stale
        highestLevels.push({
          width: undefined,
          station,
          waterLevel: isDataStale(lastUpdate) ? 0 : parseFloat(highestWaterLevel.toFixed(1)),
          highestWaterLevel: isDataStale(lastUpdate) ? 0 : parseFloat(highestWaterLevel.toFixed(1)),
          lastUpdate
        });
      });

      setChartData(highestLevels);
      setLoading(false);
    });

    return () => {
      off(markersRef, "value", unsubscribe);
    };
  }, []);

  const getLastUpdateTime = (): string => {
    const mostRecentUpdate = chartData.reduce((latest, current) => {
      if (!current.lastUpdate) return latest;
      return Math.max(latest, current.lastUpdate);
    }, 0);

    if (mostRecentUpdate === 0) {
      return "No update available";
    }

    return new Date(mostRecentUpdate).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const navigate = useNavigate();
  const handleclick = () => {
    navigate("/data");
  };

  return (
    <Card className="rounded-xl bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Flood Zone</CardTitle>
        <CardDescription>
          <div className="flex gap-2 text-white/50 font-medium leading-none mt-1">
            <span>Highest flood levels for each station.</span>
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {loading ? (
            <Skeleton className="w-full h-48" />
          ) : (
            <ChartContainer config={chartConfig}>
              <BarChart
                data={chartData}
                margin={{
                  top: 24,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="station"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value: string = "") => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="waterLevel" fill="hsl(var(--chart-1))" radius={8}>
                  <LabelList position="top" offset={12} fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none items-center">
        </div>
        <div className="grid grid-cols-2 w-full text-xs text-muted-foreground ">
          <div className="flex my-auto text-white/50">
            <span className="mr-2 font-medium ">Last Updated:</span> {getLastUpdateTime()}
          </div>
          <div className="flex text-xs gap-2cursor-pointer justify-end">
            <Button className="text-white bg-blue-400 items-center gap-2" size="sm" variant={"ghost"} onClick={handleclick}>
              View details
              <SquareArrowOutUpRight className="h-4 w-4 text-right" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default WaterLevel;