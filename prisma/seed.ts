import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Seed TransactionTypes
    const transactionTypes = [
        { typeName: 'Single', pointsMultiplier: 1.0 },
        { typeName: 'Bundle', pointsMultiplier: 1.5 },
        { typeName: 'Discount', pointsMultiplier: 2.0 },
    ];

    for (const type of transactionTypes) {
        await prisma.transactionType.upsert({
            where: { typeName: type.typeName },
            update: {},
            create: type,
        });
    }

    console.log('TransactionTypes seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
