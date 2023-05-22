import { z } from 'zod';

import { createFormContext } from '@mantine/form';
import { Grid, Loader } from '@mantine/core';

import { Controls } from '~/components/controls';
import { dataSchema, StationDataGranularity } from '~/utils/validations';
import { Chart } from '~/components';
import { api } from '~/utils/api';

const controlsFormSchema = dataSchema.omit({ stationId: true });

type ControlsForm = z.infer<typeof controlsFormSchema>;

const initialControls: ControlsForm = {
    granularity: StationDataGranularity.DAY,
    from: new Date(),
    to: new Date(Date.now() + 1000 * 60 * 60),
};

export const [FormProvider, useFormContext, useForm] =
    createFormContext<ControlsForm>();

interface IDashboardProps {
    stationId: string;
}
export const Dashboard = ({ stationId }: IDashboardProps) => {
    const form = useForm({
        initialValues: initialControls,
    });

    const {
        isLoading,
        isError,
        error,
        data: locations,
    } = api.stationData.getDataForStationById.useQuery({
        stationId,
        ...form.values,
    });

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>{error.message}</div>;
    }

    return (
        <FormProvider form={form}>
            <Controls />
            <Grid pt={20}>
                <Grid.Col span={6}>
                    <Chart />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Chart />
                </Grid.Col>
            </Grid>
        </FormProvider>
    );
};
