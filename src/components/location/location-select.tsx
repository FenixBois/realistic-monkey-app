import { Button, Select, Stack } from '@mantine/core';
import { useState } from 'react';

export function LocationSelect() {
    const [data, setData] = useState([
        { value: 'react', label: 'React' },
        { value: 'ng', label: 'Angular' }
    ]);

    return (
        <Stack spacing='xl' align='start'>
            <Select
                label='Select a location'
                data={data}
                placeholder='Select items'
                nothingFound='Nothing found'
                searchable
                creatable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                    const item = { value: query, label: query };
                    setData((current) => [...current, item]);
                    return item;
                }}
            />
            <Button color='lime'>Activate station</Button>
        </Stack>
    );
}
