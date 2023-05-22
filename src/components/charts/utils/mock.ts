import { randomInRange } from './randomInRange';

export const chartData = Array.from({ length: 7 })
    .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);

        return {
            datetime: date.valueOf(),
            humidity: randomInRange(1000, 2000),
            temperature: randomInRange(10000, 200000),
        };
    })
    .reverse();
