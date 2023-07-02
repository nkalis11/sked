import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { MaintenanceCard } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "../helpers/filterUserForClient";

type PeriodicityCalendar = 'D' | 'W' | 'M' | 'Q' | 'S' | 'A';

const prisma = new PrismaClient();
{/* Assigns Clerk User To Maintenance Card*/}
const addUserDataToMaint = async (maintCard: MaintenanceCard[]) => {
  const userId = maintCard
    .map((card) => card.assigneeId)
    .filter((id): id is string => id !== null && id !== undefined);
  //Pulls userlist from Clerk
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


{/* Router for Maintenace Cards*/}
export const maintCardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => { //Finds all maintenance cards in Prisma
    return await ctx.prisma.maintenanceCard.findMany();
  }),
  getAllUsers: publicProcedure.query(async () => {  //Gets all users from Clerk
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
        periodicityFrequency: input.periodicityFrequency === null ? undefined : input.periodicityFrequency,
        periodicityCode: input.periodicityCode,
        Periodicity: input.Periodicity,
        assigneeId: input.assigneeId,
        dueDate: new Date(),
      };
      const newCard = await ctx.prisma.maintenanceCard.create({
        data: inputData,
      });
      return newCard;
    }),
  removeMaintCard: publicProcedure //Router for removing a maintenance card from Prisma
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deletedCard = await ctx.prisma.maintenanceCard.delete({
        where: { id: input.id },
      });
      if (!deletedCard)
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
      return deletedCard;
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
    getByWeek: publicProcedure //Router for getting all maintenance cards for a week from Prisma
    .input(z.object({ startDate: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log('getByWeek input:', input);
      const startDate = new Date(input.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      const cards = await ctx.prisma.maintenanceCard.findMany({
        where: {
          dueDate: {
            gte: startDate,
            lt: endDate,
          }, 
        },
        orderBy: {
          dueDate: "desc",
        },
      });
      console.log('getByWeek result:', cards); // print the result

      return cards;
    }),
    getMaintByCurrentUser: publicProcedure //Router for getting all maintenance cards for the current user from Prisma
    .query(async ({ ctx }) => {
      const userId = ctx.userId
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR", 
          message: "User not found",
        });
      }
      const maintCards = await ctx.prisma.maintenanceCard.findMany({
        where: { assigneeId: userId },
        orderBy: { dueDate: "asc" },
      });
      return await addUserDataToMaint(maintCards);
    }),
    completedMaintCard: publicProcedure //Router for marking a maintenance card as completed in Prisma
    .input(z.object({
      cardId: z.string(),
      checkNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId
      if (!userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR", 
          message: "User not found",
        });
      }
      const card = await prisma.maintenanceCard.findUnique({
        where: { id: input.cardId },
      });
      if (card?.assigneeId !== userId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR", 
          message: "User not found",
        });
      }

      const periodicity = card.Periodicity;
      const now = new Date();
      const dueDate = getNextDueDate(now, periodicity);

      const completeMaintenanceData = {
        Title: card.Title,
        Description: card.Description,
        completedBy: userId,
        completionDate: now,
        completeOnTime: now <= card.dueDate,
        checkNotes: input.checkNotes || "",
        Periodicity: card.Periodicity,
      }

      await ctx.prisma.completedMaintenance.create({
        data: completeMaintenanceData,
      });

      const completedMaintenance = await prisma.completedMaintenance.findMany();
      console.log(completedMaintenance);

      const updatedCard = await ctx.prisma.maintenanceCard.update({
        where: { id: input.cardId },
        data: {
          assigneeId: null,
          dueDate,
          lastCompletedDate: now,
        },
      });
      return updatedCard;
    }),
    getCompletedMaintenance: publicProcedure.query(async ({ ctx }) => {
      const completedMaintenance = await ctx.prisma.completedMaintenance.findMany({
        take: 5,
        orderBy: { completionDate: "desc" },
      });

      for (const record of completedMaintenance) {
        let user;
        try {
          user = await clerkClient.users.getUser(record.completedBy);
        } catch (err) {
          console.log(err);
        }
        if (user) {
          const userData = filterUserForClient(user);

          record.completedBy = `${userData.firstName || ""} ${userData.lastName || ""}`;
        }
      }
      return completedMaintenance;
    }),
});  

function getNextDueDate(now: Date, periodicity: PeriodicityCalendar): Date {
  const nextDueDate = new Date(now);
  switch (periodicity) {
    case 'D': // Daily
      nextDueDate.setDate(nextDueDate.getDate() + 1);
      break;
    case 'W': // Weekly
      nextDueDate.setDate(nextDueDate.getDate() + 7);
      break;
    case 'M': // Monthly
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      break;
    case 'Q': // Quarterly
      nextDueDate.setMonth(nextDueDate.getMonth() + 3);
      break;
    case 'S': // Semi-annually
      nextDueDate.setMonth(nextDueDate.getMonth() + 6);
      break;
    case 'A': // Annually
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      break;
    default:
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", 
        message: "Invalid periodicity",
      });
  }
  return nextDueDate;
}
