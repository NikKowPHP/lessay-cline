import { NextResponse } from 'next/server';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// Login attempt tracking
const loginAttempts = new Map<string, { attempts: number, lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): NextResponse | null {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (entry) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitStore.set(ip, { count: 1, lastReset: now });
    } else {
      if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
      rateLimitStore.set(ip, { count: entry.count + 1, lastReset: entry.lastReset });
    }
  } else {
    rateLimitStore.set(ip, { count: 1, lastReset: now });
  }
  return null;
}

export function checkPasswordStrength(password: string): { valid: boolean, message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

export function trackLoginAttempt(ip: string): { allowed: boolean, message?: string } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry) {
    if (now - entry.lastAttempt > LOGIN_ATTEMPT_WINDOW) {
      loginAttempts.set(ip, { attempts: 1, lastAttempt: now });
    } else {
      if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
        return { allowed: false, message: 'Too many login attempts. Try again later.' };
      }
      loginAttempts.set(ip, { attempts: entry.attempts + 1, lastAttempt: now });
    }
  } else {
    loginAttempts.set(ip, { attempts: 1, lastAttempt: now });
  }
  return { allowed: true };
}