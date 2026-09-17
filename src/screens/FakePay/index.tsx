import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Card, PrimaryButton, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
import { setDemoPaid, resetDemo } from '../../lib/demoStore';
import { updateFlowState } from '../../lib/flowState';

const FakePay = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [processing, setProcessing] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handlePay = () => {
    setEmailTouched(true);
    if (!emailValid || processing) return;
    setProcessing(true);
    // Pretend Stripe is doing its thing, then start the post-payment flow.
    window.setTimeout(() => {
      setDemoPaid(true);
      updateFlowState({
        email: email.trim(),
        signInMethod: undefined,
        contactMethod: undefined,
        phone: undefined
      });
      navigate('/congrats');
    }, 1400);
  };

  const handleReset = () => {
    resetDemo();
    window.location.reload();
  };

  return (
    <Page maxWidth={480}>
      <style>{`
        @keyframes fakepay-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <Card>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: '#9B86EA',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Demo checkout · no real payment
        </div>
        <h1 style={{ ...HEADING_STYLE, marginTop: 10, fontSize: 'clamp(26px, 6vw, 34px)' }}>
          Unlock your Sugar concierge
        </h1>

        <div
          style={{
            marginTop: 20,
            padding: '14px 16px',
            borderRadius: 14,
            background: '#F0EFFA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <span style={{ color: '#64748b', fontWeight: 600 }}>Concierge unlock fee</span>
          <span style={{ color: '#0f172a', fontWeight: 800, fontSize: 20 }}>$49.00</span>
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder="you@gmail.com"
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid ' + (emailTouched && !emailValid ? '#c0392b' : '#E4E1F5'),
                background: '#FAFAFF',
                color: '#232843',
                fontSize: 16,
                fontWeight: 500,
                outline: 'none'
              }}
            />
            {emailTouched && !emailValid && (
              <span style={{ color: '#c0392b', fontSize: 13 }}>Enter a valid email address.</span>
            )}
          </label>

          <FakeField label="Card number" value="4242 4242 4242 4242" />
          <div style={{ display: 'flex', gap: 12 }}>
            <FakeField label="Expiry" value="12 / 29" />
            <FakeField label="CVC" value="123" />
          </div>
        </div>

        <PrimaryButton
          onClick={handlePay}
          disabled={processing}
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: processing ? 'wait' : 'pointer'
          }}
        >
          {processing && (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.4)',
                borderTopColor: 'white',
                animation: 'fakepay-spin 0.8s linear infinite'
              }}
            />
          )}
          {processing ? 'Processing payment…' : 'Pay $49.00'}
        </PrimaryButton>

        <p style={{ ...BODY_STYLE, marginTop: 14, marginBottom: 0, textAlign: 'center', fontSize: 13 }}>
          Nothing is charged. This simulates a successful payment, then plays the
          post-payment flow. The email decides which sign-in options you see.
        </p>
      </Card>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            borderRadius: 50,
            border: 'none',
            background: '#0f172a',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Reset demo state
        </button>
      </div>
    </Page>
  );
};

const FakeField = ({ label, value }: { label: string; value: string }) => (
  <label
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}
  >
    <span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>{label}</span>
    <input
      value={value}
      readOnly
      style={{
        padding: '12px 14px',
        borderRadius: 12,
        border: '1px solid #E4E1F5',
        background: '#FAFAFF',
        color: '#232843',
        fontSize: 16,
        fontWeight: 500,
        width: '100%',
        boxSizing: 'border-box'
      }}
    />
  </label>
);

export default FakePay;
