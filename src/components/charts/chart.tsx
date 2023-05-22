import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '@mantine/core';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface IChartProps {
    data: ChartData<'line', number[], string>;
}

export const Chart = ({ data }: IChartProps) => {
    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
    } as const;

    return (
        <Card withBorder shadow={'sm'}>
            <Line width={'100%'} height={100} data={data} options={options} />
        </Card>
    );
};
