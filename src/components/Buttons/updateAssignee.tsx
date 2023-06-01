import React, { Fragment, MouseEventHandler, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { MaintenanceCard } from '@prisma/client'
import { api } from '~/utils/api'

function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

interface AssigneeButtonProps {
        card: MaintenanceCard;
    }

const AssigneeButton: React.FC<AssigneeButtonProps> = ({ card }) => {
        const cardsQuery = api.maintenanceCard.getAll.useQuery();
        const usersQuery = api.maintenanceCard.getAllUsers.useQuery();
        const users = usersQuery.data || [];
        const [tableKey, setTableKey] = useState(Date.now());
        const [maintenanceCards, setMaintenanceCards] = useState<MaintenanceCard[]>([]);
        const [selectedCard, setSelectedCard] = useState<MaintenanceCard | null>(null);
        const updateAssigneeMutation = api.maintenanceCard.updateAssignee.useMutation();
        const handleAssigneeChange = async (cardId: string, userId: string) => {
            // Find the card with the matching ID
            const cardToUpdate = maintenanceCards.find(card => card.id === cardId);
            if (!cardToUpdate) {
              console.error(`Could not find card with ID ${cardId}`);
              return;
            }
            // Save the original assignee ID in case we need to revert
            const originalAssigneeId = cardToUpdate.assigneeId;
            // Update the assignee ID of the card
            cardToUpdate.assigneeId = userId;
            // Optimistically update the UI
            setMaintenanceCards(prevCards =>
              prevCards.map(card => 
                card.id === cardId ? cardToUpdate : card
              )
            );
            // Update the database
            try {
              await updateAssigneeMutation.mutateAsync({ cardId, userId });
              // Update the maintenanceCards state variable with a new array reference to force a re-render of the component
              setMaintenanceCards([...maintenanceCards]);
              window.location.reload();
            } catch (error) {
              // If the mutation fails, revert the change in the UI and display an error
              cardToUpdate.assigneeId = originalAssigneeId;
              setMaintenanceCards((prevCards: MaintenanceCard[]) =>
                prevCards.map((card) =>
                    card.id === cardId ? cardToUpdate : card
                )
              );
              console.error('Failed to update assignee:', error);
            }
          };
          useEffect(() => {
            if (cardsQuery.data) {
              setMaintenanceCards(cardsQuery.data);
            }
          }, [cardsQuery.data]);


    return (
        <div className="relative">
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
        </div>
      );
    };
    
export default AssigneeButton;