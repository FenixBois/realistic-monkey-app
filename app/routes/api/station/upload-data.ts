import type {ActionFunction} from "@remix-run/router";
import {prisma} from "~/db.server";
import {z} from "zod";
import {parseJsonRequest} from "~/validation.server";
import {json} from "@remix-run/node";
import type {Prisma} from "@prisma/client";
import { PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

const schema = z.object({
    token: z.string().cuid(),
    data: z.array(z.object({
        temperature: z.number(),
        humidity: z.number(),
        date: z.coerce.date()
    })).min(1).max(100)
})

export const action = (async ({request}) => {
    const {data: batchData, token} = await parseJsonRequest(request, schema);
    const station = await prisma.station.findUnique({where: {token}});
    if (!station) {
        throw new Response("Station not found", {status: 404});
    }
    if (station.state == "INACTIVE") {
        throw new Response("Station is inactive", {status: 400});
    }
    const data = batchData.map(batch => (
        {stationId: station.id, id: batch.date, humidity: batch.humidity, temperature: batch.temperature}
    ) satisfies Prisma.StationDataCreateManyInput)
    try {
        await prisma.stationData.createMany({data})
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
            // TODO figure out which id has conflict
            throw new Response("Data at that time already saved", {status: 400})
        }
        throw e
    }
    return json({
        result: "Data uploaded",
        state: station.state
    });
}) satisfies ActionFunction