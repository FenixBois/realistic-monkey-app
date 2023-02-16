import type {FC} from "react";
import type {ActionFunction} from "@remix-run/router";
import {prisma} from "~/db.server";
import {Form, useLoaderData} from "@remix-run/react";
import {zfd} from 'zod-form-data';
import {Simulate} from "react-dom/test-utils";

const stationSchema = zfd.formData({
    name: zfd.text()
});

export const action: ActionFunction = async ({request}) => {
    const data = stationSchema.parse(await request.formData());
    return await prisma.station.create({data})
}

const Stations: FC = () => {
    return <div>
        <StationsList/>
        <Form method="post">
            <input name="name"/>
            <button>Save</button>
        </Form>
    </div>
}
export default Stations;

export const loader = async () => {
    return prisma.station.findMany();
}

const StationsList: FC = () => {
    const data = useLoaderData<typeof loader>();

    if (!data?.length) return <div>No stations found</div>

    return <div>{data.map(station => <div key={station.id}>{station.name}</div>)}</div>
}