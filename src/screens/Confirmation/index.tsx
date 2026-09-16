import { useNavigate } from 'react-router-dom';
import SugarWordmark from '../../components/SugarWordmark';
import { Page, Card, PrimaryButton, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
import { getFlowState, formatMoney, CALENDLY_CALL_URL } from '../../lib/flowState';

const Confirmation = () => {
  const navigate = useNavigate();
  const { email, phone, contactMethod, savingsLow, savingsHigh } = getFlowState();

  const heading =
    contactMethod === 'call'
      ? 'Your account manager will call you at the time you book'
      : contactMethod === 'text'
      ? 'Your account manager will text you in 5 mins'
      : 'Your account manager will email you within an hour';

  const detail =
    contactMethod === 'call'
      ? 'We opened Calendly in a new tab so you can pick a 15 min slot that suits you.'
      : contactMethod === 'text'
      ? phone && `We'll reach you on ${phone}.`
      : email && `We'll email ${email}.`;

  return (
    <Page maxWidth={520}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SugarWordmark marginBottom={0} />
      </div>

      <Card style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 18 }}>
          {contactMethod === 'call' ? '📞' : contactMethod === 'text' ? '💬' : '✉️'}
        </div>
        <h1 style={{ ...HEADING_STYLE, fontSize: 'clamp(26px, 6vw, 36px)' }}>{heading}</h1>
        {detail && <p style={{ ...BODY_STYLE, marginTop: 14 }}>{detail}</p>}
        {contactMethod === 'call' && (
          <p style={{ ...BODY_STYLE, marginTop: 8 }}>
            Didn&rsquo;t see it?{' '}
            <a
              href={CALENDLY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#9B86EA', fontWeight: 700 }}
            >
              Open Calendly
            </a>
          </p>
        )}
        {savingsLow && savingsHigh && (
          <p style={{ ...BODY_STYLE, marginTop: 8 }}>
            They&rsquo;ll go over your {formatMoney(savingsLow)} to {formatMoney(savingsHigh)}{' '}
            savings plan with you.
          </p>
        )}

        <div style={{ marginTop: 28 }}>
          <PrimaryButton onClick={() => navigate('/dashboard')}>Continue</PrimaryButton>
        </div>
      </Card>
    </Page>
  );
};

export default Confirmation;
