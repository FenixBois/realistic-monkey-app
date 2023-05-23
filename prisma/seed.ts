import {PrismaClient, StationState,} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const location1 = await prisma.location.create({
        include: {stations: true},
        data: {
            name: 'Parukářka',
            stations: {
                create: [
                    {
                        name: 'Einstein',
                        gatewayInfo: 'Parukářka Einstein',
                        state: StationState.ACTIVE,
                        lastReceivedDataAt: new Date(2023, 4, 23, 10, 0, 0, 0)
                    },
                    {
                        name: 'Lobby',
                        gatewayInfo: 'Parukářka Lobby',
                        state: StationState.REGISTERED,
                    },
                ],
            },
        },
    });
    const einstein = location1.stations.find(s => s.name === "Einstein")!

    const location2 = await prisma.location.create({
        include: {stations: true},
        data: {
            name: 'Kolbenova',
            stations: {
                create: [
                    {
                        name: '1.03',
                        gatewayInfo: 'Kolbenova 1.03',
                        state: StationState.INACTIVE,
                        lastReceivedDataAt: new Date(2022, 6, 23, 10, 0, 0, 0)
                    },
                    {
                        name: '1.01',
                        gatewayInfo: 'Kolbenova 1.01',
                        state: StationState.ACTIVE,
                        lastReceivedDataAt: new Date(2023, 4, 23, 10, 0, 2, 0)
                    }
                ]
            }
        },
    });
    const kolbenova101 = location2.stations.find(s => s.name === "1.01")!

    const minTemp = 15
    const maxTemp = 30
    const minHumidity = 0
    const maxHumidity = 70
    const maxHumDiffPerMinute = 5

    const maxDate = new Date(2023, 4, 23, 10, 0, 2, 0);

    const lastData = [
        {temperature: 25, humidity: 60, stationId: einstein.id},
        {temperature: 15, humidity: 30, stationId: kolbenova101.id}
    ];

    let date = new Date(2023, 4, 19, 10, 0, 0, 0);
    while (date < maxDate) {
        for (let lastIndex in lastData) {
            const {temperature: lastTemp, humidity: lastHum, stationId} = lastData[lastIndex]!;


            const temperature = Math.min(maxTemp, Math.max(minTemp, lastTemp + (Math.random() - 0.5)));
            const humidity = Math.min(maxHumidity, Math.max(minHumidity, lastHum + (Math.random() - 0.5) * maxHumDiffPerMinute/2))

            await prisma.stationData.create({
                data: {stationId,temperature, humidity, datetime: date}
            })

            lastData[lastIndex] = {temperature, humidity, stationId};
        }
        date.setMinutes(date.getMinutes() + 1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
