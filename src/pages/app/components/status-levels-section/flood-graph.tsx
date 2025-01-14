import { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { database } from "../../../../firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig: ChartConfig = {
    WaterLevel: {
        label: "Meter :",
        color: "hsl(var(--chart-2))",
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

// Function to determine color based on water level
const getBarColor = (waterLevel: number) => {
    if (waterLevel > 1.6) return "hsl(0, 100%, 50%)";  // Red for high water levels
    if (waterLevel > 1.5) return "hsl(39, 100%, 50%)";  // Yellow for medium water levels
    return "hsl(var(--chart-1))";  // Green for low water levels
};

const FloodGraph = () => {
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

    return (
        <Card className="w-full border-none bg-background shadow-none">
            <CardHeader>
                <CardTitle>Highest Flood Levels </CardTitle>
                <CardDescription>
                    <div className="flex gap-2 font-medium leading-none mt-1">
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
                        <ChartContainer config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
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
                                {chartData.map((entry, index) => (
                                    <Bar
                                        key={index}
                                        dataKey="waterLevel"
                                        fill={getBarColor(entry.waterLevel)}  
                                        radius={8}
                                    >
                                        <LabelList position="top" offset={12} fontSize={12} />
                                    </Bar>
                                ))}
                            </BarChart>
                        </ChartContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default FloodGraph;
