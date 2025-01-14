import { cn } from "@/lib/utils";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';


export const description = "An interactive line chart";

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
    }>;
    label?: string;
    className?: string;
    nameKey?: string;
    labelFormatter?: (value: string) => string;
};

const CustomTooltipContent: React.FC<TooltipProps> = ({
    active,
    payload,
    label,
    className
}) => {
    if (!active || !payload?.length) return null;

    const meterValue = payload[0].value;
    const tideStatus = meterValue > 0.0 ? "High Tide" : "Low Tide";
    const statusColor = meterValue > 0.0 ? "text-blue-500" : "text-blue-300";

    return (
        <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)}>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Time
                    </span>
                    <span className="font-bold text-base">
                        {new Date(label || "").toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Status
                    </span>
                    <span className={cn("font-bold text-base", statusColor)}>
                        {tideStatus}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Height
                    </span>
                    <span className="font-bold text-base">
                        {meterValue.toFixed(2)} m
                    </span>
                </div>
            </div>
        </div>
    );
};

const chartConfig = {
    meters: {
        label: "Meters :",
        color: "hsl(var(--chart-6))"
    },
} satisfies ChartConfig;

const TideLevelChart = () => {
    const API_KEY = import.meta.env.VITE_TIDE_API_KEY;
    const [seaLevelData, setSeaLevelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeChart] = React.useState<keyof typeof chartConfig>("meters");

    useEffect(() => {
        const fetchTideData = async () => {
            const today = new Date();
            const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

            setStartDate(start); // Set start date
            setEndDate(end); // Set end date

            try {
                const response = await axios.get(
                    `https://api.stormglass.io/v2/tide/extremes/point`,
                    {
                        params: {
                            lat: 35.6895,
                            lng: 139.6917,
                            start: start,
                            end: end,
                        },
                        headers: {
                            Authorization: API_KEY,
                        },
                    }
                );

                const formattedData = response.data.data.map((item: { time: any; height: any; }) => ({
                    date: item.time,
                    meters: Math.max(0, item.height),
                }));

                setSeaLevelData(formattedData);
                setLoading(false);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        setError(`API Error: ${error.response.status} - ${error.response.data.message}`);
                    } else if (error.request) {
                        setError('Network Error: No response received');
                    } else {
                        setError('Error setting up request');
                    }
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTideData();
    }, []);

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Card className="border-none bg-background shadow-none">
            <CardHeader className="flex space-y-0 border-b p-0 text-xs sm:text-md sm:flex-row">
                <div className="justify-center gap-1 px-6 py-5 sm:py-6 w-full">
                    <CardTitle>Dagupan Tide Levels</CardTitle>
                    <CardDescription className='mt-2'>
                        Showing today's tide levels every 5 hours.
                    </CardDescription>
                </div>
                <div className="flex flex-2 flex-col-1 w-full gap-1 px-6 py-5 sm:py-6 justify-center sm:justify-end text-muted-foreground">
                    {currentDate}
                    <p>

                        {new Date(startDate).toLocaleString("en-US", {
                            hour: 'numeric', minute: 'numeric', hour12: true
                        })}
                        -
                        {new Date(endDate).toLocaleString("en-US", {
                            hour: 'numeric', minute: 'numeric', hour12: true
                        })}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {error ? (
                    <Skeleton className="bg-accent w-full h-48" />
                ) : (
                    <div className="chart-container">

                        {loading ? (
                            <Skeleton className="w-full h-48" />
                        ) : (
                            <>
                                <ChartContainer
                                    config={chartConfig}
                                    className="aspect-auto h-[250px] w-full"
                                >
                                    <AreaChart
                                        data={seaLevelData}
                                        margin={{
                                            left: -20,
                                            right: 12,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient id="gradientmeters" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-6))', stopOpacity: 0.8 }} />
                                                <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-6))', stopOpacity: 0.1 }} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            minTickGap={32}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return date.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                });
                                            }}
                                        />
                                        <YAxis
                                            dataKey="meters"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickCount={3}
                                        />
                                        {/* <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    className="w-[150px]"
                                                    nameKey="meters"
                                                    labelFormatter={(value) => {
                                                        return new Date(value).toLocaleTimeString("en-US", {
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                        });
                                                    }}
                                                />
                                            }
                                        /> */}
                                        <ChartTooltip
                                            content={
                                                <CustomTooltipContent className="w-[180px]" />
                                            }
                                        />
                                        <Area
                                            dataKey={activeChart}
                                            type="natural"
                                            fill="url(#gradientmeters)"
                                            stroke={`var(--color-${activeChart})`}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ChartContainer>


                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default TideLevelChart;
