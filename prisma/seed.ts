import { PrismaClient, GameCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('Starting database seed...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.review.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data.');

    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
      }
    });
    console.log(`Created user: ${user.email} (ID: ${user.id})`);

    const dataPath = path.join(__dirname, 'games.json');
    const gamesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Found ${gamesData.length} games in JSON file.`)
    for (const gameData of gamesData) {
      const randomRating = Math.random() > 0.5 ? 5 : 4;
      await prisma.game.create({
        data: {
          ...gameData,
          reviews: {
            create: [
              {
                text: "Seeded review: Great game!",
                rating: randomRating,
                userId: user.id
              }
            ]
          }
        }
      });
    }
  console.log('✅ Seeding finished.');
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    })