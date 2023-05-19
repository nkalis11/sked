import { createTRPCRouter } from "~/server/api/trpc";
import { maintCardRouter } from "./routers/maintCard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  maintenanceCard: maintCardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
