import { Title, Text, Group } from '@mantine/core';
import { RouterOutputs } from '~/utils/api';

type StationOutput = RouterOutputs['station']['getById'];

interface StationDetailProps {
    station: StationOutput;
}

export function StationDetail({ station }: StationDetailProps) {
    if (!station) return;

    return (
        <div>
            <Title>{station.name}</Title>
            <Group>
                <Text
                    sx={(theme) => ({
                        color:
                            station.state === 'ACTIVE'
                                ? theme.colors.green[6]
                                : theme.colors.red[6],
                    })}
                >
                    {station.state}
                </Text>
                <Text>{station.location?.name}</Text>
                <Text>{station.gatewayInfo}</Text>
            </Group>
        </div>
    );
}
