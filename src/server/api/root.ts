import { createTRPCRouter } from "~/server/api/trpc";
import { maintCardRouter } from "./routers/maintCard";
import { ratingRouter } from "./routers/rating";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  maintenanceCard: maintCardRouter,
  ratingCard: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
