import { api } from '~/utils/api';
import { Button, Flex, Loader, Modal, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LocationSelect } from '~/components/location/location-select';

export function StationsAdmin() {
    const [opened, { open, close }] = useDisclosure(false);
    const {
        isLoading,
        isError,
        error,
        data: registeredStations
    } = api.station.registered.useQuery();

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Text>{error.message}</Text>;
    }

    return (
        <div>
            <Modal opened={opened} onClose={close} title='Activate station'>
                <LocationSelect />
            </Modal>
            <h1>Stations Admin</h1>
            {registeredStations.map((station) => (
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
                    <Flex justify='space-between' align='center'>
                        <Text td='underline'>{station.name}</Text>
                        <Button color='lime' onClick={open}>
                            Activate station
                        </Button>
                    </Flex>
                </Paper>
            ))}
        </div>
    );
}
