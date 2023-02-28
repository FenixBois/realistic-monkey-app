import type {ActionFunction, LoaderFunction} from "@remix-run/router";
import {Response} from "@remix-run/node";
import {prisma} from "~/db.server";
import {useLoaderData} from "@remix-run/react";
import type {FC} from "react";
import {z} from "zod";
import {zfd} from "zod-form-data";

const doActivateSchema = zfd.formData({
    "do": zfd.text(z.literal("activate")),
});


const doRenameSchema = zfd.formData({
    "do": zfd.text(z.literal("rename")),
    "title": zfd.text(z.string())
});

const doDeleteSchema = zfd.formData({
    "do": zfd.text(z.literal("delete"))
})

const actionSchema = doActivateSchema
    .or(doRenameSchema)
    .or(doDeleteSchema)


export const action = (({request}) => {

}) satisfies ActionFunction

export const loader = (async ({params: {stationId}}) => {
    if (!stationId) {
        return new Response("Missing station id", {status: 400});
    }
    const data = await getStationDetailData(stationId);
    if (!data) {
        return new Response("Station not found", {status: 404});
    }
    return data;
}) satisfies LoaderFunction

async function getStationDetailData(stationId: string) {
    return prisma.station.findFirst({
        where: {id: stationId},
        include: {data: {select: {id: true, temperature: true, humidity: true}}}
    });
}

const StationDetailPage: FC = () => {
    const data = useLoaderData<typeof loader>();

    return <>{JSON.stringify(data)}</>;
}

export default StationDetailPage;