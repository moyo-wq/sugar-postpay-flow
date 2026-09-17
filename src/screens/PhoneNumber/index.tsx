import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  PrimaryButton,
  IconTile,
  InfoChip,
  HEADING_STYLE,
  EYEBROW_STYLE,
  FONT_STACK
} from '../../components/ui';
import { updateFlowState } from '../../lib/flowState';

// Only the "text me" path collects a number; calls book through Calendly.
// Styled to match the live "What's your phone number?" onboarding step.
const PhoneNumber = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState(false);

  const digits = phone.replace(/[^\d+]/g, '');
  const valid = digits.replace(/\D/g, '').length >= 8;

  const handleContinue = () => {
    setTouched(true);
    if (!valid) return;
    updateFlowState({ phone: digits });
    navigate('/confirmation');
  };

  return (
    <Sheet step={4} onBack={() => navigate('/contact-method')}>
      <IconTile>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconTile>

      <p style={{ ...EYEBROW_STYLE, marginTop: 22 }}>One quick detail</p>
      <h1 style={{ ...HEADING_STYLE, marginTop: 12 }}>What&rsquo;s your phone number?</h1>

      <p
        style={{
          margin: '26px 0 10px',
          color: '#111827',
          fontSize: 19,
          fontWeight: 700,
          fontFamily: FONT_STACK
        }}
      >
        Phone number
      </p>
      <div
        style={{
          display: 'flex',
          borderRadius: 18,
          border: '1.5px solid #ddd3fb',
          boxShadow: '0 0 0 4px rgba(155, 133, 233, 0.08)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '18px 16px',
            background: '#f6f2ff',
            borderRight: '1.5px solid #ddd3fb',
            color: '#111827',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT_STACK,
            whiteSpace: 'nowrap'
          }}
        >
          🇳🇿 +64
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5">
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="021 123 4567"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            padding: '18px 16px',
            fontSize: 20,
            fontFamily: FONT_STACK,
            color: '#111827',
            background: 'white'
          }}
        />
      </div>
      <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: 16, fontFamily: FONT_STACK }}>
        It&rsquo;s okay to include the leading 0 or country code.
      </p>
      {touched && !valid && (
        <p style={{ margin: '8px 0 0', color: '#c0392b', fontSize: 14, fontFamily: FONT_STACK }}>
          Enter a valid mobile number.
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <InfoChip>Your account manager will text you on this number.</InfoChip>
      </div>

      <div style={{ marginTop: 24 }}>
        <PrimaryButton onClick={handleContinue}>Save and continue</PrimaryButton>
      </div>
    </Sheet>
  );
};

export default PhoneNumber;
