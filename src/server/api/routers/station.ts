import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {type Prisma, StationState} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

// TODO move validations elsewhere


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
        .mutation(async ({input: {token, data: batchData}, ctx: {prisma}}) => {
            const station = await prisma.station.findUnique({where: {token}});
            if (!station) {
                throw new TRPCError({message: "Station not found", code: "NOT_FOUND"});
            }
            if (station.state == "INACTIVE") {
                throw new TRPCError({message: "Station is inactive", code: "BAD_REQUEST"});
            }
            const data = batchData.map(batch => (
                {stationId: station.id, id: batch.date, humidity: batch.humidity, temperature: batch.temperature}
            ) satisfies Prisma.StationDataCreateManyInput)
            try {
                await prisma.stationData.createMany({data})
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
                    // TODO figure out which id has conflict
                    throw new TRPCError( {message: "Data at that time already saved",code: "BAD_REQUEST"})
                }
                throw e
            }
            return {
                result: "Data uploaded",
                state: station.state
            };
        })
});