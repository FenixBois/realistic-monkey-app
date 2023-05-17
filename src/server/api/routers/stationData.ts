import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {StationDataAggregationType} from ".prisma/client";

const MINUTES = 60;
const HOURS = 60*MINUTES;
const DAYS = 24 * HOURS;

const maxDifferenceForAggregationInSeconds = {
    [StationDataAggregationType.NONE]: 60 * MINUTES,
    [StationDataAggregationType.DAY]: 60 * DAYS,
    [StationDataAggregationType.HOUR]: 60 * HOURS
};

const getDataSchema = z.object({
    stationId: z.string().cuid(),
    aggregation: z.nativeEnum(StationDataAggregationType),
    from: z.date(),
    to: z.date()
})
    .refine(({from, to}) => to >= from, {message: "\"To\" should be after \"from\""})
    .refine(
        ({from, to, aggregation}) =>  to.getUTCSeconds() - from.getUTCSeconds() < maxDifferenceForAggregationInSeconds[aggregation],
        ({aggregation}) => ({message: `Max difference allowed is ${maxDifferenceForAggregationInSeconds[aggregation]}s`})
    );

export const stationDataRouter = createTRPCRouter({
    getDataForStationById: publicProcedure
        .input(getDataSchema)
        .query(async ({input: {stationId, aggregation, from: gte, to: lte}, ctx: {prisma}}) => {
            return prisma.stationData.findMany({where: {stationId, aggregation, datetime: {gte, lte}}});
        }),
    refreshHourAggregationCache: publicProcedure
        .mutation(async () => {
            // TODO refresh those with finalized: false
            // TODO create new ones
        }),
    refreshDayAggregationCache: publicProcedure
        .mutation(async () => {
            // TODO refresh those with finalized: false
            // TODO crete new ones
        })
});