import Link from 'next/link';
import { Paper, Stack, Title, Text } from '@mantine/core';

export function LocationList() {
    // TODO Fetch locations from TRPC
    const locations = [
        {
            id: 123,
            name: 'Prague',
        },
        {
            id: 124,
            name: 'Denmark',
        },
    ];

    return (
        <div>
            <Title>Locations</Title>
            <Stack w={264} pt={32}>
                {locations.map(({ id, name }) => (
                    <Link href={`location/${id}`}>
                        <Paper
                            shadow='sm'
                            radius='md'
                            p='md'
                            sx={(theme) => ({
                                '&:hover': { boxShadow: theme.shadows.xs },
                                '&:active': {
                                    backgroundColor: theme.colors.gray[1],
                                },
                            })}
                        >
                            <Text td='underline'>{name}</Text>
                        </Paper>
                    </Link>
                ))}
            </Stack>
        </div>
    );
}
