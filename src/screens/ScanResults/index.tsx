import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, Card, PrimaryButton, Confetti, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
import { updateFlowState, computeScanRange, formatMoney } from '../../lib/flowState';

const TICK_MS = 2200;

// Ease-out so the numbers race early and settle slowly into the final figures.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const ScanResults = () => {
  const navigate = useNavigate();
  const [{ low, high }] = useState(() => computeScanRange());
  const [progress, setProgress] = useState(0);
  const done = progress >= 1;

  useEffect(() => {
    updateFlowState({ savingsLow: low, savingsHigh: high });
  }, [low, high]);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TICK_MS);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const eased = easeOut(progress);
  const lowNow = Math.round((low * eased) / 100) * 100;
  const highNow = Math.round((high * eased) / 100) * 100;

  return (
    <Page maxWidth={520}>
      {done && <Confetti />}
      <Card style={{ textAlign: 'center' }}>
        <h1 style={{ ...HEADING_STYLE, fontSize: 'clamp(24px, 5.5vw, 32px)' }}>
          Scan complete. Here&rsquo;s what we found
        </h1>

        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 'clamp(10px, 3vw, 16px)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            color: '#0f172a'
          }}
        >
          <span style={{ fontSize: 'clamp(34px, 9vw, 52px)', fontVariantNumeric: 'tabular-nums' }}>
            {formatMoney(lowNow)}
          </span>
          <span
            style={{
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              color: '#64748b'
            }}
          >
            to
          </span>
          <span style={{ fontSize: 'clamp(34px, 9vw, 52px)', fontVariantNumeric: 'tabular-nums' }}>
            {formatMoney(highNow)}
          </span>
        </div>

        <p style={{ ...BODY_STYLE, marginTop: 10, fontWeight: 700, color: '#0f172a' }}>
          in savings a year
        </p>
        <p style={{ ...BODY_STYLE, marginTop: 6, fontSize: 14 }}>
          Across your utilities, insurance and debt.
        </p>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p style={{ ...BODY_STYLE, marginTop: 22, fontSize: 14 }}>
                Specific savings can increase or decrease after our call with you
                depending on your preferences.
              </p>
              <div style={{ marginTop: 22 }}>
                <PrimaryButton onClick={() => navigate('/contact-method')}>Got it</PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </Page>
  );
};

export default ScanResults;
