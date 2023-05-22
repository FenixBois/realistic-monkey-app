import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from '@mantine/core';

import { formatDate } from './utils';

import { chartData } from '~/components/charts/utils/mock';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const Chart = () => {
    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
    } as const;

    const data = {
        labels: chartData.map((item) => formatDate(new Date(item.datetime))),
        datasets: [
            {
                label: 'Humidity',
                data: chartData.map((item) => item.humidity),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'y',
            },
        ],
    };

    return (
        <Card>
            <Line width={'100%'} height={100} data={data} options={options} />
        </Card>
    );
};
