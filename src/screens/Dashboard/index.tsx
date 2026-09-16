import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import SugarWordmark from '../../components/SugarWordmark';
import { Page, Card, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
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
  color: '#221A51',
  fontSize: 'clamp(17px, 4.2vw, 20px)',
  fontFamily: 'Lexend, system-ui, sans-serif',
  fontWeight: 700,
  lineHeight: 1.3
};

const secondaryTextStyle: CSSProperties = {
  color: '#6C6881',
  fontSize: 'clamp(13px, 3.4vw, 15px)',
  fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif',
  fontWeight: 500,
  lineHeight: 1.5,
  margin: 0
};

const Dashboard = () => {
  const { signInMethod, contactMethod, savingsLow, savingsHigh } = getFlowState();
  const emailConnected = signInMethod === 'email';

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
    <Page maxWidth={560}>
      <style>{`
        @keyframes dash-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(240, 180, 41, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(240, 180, 41, 0); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SugarWordmark marginBottom={0} />
      </div>

      <Card>
        <h1 style={{ ...HEADING_STYLE, fontSize: 'clamp(24px, 5.5vw, 32px)' }}>
          Your Dashboard
        </h1>
        <p style={{ ...BODY_STYLE, marginTop: 10 }}>
          {savingsLow && savingsHigh ? (
            <>
              Your scan found <strong style={{ color: '#221A51' }}>
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

        <div style={{ marginTop: 28 }}>
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

        <div style={{ marginTop: 28 }}>
          <YourAccountManager />
        </div>
      </Card>

      {/* Sections ported from the real concierge dashboard. Email-connected
          users skip the upload + connect-email prompts, like production. */}
      <div style={{ marginTop: 28, width: '100%' }}>
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
    </Page>
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
          fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          color: status === 'upcoming' ? '#A5A1BD' : '#221A51',
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
            fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif',
            fontSize: 14,
            color: '#6C6881'
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
    fontFamily: 'Lexend, system-ui, sans-serif',
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
              fontFamily: 'Lexend, system-ui, sans-serif'
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
              color: '#221A51',
              fontSize: 'clamp(16px, 4vw, 18px)',
              fontFamily: 'Lexend, system-ui, sans-serif',
              fontWeight: 700,
              lineHeight: 1.3
            }}>
              {m.name}
            </p>
            <span style={{
              color: online ? '#16A34A' : '#A09CB0',
              fontSize: 'clamp(11px, 2.8vw, 12px)',
              fontFamily: 'Lexend, system-ui, sans-serif',
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
        <a href={`tel:${m.phone}`} style={contactPillStyle('#F0EFFA', '#221A51')}>
          {'📞'} Call
        </a>
        <a href={m.whatsapp} target="_blank" rel="noopener noreferrer" style={contactPillStyle('#ECFDF5', '#16A34A')}>
          WhatsApp
        </a>
        <a href={`mailto:${m.email}`} style={contactPillStyle('#F0EFFA', '#221A51')}>
          {'✉️'} Email
        </a>
      </div>

    </motion.div>
  );
};

export default Dashboard;
