import React, { useState } from "react"
import { api } from "~/utils/api"
import WeekDropdown from "../Buttons/weekDropdown";
import AssigneeButton from "../Buttons/updateAssignee";
import { Card } from "@tremor/react";


const useMaintenanceTable = () => {
    const [selectedWeek, setSelectedWeek] = useState<string>(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const { data, error, isLoading } = api.maintenanceCard.getByWeek.useQuery({ startDate: selectedWeek });

    const today = new Date();
    const currentQuarter = Math.floor((today.getMonth() / 3));
    const quarterStartMonth = currentQuarter * 3;
    const quarterStartDate = new Date(today.getFullYear(), quarterStartMonth, 1);
    const weekOptions = [...Array(13).keys()].map((num) => {
        const date = new Date(quarterStartDate);
        date.setDate(date.getDate() + (num * 7));
        const value = date.toISOString().split('T')[0] || '';
        return {
            value,
            label: `Week of ${value}`,
        };
    });

    return { selectedWeek, setSelectedWeek, weekOptions, data, error, isLoading };
};

export default function WeeklyMaintenance() {
    const { selectedWeek, setSelectedWeek, weekOptions, data, error } = useMaintenanceTable();

    
    if (error) return <div>Error: {error.message}</div>;

    return (
    <Card>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Maintenance</h1>
                    <p className="mt-2 text-sm text-gray-700">Maintenance List</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <WeekDropdown 
                        value={selectedWeek} 
                        onChange={setSelectedWeek} 
                        options={weekOptions}
                    />
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
                                        Assigned To
                                    </th> 
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {Array.isArray(data) && data.map((card) => (
                                      <tr key={card.id} className="even:bg-gray-50">
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Title}</td>
                                      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Description}</td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.dueDate ? card.dueDate.toISOString().split('T')[0] : 'No due date'}</td>
                                      <td>
                                        <AssigneeButton card={card} />
                                      </td>
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Card>
    )
}