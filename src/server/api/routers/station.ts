import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {type Prisma, StationState} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

// TODO move validations elsewhere

const findExtremes = (data: z.infer<typeof uploadDataSchema>["data"]) => {
    let min = data[0]!.date;
    let max = min;

    for (let {date} of data) {
        if (min > date) {
            min = date
        }
        if (max < date) {
            max = date
        }
    }

    return {min, max};
}

const registerSchema = z.object({
    "identifier": z.string().max(100)
})

const uploadDataSchema = z.object({
    token: z.string().cuid(),
    data: z.array(z.object({
        temperature: z.number(),
        humidity: z.number(),
        date: z.coerce.date()
    })).min(1).max(100)
})


export const stationRouter = createTRPCRouter({

    register: publicProcedure
        .input(registerSchema)
        .mutation(async ({input: {identifier}, ctx: {prisma}}) => {
            const result = await prisma.station.create({
                data: {
                    gatewayInfo: identifier,
                    name: identifier,
                    state: StationState.REGISTERED
                }
            });
            return result.token;
        }),

    uploadData: protectedProcedure
        .input(uploadDataSchema)
        .mutation(async ({input: {token, data: batchData}, ctx: {prisma: prismaCtx}}) => {
            return prismaCtx.$transaction(async (prisma) => {
                const station = await prisma.station.findUnique({where: {token}});
                if (!station) {
                    throw new TRPCError({message: "Station not found", code: "NOT_FOUND"});
                }
                if (station.state == "INACTIVE") {
                    throw new TRPCError({message: "Station is inactive", code: "BAD_REQUEST"});
                }
                const {min, max} = findExtremes(batchData);
                const data = batchData.map(batch => (
                    {
                        stationId: station.id,
                        datetime: batch.date,
                        humidity: batch.humidity,
                        temperature: batch.temperature,
                        aggregation: "NONE"
                    }
                ) satisfies Prisma.StationDataCreateManyInput)
                try {
                    await prisma.stationData.createMany({data})
                } catch (e) {
                    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
                        // TODO figure out which id has conflict
                        throw new TRPCError({message: "Data at that time already saved", code: "BAD_REQUEST"})
                    }
                    throw e
                }
                await prisma.stationData.updateMany({
                    where: {
                        OR: [
                            // TODO extend range
                            {datetime: {lte: max, gte: min}, aggregation: "DAY"},
                            {datetime: {lte: max, gte: min}, aggregation: "HOUR"}
                        ]
                    }, data: {aggregationFinalized: false}
                });
                return {
                    result: "Data uploaded",
                    state: station.state
                };
            })
        }),
    registered: protectedProcedure
        .query(async ({ctx: {prisma}}) => {
            return prisma.station.findMany({where: {state: "REGISTERED"}});
        }),
    // TODO registered should be for admin only
    getById: publicProcedure
        .input(z.object({
            id: z.string().cuid()
        }))
        .query(async ({input: {id}, ctx: {prisma}}) => {
            return prisma.station.findUnique({where: {id}});
        })
});