// localStorage helpers for the standalone post-payment demo.

export const DEMO_PAID_KEY = 'sugar_demo_paid';

export function isDemoPaid(): boolean {
  try {
    return localStorage.getItem(DEMO_PAID_KEY) === '1';
  } catch {
    return false;
  }
}

export function setDemoPaid(paid: boolean): void {
  try {
    if (paid) localStorage.setItem(DEMO_PAID_KEY, '1');
    else localStorage.removeItem(DEMO_PAID_KEY);
  } catch {}
}

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function resetDemo(): void {
  try {
    localStorage.removeItem(DEMO_PAID_KEY);
    localStorage.removeItem('sugar_demo_flow');
    sessionStorage.clear();
  } catch {}
}
