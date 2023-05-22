import { Button, Select, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { Location } from '@prisma/client';
import { useForm } from '@mantine/form';

interface LocationSelectProps {
    stationId: string;
    onSubmit: () => void;
}

export function LocationSelect({ stationId, onSubmit }: LocationSelectProps) {
    const form = useForm({
        initialValues: {
            locationId: ''
        },
        validate: {
            locationId: (value) => value === '' ? 'Location is required' : null
        }
    });
    const [locations, setLocations] = useState<{ value: string, label: string }[]>([]);
    const { data } = api.location.getAll.useQuery();

    useEffect(() => {
        if (!data) return;

        setLocations(data.map((location: Location) => {
            return { value: location.id, label: location.name };
        }));
    }, [data]);

    const locationMutation = api.location.create.useMutation({});
    const stationMutation = api.station.activate.useMutation({
        onSuccess: () => onSubmit()
    });

    const createItem = (query: string) => {
        locationMutation.mutateAsync({ name: query }).then((data) => {
            setLocations((locations) => [...locations, { value: data.id, label: data.name }]);
        }).catch((error) => {
            throw error;
        });

        return { value: query, label: query };
    };

    const activateStation = () => {
        stationMutation.mutate({
            id: stationId,
            locationId: form.values.locationId
        });
    };

    return (
        <form onSubmit={form.onSubmit(() => activateStation())}>
            <Stack spacing='xl' align='start'>
                <Select
                    {...form.getInputProps('locationId')}
                    label='Select a location'
                    data={locations ? locations : []}
                    placeholder='Select items'
                    nothingFound='Nothing found'
                    withinPortal
                    searchable
                    creatable
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={createItem}
                />
                <Button type='submit' color='lime' mt={16}>Activate station</Button>
            </Stack>
        </form>
    );
}
