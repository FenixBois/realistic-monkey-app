import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
    getDataSchema,
    numberOfMinutesForGranularity,
} from '~/utils/validations';

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
                const data =
                    (await prisma.$queryRaw`SELECT AVG(temperature)                                                t,
                                                 AVG(humidity)                                                   h,
                                                 ROUND(extract(epoch from "datetime") / (60 * ${numberOfMinutes})) d
                                          FROM "StationData"
                                          WHERE "stationId" = ${stationId} AND datetime >= ${gte} AND datetime <= ${lte}
                                          GROUP BY d
                                          ORDER BY d`) as {
                        t: number;
                        h: number;
                        d: number;
                    }[];
                return data.map(
                    ({ t: temperature, h: humidity, d: datetime }) => ({
                        temperature,
                        humidity,
                        datetime: datetime * 60 * numberOfMinutes * 1000,
                    })
                );
            }
        ),
});
