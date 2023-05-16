import { NextPage } from "next";
import DashboardLayout from "~/components/Layouts/DashboardLayout";
import { useOrganizationList } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { OrganizationMembership } from "@clerk/nextjs/server";
import InviteMember from "~/components/Forms/InviteMember";

interface Organization {
    id: string;
    name: string;
    membersCount: number;
}

const Workcenter: NextPage = () => { 
    const { organizationList } = useOrganizationList();
    const [selectedOrg, setSelectedOrg] = useState<{ organization: Organization } | null>(null);


    if (!organizationList) {
        return null;
    }
    const handleViewWorkcenterClick = (org: Organization) => {
        setSelectedOrg({ organization: org});
    }
    const closeWorkcenterView = () => {
        setSelectedOrg(null);
    }


    return ( 
        <DashboardLayout>
            <div id="workcenter-list" className="md:flex md:items-center md:justify-between bg-slate-400">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Workcenter
                    </h2>
                    <ul>
                        {organizationList.map(({ organization }) => (
                            <li key={organization.id}>
                                {organization.name}
                                <button onClick={() => handleViewWorkcenterClick(organization)}>
                                    View Workcenter
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                    Edit
                    </button>
                    <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Publish
                    </button>
                </div>
            </div>
            <div id="workcenter-view">
                {selectedOrg && (
                    <div>
                        <h2>{selectedOrg.organization.name}</h2>
                        <p>{selectedOrg.organization.membersCount}</p>
                        <button onClick={closeWorkcenterView}>Close</button>
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
