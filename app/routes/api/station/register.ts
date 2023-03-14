import type {ActionFunction} from "@remix-run/router";
import {z} from "zod";
import {parseJsonRequest, zodValidationErrorResponse} from "~/validation.server";
import {prisma} from "~/db.server";
import {StationState} from "@prisma/client";
import {json} from "@remix-run/node";

const schema = z.object({
    "identifier": z.string().max(100)
})

export const action = (async ({request}) => {
    const {identifier} = await parseJsonRequest(request, schema);
    const result = await prisma.station.create({
        data: {
            gatewayInfo: identifier,
            name: identifier,
            state: StationState.REGISTERED
        }
    });

    return json(result.token)
}) satisfies ActionFunction;