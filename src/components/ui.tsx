// Shared visual pieces for the demo flow, styled to match the live concierge
// post-payment app (soft gradient background, white header bar, rounded cards
// with soft sugar shadows, system font, purple accents).
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

export const FONT_STACK = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export const PAGE_STYLE: CSSProperties = {
  width: '100%',
  minHeight: '100dvh',
  background: 'linear-gradient(180deg, #faf7ff 0%, #fff5fa 55%, #f6f2ff 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box'
};

export const CARD_STYLE: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid #ede5fe',
  boxShadow: '0 14px 40px -18px rgba(155, 133, 233, 0.45)',
  borderRadius: 24,
  padding: 'clamp(24px, 6vw, 40px)',
  width: '100%',
  boxSizing: 'border-box',
  backdropFilter: 'blur(4px)'
};

export const HEADING_STYLE: CSSProperties = {
  margin: 0,
  color: '#0f172a',
  fontSize: 'clamp(26px, 6vw, 34px)',
  fontFamily: FONT_STACK,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.2
};

export const BODY_STYLE: CSSProperties = {
  color: '#475569',
  fontSize: 'clamp(15px, 3.8vw, 17px)',
  fontFamily: FONT_STACK,
  fontWeight: 400,
  lineHeight: 1.6
};

export const EYEBROW_STYLE: CSSProperties = {
  margin: 0,
  color: '#6849bc',
  fontSize: 13,
  fontFamily: FONT_STACK,
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase'
};

const Header = () => (
  <header
    style={{
      width: '100%',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px clamp(16px, 5vw, 28px)',
      boxSizing: 'border-box'
    }}
  >
    <div
      style={{
        color: '#9B86EA',
        fontSize: 'clamp(30px, 7vw, 36px)',
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
        padding: '10px 14px',
        color: '#6849bc',
        fontWeight: 700,
        fontSize: 14,
        lineHeight: 1,
        letterSpacing: 2
      }}
    >
      •••
    </div>
  </header>
);

export const Page = ({ children, maxWidth = 560 }: { children: ReactNode; maxWidth?: number }) => (
  <div style={PAGE_STYLE}>
    <Header />
    <div
      style={{
        width: '100%',
        maxWidth,
        padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 24px) 64px',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  </div>
);

export const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ ...CARD_STYLE, ...style }}
  >
    {children}
  </motion.div>
);

export const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  style
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    whileHover={disabled ? undefined : { y: -2 }}
    whileTap={disabled ? undefined : { scale: 0.98 }}
    style={{
      width: '100%',
      padding: '15px',
      background: disabled ? '#c3aef9' : '#9b85e9',
      boxShadow: disabled ? 'none' : '0 14px 40px -18px rgba(155, 133, 233, 0.65)',
      borderRadius: 14,
      color: 'white',
      fontSize: 16,
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
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    style={{
      width: '100%',
      padding: '16px 20px',
      background: selected ? '#9b85e9' : 'white',
      color: selected ? 'white' : '#0f172a',
      border: '1px solid ' + (selected ? '#9b85e9' : '#ede5fe'),
      boxShadow: selected
        ? '0 14px 40px -18px rgba(155, 133, 233, 0.65)'
        : '0 8px 24px -18px rgba(155, 133, 233, 0.4)',
      borderRadius: 16,
      fontSize: 16,
      fontFamily: FONT_STACK,
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'left'
    }}
  >
    {children}
  </motion.button>
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
