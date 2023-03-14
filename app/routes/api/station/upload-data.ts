import type {ActionFunction} from "@remix-run/router";
import {prisma} from "~/db.server";
import {z} from "zod";
import {parseJsonRequest} from "~/validation.server";
import {json} from "@remix-run/node";

const schema = z.object({
    token: z.string().cuid(),
    data: z.object({
        temperature: z.number(),
        humidity: z.number(),
        date: z.coerce.date()
    })
})

export const action = (async ({request}) => {
    const {data, token} = await parseJsonRequest(request, schema);
    const station = await prisma.station.findUnique({where: {token}});
    if (!station) {
        throw new Response("Station not found", {status: 404});
    }
    if (station.state == "INACTIVE") {
        throw new Response("Station is inactive", {status: 400});
    }
    await prisma.stationData.create({
        data: {
            stationId: station.id,
            id: data.date,
            humidity: data.humidity,
            temperature: data.humidity
        }
    })
    return json({
        result: "Data uploaded",
        state: station.state
    });
}) satisfies ActionFunction