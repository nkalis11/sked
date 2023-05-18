import { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        externalUsername: user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username || null
    };
}