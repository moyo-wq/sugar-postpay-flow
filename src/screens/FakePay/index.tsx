import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  PrimaryButton,
  HEADING_STYLE,
  BODY_STYLE,
  EYEBROW_STYLE,
  FONT_STACK
} from '../../components/ui';
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

  const inputStyle = (invalid = false) => ({
    padding: '15px 16px',
    borderRadius: 16,
    border: '1.5px solid ' + (invalid ? '#c0392b' : '#ddd3fb'),
    background: '#fbfaff',
    color: '#111827',
    fontSize: 17,
    fontWeight: 500,
    fontFamily: FONT_STACK,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const
  });

  return (
    <Sheet>
      <style>{`
        @keyframes fakepay-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={EYEBROW_STYLE}>Demo checkout · no real payment</p>
      <h1 style={{ ...HEADING_STYLE, marginTop: 12 }}>Unlock your Sugar concierge</h1>

      <div
        style={{
          marginTop: 20,
          padding: '15px 16px',
          borderRadius: 16,
          background: '#f6f2ff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: FONT_STACK
        }}
      >
        <span style={{ color: '#64748b', fontWeight: 600 }}>Concierge unlock fee</span>
        <span style={{ color: '#111827', fontWeight: 800, fontSize: 20 }}>$49.00</span>
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT_STACK }}>
          <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@gmail.com"
            style={inputStyle(emailTouched && !emailValid)}
          />
          {emailTouched && !emailValid && (
            <span style={{ color: '#c0392b', fontSize: 13 }}>Enter a valid email address.</span>
          )}
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT_STACK }}>
          <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>Card number</span>
          <input value="4242 4242 4242 4242" readOnly style={inputStyle()} />
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT_STACK }}>
            <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>Expiry</span>
            <input value="12 / 29" readOnly style={inputStyle()} />
          </label>
          <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT_STACK }}>
            <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>CVC</span>
            <input value="123" readOnly style={inputStyle()} />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <PrimaryButton
          onClick={handlePay}
          disabled={processing}
          style={{
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
      </div>

      <p style={{ ...BODY_STYLE, marginTop: 14, marginBottom: 0, textAlign: 'center', fontSize: 13 }}>
        Nothing is charged. This simulates a successful payment, then plays the post-payment
        flow. The email decides which sign-in options you see.
      </p>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            borderRadius: 50,
            border: 'none',
            background: '#111827',
            color: 'white',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: FONT_STACK
          }}
        >
          Reset demo state
        </button>
      </div>
    </Sheet>
  );
};

export default FakePay;
