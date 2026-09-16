// State for the post-payment demo flow, persisted in localStorage.
import { readJson, writeJson } from './demoStore';

export type EmailProvider = 'gmail' | 'microsoft' | 'icloud' | 'other';
export type SignInMethod = 'email' | 'bank' | 'account_manager';
export type ContactMethod = 'email' | 'text' | 'call';

export type FlowState = {
  email: string;
  signInMethod?: SignInMethod;
  contactMethod?: ContactMethod;
  phone?: string;
  savingsLow?: number;
  savingsHigh?: number;
};

// 15 min call bookings go through Calendly.
export const CALENDLY_CALL_URL = 'https://calendly.com/concierge-sugarwallet/15min';

export const FLOW_STATE_KEY = 'sugar_demo_flow';

const GMAIL_DOMAINS = ['gmail.com', 'googlemail.com'];
const MICROSOFT_DOMAINS = ['outlook.com', 'outlook.co.nz', 'hotmail.com', 'hotmail.co.nz', 'live.com', 'msn.com'];
const ICLOUD_DOMAINS = ['icloud.com', 'me.com', 'mac.com'];

export function detectProvider(email: string): EmailProvider {
  const domain = email.trim().toLowerCase().split('@')[1] || '';
  if (GMAIL_DOMAINS.includes(domain)) return 'gmail';
  if (MICROSOFT_DOMAINS.includes(domain)) return 'microsoft';
  if (ICLOUD_DOMAINS.includes(domain)) return 'icloud';
  return 'other';
}

export function providerDisplayName(provider: EmailProvider): string {
  if (provider === 'gmail') return 'Gmail';
  if (provider === 'microsoft') return 'Outlook';
  if (provider === 'icloud') return 'iCloud';
  return 'your email';
}

export function getFlowState(): FlowState {
  return readJson<FlowState>(FLOW_STATE_KEY) || { email: '' };
}

export function updateFlowState(patch: Partial<FlowState>): FlowState {
  const next = { ...getFlowState(), ...patch };
  writeJson(FLOW_STATE_KEY, next);
  return next;
}

export function signInMethodLabel(method: SignInMethod | undefined): string {
  if (method === 'email') return 'Email';
  if (method === 'bank') return 'your bank';
  if (method === 'account_manager') return 'your account manager';
  return 'Email';
}

// Average monthly savings per customer, from the main repo's savings maths
// ("anchored to real Sugar customer benchmarks"):
// utilities $78.63/mo, insurance $117.02/mo, debt $189.15/mo.
export const AVG_MONTHLY_SAVINGS = {
  utilities: 78.63,
  insurance: 117.02,
  debt: 189.15
};

// Annualized range shown after the scan. Same shape as the real projection
// maths (a ~16% band around the point estimate), but discounted 30% so we
// under-promise, and hard-capped so the top of the range never crosses $4,000.
// $384.80/mo benchmark -> discounted $269.36/mo -> $2,800 to $3,700 a year.
const CONSERVATIVE_DISCOUNT = 0.7;
const RANGE_HIGH_CAP = 4000;

export function computeScanRange(): { low: number; high: number } {
  const monthly =
    (AVG_MONTHLY_SAVINGS.utilities + AVG_MONTHLY_SAVINGS.insurance + AVG_MONTHLY_SAVINGS.debt) *
    CONSERVATIVE_DISCOUNT;
  const offset = Math.round((monthly * 0.16) / 10) * 10;
  const low = Math.round(((monthly - offset) * 12) / 100) * 100;
  const high = Math.min(
    RANGE_HIGH_CAP,
    Math.round(((monthly + offset) * 12) / 100) * 100
  );
  return { low, high };
}

export function savingsMidpoint(low: number, high: number): number {
  return Math.round((low + high) / 2 / 100) * 100;
}

export function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-NZ')}`;
}
