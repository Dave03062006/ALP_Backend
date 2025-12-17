import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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