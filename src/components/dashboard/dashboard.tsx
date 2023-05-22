import { z } from 'zod';

import { createFormContext } from '@mantine/form';
import { Flex, Grid, Loader, useMantineTheme } from '@mantine/core';

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
interface Data {
    value: number;
    datetime: number;
}

const humidity: Data[] = [
    { value: 60, datetime: 1621674000 },
    { value: 62, datetime: 1621677600 },
    { value: 58, datetime: 1621681200 },
    { value: 55, datetime: 1621684800 },
    { value: 65, datetime: 1621688400 },
];

const temperature: Data[] = [
    { value: 25, datetime: 1621674000 },
    { value: 26, datetime: 1621677600 },
    { value: 24, datetime: 1621681200 },
    { value: 22, datetime: 1621684800 },
    { value: 27, datetime: 1621688400 },
];

export const Dashboard = ({ stationId }: IDashboardProps) => {
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: initialControls,
    });

    const { isLoading, isError, error, data } =
        api.stationData.getDataForStationById.useQuery({
            stationId,
            ...form.values,
        });

    /*   const humidity = data?.map(({ humidity: value, datetime }) => ({
        value,
        datetime,
    }));

    const temperature = data?.map(
        ({ temperature: value, humidity, datetime }) => ({ value, datetime })
    );*/

    const humidityChartData = {
        labels:
            humidity?.map(({ datetime }) =>
                new Date(datetime).toLocaleDateString()
            ) ?? [],
        datasets: [
            {
                label: 'Humidity',
                data: humidity?.map(({ value }) => value) ?? [],
                borderColor: theme.colors.blue[5],
                backgroundColor: theme.colors.blue[6],
                yAxisID: 'y',
                tension: 0.3,
            },
        ],
    };

    const temperatureChartData = {
        labels:
            temperature?.map(({ datetime }) =>
                new Date(datetime).toLocaleDateString()
            ) ?? [],
        datasets: [
            {
                label: 'Temperature',
                data: temperature?.map(({ value }) => value) ?? [],
                borderColor: theme.colors.red[5],
                backgroundColor: theme.colors.red[6],
                yAxisID: 'y',
                tension: 0.3,
            },
        ],
    };

    if (isError) {
        return <div>{error.message}</div>;
    }

    return (
        <FormProvider form={form}>
            <Controls />
            {isLoading ? (
                <Flex justify={'center'} p={20}>
                    <Loader />
                </Flex>
            ) : (
                <Grid pt={20}>
                    <Grid.Col span={6}>
                        <Chart data={humidityChartData} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Chart data={temperatureChartData} />
                    </Grid.Col>
                </Grid>
            )}
        </FormProvider>
    );
};
