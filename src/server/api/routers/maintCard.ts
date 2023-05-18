import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MaintenanceCard, PrismaClient, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "../helpers/filterUserForClient";

const prisma = new PrismaClient();

const addUserDataToMaint = async (maintCard: MaintenanceCard[]) => {
  const userId = maintCard
    .map((card) => card.assigneeId)
    .filter((id): id is string => id !== null && id !== undefined);

  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return maintCard.map((card) => {
    const assignee = users.find((user) => user.id === card.assigneeId);

    if (!assignee) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Assignee not found",
      });
    }
    if (!assignee.username) {
      if (!assignee.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Assignee username not found",
        });
      }
      assignee.username = assignee.externalUsername;
    }
    return {
      card,
      assignee: {
        ...assignee,
        username: assignee.username ?? ("username not found"),
      },
    };
  });
};

export const maintCardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => { //Router for getting all maintenance cards from Prisma
    return await ctx.prisma.maintenanceCard.findMany();
  }),
  getAllUsers: publicProcedure.query(async () => {  //Router for getting all users from Clerk
    const users = await clerkClient.users.getUserList({
      limit: 110,
    });
    return users.map(filterUserForClient);
  }),
  addMaintCard: publicProcedure  //Router for adding a maintenance card to Prisma
    .input(z.object({
      Title: z.string(),
      Description: z.string(),
      manHours: z.string(),
      System: z.string(),
      Subsystem: z.string(),
      Equipment: z.string(),
      periodicityFrequency: z.number().optional(),
      periodicityCode: z.number(),
      Periodicity: z.enum(["D", "W", "M", "Q", "S", "A"]),
      assigneeId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const inputData: Prisma.MaintenanceCardCreateInput = {
        Title: input.Title,
        Description: input.Description,
        manHours: new Prisma.Decimal(input.manHours),
        System: input.System,
        Subsystem: input.Subsystem,
        Equipment: input.Equipment,
        periodicityFrequency: input.periodicityFrequency,
        periodicityCode: input.periodicityCode,
        Periodicity: input.Periodicity,
        assigneeId: input.assigneeId,
      };
      const newCard = await ctx.prisma.maintenanceCard.create({
        data: inputData,
      });
      return newCard;
    }),
  updateAssignee: publicProcedure //Router for updating the assignee of a maintenance card in Prisma
    .input(z.object({ cardId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx}) => {
      const updatedCard = await ctx.prisma.maintenanceCard.update({
        where: { id: input.cardId },
        data: { assigneeId: input.userId },
      });
      if (!updatedCard)
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });  
      return updatedCard;
      }),

  getById: publicProcedure //Router for getting a maintenance card by its ID from Prisma
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const maintCard = await ctx.prisma.maintenanceCard.findUnique({
        where: { id: input.id },
      });

      if (!maintCard) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToMaint([maintCard]))[0];
    }),
  getMaintByUserId: publicProcedure //Router for getting all maintenance cards assigned to a user from Prisma
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input}) =>
      ctx.prisma.maintenanceCard
        .findMany({
          where: {
            assigneeId: input.userId,
            },
            take: 100,
        })
        .then(addUserDataToMaint)
    ),

});
