
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Type guard for Prisma errors
export function isPrismaError(error: any): error is { code: string } {
    return error !== null && typeof error === 'object' && 'code' in error;
  }
  