/**
 * Single source of truth for authorized vendor admin email.
 * Change this constant whenever the designated administrator email changes.
 */
export const ADMIN_EMAIL = 'pradhiip92@gmail.com';

/**
 * Checks if the given email matches the designated administrator email.
 * If emailVerified is passed, also enforces that the email is verified.
 */
export function isUserAdmin(email?: string | null, emailVerified?: boolean): boolean {
  if (!email) return false;
  if (emailVerified !== undefined && !emailVerified) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}

