import { useNavigate } from 'react-router-dom';
import { Sheet, OptionButton, HEADING_STYLE, BODY_STYLE, EYEBROW_STYLE } from '../../components/ui';
import {
  getFlowState,
  updateFlowState,
  CALENDLY_CALL_URL,
  type ContactMethod as Method
} from '../../lib/flowState';

const ContactMethod = () => {
  const navigate = useNavigate();
  const { email } = getFlowState();

  const choose = (method: Method) => {
    updateFlowState({ contactMethod: method, phone: undefined });
    if (method === 'email') {
      navigate('/confirmation');
    } else if (method === 'call') {
      // Calls are booked through Calendly; open it and confirm.
      window.open(CALENDLY_CALL_URL, '_blank', 'noopener');
      navigate('/confirmation');
    } else {
      navigate('/phone');
    }
  };

  return (
    <Sheet step={3} onBack={() => navigate(-1)}>
      <p style={EYEBROW_STYLE}>Your account manager</p>
      <h1 style={{ ...HEADING_STYLE, marginTop: 12 }}>
        Great! Now, how would you prefer your account manager to contact you?
      </h1>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <OptionButton onClick={() => choose('email')}>
          ✉️ &nbsp;Email
          {email && (
            <div style={{ ...BODY_STYLE, fontSize: 14, marginTop: 4 }}>We&rsquo;ll use {email}</div>
          )}
        </OptionButton>
        <OptionButton onClick={() => choose('text')}>💬 &nbsp;Text me</OptionButton>
        <OptionButton onClick={() => choose('call')}>📞 &nbsp;Call me</OptionButton>
      </div>
    </Sheet>
  );
};

export default ContactMethod;
