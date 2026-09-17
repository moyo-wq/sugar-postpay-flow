import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  PhonePage,
  PhoneHeader,
  PHONE_WIDTH,
  HEADING_STYLE,
  BODY_STYLE,
  EYEBROW_STYLE,
  FONT_STACK
} from '../../components/ui';
import {
  getFlowState,
  signInMethodLabel,
  savingsMidpoint,
  formatMoney
} from '../../lib/flowState';
import {
  MoveFasterSection,
  UploadDocumentsSection,
  EmailConnectSection,
  ReferralCard,
  MembershipSection
} from '../../components/DashboardSections';

type StepStatus = 'done' | 'in_progress' | 'upcoming';

// ── Account manager data, ported from the real AccountHome screen ────────────

// Online status: always online except 1pm-5pm NZ time
const isManagerOnline = (): boolean => {
  const nzTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }));
  const hour = nzTime.getHours();
  return !(hour >= 13 && hour < 17);
};

const ACCOUNT_MANAGER = {
  name: 'Dev Soni',
  initials: 'DS',
  title: 'Account Manager',
  hours: 'Mon-Fri, 9am-5pm NZST',
  phone: '+6421234567',
  whatsapp: 'https://wa.me/6421234567',
  email: 'concierge@sugarwallet.com'
};

const managerCardStyle: CSSProperties = {
  background: '#F8F7FC',
  borderRadius: 16,
  border: '1px solid #EBE8FF',
  padding: 'clamp(18px, 5vw, 28px)',
  width: '100%',
  boxSizing: 'border-box'
};

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 clamp(12px, 3vw, 18px) 0',
  color: '#0f172a',
  fontSize: 'clamp(17px, 4.2vw, 20px)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontWeight: 700,
  lineHeight: 1.3
};

const secondaryTextStyle: CSSProperties = {
  color: '#64748b',
  fontSize: 'clamp(13px, 3.4vw, 15px)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontWeight: 500,
  lineHeight: 1.5,
  margin: 0
};

const Dashboard = () => {
  const { email, signInMethod, contactMethod, savingsLow, savingsHigh } = getFlowState();
  const emailConnected = signInMethod === 'email';
  const memberSince = new Date().toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Scanned users get their annualized range; everyone else the $3,000 baseline.
  const planAmount =
    savingsLow && savingsHigh ? formatMoney(savingsMidpoint(savingsLow, savingsHigh)) : '$3,000';

  const inProgressLabel =
    contactMethod === 'call' ? 'Call booked' : 'Account manager messaged you';
  const inProgressDetail =
    contactMethod === 'call'
      ? 'Your account manager will call you at your booked time'
      : contactMethod === 'text'
      ? 'Keep an eye on your texts, about 5 mins away'
      : 'Keep an eye on your inbox, within the hour';

  const steps: { label: string; status: StepStatus; detail?: string }[] = [
    { label: 'Paid', status: 'done' },
    { label: `Signed in with ${signInMethodLabel(signInMethod)}`, status: 'done' },
    { label: 'Information received', status: 'done' },
    { label: inProgressLabel, status: 'in_progress', detail: inProgressDetail },
    { label: `${planAmount} savings plan sent`, status: 'upcoming' },
    { label: `${planAmount} savings plan approved`, status: 'upcoming' },
    { label: 'Savings plan executed', status: 'upcoming' },
    { label: 'Others…', status: 'upcoming' }
  ];

  return (
    <PhonePage>
      <style>{`
        @keyframes dash-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240, 180, 41, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(240, 180, 41, 0); }
        }
      `}</style>
      <PhoneHeader />

      {/* Welcome hero, like the live concierge dashboard */}
      <div
        style={{
          background: 'linear-gradient(115deg, #f1e9fc 0%, #fbeaf2 70%, #fde9ef 100%)',
          padding: '36px 22px 30px'
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#111827',
            fontSize: 'clamp(34px, 9vw, 42px)',
            fontFamily: FONT_STACK,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            overflowWrap: 'anywhere'
          }}
        >
          Welcome <span style={{ color: '#a78bfa' }}>{email || 'back'}</span>!
        </h1>
        <p style={{ ...BODY_STYLE, marginTop: 12, color: '#475569' }}>
          Member since {memberSince}
        </p>

        {/* Status / plan card overlapping the hero, like the live app */}
        <div
          style={{
            marginTop: 26,
            background: 'white',
            borderRadius: 24,
            border: '1px solid #f1eafd',
            boxShadow: '0 20px 50px -30px rgba(104, 73, 188, 0.35)',
            padding: '24px 22px'
          }}
        >
          <p style={EYEBROW_STYLE}>Status / Plan</p>
          <h2 style={{ ...HEADING_STYLE, marginTop: 10, fontSize: 28 }}>Your Dashboard</h2>
          <p style={{ ...BODY_STYLE, marginTop: 10 }}>
            {savingsLow && savingsHigh ? (
              <>
                Your scan found <strong style={{ color: '#111827' }}>
                  {formatMoney(savingsLow)} to {formatMoney(savingsHigh)}
                </strong>{' '}
                a year in savings. We&rsquo;ll keep this updated as your account manager
                makes progress.
              </>
            ) : (
              <>
                Here&rsquo;s where things are at. We&rsquo;ll keep this updated as your
                account manager makes progress.
              </>
            )}
          </p>

          <div style={{ marginTop: 24 }}>
            {steps.map((step, index) => (
              <TimelineStep
                key={step.label}
                label={step.label}
                detail={step.detail}
                status={step.status}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <YourAccountManager />
          </div>
        </div>
      </div>

      {/* Sections ported from the real concierge dashboard. Email-connected
          users skip the upload + connect-email prompts, like production. */}
      <div style={{ padding: '24px 22px 0' }}>
        <MoveFasterSection
          showUpload={!emailConnected}
          onUpload={() =>
            document
              .getElementById('upload-documents')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        />
        {!emailConnected && <UploadDocumentsSection />}
        {!emailConnected && <EmailConnectSection />}
        <ReferralCard />
        <MembershipSection />
      </div>

      <div style={{ height: 84 }} />
      <BottomNav uploadAvailable={!emailConnected} />
    </PhonePage>
  );
};

// ── Bottom nav, like the live concierge dashboard ────────────────────────────

const BottomNav = ({ uploadAvailable }: { uploadAvailable: boolean }) => {
  const itemStyle = (active: boolean): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 22px',
    borderRadius: 14,
    background: active ? '#ede5fe' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: active ? '#6849bc' : '#64748b',
    fontFamily: FONT_STACK,
    fontSize: 13,
    fontWeight: 600
  });

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `min(${PHONE_WIDTH}px, 100%)`,
        boxSizing: 'border-box',
        background: 'white',
        borderTop: '1px solid #ede5fe',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 12px calc(8px + env(safe-area-inset-bottom))',
        zIndex: 40
      }}
    >
      <button type="button" style={itemStyle(true)}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 9.5V21h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dashboard
      </button>
      <button
        type="button"
        style={itemStyle(false)}
        onClick={() => {
          if (uploadAvailable) {
            document
              .getElementById('upload-documents')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 16V4m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Upload
      </button>
      <button type="button" style={itemStyle(false)}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.9-1.1L14.2 3h-4l-.4 2.6a7 7 0 0 0-1.9 1.1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.9 1.1l.4 2.6h4l.4-2.6a7 7 0 0 0 1.9-1.1l2.4 1 2-3.4-2-1.6c.1-.35.1-.72.1-1.1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Settings
      </button>
    </nav>
  );
};

const STATUS_COLORS: Record<StepStatus, string> = {
  done: '#34C77B',
  in_progress: '#F0B429',
  upcoming: '#D5D2E4'
};

const TimelineStep = ({
  label,
  detail,
  status,
  isLast
}: {
  label: string;
  detail?: string;
  status: StepStatus;
  isLast: boolean;
}) => (
  <div style={{ display: 'flex', gap: 16 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          flexShrink: 0,
          background: STATUS_COLORS[status],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: status === 'in_progress' ? 'dash-pulse 1.6s ease-in-out infinite' : undefined
        }}
      >
        {status === 'done' && (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {status === 'in_progress' && (
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'white' }} />
        )}
      </div>
      {!isLast && (
        <div
          style={{
            width: 3,
            flex: 1,
            minHeight: 26,
            background: status === 'upcoming' ? '#EAE8F5' : STATUS_COLORS[status],
            opacity: status === 'upcoming' ? 1 : 0.35
          }}
        />
      )}
    </div>

    <div style={{ paddingBottom: isLast ? 0 : 22 }}>
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          color: status === 'upcoming' ? '#A5A1BD' : '#0f172a',
          lineHeight: '28px'
        }}
      >
        {label}
        {status === 'in_progress' && (
          <span
            style={{
              marginLeft: 10,
              fontSize: 12,
              fontWeight: 700,
              color: '#8A6D1B',
              background: '#FDF3D7',
              borderRadius: 50,
              padding: '3px 10px',
              verticalAlign: 'middle'
            }}
          >
            In progress
          </span>
        )}
      </div>
      {detail && (
        <div
          style={{
            marginTop: 4,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 14,
            color: '#64748b'
          }}
        >
          {detail}
        </div>
      )}
    </div>
  </div>
);

// ── Your Account Manager, ported from the real AccountHome screen ────────────

const YourAccountManager = () => {
  const m = ACCOUNT_MANAGER;
  const online = isManagerOnline();

  const contactPillStyle = (bg: string, color: string): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3.5vw, 18px)',
    borderRadius: 50,
    background: bg,
    color,
    fontWeight: 600,
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textDecoration: 'none',
    transition: 'transform 0.15s',
    border: 'none',
    cursor: 'pointer'
  });

  return (
    <motion.div
      style={managerCardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h3 style={sectionTitleStyle}>Your account manager</h3>

      {/* Manager profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(14px, 3.5vw, 20px)' }}>
        {/* Avatar with online indicator */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 'clamp(56px, 14vw, 72px)',
              height: 'clamp(56px, 14vw, 72px)',
              borderRadius: '50%',
              background: '#EBE8FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{
              color: '#9B86EA',
              fontSize: 'clamp(18px, 5vw, 24px)',
              fontWeight: 700,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {m.initials}
            </span>
          </div>
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: online ? '#16A34A' : '#A09CB0',
            border: '2.5px solid #F8F7FC'
          }} />
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p style={{
              margin: 0,
              color: '#0f172a',
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              lineHeight: 1.3
            }}>
              {m.name}
            </p>
            <span style={{
              color: online ? '#16A34A' : '#A09CB0',
              fontSize: 'clamp(11px, 2.8vw, 12px)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600
            }}>
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
          <p style={{ ...secondaryTextStyle, marginTop: 2 }}>{m.title}</p>
          <p style={{ ...secondaryTextStyle, marginTop: 4, fontSize: 'clamp(12px, 3vw, 13px)' }}>
            {m.hours}
          </p>
        </div>
      </div>

      {/* Contact options */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'clamp(12px, 3vw, 16px)' }}>
        <a href={`tel:${m.phone}`} style={contactPillStyle('#F0EFFA', '#0f172a')}>
          {'📞'} Call
        </a>
        <a href={m.whatsapp} target="_blank" rel="noopener noreferrer" style={contactPillStyle('#ECFDF5', '#16A34A')}>
          WhatsApp
        </a>
        <a href={`mailto:${m.email}`} style={contactPillStyle('#F0EFFA', '#0f172a')}>
          {'✉️'} Email
        </a>
      </div>

    </motion.div>
  );
};

export default Dashboard;
