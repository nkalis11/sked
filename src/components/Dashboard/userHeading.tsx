import { api } from "~/utils/api";
import React from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import { Card } from "@tremor/react";

export default function UserHeading() {
    const user = useUser();

    return (
        <Card>
            <div className="md:flex md:items-center md:justify-between md:space-x-5">
                <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'h-16 w-16 rounded-full'
                                    }
                                }}
                            />
                            <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="pt-1.5">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.user?.fullName}!</h1>
                        <p className="text-sm font-medium text-gray-500">{user.user?.primaryEmailAddress ? user.user.primaryEmailAddress.toString() : "No email address found"}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                    <p
                    className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Advance to offer
                    </button>
                </div>
            </div>
        </Card>
    )
}