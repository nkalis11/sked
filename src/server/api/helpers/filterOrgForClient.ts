import type { Organization } from "@clerk/clerk-sdk-node";

export const filterOrgForClient = (organization: Organization) => {
    return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
    };
}