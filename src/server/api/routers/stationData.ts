import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';
import { dataSchema, StationDataGranularity } from '~/utils/validations';

const MINUTES = 60;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

// noinspection PointlessArithmeticExpressionJS
const maxDifferenceForGranularityInSeconds = {
    [StationDataGranularity.DAY]: 60 * DAYS,
    [StationDataGranularity.HOUR]: 60 * HOURS,
    [StationDataGranularity.HALF_HOUR]: 30 * HOURS,
    [StationDataGranularity.TEN_MINUTES]: 10 * HOURS,
    [StationDataGranularity.FIVE_MINUTES]: 5 * HOURS,
    [StationDataGranularity.MINUTE]: 1 * HOURS,
};

const numberOfMinutesForGranularity = {
    [StationDataGranularity.DAY]: 60 * 24,
    [StationDataGranularity.HOUR]: 60,
    [StationDataGranularity.HALF_HOUR]: 30,
    [StationDataGranularity.TEN_MINUTES]: 10,
    [StationDataGranularity.FIVE_MINUTES]: 5,
    [StationDataGranularity.MINUTE]: 1,
};

export const getDataSchema = dataSchema
    .refine(({ from, to }) => to > from, {
        message: '"To" should be after "from"',
    })
    .refine(
        ({ from, to, granularity }) =>
            to.getUTCSeconds() - from.getUTCSeconds() <
            maxDifferenceForGranularityInSeconds[granularity],
        ({ granularity }) => ({
            message: `Max difference allowed is ${maxDifferenceForGranularityInSeconds[granularity]}s`,
        })
    );

export const stationDataRouter = createTRPCRouter({
    getDataForStationById: publicProcedure
        .input(getDataSchema)
        .query(
            async ({
                input: { stationId, granularity, from: gte, to: lte },
                ctx: { prisma },
            }) => {
                const numberOfMinutes =
                    numberOfMinutesForGranularity[granularity];
                return await prisma.$queryRaw`SELECT AVG(temperature) temperature, AVG(humdidity) humidity
                                          FROM StationData
                                          WHERE stationId = ${stationId}
                                          GROUP BY ROUND(extract(epoch from datetime) / (60 * ${numberOfMinutes}))`;
            }
        ),
});
