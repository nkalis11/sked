import { MaintenanceCard, PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import React from "react";
import { clerkClient } from "@clerk/nextjs/server";
import { useMutation } from "@tanstack/react-query";

export default function Testing() {
    const cardsQuery = api.maintenanceCard.getAll.useQuery();
    const usersQuery = api.maintenanceCard.getAllUsers.useQuery();
    const users = usersQuery.data || [];
    const [maintenanceCards, setMaintenanceCards] = useState<MaintenanceCard[]>([]);

    useEffect(() => {
      if (cardsQuery.data) {
        setMaintenanceCards(cardsQuery.data);
      }
    }, [cardsQuery.data]);

    const updateAssigneeMutation = api.maintenanceCard.updateAssignee.useMutation();
    const handleAssigneeChange = async (cardId: string, userId: string) => {
        // Save the original assignee ID in case we need to revert
        const originalAssigneeId = maintenanceCards.find(card => card.id === cardId)?.assigneeId;
        // Optimistically update the UI
        setMaintenanceCards(prevCards =>
          prevCards.map(card => 
            card.id === cardId ? { ...card, assigneeId: userId } : card
          )
        );
        // Update the database
        try {
          await updateAssigneeMutation.mutateAsync({ cardId, userId });
        } catch (error) {
          // If the mutation fails, revert the change in the UI and display an error
          setMaintenanceCards((prevCards: MaintenanceCard[]) =>
            prevCards.map((card) =>
                card.id === cardId ? { ...card, assigneeId: userId } : card
            )
          );
          console.error('Failed to update assignee:', error);
        }
        // Refetch maintenanceCards to update the UI
        void cardsQuery.refetch();
      };

    return (
        <>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Periodicity</th>
                        <th>Description</th>
                        <th>System</th>
                        <th>Equipment</th>
                        <th>Assigned To:</th>
                        <th>Assign Clerk</th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceCards.map((card) => (
                        <tr key={card.id}>
                            <td>{card.Description}</td>
                            <td>{card.System}</td>
                            <td>{card.Subsystem}</td>
                            <td>{card.Equipment}</td>
                            <td>{users.find((user) => user.id === card.assigneeId)?.username || 'Unassigned'}</td>
                            <td>
                                <select
                                    value={card.assigneeId || ""}
                                    onChange={(e) =>  {
                                        const newUserId = e.target.value;
                                        handleAssigneeChange(card.id, newUserId).catch((error) => {
                                            console.error('Failed to update assignee:', error);
                                        });
                                    }}
                                >
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.username} ({user.id})
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>    
            </table>
        </div>
        </>
    );
}
