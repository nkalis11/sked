import { api } from "~/utils/api";
import React from "react"
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function UserMaintenance () {
    const { data, error, isLoading } = api.maintenanceCard.getMaintByCurrentUser.useQuery();
    const completeMaintCard = api.maintenanceCard.completedMaintCard.useMutation();

    const handleMarkComplete = async (cardId: string) => {
        try {
            const result = await completeMaintCard.mutateAsync({ cardId });
            console.log('Maintenance card marked as complete:', result);
        }   catch (error) {
            console.error('Failed to mark maintenance card as complete:', error);
        }
    }

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
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Title
                                    </th>
                                    <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
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
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.card.Title}</td>
                                    <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.card.Description}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.card.dueDate ? card.card.dueDate.toISOString().split('T')[0] : 'No due date'}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <button 
                                            onClick={() => { void handleMarkComplete(card.card.id); }}
                                            type="button"
                                            id="largeButton"
                                            className="hidden sm:inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                            Mark Complete
                                        </button>
                                        <button
                                            onClick={() => { void handleMarkComplete(card.card.id); }}
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
                    </div>
                </div>
            </div>
        </div>
    )
}