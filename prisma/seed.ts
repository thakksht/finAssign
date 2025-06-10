import { PrismaClient } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const user = await prisma.user.upsert({
    where: { id: 'user123' },
    update: {},
    create: {
      id: 'user123',
      email: 'user@example.com',
      name: 'Test User',
    },
  });

  console.log(`Created user: ${user.name}`);
  
  // Delete existing transactions to start fresh
  try {
    await prisma.transaction.deleteMany({
      where: { userId: 'user123' },
    });
  } catch (error) {
    console.log('No transactions to delete');
  }
  
  // Delete existing categories to start fresh
  try {
    await prisma.category.deleteMany({
      where: { userId: 'user123' },
    });
  } catch (error) {
    console.log('No categories to delete');
  }
  
  // Create default categories
  const expenseCategories = [
    { name: 'Food', color: '#10B981' }, // Green
    { name: 'Rent', color: '#6366F1' }, // Indigo
    { name: 'Utilities', color: '#F59E0B' }, // Amber
    { name: 'Transportation', color: '#3B82F6' }, // Blue
    { name: 'Entertainment', color: '#EC4899' }, // Pink
    { name: 'Healthcare', color: '#EF4444' }, // Red
    { name: 'Shopping', color: '#8B5CF6' }, // Purple
    { name: 'Travel', color: '#0EA5E9' }, // Sky
    { name: 'Education', color: '#14B8A6' }, // Teal
    { name: 'Other Expenses', color: '#71717A' }, // Gray
  ];
  
  const incomeCategories = [
    { name: 'Salary', color: '#10B981' }, // Green
    { name: 'Freelance', color: '#6366F1' }, // Indigo
    { name: 'Gifts', color: '#F59E0B' }, // Amber
    { name: 'Investments', color: '#3B82F6' }, // Blue
    { name: 'Refunds', color: '#EC4899' }, // Pink
    { name: 'Other Income', color: '#71717A' }, // Gray
  ];
  
  // Create all categories and store them by name
  const categoryMap: Record<string, { id: string, name: string }> = {};
  
  // Create expense categories
  for (const cat of expenseCategories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        color: cat.color,
        userId: user.id,
      },
    });
    categoryMap[cat.name] = category;
  }
  
  // Create income categories
  for (const cat of incomeCategories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        color: cat.color,
        userId: user.id,
      },
    });
    categoryMap[cat.name] = category;
  }

  console.log(`Created ${Object.keys(categoryMap).length} categories`);
  
  // Create sample transactions
  const currentDate = new Date();
  const transactions = [];

  // Generate transactions for the last 6 months
  for (let i = 0; i < 50; i++) {
    // Create random date within last 6 months
    const randomDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 28) + 1
    );

    // Randomly determine if it's an expense or income
    const isExpense = Math.random() > 0.3; // 70% chance of being an expense
    
    const categoryOptions = isExpense
      ? expenseCategories.map(c => c.name)
      : incomeCategories.map(c => c.name);
    
    const categoryName = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
    
    // Generate amount (expenses are negative)
    let amount;
    if (isExpense) {
      amount = -(Math.random() * 200 + 10);
    } else {
      amount = Math.random() * 1000 + 500;
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount.toFixed(2)),
        description: `${categoryName} - ${isExpense ? faker.commerce.product() : faker.company.name()}`,
        date: randomDate,
        userId: user.id,
        categoryId: categoryMap[categoryName].id
      },
    });

    transactions.push(transaction);
  }

  console.log(`Created ${transactions.length} sample transactions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

