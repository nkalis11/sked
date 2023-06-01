import { api } from "~/utils/api";
import { useState } from "react";


interface DeleteCardButtonProps {
    cardId: string;
    onSuccess: () => void;
    }


    export default function DeleteCardButton({ cardId, onSuccess }: DeleteCardButtonProps) {
        const removeMaintCard = api.maintenanceCard.removeMaintCard.useMutation();
        const [isDeleted, setIsDeleted] = useState(false);
      
        const handleClick = async (id: string) => {
          await removeMaintCard.mutateAsync({id});
          setIsDeleted(true);
          onSuccess();
        }

        if (isDeleted) {
            return null;
        }

        return (
            <button 
            onClick={async () => {
                await handleClick(cardId);
            }}
                className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Delete
            </button>
        );
      }
