// Shared visual pieces for the demo flow, styled to match the Sugar funnel.
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

export const PAGE_STYLE: CSSProperties = {
  width: '100%',
  minHeight: '100dvh',
  background: '#F0EFFA',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 'clamp(40px, 10vw, 72px) clamp(20px, 5vw, 24px)',
  boxSizing: 'border-box'
};

export const CARD_STYLE: CSSProperties = {
  background: 'white',
  boxShadow: '11px 12px 0px #221A51',
  borderRadius: 20,
  padding: 'clamp(24px, 6vw, 44px)',
  width: '100%',
  boxSizing: 'border-box'
};

export const HEADING_STYLE: CSSProperties = {
  margin: 0,
  color: '#221A51',
  fontSize: 'clamp(28px, 6.5vw, 40px)',
  fontFamily: 'Bricolage Grotesque, Lexend, system-ui, sans-serif',
  fontWeight: 800,
  lineHeight: 1.25
};

export const BODY_STYLE: CSSProperties = {
  color: '#6C6881',
  fontSize: 'clamp(16px, 4vw, 18px)',
  fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif',
  fontWeight: 500,
  lineHeight: 1.6
};

export const Page = ({ children, maxWidth = 520 }: { children: ReactNode; maxWidth?: number }) => (
  <div style={PAGE_STYLE}>
    <div style={{ width: '100%', maxWidth }}>{children}</div>
  </div>
);

export const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
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
      padding: '16px',
      background: disabled ? 'rgba(155, 134, 234, 0.5)' : '#9B86EA',
      boxShadow: disabled ? 'none' : '6px 8px 0px #221A51',
      borderRadius: 50,
      color: 'white',
      fontSize: 18,
      fontFamily: 'Instrument Sans, Lexend, system-ui, sans-serif',
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
      background: selected ? '#9B86EA' : 'white',
      color: selected ? 'white' : '#221A51',
      border: '2px solid ' + (selected ? '#9B86EA' : '#E4E1F5'),
      boxShadow: selected ? '4px 6px 0px #221A51' : 'none',
      borderRadius: 16,
      fontSize: 17,
      fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif',
      fontWeight: 700,
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
