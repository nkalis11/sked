import React from "react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { api } from "~/utils/api";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

export default function MaintFeed() {
    const { data, error, isLoading } = api.maintenanceCard.getCompletedMaintenance.useQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">  
                {data?.map((item, index) => (
                <li key={index}>
                    <div className="relative pb-8">
                        {index !== data.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"/>
                        ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span>
                                        {item.completeOnTime 
                                            ? <CheckCircleIcon className="h-8 w-8 text-green-400" /> 
                                            : <ExclamationCircleIcon className="h-8 w-8 text-red-400" />
                                        }
                                    </span>                                    
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500"> 
                                            {item.Title} completed by <b>{item.completedBy}</b>
                                        </p>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time>
                                            {new Date(item.completionDate).toLocaleDateString()}
                                        </time>
                                    </div>
                                </div>
                            </div>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
}