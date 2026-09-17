import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, PrimaryButton, Confetti, HEADING_STYLE, BODY_STYLE, EYEBROW_STYLE } from '../../components/ui';
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
    <Sheet step={2}>
      {done && <Confetti />}
      <div style={{ textAlign: 'center' }}>
        <p style={EYEBROW_STYLE}>Scan complete</p>
        <h1 style={{ ...HEADING_STYLE, marginTop: 12, fontSize: 26 }}>
          Here&rsquo;s what we found
        </h1>

        <div
          style={{
            marginTop: 26,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: 12,
            fontWeight: 800,
            color: '#111827'
          }}
        >
          <span style={{ fontSize: 'clamp(32px, 9vw, 44px)', fontVariantNumeric: 'tabular-nums' }}>
            {formatMoney(lowNow)}
          </span>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#64748b' }}>to</span>
          <span style={{ fontSize: 'clamp(32px, 9vw, 44px)', fontVariantNumeric: 'tabular-nums' }}>
            {formatMoney(highNow)}
          </span>
        </div>

        <p style={{ ...BODY_STYLE, marginTop: 10, fontWeight: 700, color: '#111827' }}>
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
              <p style={{ ...BODY_STYLE, marginTop: 20, fontSize: 14 }}>
                Specific savings can increase or decrease after our call with you depending on
                your preferences.
              </p>
              <div style={{ marginTop: 20 }}>
                <PrimaryButton onClick={() => navigate('/contact-method')}>Got it</PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Sheet>
  );
};

export default ScanResults;
