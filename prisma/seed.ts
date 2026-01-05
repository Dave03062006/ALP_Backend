import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Start seeding...');

  // Create a default test profile
  console.log('Creating default profile...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const defaultProfile = await prisma.profile.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      displayName: 'Test User',
      points: 0,
      totalSpent: 0,
      achievementCount: 0
    }
  });

  console.log(`✅ Default profile created: ${defaultProfile.username} (ID: ${defaultProfile.id})`);

  // Create transaction types
  console.log('Creating transaction types...');
  const transactionTypes = [
    { typeName: 'Single Purchase', pointsMultiplier: 1.0 },
    { typeName: 'Bundle', pointsMultiplier: 1.5 },
    { typeName: 'Discount', pointsMultiplier: 0.8 }
  ];

  for (const type of transactionTypes) {
    const created = await prisma.transactionType.upsert({
      where: { typeName: type.typeName },
      update: { pointsMultiplier: type.pointsMultiplier },
      create: type
    });
    console.log(`✅ Transaction type: ${created.typeName}`);
  }

  console.log('Start seeding games and currency rates...');
 
  const gamesData = [
    {
      name: 'Valorant',
      iconUrl: 'https://img.icons8.com/color/48/valorant.png',
      currencyName: 'VP',
      toIDR: 150.0, 
    },
    { 
      name: 'Genshin Impact',
      iconUrl: 'https://img.icons8.com/color/48/genshin-impact.png',
      currencyName: 'Genesis Crystals',
      toIDR: 250.0, 
    },
    {
      name: 'Mobile Legends',
      iconUrl: 'https://img.icons8.com/color/48/mobile-legends.png',
      currencyName: 'Diamonds',
      toIDR: 300.0, 
    },
    {
      name: 'Roblox',
      iconUrl: 'https://img.icons8.com/color/48/roblox.png',
      currencyName: 'Robux',
      toIDR: 180.0, 
    },
    {
      name: 'PUBG Mobile',
      iconUrl: 'https://img.icons8.com/color/48/pubg.png',
      currencyName: 'UC',
      toIDR: 200.0, 
    },
    {
      name: 'Free Fire',
      iconUrl: 'https://img.icons8.com/color/48/garena.png',
      currencyName: 'Diamonds',
      toIDR: 150.0, 
    },
    {
      name: 'Honkai: Star Rail',
      iconUrl: 'https://img.icons8.com/color/48/honkai-star-rail.png',
      currencyName: 'Oneiric Shards',
      toIDR: 250.0, 
    }
  ];

  for (const game of gamesData) {
    
    const createdGame = await prisma.game.upsert({
      where: { name: game.name },
      update: {
        iconUrl: game.iconUrl,
        isActive: true
      },
      create: {
        name: game.name,
        iconUrl: game.iconUrl,
        isActive: true
      },
    });

    console.log(`✅ Game processed: ${createdGame.name} (ID: ${createdGame.id})`);

    
    const createdRate = await prisma.currencyRate.upsert({
      where: {
        gameId_currencyName: {
          gameId: createdGame.id,
          currencyName: game.currencyName,
        },
      },
      update: {
        toIDR: game.toIDR,
        isActive: true
      },
      create: {
        gameId: createdGame.id,
        currencyName: game.currencyName,
        toIDR: game.toIDR,
        isActive: true
      },
    });

    console.log(`   💰 Rate set: 1 ${createdRate.currencyName} = Rp ${createdRate.toIDR}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });