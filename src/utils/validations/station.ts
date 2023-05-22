import { z } from 'zod';

export const StationDataGranularity = {
    MINUTE: 'MINUTE',
    FIVE_MINUTES: 'FIVE_MINUTES',
    TEN_MINUTES: 'TEN_MINUTES',
    HALF_HOUR: 'HALF_HOUR',
    HOUR: 'HOUR',
    DAY: 'DAY',
} as const;

export const dataSchema = z.object({
    stationId: z.string().cuid(),
    granularity: z.nativeEnum(StationDataGranularity),
    from: z.date(),
    to: z.date(),
});
