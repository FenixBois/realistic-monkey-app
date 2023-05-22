import { Title, Text, Group, Menu, Button, Flex } from '@mantine/core';
import { api, RouterOutputs } from '~/utils/api';
import { Dashboard } from '~/components';
import { IconTrash } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type StationOutput = RouterOutputs['station']['getById'];

interface StationDetailProps {
    station: StationOutput;
}

export function StationDetail({ station }: StationDetailProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const locationMutation = api.station.delete.useMutation({
        onSuccess: () => {
            router.push('/');
        }
    });
    
    if (!station) return null;

    const removeStation = () => {
        locationMutation.mutate({ id: station.id });
    };

    return (
        <div>
            <Flex justify='space-between' align='baseline'>
                <Title>{station.name}</Title>
                {session?.user?.role === 'ADMIN' &&
                    <Menu shadow='md' width={200}>
                        <Menu.Target>
                            <Button color='red' variant='light'>Remove station</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Are you sure?</Menu.Label>
                            <Menu.Item onClick={removeStation} color='red' icon={<IconTrash size={14} />}>
                                Remove this station
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                }
            </Flex>
            <Group mb={24}>
                <Text
                    sx={(theme) => ({
                        color:
                            station.state === 'ACTIVE'
                                ? theme.colors.green[6]
                                : theme.colors.red[6]
                    })}
                >
                    {station.state}
                </Text>
                <Text>{station.location?.name}</Text>
                <Text>{station.gatewayInfo}</Text>
            </Group>

            <Dashboard stationId={station.id} />
        </div>
    );
}
