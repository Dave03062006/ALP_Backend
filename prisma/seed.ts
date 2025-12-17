import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding games and currency rates...');

  // Data Game dan Rate Mata Uang (Estimasi dalam Rupiah)
  const gamesData = [
    {
      name: 'Valorant',
      iconUrl: 'https://img.icons8.com/color/48/valorant.png',
      currencyName: 'VP',
      toIDR: 150.0, // Estimasi: 1 VP sekitar Rp 150 (bervariasi tergantung bundle)
    },
    {
      name: 'Genshin Impact',
      iconUrl: 'https://img.icons8.com/color/48/genshin-impact.png',
      currencyName: 'Genesis Crystals',
      toIDR: 250.0, // Estimasi: 1 Genesis Crystal sekitar Rp 250
    },
    {
      name: 'Mobile Legends',
      iconUrl: 'https://img.icons8.com/color/48/mobile-legends.png',
      currencyName: 'Diamonds',
      toIDR: 300.0, // Estimasi: 1 Diamond sekitar Rp 300
    },
    {
      name: 'Roblox',
      iconUrl: 'https://img.icons8.com/color/48/roblox.png',
      currencyName: 'Robux',
      toIDR: 180.0, // Estimasi: 1 Robux sekitar Rp 180
    },
    {
      name: 'PUBG Mobile',
      iconUrl: 'https://img.icons8.com/color/48/pubg.png',
      currencyName: 'UC',
      toIDR: 200.0, // Estimasi: 1 UC sekitar Rp 200
    },
    {
      name: 'Free Fire',
      iconUrl: 'https://img.icons8.com/color/48/garena.png',
      currencyName: 'Diamonds',
      toIDR: 150.0, // Estimasi: 1 Diamond sekitar Rp 150
    },
    {
      name: 'Honkai: Star Rail',
      iconUrl: 'https://img.icons8.com/color/48/honkai-star-rail.png',
      currencyName: 'Oneiric Shards',
      toIDR: 250.0, // Mirip Genshin
    }
  ];

  for (const game of gamesData) {
    // 1. Create atau Update Game
    // Menggunakan upsert agar tidak duplicate error jika dijalankan ulang
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

    // 2. Create atau Update Currency Rate untuk Game tersebut
    // Menggunakan composite unique key [gameId, currencyName] sesuai schema kamu
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