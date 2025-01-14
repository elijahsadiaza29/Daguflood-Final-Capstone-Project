import { useState, useEffect } from 'react';
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { database } from '../../../../../firebaseConfig';
import { ref, onValue, off } from 'firebase/database';

interface MarkerData {
    station?: string;
    waterLevel?: number;
    status?: string;
    latestUpdate?: string;
    lat?: number;
    lng?: number;
}

interface InfowindowChartProps {
    markerData: MarkerData;
}

export function InfowindowChart({ markerData: initialMarkerData }: InfowindowChartProps) {
    const [markerData, setMarkerData] = useState<MarkerData>(initialMarkerData);
    const MAX_WATER_LEVEL = 2.0;

    const isDataStale = (timestamp: string | undefined): boolean => {
        if (!timestamp) return true;
        
        const currentTime = Date.now();
        const updateTime = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        const timeDifference = currentTime - updateTime;
        const stallThreshold = 120 * 60 * 1000;
        return timeDifference > stallThreshold;
    };

    useEffect(() => {
        if (!initialMarkerData.station) return;

        const currentRef = ref(database, `floodData/${initialMarkerData.station}/current`);
        
        const currentListener = onValue(currentRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setMarkerData(prevData => ({
                    ...prevData,
                    waterLevel: data.waterLevel || 0,
                    status: data.status || 'Normal',
                    latestUpdate: data.timestamp?.toString() || 'Unknown',
                    lat: data.lat,
                    lng: data.lng
                }));
            }
        });

        return () => {
            off(currentRef, 'value', currentListener);
        };
    }, [initialMarkerData.station]);

    const getStatus = (status: string | undefined, latestUpdate: string | undefined): string => {
        if (isDataStale(latestUpdate)) {
            return 'Offline';
        }
        return status || 'Normal';
    };

    const getStatusColor = (status: string = "normal") => {
        if (isDataStale(markerData.latestUpdate)) {
            return "#808080"; 
        }

        switch (status.toLowerCase()) {
            case "critical":
                return "#ff0000";
            case "alert":
                return "#ff6600";
            case "warning":
                return "#ffcc00";
            default:
                return "#5391f5";
        }
    };

    const formatDateTime = (dateInput: string | number = "Unknown") => {
        if (dateInput === "Unknown") return "No data available";
        
        const timestamp = typeof dateInput === "string" ? parseInt(dateInput, 10) : dateInput;
        const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
        
        if (isNaN(date.getTime())) return "Invalid Date";
        
        return `${date.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        })} ${date.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`;
    };

    const waterLevel = markerData.waterLevel || 0;
    const displayPercentage = Math.min((waterLevel / MAX_WATER_LEVEL) * 100, 100);
    
    const chartData = [
        {
            name: "Background",
            value: 100,
        },
        { 
            name: "Water Level",
            value: displayPercentage,
            fill: getStatusColor(markerData.status)
        },
    ];

    return (
        <Card className="flex flex-col rounded-3xl shadow-none">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-lg"></CardTitle>
                <CardDescription className="place-items-center gap-1">
                    <div className="grid grid-cols-1 gap-1 place-items-center text-muted-foreground text-xs">
                        Last Update:
                    </div>
                    <div className="flex gap-2 text-muted-foreground">
                        {markerData.latestUpdate ? formatDateTime(markerData.latestUpdate) : "No data available"}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                            innerRadius={80}
                            outerRadius={110}
                            barSize={10}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                            />
                            <RadialBar
                                dataKey="value"
                                cornerRadius={10}
                            />
                            <PolarRadiusAxis
                                tick={false}
                                tickLine={false}
                                axisLine={false}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 24}
                                                        className="fill-foreground text-xs font-bold"
                                                    >
                                                        {markerData.station || "Unknown"}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {getStatus(markerData.status, markerData.latestUpdate)}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-foreground"
                                                    >
                                                        {markerData.waterLevel?.toFixed(1) || 0} meters
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div>
                    <div className="text-gray-400">See more details on the status.</div>
                    <div>
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${markerData.lat},${markerData.lng}`} 
                            target="_blank" 
                            className="border-none text-blue-500"
                            rel="noopener noreferrer"
                        >
                            View directions on Google Maps
                        </a>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default InfowindowChart;