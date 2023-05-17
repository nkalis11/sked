import { NextPage } from "next";
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useState } from "react";
import InviteMember from "~/components/Forms/InviteMember";


interface Organization {
    id: string;
    name: string;
    membersCount: number;
}

const Workcenter: NextPage = () => { 
    const { organizationList, setActive } = useOrganizationList();
    const { membershipList, membership } = useOrganization({
        membershipList: {},
    });

    const [selectedOrg, setSelectedOrg] = useState<{ organization: Organization } | null>(null);

    if (!organizationList) {
        return null;
    }
    const handleViewWorkcenterClick = (org: Organization) => {
        setActive({ organization: org.id })
        .then(() => setSelectedOrg({ organization: org }))
        .catch((error) => {
            // handle the error appropriately for your application
            console.error(error);
        });
    };

    const closeWorkcenterView = () => {
        setSelectedOrg(null);
    }


    return ( 
        <DashboardLayout>
            <div id="workcenter-list" className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1 gap-y-3">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Workcenters
                    </h2>
                    
                        <ul role="list" className="space-y-3">
                            {organizationList.map(({ organization }) => (
                                <li key={organization.id} className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
                                    <div className="flex gap-x-4">
                                        {organization.logoUrl && (
                                            <img 
                                                src={organization.logoUrl} 
                                                alt=" " 
                                                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                            />
                                        )}
                                        <div className="min-w-0 flex-auto">
                                            <p text-sm font-semibold leading-6 text-white>{organization.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <button 
                                            className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                            onClick={() => handleViewWorkcenterClick(organization)}>
                                            View Workcenter
                                        </button>
                                    </div>
                                
                                </li>
                            ))}
                        </ul>
                    
                </div>
          
            </div>
            <div id="workcenter-view">
                {selectedOrg &&  (
                    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:px-6">
                            <h2>{selectedOrg.organization.name}</h2>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div>
                                <h2>Workcenter Members</h2>
                                <ul>
                                {membershipList && membershipList.map((membership) => 
                                    <li key={membership.id}>
                                        {membership.publicUserData.firstName} {membership.publicUserData.lastName} &lt;
                                        {membership.publicUserData.identifier}&gt; :: {membership.role}
                                    </li>
                                )}
                                </ul>
                            </div>
                            <button className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100" onClick={closeWorkcenterView}>Close</button>
                        </div>
                        
                    </div>
                )}             
            </div>
            <div>
                <InviteMember />
            </div>
        </DashboardLayout>
    )
};
export default Workcenter;
