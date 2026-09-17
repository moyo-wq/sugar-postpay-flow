import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, HEADING_STYLE, BODY_STYLE } from '../../components/ui';

const STEP_MS = 950;

// Only the bank sign-in path lands here; email skips the scan entirely.
const Connecting = () => {
  const navigate = useNavigate();

  const steps = [
    'Connecting to your bank…',
    'Scanning your transactions for bills…',
    'Spotting your utilities, insurance and debt…',
    'Comparing your rates against better deals…',
    'Totalling up your savings…'
  ];

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      navigate('/scan-results', { replace: true });
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((i) => i + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [stepIndex, steps.length, navigate]);

  return (
    <Page maxWidth={480}>
      <style>{`
        @keyframes connect-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <Card style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            margin: '8px auto 24px',
            borderRadius: '50%',
            border: '5px solid rgba(155, 134, 234, 0.25)',
            borderTopColor: '#9B86EA',
            animation: 'connect-spin 1s linear infinite'
          }}
        />
        <h1 style={{ ...HEADING_STYLE, fontSize: 'clamp(24px, 5.5vw, 32px)' }}>
          {stepIndex < 1 ? 'Connecting to your bank' : 'Scanning for savings'}
        </h1>
        <p style={{ ...BODY_STYLE, marginTop: 14, minHeight: 28 }}>
          {steps[Math.min(stepIndex, steps.length - 1)]}
        </p>
      </Card>
    </Page>
  );
};

export default Connecting;
