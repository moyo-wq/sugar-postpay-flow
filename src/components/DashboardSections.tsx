// Sections ported from the real concierge dashboard (sugar-concierge
// origin/main, v1.39.16): "Want us to move faster?", the utility bill upload
// form, the connect-email card + provider modal, the referral card and the
// membership card. Markup and classes are kept faithful; every backend call
// is replaced with local demo behavior.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateFlowState } from '../lib/flowState';

// ── Icons (copied from routes.tsx) ───────────────────────────────────────────

const BoltBillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" />
    <path d="M10 7h4M8 10h8M8 13h6" stroke="#fff" strokeWidth="1.6" />
    <path d="M13 6l-2 5h3l-2 5" fill="#fff" />
  </svg>
);

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="6" y="3" width="12" height="18" rx="2" fill="currentColor" />
    <rect x="9" y="2" width="6" height="3" rx="1" fill="#fff" />
    <path d="M9 9h6M9 12h6M9 15h4" stroke="#fff" strokeWidth="1.6" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2 8 6 8-6"
    />
  </svg>
);

const ReferralGiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M20 7h-2.18A3 3 0 0 0 12 4a3 3 0 0 0-5.82 3H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-6-2a1 1 0 1 1 0 2h-1V6a1 1 0 0 1 1-1ZM9 5a1 1 0 0 1 1 1v1H9a1 1 0 0 1 0-2Zm2 14H6v-6h5v6Zm0-8H5V9h6v2Zm7 8h-5v-6h5v6Zm1-8h-6V9h6v2Z"
    />
  </svg>
);

const ReferralCopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const ReferralCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m5 13 4 4L19 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── WhyNeeded (ported from components/WhyNeeded.tsx, analytics stripped) ─────

const WhyNeeded = ({
  id,
  reason,
  safety,
  label = 'Why is this needed?'
}: {
  id: string;
  reason: React.ReactNode;
  safety: React.ReactNode;
  label?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const panelId = `why-needed-${id}`;

  return (
    <div className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-sugar-600 underline decoration-sugar-300 decoration-dotted underline-offset-4 transition-colors hover:text-sugar-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sugar-500"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold leading-none"
        >
          ?
        </span>
        {label}
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          className="mt-3 max-w-xl rounded-2xl border border-sugar-100 bg-sugar-50/70 p-4 text-sm leading-6 text-slate-700"
        >
          <p>{reason}</p>
          <p className="mt-3 flex items-start gap-2 font-medium text-slate-800">
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            <span>{safety}</span>
          </p>
        </div>
      )}
    </div>
  );
};

// ── "Want us to move faster?" ────────────────────────────────────────────────

export const MoveFasterSection = ({
  showUpload,
  onUpload
}: {
  showUpload: boolean;
  onUpload: () => void;
}) => {
  const optionArrow = (
    <svg
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <section aria-label="Want us to move faster?" className="mb-6">
      <article className="relative overflow-hidden rounded-3xl border border-sugar-100 bg-white/90 p-4 shadow-sugar backdrop-blur sm:p-5">
        <h2 className="text-base font-bold text-slate-900">Want us to move faster?</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {showUpload
            ? 'These are the two quickest ways to help Sugar act for you.'
            : 'Check your debt details so Sugar can keep moving for you.'}
        </p>
        <div className={`mt-4 grid gap-3 ${showUpload ? 'sm:grid-cols-2' : ''}`}>
          <button
            type="button"
            className="group rounded-2xl border border-sugar-100 bg-white p-4 text-left transition-colors hover:border-sugar-300 hover:bg-sugar-50/60"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sugar-500 text-white shadow-sugar">
              <ClipboardIcon className="h-5 w-5" />
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Check your debt details</h3>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Check the debts we found, fix anything that&apos;s wrong, and add any we missed.
            </p>
            <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-sugar-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-sugar-600">
              Start debt check
              {optionArrow}
            </span>
          </button>
          {showUpload && (
            <button
              type="button"
              onClick={onUpload}
              className="group rounded-2xl border border-sugar-100 bg-white p-4 text-left transition-colors hover:border-sugar-300 hover:bg-sugar-50/60"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sugar-500 text-white shadow-sugar">
                <BoltBillIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                Upload your utility bills
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Share a recent power, internet or phone bill so we can start hunting for a
                better deal.
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sugar-700 transition-colors group-hover:text-sugar-600">
                Upload bills
                {optionArrow}
              </span>
            </button>
          )}
        </div>
      </article>
    </section>
  );
};

// ── Upload documents (visual port of UtilityBillUploadSection) ───────────────

const UTILITY_BILL_OPTIONS = [
  { id: 'power', label: 'Power' },
  { id: 'gas', label: 'Gas' },
  { id: 'internet', label: 'Internet' },
  { id: 'mobile', label: 'Mobile' }
];

type BillDraft = { id: number; billKind: string; fileName: string | null };

export const UploadDocumentsSection = () => {
  const [bills, setBills] = React.useState<BillDraft[]>([
    { id: 1, billKind: 'power', fileName: null }
  ]);
  const nextId = React.useRef(2);
  const [recentConfirmed, setRecentConfirmed] = React.useState(false);
  const [preferences, setPreferences] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const readyToUpload =
    bills.some((bill) => bill.fileName) && recentConfirmed && !uploading;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!readyToUpload) return;
    setUploading(true);
    // Demo: pretend the upload takes a moment, then confirm.
    window.setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <section id="upload-documents" aria-label="Upload your documents" className="mb-6">
      <article className="relative overflow-hidden rounded-3xl border border-sugar-100 bg-white/90 p-4 shadow-sugar backdrop-blur sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-candy-100/70 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-sugar-100/70 blur-3xl"
        />
        <div className="relative">
          <div className="max-w-2xl border-b border-sugar-100 pb-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Upload your documents
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload utility bills from the last 2 months so we can compare your real usage
              across power, gas, internet, and mobile.
            </p>
          </div>

          <form className="relative mt-5" onSubmit={handleSubmit}>
            <fieldset disabled={uploading} className="space-y-5">
              <div className="space-y-3">
                {bills.map((draft, index) => {
                  const option =
                    UTILITY_BILL_OPTIONS.find((item) => item.id === draft.billKind) ||
                    UTILITY_BILL_OPTIONS[0];

                  return (
                    <div
                      key={draft.id}
                      className="rounded-2xl border border-sugar-100 bg-sugar-50/40 p-3"
                    >
                      <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
                        <label className="block">
                          <span className="sr-only">Utility</span>
                          <select
                            aria-label={`Utility for bill ${index + 1}`}
                            value={draft.billKind}
                            onChange={(event) => {
                              const nextKind = event.target.value;
                              setBills((current) =>
                                current.map((item) =>
                                  item.id === draft.id ? { ...item, billKind: nextKind } : item
                                )
                              );
                              setSuccess(false);
                            }}
                            className="block w-full rounded-xl border border-sugar-100 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-sugar-400 focus:outline-none focus:ring-2 focus:ring-sugar-300"
                          >
                            {UTILITY_BILL_OPTIONS.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="sr-only">Bill file</span>
                          <span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sugar-200 bg-white px-4 py-3 transition hover:border-sugar-400 hover:bg-sugar-50">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sugar-50 text-sugar-600 shadow-inner ring-1 ring-sugar-100">
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-slate-900">
                                {draft.fileName || 'Choose bill'}
                              </span>
                              <span className="mt-0.5 block text-xs text-slate-600">
                                {draft.fileName ? option.label : 'PDF or image'}
                              </span>
                            </span>
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              className="sr-only"
                              onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                setBills((current) =>
                                  current.map((item) =>
                                    item.id === draft.id
                                      ? { ...item, fileName: file ? file.name : null }
                                      : item
                                  )
                                );
                                setSuccess(false);
                              }}
                            />
                          </span>
                        </label>

                        {bills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setBills((current) =>
                                current.filter((item) => item.id !== draft.id)
                              );
                              setSuccess(false);
                            }}
                            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sugar-500"
                            aria-label={`Remove bill ${index + 1}`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setBills((current) => [
                      ...current,
                      { id: nextId.current++, billKind: 'power', fileName: null }
                    ]);
                    setSuccess(false);
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sugar-700 transition-colors hover:text-sugar-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sugar-500"
                >
                  <span aria-hidden="true">+</span>
                  Add another bill
                </button>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={recentConfirmed}
                  onChange={(event) => {
                    setRecentConfirmed(event.target.checked);
                    setSuccess(false);
                  }}
                  className="h-4 w-4 rounded border-sugar-200 text-sugar-600 focus:ring-sugar-500"
                />
                <span className="font-medium text-slate-900">
                  These bills are from the last 2 months.
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-900">
                  Anything we should know? (optional)
                </span>
                <textarea
                  value={preferences}
                  onChange={(event) => {
                    setPreferences(event.target.value);
                    setSuccess(false);
                  }}
                  rows={2}
                  className="mt-2 block w-full rounded-2xl border border-sugar-100 px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sugar-400 focus:outline-none focus:ring-2 focus:ring-sugar-300"
                  placeholder="EV charging, weekend usage, broadband speed, mobile data needs, providers to avoid."
                />
              </label>
            </fieldset>

            {success && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                <p className="font-semibold">Thanks, we&apos;ve got them.</p>
                <p className="mt-1">
                  We&apos;ll reach out if we need anything else. Otherwise, we&apos;ll start
                  looking for savings.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="submit"
                disabled={!readyToUpload}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sugar transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sugar-500 ${
                  readyToUpload
                    ? 'bg-sugar-gradient hover:-translate-y-0.5 hover:shadow-sugar-lg'
                    : 'cursor-not-allowed bg-sugar-300'
                }`}
              >
                {uploading ? 'Uploading...' : 'Send bills'}
              </button>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
};

// ── Connect email (visual port of the dashboard email connection section) ────

const MAILBOX_PROVIDERS = [
  { key: 'gmail', label: 'Gmail' },
  { key: 'outlook', label: 'Outlook & Hotmail' },
  { key: 'other', label: 'Another email inbox' }
];

export const EmailConnectSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);

  const startFakeConnect = () => {
    // Same as picking "Sign in via email": run the fake OAuth + scan flow.
    updateFlowState({ signInMethod: 'email' });
    navigate('/connecting');
  };

  return (
    <>
      <section className="mb-6">
        <article
          id="dashboard-email-connection"
          className="relative overflow-hidden rounded-3xl border border-sugar-100 bg-white/90 p-4 shadow-sugar backdrop-blur sm:p-6 md:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sugar-100/70 blur-2xl"
          />
          <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
            <div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Sign in with email for the fastest and quickest way
              </h2>
              <WhyNeeded
                id="connect-email"
                reason="Connecting your email lets us automatically find the bills and provider statements we need, so you don't have to dig them out yourself. We only look for the relevant bills and statements, and we never read your personal emails."
                safety="This is read-only access so we cannot edit, delete or alter anything."
              />
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sugar-200 bg-sugar-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sugar-700">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4.5C7 4.5 2.7 8 1 12c1.7 4 6 7.5 11 7.5s9.3-3.5 11-7.5c-1.7-4-6-7.5-11-7.5z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Read-only access
            </span>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="relative mt-6 flex w-full flex-col gap-4 rounded-2xl border border-sugar-100 bg-gradient-to-br from-sugar-50/60 to-white p-4 text-left transition-colors hover:border-sugar-300 hover:bg-sugar-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sugar-400 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sugar-gradient text-white shadow-sugar">
              <MailIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-slate-900">Connect email</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                Choose Gmail, Outlook & Hotmail, or another email inbox.
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-sugar-500 px-4 py-2 text-sm font-semibold text-white shadow-sugar">
              Choose provider
            </span>
          </button>
        </article>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mailbox-provider-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-sugar-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-sugar-100 bg-sugar-50/60 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sugar-700">
                  Email connect
                </p>
                <h3
                  id="mailbox-provider-title"
                  className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl"
                >
                  Choose an email provider
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sugar-100 bg-white text-slate-500 transition-colors hover:bg-sugar-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sugar-400"
                aria-label="Close email provider options"
              >
                x
              </button>
            </div>
            <div className="overflow-y-auto px-4 pb-5 pt-0 sm:px-6 sm:pb-6">
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {MAILBOX_PROVIDERS.map((provider) => (
                  <div
                    key={provider.key}
                    className="h-full rounded-2xl border border-sugar-100 bg-gradient-to-br from-sugar-50/40 to-white p-3 sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{provider.label}</h3>
                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-sugar-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sugar-700">
                        Ready to link
                      </span>
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={startFakeConnect}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-sugar-500 px-4 py-2 text-sm font-semibold text-white shadow-sugar transition-colors hover:bg-sugar-600"
                      >
                        Connect {provider.label}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Refer a friend (ported ReferralCard, fake link) ──────────────────────────

const DEMO_REFERRAL_LINK = 'https://concierge.sugarwallet.co.nz/debt-solve/30-off?ref=demo500';

export const ReferralCard = () => {
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    []
  );

  const handleCopy = async () => {
    let success = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(DEMO_REFERRAL_LINK);
        success = true;
      }
    } catch {
      success = false;
    }
    setCopied(success);
    if (success) {
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    }
  };

  const displayLink = DEMO_REFERRAL_LINK.replace(/^https?:\/\//, '');

  return (
    <section className="mb-6">
      <article
        id="dashboard-refer-a-friend"
        className="relative overflow-hidden rounded-3xl border border-sugar-100 bg-white/90 p-4 shadow-sugar backdrop-blur sm:p-6 md:p-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-sugar-100/60 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
          <div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Refer a friend, receive <span className="text-sugar-600">$50</span>
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sugar-200 bg-sugar-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sugar-700">
            <ReferralGiftIcon className="h-3.5 w-3.5" />
            $50 reward
          </span>
        </div>

        <p className="relative mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          Share your personal link. When a friend joins Sugar, you&apos;ll receive $50 as a
          thank-you, and they get 30% off.
        </p>

        <div className="relative mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-sugar-100 bg-sugar-50/60 px-4 py-3">
            <span className="truncate text-sm font-semibold text-slate-900">{displayLink}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            aria-live="polite"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-sugar-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sugar transition-colors hover:bg-sugar-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sugar-500"
          >
            {copied ? <ReferralCheckIcon className="h-4 w-4" /> : <ReferralCopyIcon className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </article>
    </section>
  );
};

// ── Membership (ported "No active membership" card, fake checkout) ───────────

type MembershipCadence = 'weekly' | 'monthly' | 'annual';

const MEMBERSHIP_CHECKOUT_PLANS: Record<
  MembershipCadence,
  { label: string; ctaLabel: string }
> = {
  weekly: { label: 'Weekly', ctaLabel: 'Start membership · $9/wk' },
  monthly: { label: 'Monthly', ctaLabel: 'Start membership · $35/mo' },
  annual: { label: 'Annual', ctaLabel: 'Start membership · $300/yr' }
};

export const MembershipSection = () => {
  const [selectedCadence, setSelectedCadence] = React.useState<MembershipCadence>('monthly');
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const startFakeCheckout = () => {
    if (checkoutLoading) return;
    setNotice(null);
    setCheckoutLoading(true);
    // Demo: pretend to open Stripe, then explain nothing is charged.
    window.setTimeout(() => {
      setCheckoutLoading(false);
      setNotice('Demo checkout: in the real app this opens Stripe.');
    }, 1400);
  };

  return (
    <section className="mb-12 flex justify-center">
      <article
        id="dashboard-membership"
        className="relative w-full overflow-hidden rounded-3xl border border-sugar-100 bg-white/90 p-4 shadow-sugar backdrop-blur sm:p-6 md:p-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-candy-100/60 blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              No active membership
            </h2>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Inactive
          </span>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p>No active Sugar membership was found for this account.</p>
          <p>
            Activate your Sugar membership to unlock concierge support and keep new savings
            opportunities moving.
          </p>
        </div>

        <div className="relative mt-6 border-t border-sugar-100/80 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-sugar-700">
            Choose your plan
          </p>
          <div className="mt-3 inline-flex rounded-full border border-sugar-100 bg-white/80 p-1 shadow-sm">
            {(Object.keys(MEMBERSHIP_CHECKOUT_PLANS) as MembershipCadence[]).map((cadence) => {
              const plan = MEMBERSHIP_CHECKOUT_PLANS[cadence];
              const isSelected = selectedCadence === cadence;

              return (
                <button
                  key={cadence}
                  type="button"
                  onClick={() => setSelectedCadence(cadence)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-sugar-500 text-white shadow-sugar'
                      : 'text-slate-600 hover:text-sugar-700'
                  }`}
                  aria-pressed={isSelected}
                >
                  {plan.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={startFakeCheckout}
            disabled={checkoutLoading}
            aria-disabled={checkoutLoading}
            className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sugar transition-all ${
              checkoutLoading
                ? 'cursor-not-allowed bg-slate-400'
                : 'bg-sugar-500 hover:bg-sugar-600 hover:shadow-sugar-lg'
            }`}
          >
            {checkoutLoading ? (
              'Opening secure checkout...'
            ) : (
              <>
                {MEMBERSHIP_CHECKOUT_PLANS[selectedCadence].ctaLabel}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
          {notice && (
            <p className="mt-3 rounded-2xl border border-sugar-100 bg-sugar-50 px-4 py-3 text-sm text-sugar-800">
              {notice}
            </p>
          )}
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs leading-5 text-slate-500">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-sugar-500" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            You will be redirected to Stripe to complete payment securely.
          </p>
        </div>
      </article>
    </section>
  );
};
