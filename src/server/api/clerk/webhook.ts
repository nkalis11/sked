
import { getAuth } from "@clerk/nextjs/server"
import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

type WebhookEvent = {
    type: string;
    data: {
        id: string;
        emailAddress: string;
        firstName: string;
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const event: WebhookEvent = req.body;

    if (event.type === 'user.created') {
        const { id, emailAddress, firstName } = event.data;

        await prisma.user.create({
            data: {
                clerkId: id,
                email: emailAddress,
                name: firstName,
            },
        });
    }

    return res.status(200).json({ recieved: true });
}