import { z } from 'zod';
import { useEffect } from 'react';

export const StationDataGranularity = {
    MINUTE: 'MINUTE',
    FIVE_MINUTES: 'FIVE_MINUTES',
    TEN_MINUTES: 'TEN_MINUTES',
    HALF_HOUR: 'HALF_HOUR',
    HOUR: 'HOUR',
    DAY: 'DAY',
} as const;

const MINUTES = 60;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const dataSchema = z.object({
    stationId: z.string().cuid(),
    granularity: z.nativeEnum(StationDataGranularity),
    from: z.date(),
    to: z.date(),
});

export const getDataSchema = dataSchema
    .refine(({ from, to }) => to > from, {
        message: 'To should be after from',
        path: ['from'],
    })
    .refine(
        ({ from, to, granularity }) =>
            (to.valueOf() - from.valueOf()) / 1000 <=
            maxDifferenceForGranularityInSeconds[granularity],
        ({ granularity }) => ({
            message: `Max difference allowed is ${
                maxDifferenceForGranularityInSeconds[granularity] / 60 / 60
            }h`,
            path: ['granularity'],
        })
    );

export const maxDifferenceForGranularityInSeconds = {
    [StationDataGranularity.DAY]: 60 * DAYS,
    [StationDataGranularity.HOUR]: 60 * HOURS,
    [StationDataGranularity.HALF_HOUR]: 30 * HOURS,
    [StationDataGranularity.TEN_MINUTES]: 10 * HOURS,
    [StationDataGranularity.FIVE_MINUTES]: 5 * HOURS,
    [StationDataGranularity.MINUTE]: 1 * HOURS,
};

export const numberOfMinutesForGranularity = {
    [StationDataGranularity.DAY]: 60 * 24,
    [StationDataGranularity.HOUR]: 60,
    [StationDataGranularity.HALF_HOUR]: 30,
    [StationDataGranularity.TEN_MINUTES]: 10,
    [StationDataGranularity.FIVE_MINUTES]: 5,
    [StationDataGranularity.MINUTE]: 1,
};
