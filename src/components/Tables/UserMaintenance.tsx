import { api } from "~/utils/api";
import React, { useState } from "react"
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import MaintModal from "../Modals/maintModal";
import MarkCompleteModal from "../Modals/markCompleteModal";
import type { MaintenanceCard } from "@prisma/client";

export default function UserMaintenance () {
    const query = api.maintenanceCard.getMaintByCurrentUser.useQuery();
    const { data, error, isLoading } = query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<MaintenanceCard | null>(null);
  
    const isPastDue = (dueDate: Date| undefined) => {
        if (!dueDate) {
            return false;
        }
        const today = new Date();
        return dueDate < today;
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
                    <h1 className="text-4xl font-sans font-semibold leading-6 text-gray-900">My Tasks</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of maintenance currently assigned to you.</p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {data.length === 0 ? (
                            <div className="text-center mt-4">
                                <h2 className="text-gray-500 text-lg">You do not currently have any maintenance assigned to you.</h2>
                            </div>
                        ) : (
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Title
                                    </th>
                                    <th scope="col" className="hidden 2xl:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Due Date
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Completion
                                    </th> 
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {data.map((card) => (
                                <tr key={card.card.id} className="even:bg-gray-50">
                                    <td 
                                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-semibold hover:bg-slate-200 hover:cursor-pointer"
                                        onClick={() => {
                                            setSelectedCard(card.card);
                                            setIsModalOpen(true);
                                        }}
                                    >{card.card.Title}</td>
                                    <td className="hidden 2xl:table-cell max-w-xl overflow-ellipsis overflow-hidden break-all whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.card.Description}</td>
                                    <td className={`hidden md:table-cell px-3 py-3.5 whitespace-nowrap text-sm font-medium ${isPastDue(card.card.dueDate) ? 'text-red-500' : 'text-gray-900'}`}>
                                        {card.card.dueDate ? card.card.dueDate.toISOString().split('T')[0] : 'No due date'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <button 
                                            onClick={() => {
                                                setSelectedCard(card.card);
                                                setIsCompleteModalOpen(true);
                                            }
                                            }
                                            type="button"
                                            id="largeButton"
                                            className="hidden sm:inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                            Mark Complete
                                        </button>
                                        <button
                                            
                                            onClick={() => {
                                                setSelectedCard(card.card);
                                                setIsCompleteModalOpen(true);
                                            }
                                            }
                                            type="button"
                                            id="smallButton"
                                            className="sm:hidden rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            
                        ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
            </div>
                {isModalOpen && selectedCard && (
                    <MaintModal
                        card={selectedCard}
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
                {isCompleteModalOpen && selectedCard && (
                    <MarkCompleteModal
                        card={selectedCard}
                        open={isCompleteModalOpen}
                        onClose={() => setIsCompleteModalOpen(false)}
                    />
                )}
        </div>
        
    )
}