import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale, _adapters } from 'chart.js';
import { TreeItem, TreeItems } from '../tree/Chakra-Tree';
import { useEffect, useState } from 'react';
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, TimeScale);

type ChartParams = {
    items: TreeItems[] | null;
}

function Chart({ items }: ChartParams) {
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDataset, setCurrentDataset] = useState<any[]>([]);

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            if (items != null) {
                const newItems = items as unknown as any[];
                const newNewItems: TreeItem[] = newItems.flatMap(n => n);
                const IDs = newNewItems.map(n => n.value);

                const filteredDatasets = allDatasets.filter(d => IDs.some(i => i === d.label));
                // Map datasets to include both x (time) and y (data) values
                const formattedDatasets = filteredDatasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data.map((value, index) => ({
                        x: Date.now() + index * 1000 * 60, // Simulating time in minutes
                        y: value,
                    })),
                    fill: true,
                    backgroundColor: dataset.backgroundColor,
                    borderColor: dataset.borderColor,
                }));

                setCurrentDataset(formattedDatasets);
            }

            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [items]);

    const data = {
        datasets: currentDataset
    };

    return (
        <Box flexGrow={1} width="100%" height="100%" position="relative">
            <Line
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            title: { display: true, text: 'Time' },
                            time: {
                                unit: 'minute',
                                tooltipFormat: 'MMM D, h::ss a',
                            },
                            adapters: {
                                date: { de }
                            }
                        },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        tooltip: {
                            enabled: true,
                            mode: 'nearest',
                            intersect: true
                        }
                    },
                    elements: {
                        point: {
                            hitRadius: 5
                        }
                    }
                }}
            />

            {loading && (
                <Box pos="absolute" inset="0" bg="gray.800" opacity="0.8" display="flex">
                    <Center h="full" w="full">
                        <VStack color="teal.500">
                            <Spinner color="teal.500" />
                            <Text color="teal.500">Parsing...</Text>
                        </VStack>
                    </Center>
                </Box>
            )}
        </Box>
    );
}

// MOCK DATA
const allDatasets = [
    {
        label: "fuel",
        data: [100, 95, 78, 60, 40, 38, 35, 32, 30, 27, 26, 25, 24, 23, 22, 18, 17],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#4BC0C0"
    },
    {
        label: "burn-rate",
        data: [90, 90, 90, 70, 75, 60, 40, 20, 20, 20, 20, 25, 20, 20, 20, 20, 20],
        fill: false,
        backgroundColor: "rgba(116,39,116,0.2)",
        borderColor: "#742774"
    },
    {
        label: "absolute-altitude",
        data: [0, 500, 1500, 3000, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 49000, 50000, 51000],
        fill: false,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "#FF6384"
    },
    {
        label: "relative-altitude",
        data: [0, 20, 45, 70, 90, 120, 150, 180, 200, 220, 230, 240, 245, 250, 255],
        fill: false,
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "#36A2EB"
    },
    {
        label: "altitude-level",
        data: [0, 500, 1500, 3000, 6000, 9000, 12000, 15000, 18000, 21000, 24000, 27000, 30000, 33000, 36000],
        fill: false,
        backgroundColor: "rgba(255,206,86,0.2)",
        borderColor: "#FFCE56"
    },
    {
        label: "lift-off",
        data: [0, 20, 50, 100, 150, 200, 250, 270, 290, 310, 320, 330, 340, 350, 360],
        fill: false,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "#9966FF"
    }
];

export default Chart;
