import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {z} from "zod";


export const locationRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            name: z.string()
        }))
        .mutation(async ({input: data, ctx: {prisma}}) => {
            return prisma.location.create({data});
        }),
    getAll: publicProcedure
        .query(async ({ctx: {prisma}}) => {
            return prisma.location.findMany()
        }),
    getById: publicProcedure
        .input(z.object({
            id: z.string().cuid()
        }))
        .query(async ({input: {id}, ctx: {prisma}}) => {
            return prisma.location.findUnique({where: {id}, include: {stations: true}});
        }),
    edit: protectedProcedure
        .input(z.object({
            id: z.string().cuid(),
            name: z.string()
        }))
        .mutation(async ({input: {id, ...data}, ctx: {prisma}}) => {
            return prisma.location.update({where: {id}, data});
        }),
    delete: protectedProcedure
        .input(z.object({
            id: z.string().cuid()
        }))
        .mutation(async ({input: where, ctx: {prisma}}) => {
            return prisma.location.delete({where});
        })
})