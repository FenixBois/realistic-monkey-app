import { createTRPCRouter } from '~/server/api/trpc';
import { stationRouter } from '~/server/api/routers/station';
import { locationRouter } from '~/server/api/routers/location';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    station: stationRouter,
    location: locationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
