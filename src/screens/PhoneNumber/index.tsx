import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SugarWordmark from '../../components/SugarWordmark';
import { Page, Card, PrimaryButton, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
import { updateFlowState } from '../../lib/flowState';

// Only the "text me" path collects a number; calls book through Calendly.
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
    <Page maxWidth={480}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SugarWordmark marginBottom={0} />
      </div>

      <Card>
        <h1 style={HEADING_STYLE}>What number should we text you on?</h1>
        <p style={{ ...BODY_STYLE, marginTop: 12 }}>
          Your account manager will only use this to reach you about your savings.
        </p>

        <label
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontFamily: 'Schibsted Grotesk, Lexend, system-ui, sans-serif'
          }}
        >
          <span style={{ color: '#6C6881', fontSize: 13, fontWeight: 600 }}>Mobile number</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="+64 21 123 4567"
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              border: '1px solid ' + (touched && !valid ? '#c0392b' : '#E4E1F5'),
              background: '#FAFAFF',
              color: '#232843',
              fontSize: 17,
              fontWeight: 500,
              outline: 'none'
            }}
          />
          {touched && !valid && (
            <span style={{ color: '#c0392b', fontSize: 13 }}>Enter a valid mobile number.</span>
          )}
        </label>

        <div style={{ marginTop: 24 }}>
          <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
        </div>
      </Card>
    </Page>
  );
};

export default PhoneNumber;
