import { Grid, Select } from '@mantine/core';
import { DateInput, DateTimePicker } from '@mantine/dates';

import { useFormContext } from '~/components/dashboard/dashboard';
import { StationDataGranularity } from '~/utils/validations';

export const Controls = () => {
    const form = useFormContext();

    const data = [
        { value: StationDataGranularity.FIVE_MINUTES, label: '5 minutes' },
        { value: StationDataGranularity.TEN_MINUTES, label: '10 minutes' },
        { value: StationDataGranularity.HALF_HOUR, label: '30 minutes' },
        { value: StationDataGranularity.HOUR, label: '1 hour' },
        { value: StationDataGranularity.DAY, label: '24 hours' },
    ];
    return (
        <div>
            <Grid>
                <Grid.Col span={4}>
                    <DateTimePicker
                        label='From'
                        placeholder='From date'
                        mx='auto'
                        {...form.getInputProps('from')}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateTimePicker
                        label='To'
                        placeholder='To date'
                        mx='auto'
                        {...form.getInputProps('to')}
                    />
                </Grid.Col>

                <Grid.Col span={4}>
                    <Select
                        label='Granularity'
                        data={data}
                        {...form.getInputProps('granularity')}
                    />
                </Grid.Col>
            </Grid>
        </div>
    );
};
