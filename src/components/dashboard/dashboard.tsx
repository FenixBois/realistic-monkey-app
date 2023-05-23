import { z } from 'zod';

import { createFormContext, zodResolver } from '@mantine/form';
import { Flex, Grid, Loader, useMantineTheme } from '@mantine/core';

import { Controls } from '~/components/controls';
import { getDataSchema, StationDataGranularity } from '~/utils/validations';
import { Chart } from '~/components';
import { api } from '~/utils/api';
import { useEffect } from 'react';

type ControlsForm = z.infer<typeof getDataSchema>;

const initialControls = {
    granularity: StationDataGranularity.FIVE_MINUTES,
    from: new Date(Date.now() - 1000 * 60 * 60),
    to: new Date(),
};

export const [FormProvider, useFormContext, useForm] =
    createFormContext<ControlsForm>();

interface IDashboardProps {
    stationId: string;
}

export const Dashboard = ({ stationId }: IDashboardProps) => {
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: { ...initialControls, stationId },
        validate: zodResolver(getDataSchema),
        validateInputOnChange: true,
        validateInputOnBlur: true,
    });

    useEffect(() => {
        form.validate();
    }, [form.values.from, form.values.to, form.values.granularity]);

    const { isLoading, isError, error, data } =
        api.stationData.getDataForStationById.useQuery(
            {
                ...form.values,
                stationId,
            },
            {
                enabled: form.isValid(),
            }
        );

    const humidity = data?.map(({ humidity: value, datetime }) => ({
        value,
        datetime,
    }));

    const temperature = data?.map(
        ({ temperature: value, humidity, datetime }) => ({ value, datetime })
    );

    const humidityChartData = {
        labels:
            humidity?.map(({ datetime }) =>
                new Date(datetime).toLocaleTimeString('cs-CZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            ) ?? [],
        datasets: [
            {
                label: 'Humidity',
                data: humidity?.map(({ value }) => value) ?? [],
                borderColor: theme.colors.blue[6],
                backgroundColor: theme.colors.blue[5],
                yAxisID: 'y',
                tension: 0.3,
            },
        ],
    };

    const temperatureChartData = {
        labels:
            temperature?.map(({ datetime }) =>
                new Date(datetime).toLocaleTimeString('cs-CZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            ) ?? [],
        datasets: [
            {
                label: 'Temperature',
                data: temperature?.map(({ value }) => value) ?? [],
                borderColor: theme.colors.red[6],
                backgroundColor: theme.colors.red[5],
                yAxisID: 'y',
                tension: 0.3,
            },
        ],
    };

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
