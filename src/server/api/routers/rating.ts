import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MaintenanceCard, CompletedMaintenance, PrismaClient, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "../helpers/filterUserForClient";

const prisma = new PrismaClient();

export const ratingRouter = createTRPCRouter({
    getPercent: publicProcedure.query(async ({ ctx }) => {
        const completedMaintenance = await ctx.prisma.completedMaintenance.findMany();
        const trueCount = completedMaintenance.filter(
            (value) => value.completeOnTime === true
        ).length;
        const falseCount = completedMaintenance.filter(
            (value) => value.completeOnTime === false
        ).length;
        const truePercent = Math.round((trueCount / completedMaintenance.length) * 100);
        const falsePercent = Math.round((falseCount / completedMaintenance.length) * 100);
        return { truePercent, falsePercent };
    }),
});