import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateDueDate(cardId: string): Promise<void> {
    const card = await prisma.maintenanceCard.findUnique({
        where: { id: cardId },
    });
    if (!card) throw new Error("Card not found");

    const { periodicityFrequency, periodicityCode } = card;

    if (!periodicityFrequency || !periodicityCode) {
        throw new Error("Card not found");
    }
    const dueDate = new Date(card.dueDate || Date.now());
    dueDate.setFullYear(dueDate.getFullYear() + periodicityFrequency);

    switch (periodicityCode) {
        case 1: // Year
        dueDate.setMonth(0);
        dueDate.setDate(1);
        break;
        case 2: // Quarter
        dueDate.setMonth(Math.floor(dueDate.getMonth() / 3) * 3);
        dueDate.setDate(1);
        break;
        case 3: // Month
        dueDate.setDate(1);
        break;
        case 4: // Week
        dueDate.setDate(dueDate.getDate() - dueDate.getDay() + 7);
        break;
        case 5: // Day
        dueDate.setDate(dueDate.getDate() + 1);
        break;
        default:
        throw new Error("Invalid periodicity code");
}
await prisma.maintenanceCard.update({
    where: { id: cardId },
    data: { dueDate },
});
}