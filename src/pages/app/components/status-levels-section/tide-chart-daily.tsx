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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';

export const description = "Predicted Tide Level Chart for Future Days";

const chartConfig = {
  meters: {
    label: "Meters :",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

const TideChartDaily = () => {
  const API_KEY = import.meta.env.VITE_TIDE_API_KEY;
  const [seaLevelData, setSeaLevelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart] = React.useState<keyof typeof chartConfig>("meters");

  useEffect(() => {
    const fetchFutureTideData = async () => {
      // Set the date range for the next 7 days
      const today = new Date();
      const start = today.toISOString(); // Start date is today
      const end = new Date(today.setDate(today.getDate() + 7)).toISOString(); // 7 days into the future

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

        // Process the data to format it for the chart
        const formattedData = response.data.data.map((item: { time: string; height: number }) => ({
          date: item.time.split('T')[0], // Extract the date in YYYY-MM-DD format
          meters: Math.max(0, item.height),
        }));

        // Aggregate the data by date to avoid duplicates
        const aggregatedData = formattedData.reduce((acc: any[], currentValue: { date: any; meters: number; }) => {
          const existing = acc.find((item) => item.date === currentValue.date);
          if (existing) {
            existing.meters = Math.max(existing.meters, currentValue.meters); // Get the max height for the day
          } else {
            acc.push(currentValue);
          }
          return acc;
        }, []);

        setSeaLevelData(aggregatedData);
        setLoading(false);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setError(`API Error: Payment Required`);
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

    fetchFutureTideData();
  }, []);

  return (
    <Card className='border-none bg-background shadow-none'>
      <CardHeader>
        <CardTitle>Tide Level Forecast</CardTitle>
        <CardDescription>
         Dagupan City tide forecast for the next 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {error ? (
          <Skeleton className="bg-accent w-full h-44" />
        ) : (
          <div className="chart-container">
            {loading ? (
              <Skeleton className="w-full h-48" />
            ) : (
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
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-2))', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-2))', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
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
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="meters"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TideChartDaily;
