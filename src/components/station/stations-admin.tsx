import { api } from '~/utils/api';
import { Button, Flex, Loader, Modal, Paper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LocationSelect } from '~/components/location/location-select';

export function StationsAdmin() {
    const utils = api.useContext();
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

    const handleSubmit = () => {
        utils.station.registered.invalidate().then(() => {
            close();
        });
    };

    return (
        <div>
            <Title>Stations Admin</Title>
            {registeredStations.map((station) => (
                <Paper
                    key={station.id}
                    withBorder
                    radius='md'
                    p='md'
                    mt='sm'
                >
                    <Modal opened={opened} onClose={close} title='Activate station'>
                        <LocationSelect stationId={station.id} onSubmit={handleSubmit} />
                    </Modal>
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
