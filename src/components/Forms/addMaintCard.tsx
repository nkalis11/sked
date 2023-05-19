import { useState, Fragment } from "react";
import React from "react";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { api } from "~/utils/api";
import { Prisma, PrismaClient } from "@prisma/client";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

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
    const [periodicityFrequency, setPeriodicityFrequency] = useState<number>(0);
    const [periodicityCode, setPeriodicityCode] = useState<number>(0);
    const [periodicity, setPeriodicity] = useState<PeriodicityCalendar>(() => PeriodicityCalendar.D); // Set the default value
    const [assigneeId, setAssigneeId] = useState("");

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
                periodicityFrequency: periodicityFrequency,
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
        <div className="bg-blue-50">
            <div className="mx-auto max-w-2xl px-4 pb-8 pt-8 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Add Maintenance Card</h2>
                <form 
                    className="lg:grid lg:grid-cols-1 lg:gap-x-12 xl:gap-x-16" 
                    onSubmit={onSubmit}
                >
                    <div className=""> 
                        <div className="">
                            <h2 className="text-lg font-medium text-gray-900">Detailed Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                                <div> 
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <div className="mt-1">
                                        <input 
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Man Hours
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            step={0.1}
                                            aria-invalid="true"
                                            defaultValue={1.5}
                                            value={manHours}
                                            placeholder="1.5"
                                            aria-describedby="man-hours-error"
                                            onChange={(e) => setManHours(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                        
                                    </div>
                                 
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        System
                                    </label>
                                    <div className="mt-1">
                                        <input
                                             type="text"
                                             value={system}
                                             onChange={(e) => setSystem(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Subsystem
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={subsystem}
                                            onChange={(e) => setSubsystem(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Equipment
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={equipment}
                                            onChange={(e) => setEquipment(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Frequency
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            value={periodicityFrequency}
                                            onChange={(e) => setPeriodicityFrequency(parseInt(e.target.value))}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Frequency Code
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            value={periodicityCode}
                                            onChange={(e) => setPeriodicityCode(parseInt(e.target.value))}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div> {/* This should be a dropdown*/}
                                    <label className="block text-sm font-medium text-gray-700">
                                        Periodicity
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            value={periodicity}
                                            onChange={(e) => setPeriodicity(e.target.value as PeriodicityCalendar)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        </div>
                        <div>
                            <button>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
