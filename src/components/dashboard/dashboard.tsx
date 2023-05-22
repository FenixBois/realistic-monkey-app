import { z } from 'zod';

import { createFormContext } from '@mantine/form';
import { Controls } from '~/components/controls';
import { dataSchema, StationDataGranularity } from '~/utils/validations';

const controlsFormSchema = dataSchema.omit({ stationId: true });

type ControlsForm = z.infer<typeof controlsFormSchema>;

const initialControls: ControlsForm = {
    granularity: StationDataGranularity.DAY,
    from: new Date(),
    to: new Date(),
};

export const [FormProvider, useFormContext, useForm] =
    createFormContext<ControlsForm>();

export const Dashboard = () => {
    const form = useForm({
        initialValues: initialControls,
    });
    return (
        <FormProvider form={form}>
            <Controls />
            <h1>Home</h1>
        </FormProvider>
    );
};
