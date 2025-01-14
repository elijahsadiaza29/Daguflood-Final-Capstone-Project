import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { database } from '../../../../firebaseConfig';
import { ref, onValue, off } from 'firebase/database';
import { Skeleton } from '@/components/ui/skeleton';
import { IconArrowsDownUp } from '@tabler/icons-react';

interface Flood {
    id: string;
    station: string;
    status: string;
    current: number;
    latestUpdate: number;
    history: FloodHistory[];
}

interface FloodHistory {
    timestamp: number;
    value: number;
}

type StatusType = 'all' | 'offline' | 'normal' | 'alert' | 'warning' | 'critical';

const FloodLevelTable: React.FC = () => {
    const [floods, setFloods] = useState<Flood[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isDescending, setIsDescending] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        const locations = ['Amado', 'Burgos', 'Tapuac', 'Arellano'];
        const listeners: Array<() => void> = [];

        const fetchFloodData = () => {
            locations.forEach((location) => {
                const currentRef = ref(database, `floodData/${location}/current`);
                const historyRef = ref(database, `floodData/${location}/history`);

                const currentListener = onValue(
                    currentRef,
                    (currentSnapshot) => {
                        setFloods((prevFloods) => {
                            const currentWaterLevel = currentSnapshot.val()?.waterLevel || 0;
                            const status = currentSnapshot.val()?.status || 'Normal';
                            const latestUpdate = currentSnapshot.val()?.timestamp || 0;

                            let updatedFloods = [...prevFloods];
                            const locationIndex = updatedFloods.findIndex((flood) => flood.id === location);

                            if (locationIndex === -1) {
                                updatedFloods.push({
                                    id: location,
                                    station: location,
                                    status: status,
                                    current: currentWaterLevel,
                                    latestUpdate: latestUpdate,
                                    history: Array(3).fill({ timestamp: 0, value: 0 }),
                                });
                            } else {
                                updatedFloods[locationIndex] = {
                                    ...updatedFloods[locationIndex],
                                    status: status,
                                    current: currentWaterLevel,
                                    latestUpdate: latestUpdate,
                                };
                            }

                            return updatedFloods;
                        });
                        setLoading(false);
                    },
                    (error) => {
                        console.error(`Error fetching current data for ${location}: `, error);
                        setError(`Error fetching current data for ${location}`);
                        setLoading(false);
                    }
                );

                listeners.push(() => off(currentRef, 'value', currentListener));

                const historyListener = onValue(
                    historyRef,
                    (historySnapshot) => {
                        setFloods((prevFloods) => {
                            let updatedFloods = [...prevFloods];
                            let history: FloodHistory[] = Array(3).fill({ timestamp: 0, value: 0 });

                            if (historySnapshot.exists()) {
                                const historyData = historySnapshot.val();
                                ['2min', '6min', '10min'].forEach((interval, index) => {
                                    if (historyData[interval] && historyData[interval].value !== undefined) {
                                        history[index] = {
                                            timestamp: historyData[interval].timestamp || 0,
                                            value: historyData[interval].value || 0,
                                        };
                                    }
                                });
                            }

                            const locationIndex = updatedFloods.findIndex((flood) => flood.id === location);
                            if (locationIndex === -1) {
                                updatedFloods.push({
                                    id: location,
                                    station: location,
                                    status: 'Normal',
                                    current: 0,
                                    latestUpdate: 0,
                                    history: history,
                                });
                            } else {
                                updatedFloods[locationIndex] = {
                                    ...updatedFloods[locationIndex],
                                    history: history,
                                };
                            }

                            return updatedFloods;
                        });
                        setLoading(false);
                    },
                    (error) => {
                        console.error(`Error fetching history data for ${location}: `, error);
                        setError(`Error fetching history data for ${location}`);
                        setLoading(false);
                    }
                );

                listeners.push(() => off(historyRef, 'value', historyListener));
            });
        };

        fetchFloodData();

        return () => {
            listeners.forEach((cleanup) => cleanup());
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, isDescending]);

    const isDataStale = (timestamp: number): boolean => {
        const currentTime = Date.now();
        const timeDifference = currentTime - timestamp;
        const stallThreshold = 120 * 60 * 1000;
        return timeDifference > stallThreshold;
    };

    const formatTimestamp = (timestamp: number): string => {
        if (timestamp === 0) return 'MM-DD-YYYY HH:MI';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getCurrentValue = (flood: Flood): string => {
        if (isDataStale(flood.latestUpdate)) {
            return '0.0';
        }
        return (Math.floor(flood.current * 10) / 10).toFixed(1);
    };

    const getStatus = (flood: Flood): string => {
        if (isDataStale(flood.latestUpdate)) {
            return 'Offline';
        }
        return flood.status;
    };

    const getHistoricalValue = (flood: Flood, index: number): string => {
        if (isDataStale(flood.latestUpdate)) {
            return '0.0';
        }

        // Check history
        if (!flood.history || flood.history.length <= index || !flood.history[index] || flood.history[index].value === undefined) {
            return '0.0';
        }
        return (Math.floor(flood.history[index].value * 10) / 10).toFixed(1);
    };

    const getStatusVariant = (status: string): "default" | "normal" | "alert" | "warning" | "critical" => {
        switch (status.toLowerCase()) {
            case 'normal':
                return 'normal';
            case 'alert':
                return 'alert';
            case 'warning':
                return 'warning';
            case 'critical':
                return 'critical';
            default:
                return 'default';
        }
    };

    const filterAndSortData = (data: Flood[]): Flood[] => {
        let filteredData = [...data];

        // Apply status filter
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(flood => {
                const currentStatus = isDataStale(flood.latestUpdate) ? 'Offline' : flood.status;
                return currentStatus.toLowerCase() === statusFilter.toLowerCase();
            });
        }

        // Sort by water level
        filteredData.sort((a, b) => {
            const valueA = isDataStale(a.latestUpdate) ? 0 : a.current;
            const valueB = isDataStale(b.latestUpdate) ? 0 : b.current;
            return isDescending ? valueB - valueA : valueA - valueB;
        });

        return filteredData;
    };

    // Get filtered and sorted data
    const filteredAndSortedData = filterAndSortData(floods);
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };


    return (
        <Card className="w-full border-none bg-background shadow-none">
            <CardHeader>
                <CardTitle>Flood Levels</CardTitle>
                <CardDescription>
                    Showing previous and latest flood levels for each station.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <div>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </div>
                        </div>
                    </Alert>
                ) : (
                    <div className="space-y-4">

                        {/* Filters Section */}
                        <div className="grid grid-cols-[auto_auto] gap-4 sm:grid sm:grid-cols-[250px_auto] sm:gap-4">
                            {/* Status Filter */}
                            <div className="flex-1">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value: StatusType) => setStatusFilter(value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="alert">Alert</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Water Level Sort */}
                            <div className="flex-none">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDescending(!isDescending)}
                                    className="w-full sm:w-auto flex items-center gap-2"
                                >
                                    {isDescending ? (
                                        <p>Low</p>
                                    ) : (
                                        <p>High</p>
                                    )}
                                    <IconArrowsDownUp className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="table-container w-[280px] sm:w-full h-full overflow-x-auto">
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Status</TableHead>
                                                <TableHead>Station</TableHead>
                                                <TableHead className="text-right">Latest</TableHead>
                                                <TableHead>Last Updated</TableHead>
                                                <TableHead className="text-right">-2 hrs ago</TableHead>
                                                <TableHead className="text-right">-4 hrs ago</TableHead>
                                                <TableHead className="text-right">-8 hrs ago</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentItems.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={7}
                                                        className="text-center h-24 text-muted-foreground"
                                                    >
                                                        No flood data found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentItems.map((flood, index) => (
                                                    <TableRow
                                                        key={flood.id}
                                                        className={index % 2 === 0 ? 'bg-slate-500/5' : ''}
                                                    >
                                                        <TableCell>
                                                            <Badge
                                                                variant={getStatusVariant(getStatus(flood))}
                                                                className="capitalize"
                                                            >
                                                                {getStatus(flood)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {flood.station}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {getCurrentValue(flood)} m
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatTimestamp(flood.latestUpdate)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {getHistoricalValue(flood, 0)} m
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {getHistoricalValue(flood, 1)} m
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {getHistoricalValue(flood, 2)} m
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </>

                            )}

                        </div>
                        {/* Pagination Section */}
                        <div className=" mt-4 flex flex-col w-full sm:flex-row items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                                Total items: {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAndSortedData.length)} of {filteredAndSortedData.length}
                            </span>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <Button
                                            key={number}
                                            variant={number === currentPage ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentPage(number)}
                                        >
                                            {number}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FloodLevelTable;