import {
    PrismaClient,
    StationState,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const location1 = await prisma.location.create({
        data: {
            name: 'Location 1',
            stations: {
                create: [
                    {
                        name: 'Station 1',
                        gatewayInfo: 'Gateway 1',
                        state: StationState.ACTIVE,
                        data: {
                            create: [
                                {
                                    humidity: 50.0,
                                    temperature: 20.0,
                                },
                            ],
                        },
                    },
                    {
                        name: 'Station 2',
                        gatewayInfo: 'Gateway 2',
                        state: StationState.REGISTERED,
                        data: {
                            create: [
                                {
                                    humidity: 40.0,
                                    temperature: 15.0,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const location2 = await prisma.location.create({
        data: {
            name: 'Location 2',
            stations: {
                create: [
                    {
                        name: 'Station 3',
                        gatewayInfo: 'Gateway 3',
                        state: StationState.REGISTERED,
                        data: {
                            create: [
                                {
                                    humidity: 50.0,
                                    temperature: 20.0,
                                },
                            ],
                        },
                    },
                    {
                        name: 'Station 4',
                        gatewayInfo: 'Gateway 4',
                        state: StationState.INACTIVE,
                        data: {
                            create: [
                                {
                                    humidity: 40.0,
                                    temperature: 15.0,
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
