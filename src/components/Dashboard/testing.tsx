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
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Card Header */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Current Maintenance</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all current maintenance cards.
                    </p>
                </div>
            </div>
            {/* Card Table */}
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Title</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">System</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subsystem</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Equipment</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned To:</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assign Clerk</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {maintenanceCards.map((card) => (
                                    <tr key={card.id} className="even:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{card.Title}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.System}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Subsystem}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Equipment}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            { 
                                                (() => {
                                                    const user = users.find(user => user.id === card.assigneeId);
                                                    return user ? `${user.firstName ?? ''} ${user.lastName ?? ''}` : 'Unassigned';
                                                })()
                                            }
                                        </td>
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
                                                        {user.firstName} {user.lastName} 
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>    
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
