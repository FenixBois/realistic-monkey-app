import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


export const locationRouter = createTRPCRouter({
    getAll: publicProcedure
        .query(async ({ctx: {prisma}}) => {
            return prisma.location.findMany()
        }),
    getById: publicProcedure
        .input(z.object({
            id: z.string().cuid()
        })).query(async ({input: {id}, ctx: {prisma}}) => {
            return prisma.location.findUnique({where: {id}, include: {stations: true}});
        })
})