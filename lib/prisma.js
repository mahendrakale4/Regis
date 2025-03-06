// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Ensure graceful shutdown of the Prisma Client
if (process.env.NODE_ENV !== 'production') {
    global.prisma = global.prisma || prisma; // Avoid creating new Prisma Client instances during hot reloads in development
}

export default prisma;
