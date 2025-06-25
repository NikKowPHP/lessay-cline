// ROO-AUDIT-TAG :: plan-011-non-functional.md :: Implement security utilities
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function logSecurityEvent({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: object;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}