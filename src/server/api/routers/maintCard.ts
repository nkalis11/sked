import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { MaintenanceCard, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "../helpers/filterUserForClient";

const prisma = new PrismaClient();

const addUserDataToMaint = async (maintCard: MaintenanceCard[]) => {
  const userId = maintCard.map((card) => card.assigneeId);
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
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.maintenanceCard.findMany();
  }),
  getAllUsers: publicProcedure.query(async () => {
    const users = await clerkClient.users.getUserList({
      limit: 110,
    });
    return users.map(filterUserForClient);
  }),
  updateAssignee: publicProcedure
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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const maintCard = await ctx.prisma.maintenanceCard.findUnique({
        where: { id: input.id },
      });

      if (!maintCard) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToMaint([maintCard]))[0];
    }),
  getMaintByUserId: publicProcedure
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
