const RETENTION_HOURS = 2;
export const RETENTION_MS = RETENTION_HOURS * 60 * 60 * 1000;

export function computeExpiry(createdAtIso: string): string {
  return new Date(new Date(createdAtIso).getTime() + RETENTION_MS).toISOString();
}

export function isExpired(createdAtIso: string): boolean {
  const createdMs = new Date(createdAtIso).getTime();
  return !Number.isFinite(createdMs) || createdMs + RETENTION_MS < Date.now();
}
