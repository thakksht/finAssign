const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔄 Setting up database...');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️ No .env file found. Creating one with default database connection...');
  
  const defaultEnv = `
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financedb?schema=public"
`;
  
  fs.writeFileSync(envPath, defaultEnv.trim());
  console.log('✅ Created .env file with default database connection');
}

// Run Prisma generate
console.log('🔄 Running prisma generate...');
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running prisma generate:', error);
    return;
  }
  
  console.log(stdout);
  console.log('✅ Prisma client generated successfully');
  
  // Check if database needs migration
  console.log('🔄 Checking database status...');
  exec('npx prisma migrate status', (error, stdout, stderr) => {
    if (error) {
      console.log('⚠️ Database might need migration');
      console.log('Run the following commands to set up your database:');
      console.log('npx prisma migrate dev --name init');
      return;
    }
    
    console.log(stdout);
    console.log('✅ Database setup complete!');
  });
});
