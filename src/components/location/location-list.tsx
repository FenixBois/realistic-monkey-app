import Link from 'next/link';
import { Paper, Title, Text, Loader, Accordion } from '@mantine/core';
import { api } from '~/utils/api';

export function LocationList() {
    const {
        isLoading,
        isError,
        error,
        data: locations
    } = api.location.getAll.useQuery();

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Text>{error.message}</Text>;
    }

    return (
        <div>
            <Title>Locations</Title>
            <Accordion
                variant='separated'
                pt={32}
            >
                {locations.map((location) => (
                    (location.stations.length !== 0 &&
                        <Accordion.Item key={location.id} value={location.name}>
                            <Accordion.Control>{location.name}</Accordion.Control>
                            <Accordion.Panel>
                                {location.stations.map((station) => (
                                    <Link
                                        key={station.id}
                                        href={`station/${station.id}`}
                                    >
                                        <Paper
                                            withBorder
                                            radius='md'
                                            p='md'
                                            m='sm'
                                            sx={(theme) => ({
                                                '&:hover': {
                                                    backgroundColor:
                                                        theme.colorScheme === 'dark'
                                                            ? theme.colors.gray
                                                            : theme.colors.gray[1]
                                                }
                                            })}
                                        >
                                            <Text td='underline'>{station.name}</Text>
                                        </Paper>
                                    </Link>
                                ))}
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                ))}
            </Accordion>
        </div>
    );
}
