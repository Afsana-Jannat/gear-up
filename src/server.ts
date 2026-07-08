import 'dotenv/config';

import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

const PORT = Number(config.port) || 5000;

async function main() {
  try {
    await prisma.$connect();

    console.log('Database Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

main();
