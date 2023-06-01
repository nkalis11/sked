import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const maintenanceCard1 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 1",
      Description: "Description 1",
      manHours: 1.5,
      System: "System 1",
      Subsystem: "Subsystem 1",
      Equipment: "Equipment 1",
      periodicityFrequency: 10,
      periodicityCode: 1,
      Periodicity: "D",  // Use one of the enum values here
      dueDate: new Date("2023-06-01"),
      // Add other fields as needed
    },
  });
  const maintenanceCard2 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 2",
      Description: "Description 2",
      manHours: 2.5,
      System: "System 2",
      Subsystem: "Subsystem 2",
      Equipment: "Equipment 2",
      periodicityFrequency: 20,
      periodicityCode: 2,
      Periodicity: "W",  
      dueDate: new Date("2023-06-02"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard3 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 3",
      Description: "Description 3",
      manHours: 3.5,
      System: "System 3",
      Subsystem: "Subsystem 3",
      Equipment: "Equipment 3",
      periodicityFrequency: 30,
      periodicityCode: 3,
      Periodicity: "M",  
      dueDate: new Date("2023-06-04"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard4 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 4",
      Description: "Description 4",
      manHours: 4.5,
      System: "System 4",
      Subsystem: "Subsystem 4",
      Equipment: "Equipment 4",
      periodicityFrequency: 40,
      periodicityCode: 4,
      Periodicity: "Q",  
      dueDate: new Date("2023-06-06"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard5 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 5",
      Description: "Description 5",
      manHours: 5.5,
      System: "System 5",
      Subsystem: "Subsystem 5",
      Equipment: "Equipment 5",
      periodicityFrequency: 50,
      periodicityCode: 5,
      Periodicity: "S",  
      dueDate: new Date("2023-06-07"),
      // Add other fields as needed
    },
  });
  const maintenanceCard6 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 6",
      Description: "Description 6",
      manHours: 6.0,
      System: "System 6",
      Subsystem: "Subsystem 6",
      Equipment: "Equipment 6",
      periodicityFrequency: 60,
      periodicityCode: 6,
      Periodicity: "A",  
      dueDate: new Date("2023-06-08"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard7 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 7",
      Description: "Description 7",
      manHours: 7.0,
      System: "System 7",
      Subsystem: "Subsystem 7",
      Equipment: "Equipment 7",
      periodicityFrequency: 70,
      periodicityCode: 7,
      Periodicity: "D",  
      dueDate: new Date("2023-06-11"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard8 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 8",
      Description: "Description 8",
      manHours: 8.0,
      System: "System 8",
      Subsystem: "Subsystem 8",
      Equipment: "Equipment 8",
      periodicityFrequency: 80,
      periodicityCode: 8,
      Periodicity: "W",  
      dueDate: new Date("2023-06-14"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard9 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 9",
      Description: "Description 9",
      manHours: 9.0,
      System: "System 9",
      Subsystem: "Subsystem 9",
      Equipment: "Equipment 9",
      periodicityFrequency: 90,
      periodicityCode: 9,
      Periodicity: "M",  
      dueDate: new Date("2023-06-17"),
      // Add other fields as needed
    },
  });
  
  const maintenanceCard10 = await prisma.maintenanceCard.create({
    data: {
      Title: "Title 10",
      Description: "Description 10",
      manHours: 10.0,
      System: "System 10",
      Subsystem: "Subsystem 10",
      Equipment: "Equipment 10",
      periodicityFrequency: 100,
      periodicityCode: 10,
      Periodicity: "Q",  
      dueDate: new Date("2023-06-21"),
      // Add other fields as needed
    },
  });
    
  
  
  // Output the created records to the console:
  console.log({ maintenanceCard1, maintenanceCard2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
