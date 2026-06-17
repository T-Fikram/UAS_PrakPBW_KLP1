const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { calculateHealthScore } = require('../src/utils/healthScore');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing records
  await prisma.healthRecord.deleteMany({});
  await prisma.user.deleteMany({});

  // Create test user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const user = await prisma.user.create({
    data: {
      name: 'Rian Wijaya',
      email: 'user@healthmirror.com',
      password: hashedPassword,
    },
  });

  console.log(`👤 Created user: ${user.name} (${user.email})`);

  // Generate 15 days of health records
  const recordsData = [];
  const today = new Date();

  // Habits over 15 days with slight changes
  const habits = [
    { sleep: 8.0, water: 8, exercise: 30, screen: 3.5 }, // Day 0 (today) - Excellent (100)
    { sleep: 7.5, water: 9, exercise: 45, screen: 4.0 }, // Day 1 - Excellent (100)
    { sleep: 6.5, water: 6, exercise: 20, screen: 6.0 }, // Day 2 - Good (60)
    { sleep: 5.5, water: 4, exercise: 0, screen: 9.0 },  // Day 3 - Needs Improvement (20)
    { sleep: 8.5, water: 8, exercise: 30, screen: 3.0 }, // Day 4 - Excellent (100)
    { sleep: 9.5, water: 7, exercise: 15, screen: 5.0 }, // Day 5 - Good (60)
    { sleep: 7.0, water: 8, exercise: 40, screen: 4.5 }, // Day 6 - Good (90) / Excellent
    { sleep: 6.0, water: 5, exercise: 10, screen: 7.5 }, // Day 7 - Fair (50)
    { sleep: 8.0, water: 9, exercise: 60, screen: 2.5 }, // Day 8 - Excellent (100)
    { sleep: 7.0, water: 8, exercise: 0, screen: 5.0 },  // Day 9 - Good (70)
    { sleep: 5.0, water: 3, exercise: 0, screen: 10.5 }, // Day 10 - Needs Improvement (20)
    { sleep: 8.0, water: 8, exercise: 35, screen: 3.0 }, // Day 11 - Excellent (100)
    { sleep: 7.5, water: 7, exercise: 20, screen: 4.0 }, // Day 12 - Good (80) / Excellent
    { sleep: 6.5, water: 8, exercise: 45, screen: 5.5 }, // Day 13 - Good (80) / Excellent
    { sleep: 8.0, water: 9, exercise: 0, screen: 3.5 },  // Day 14 - Good (80) / Excellent
  ];

  for (let i = 0; i < habits.length; i++) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - i);
    recordDate.setHours(0, 0, 0, 0);

    const habit = habits[i];
    const healthScore = calculateHealthScore({
      sleepHours: habit.sleep,
      waterGlasses: habit.water,
      exerciseMinutes: habit.exercise,
      screenTimeHours: habit.screen,
    });

    recordsData.push({
      userId: user.id,
      date: recordDate,
      sleepHours: habit.sleep,
      waterGlasses: habit.water,
      exerciseMinutes: habit.exercise,
      screenTimeHours: habit.screen,
      healthScore,
    });
  }

  await prisma.healthRecord.createMany({
    data: recordsData,
  });

  console.log(`📊 Seeded ${recordsData.length} health records.`);
  console.log('🚀 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
