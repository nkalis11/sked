import { PrismaClient } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function Schedule( ) {
    const cardsQuery = api.maintenanceCard.getAll.useQuery();
    const clerksQuery = api.maintenanceCard.getAllClerks.useQuery();

    const maintenanceCards = cardsQuery.data || [];
    const clerks = clerksQuery.data || [];

    const handleAssignClerk = (maintenanceCardId: string, clerkId: string) => {
      // Handle assigning the clerk to the maintenance card
      // You can call an API endpoint or perform any necessary logic here
      console.log("Assigning clerk", clerkId, "to maintenance card", maintenanceCardId);
    };
    

    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                      Periodicity
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      System
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Equipment
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {maintenanceCards.map((card) => (
                    <tr key={card.id} className="even:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {card.Description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.System}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Subsystem}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{card.Equipment}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover
                              .bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              id={`assign-clerk-${card.id}-button`}
                              aria-expanded="false"
                              aria-haspopup="true"
                            >
                              Assign Clerk
                              <svg
                                className="-mr-1 ml-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 9.707a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          {/* Dropdown content */}
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby={`assign-clerk-${card.id}-button`}
                            style={{ display: "none" }}
                          >
                            <div className="py-1" role="none">
                              {clerks.map((clerk) => (
                                <button
                                  key={clerk.id}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  role="menuitem"
                                  onClick={() => handleAssignClerk(card.id, clerk.id)}
                                >
                                  {clerk.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }



    
