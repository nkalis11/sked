import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const maintCardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.maintenanceCard.findMany();
  }),
  getAllClerks: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.clerk.findMany();
  }),
  assignClerk: privateProcedure
    .input(
      z.object({
        maintCardId: z.string(),
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { maintCardId, clerkId } = input;

      // Check if the maintenance card exists
      const maintCard = await ctx.prisma.maintenanceCard.findUnique({
        where: { id: maintCardId },
      });
      if (!maintCard) {
        throw new Error(`Maintenance card with ID ${maintCardId} not found`);
      }

      // Check if the clerk exists
      const clerk = await ctx.prisma.clerk.findUnique({
        where: { id: clerkId },
      });
      if (!clerk) {
        throw new Error(`Clerk with ID ${clerkId} not found`);
      }

      // Create a new ClerkCard entry to assign the clerk to the maintenance card
      const clerkCard = await ctx.prisma.clerkCard.create({
        data: {
          clerkId,
          maintenanceId: maintCardId,
        },
      });

      return clerkCard;
    }),
});
