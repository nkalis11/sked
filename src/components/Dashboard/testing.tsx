import { MaintenanceCard, PrismaClient } from "@prisma/client";
import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { api } from "~/utils/api";
import React from "react";
import { clerkClient } from "@clerk/nextjs/server";
import { useMutation } from "@tanstack/react-query";
import { List } from "@tremor/react";
import MaintModal from "../Modals/maintModal";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Testing() {
    const cardsQuery = api.maintenanceCard.getAll.useQuery();
    const usersQuery = api.maintenanceCard.getAllUsers.useQuery();
    const users = usersQuery.data || [];
    const [maintenanceCards, setMaintenanceCards] = useState<MaintenanceCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<MaintenanceCard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

      const handleCardClick = (card: MaintenanceCard, event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        const isCardTitleCell = target.classList.contains('card-title-cell');
      
        if (isCardTitleCell) {
          setSelectedCard(card);
          setIsModalOpen(true);  // <-- Set the modal to open
        }
    };

    const closeModal = () => {
        setSelectedCard(null);
        setIsModalOpen(false);  // <-- Set the modal to close
    };

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
        <div className="relative">
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
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 card-title-cell hover:text-blue-700 cursor-pointer" onClick={(event) => handleCardClick(card, event)}>{card.Title}</td>
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
                                            <Listbox value={card.assigneeId || ""} onChange={(value) => {
                                                const ignorePromise = async () => {
                                                    try {
                                                        await handleAssigneeChange(card.id, value);
                                                    } catch (error) {
                                                        console.error('Failed to update assignee:', error);
                                                    }
                                                };
                                                void ignorePromise();
                                            }}>
                                                {({ open }) => (
                                                    <>
                                                        <div className="mt-2">
                                                        <Listbox.Button className="relative w-64 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                            <span className="block truncate">Assign New User</span>
                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            </span>
                                                        </Listbox.Button> 
                                                        {open && (
                                                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                          <Transition
                                                            show={open}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                          >
                                                            {users.map((user) => (
                                                              <Listbox.Option key={user.id} value={user.id} className={({ active }) =>
                                                                classNames(
                                                                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                  'relative cursor-default select-none py-2 pl-8 pr-4'
                                                                )
                                                              }>
                                                                {user.firstName} {user.lastName} 
                                                              </Listbox.Option>
                                                            ))}
                                                          </Transition>
                                                        </Listbox.Options>
                                                        
                                                            
                                                        )}
                                                        </div>
                                                    </>

                                                )}
                                            </Listbox>  
                                        </td>
                                    </tr>
                                ))}
                            </tbody>  
                        </table>
                         {/* Render Modal*/ }  
                         {selectedCard && (
                            <MaintModal card={selectedCard} onClose={closeModal} open={isModalOpen} />
                            )}
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
