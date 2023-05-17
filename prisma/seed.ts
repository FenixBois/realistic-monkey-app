import {
    PrismaClient,
    StationState,
    StationDataAggregationType,
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
                                    aggregation:
                                        StationDataAggregationType.NONE,
                                    aggregationFinalized: true,
                                    humidity: 50.0,
                                    temperature: 20.0,
                                },
                            ],
                        },
                    },
                    {
                        name: 'Station 2',
                        gatewayInfo: 'Gateway 2',
                        state: StationState.INACTIVE,
                        data: {
                            create: [
                                {
                                    aggregation: StationDataAggregationType.DAY,
                                    aggregationFinalized: true,
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

    console.log('Created Location:', location1);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
