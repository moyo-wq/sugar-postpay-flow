// Shared visual pieces for the demo flow, matching the live concierge
// post-payment app: phone-width onboarding sheets with progress dots floating
// over a blurred backdrop, and a phone-frame dashboard page. Everything stays
// phone-width even on desktop.
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

export const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export const HEADING_STYLE: CSSProperties = {
  margin: 0,
  color: '#111827',
  fontSize: 'clamp(28px, 7vw, 34px)',
  fontFamily: FONT_STACK,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.15
};

export const BODY_STYLE: CSSProperties = {
  color: '#64748b',
  fontSize: 17,
  fontFamily: FONT_STACK,
  fontWeight: 400,
  lineHeight: 1.55
};

export const EYEBROW_STYLE: CSSProperties = {
  margin: 0,
  color: '#7c63d6',
  fontSize: 14,
  fontFamily: FONT_STACK,
  fontWeight: 700,
  letterSpacing: '0.28em',
  textTransform: 'uppercase'
};

// ── Onboarding sheet (phone-style dialog over a blurred backdrop) ────────────

const BACKDROP_STYLE: CSSProperties = {
  width: '100%',
  minHeight: '100dvh',
  background:
    'radial-gradient(circle at 25% 15%, #a49dbb 0%, transparent 45%), ' +
    'radial-gradient(circle at 80% 70%, #8f88a6 0%, transparent 50%), ' +
    'linear-gradient(165deg, #96909c 0%, #7b7590 55%, #8b8496 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px',
  boxSizing: 'border-box'
};

const ProgressDots = ({ step, total }: { step: number; total: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    {Array.from({ length: total }, (_, i) => {
      if (i === step) {
        return (
          <span
            key={i}
            style={{ width: 54, height: 9, borderRadius: 9, background: '#9b85e9' }}
          />
        );
      }
      return (
        <span
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: i < step ? '#34d399' : '#dbe2ee'
          }}
        />
      );
    })}
  </div>
);

export const Sheet = ({
  step,
  totalSteps = 6,
  onSkip,
  onBack,
  continueButton,
  children
}: {
  step?: number;
  totalSteps?: number;
  onSkip?: () => void;
  onBack?: () => void;
  continueButton?: ReactNode;
  children: ReactNode;
}) => {
  const hasFooter = Boolean(onBack || continueButton);

  return (
    <div style={BACKDROP_STYLE}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 'min(430px, 100%)',
          background: 'white',
          borderRadius: 36,
          boxShadow: '0 30px 80px -30px rgba(30, 20, 70, 0.55)',
          overflow: 'hidden',
          fontFamily: FONT_STACK
        }}
      >
        {(step !== undefined || onSkip) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '22px 26px',
              borderBottom: '1px solid #f1f3f9'
            }}
          >
            {step !== undefined ? <ProgressDots step={step} total={totalSteps} /> : <span />}
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  fontFamily: FONT_STACK,
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Skip for now
              </button>
            )}
          </div>
        )}

        <div style={{ padding: '26px 26px 28px' }}>{children}</div>

        {hasFooter && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 26px 24px',
              borderTop: '1px solid #f1f3f9'
            }}
          >
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#111827',
                  fontFamily: FONT_STACK,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {continueButton}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Gradient icon tile, like the phone-number onboarding step.
export const IconTile = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: 76,
      height: 76,
      borderRadius: 22,
      background: 'linear-gradient(135deg, #b06ae8 0%, #f0568f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 34,
      color: 'white',
      boxShadow: '0 14px 30px -14px rgba(217, 90, 150, 0.6)'
    }}
  >
    {children}
  </div>
);

// Purple info chip with a check, like "We'll use this for account support...".
export const InfoChip = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: '#f6f2ff',
      border: '1px solid #ede5fe',
      borderRadius: 20,
      padding: '18px 18px'
    }}
  >
    <span
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#9b85e9',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span style={{ color: '#5b4bab', fontSize: 16, fontWeight: 500, lineHeight: 1.45, fontFamily: FONT_STACK }}>
      {children}
    </span>
  </div>
);

export const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  style
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    whileTap={disabled ? undefined : { scale: 0.98 }}
    style={{
      width: fullWidth ? '100%' : 'auto',
      padding: fullWidth ? '18px' : '14px 28px',
      background: disabled ? '#c8b9f5' : '#9b85e9',
      borderRadius: fullWidth ? 22 : 14,
      color: 'white',
      fontSize: 18,
      fontFamily: FONT_STACK,
      fontWeight: 600,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }}
  >
    {children}
  </motion.button>
);

export const OptionButton = ({
  children,
  onClick,
  selected = false
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    style={{
      width: '100%',
      padding: '17px 20px',
      background: selected ? '#9b85e9' : '#fbfaff',
      color: selected ? 'white' : '#111827',
      border: '1.5px solid ' + (selected ? '#9b85e9' : '#e5dcfb'),
      borderRadius: 18,
      fontSize: 17,
      fontFamily: FONT_STACK,
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'left'
    }}
  >
    {children}
  </motion.button>
);

// ── Phone-frame page (dashboard) ─────────────────────────────────────────────

export const PHONE_WIDTH = 470;

// Full page laid out as a phone column even on desktop, like the live app.
export const PhonePage = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      minHeight: '100dvh',
      background: '#e9e5f1',
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <div
      style={{
        width: `min(${PHONE_WIDTH}px, 100%)`,
        minHeight: '100dvh',
        background: 'white',
        boxShadow: '0 0 60px rgba(30, 20, 70, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT_STACK
      }}
    >
      {children}
    </div>
  </div>
);

export const PhoneHeader = () => (
  <header
    style={{
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px'
    }}
  >
    <div
      style={{
        color: '#9B86EA',
        fontSize: 34,
        letterSpacing: '-0.05em',
        fontFamily: 'Octarine, system-ui, sans-serif',
        fontWeight: 700,
        lineHeight: 1
      }}
    >
      sugar
    </div>
    <div
      aria-hidden
      style={{
        border: '1px solid #ede5fe',
        borderRadius: 14,
        padding: '12px 14px',
        color: '#6849bc',
        fontWeight: 700,
        fontSize: 13,
        lineHeight: 1,
        letterSpacing: 2
      }}
    >
      •••
    </div>
  </header>
);

// CSS confetti, same approach as the production paywall-success screen.
export const Confetti = () => {
  const colors = ['#9B86EA', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    size: 8 + Math.random() * 8
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: piece.left,
            top: 0,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.id % 3 === 0 ? '50%' : '2px',
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`
          }}
        />
      ))}
    </div>
  );
};
