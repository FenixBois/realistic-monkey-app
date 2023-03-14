import type {ZodError} from "zod";
import { Response} from "@remix-run/node";
import type {ZodSchema} from "zod";

export function zodValidationErrorResponse<Input>(error: ZodError<Input>){
    throw new Response("validation failed" + error.message, {
        status: 400,
        statusText: "validation failed"
    })
}

export async function parseJsonRequest<Output>(request: Request, schema: ZodSchema<Output>): Promise<Output>{
    if(request.headers.get("content-type") != "application/json"){
        throw new Response("Not a json request", {status: 400});
    }
    const body = await request.json()
    const parseResult = await schema.safeParseAsync(body);

    if (!parseResult.success) {
        throw zodValidationErrorResponse(parseResult.error)
    }
    return parseResult.data;
}