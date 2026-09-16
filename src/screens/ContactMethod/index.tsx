import { useNavigate } from 'react-router-dom';
import SugarWordmark from '../../components/SugarWordmark';
import { Page, Card, OptionButton, HEADING_STYLE, BODY_STYLE } from '../../components/ui';
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
    <Page maxWidth={520}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SugarWordmark marginBottom={0} />
      </div>

      <Card>
        <h1 style={HEADING_STYLE}>
          Great! Now, how would you prefer your account manager to contact you?
        </h1>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <OptionButton onClick={() => choose('email')}>
            ✉️ &nbsp;Email
            {email && (
              <div style={{ ...BODY_STYLE, fontSize: 14, fontWeight: 500, marginTop: 4 }}>
                We&rsquo;ll use {email}
              </div>
            )}
          </OptionButton>
          <OptionButton onClick={() => choose('text')}>💬 &nbsp;Text me</OptionButton>
          <OptionButton onClick={() => choose('call')}>📞 &nbsp;Call me</OptionButton>
        </div>
      </Card>
    </Page>
  );
};

export default ContactMethod;
