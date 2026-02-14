// List of admin emails with access to admin panel
const ADMIN_EMAILS = [
  'purohitlokesh46@gmail.com',
  'vivekvyas72725@gmail.com',
  'kapilvyas2000@gmail.com',
  'tanwarsawaisingh@gmail.com'
];

export function isAdmin(email?: string): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}
