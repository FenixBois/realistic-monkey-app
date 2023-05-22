import { Grid } from '@mantine/core';
import { DateInput } from '@mantine/dates';

import { useFormContext } from '~/components/dashboard/dashboard';

export const Controls = () => {
    const form = useFormContext();

    return (
        <div>
            <Grid>
                <Grid.Col span={4}>
                    <DateInput
                        label='Date input'
                        placeholder='Date input'
                        mx='auto'
                        {...form.getInputProps('from')}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <DateInput
                        label='Date input'
                        placeholder='Date input'
                        mx='auto'
                        {...form.getInputProps('to')}
                    />
                </Grid.Col>
            </Grid>
        </div>
    );
};
