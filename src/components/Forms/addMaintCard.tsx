import { useState } from "react";
import React from "react";
import { api } from "~/utils/api";
import { CheckCircleIcon } from '@heroicons/react/20/solid'

type AddMaintCardProps = {
    onFormSubmitted: () => void;
};

enum PeriodicityCalendar {
    D = 'D',
    W = 'W',
    M = 'M',
    Q = 'Q',
    S = 'S',
    A = 'A'
  }
  
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function AddMaintCard({ onFormSubmitted }: AddMaintCardProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [manHours, setManHours] = useState("");
    const [system, setSystem] = useState("");
    const [subsystem, setSubsystem] = useState("");
    const [equipment, setEquipment] = useState("");
    const [periodicityFrequency, setPeriodicityFrequency] = useState<number | null>(null);
    const [periodicityCode, setPeriodicityCode] = useState<number>(0);
    const [periodicity, setPeriodicity] = useState<PeriodicityCalendar>(() => PeriodicityCalendar.D); // Set the default value
    const [assigneeId, setAssigneeId] = useState("");
    const [organizationId, setOrganizationId] = useState("");

    const addMaintCardMutation = api.maintenanceCard.addMaintCard.useMutation();
       
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const result = await addMaintCardMutation.mutateAsync({
                Title: title,
                Description: description,
                manHours: manHours,
                System: system,
                Subsystem: subsystem,
                Equipment: equipment,
                periodicityFrequency: periodicityFrequency === null ? undefined : periodicityFrequency,
                periodicityCode: periodicityCode,
                Periodicity: periodicity,
                assigneeId: assigneeId,
            }); 
            onFormSubmitted();
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e).catch((error) => console.error("Error:", error));
    };
        
    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
            <form 
                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2" 
                onSubmit={onSubmit}
            >
                <div className="px-4 py-6 sm:p-8"> 
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-full">
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <div className="mt-2">
                                <input 
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                System
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={system}
                                    onChange={(e) => setSystem(e.target.value)}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Subsystem
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={subsystem}
                                    onChange={(e) => setSubsystem(e.target.value)}
                                    className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Man Hours
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    step={0.1}
                                    aria-invalid="true"
                                    defaultValue={1.5}
                                    value={manHours}
                                    placeholder="1.5"
                                    aria-describedby="man-hours-error"
                                    onChange={(e) => setManHours(e.target.value)}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Equipment
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={equipment}
                                    onChange={(e) => setEquipment(e.target.value)}
                                    className="block w-full pl-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Frequency
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    value={periodicityFrequency === null ? '' : periodicityFrequency}
                                    onChange={(e) => setPeriodicityFrequency(e.target.value ? parseInt(e.target.value) : null)}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Frequency Code
                            </label>
                            <div className="mt-2">
                                <input
                                    type="number"
                                    value={periodicityCode}
                                    onChange={(e) => setPeriodicityCode(parseInt(e.target.value))}
                                    className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2"> {/* This should be a dropdown*/}
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Periodicity
                            </label>
                            <div className="mt-2">
                                <select
                                    value={periodicity}
                                    onChange={(e) => setPeriodicity(e.target.value as PeriodicityCalendar)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    {Object.values(PeriodicityCalendar).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        </div>   
                    </div>

                  
                    <button
                        type="submit"
                        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Submit
                        
                    </button>

                </div>
            </form>
        </div>
    );
}
