import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export async function createSession(): Promise<string> {
  const token = Buffer.from(
    JSON.stringify({ exp: Date.now() + 24 * 60 * 60 * 1000, auth: true })
  ).toString('base64');
  return token;
}

export function isValidSession(token: string): boolean {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString());
    return data.auth === true && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (!isValidSession(token)) return null;
  return { authenticated: true };
}

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return isValidSession(token);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
