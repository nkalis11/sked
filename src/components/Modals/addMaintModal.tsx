import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import AddMaintCard from "../Forms/addMaintCard";

type AddMaintModalProps = {
    onFormSubmitted: () => void;
};

export default function AddMaintModal({ onFormSubmitted }: AddMaintModalProps) {
    const [isOpen, setIsOpen] = useState(true);

    const close = () => setIsOpen(false); 

    return (
        <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onFormSubmitted}>
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
            <div className="flex min-h-full justify-center p-4 text-center sm:items-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel>
                    <div>
                    <AddMaintCard 
                      onFormSubmitted={close}/>
                    </div>
                </Dialog.Panel>
                </Transition.Child>
            </div>
            </div>
        </Dialog>
        </Transition.Root>
    );
}
            