import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { MaintenanceCard } from "@prisma/client"
import { api } from "~/utils/api";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type MarkCompleteModalProps = {
    card: MaintenanceCard;
    onClose: () => void;
    open: boolean;
};

export default function MarkCompleteModal({ card, onClose, open }: MarkCompleteModalProps) {
    const completeMaintCard = api.maintenanceCard.completedMaintCard.useMutation();
    const [notes, setNotes] = useState(''); // TODO: Add a text area for notes

    const handleMarkComplete = async (cardId: string) => {
        try {
            const result = await completeMaintCard.mutateAsync({ cardId, checkNotes: notes });
            console.log('Maintenance card marked as complete:', result);
            closeModal();
            location.reload();
        }   catch (error) {
            console.error('Failed to mark maintenance card as complete:', error);
        }
    }
    const closeModal = () => {
        onClose(); // Call the onClose function passed from the parent component
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div className="mt-3 text-left sm:mt-5">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                            {card.Title}
                                        </Dialog.Title>
                                    </div>
                                    <div className="mt-2">
                                        <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                                            Enter any notes
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                rows={4}
                                                name="notes"
                                                id="checkNotes"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => { void handleMarkComplete(card.id); }}
                                            type="button"
                                            className="hidden sm:inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                                        >
                                            <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                            Mark Complete
                                        </button>
                                    </div> 
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
