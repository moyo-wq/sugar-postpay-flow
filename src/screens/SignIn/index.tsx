import { useNavigate } from 'react-router-dom';
import { Sheet, OptionButton, HEADING_STYLE, BODY_STYLE, EYEBROW_STYLE } from '../../components/ui';
import {
  getFlowState,
  updateFlowState,
  detectProvider,
  type SignInMethod
} from '../../lib/flowState';

const SignIn = () => {
  const navigate = useNavigate();
  const { email } = getFlowState();
  const provider = detectProvider(email);

  // Email sign-in only exists for Gmail / Microsoft inboxes we can connect to.
  const showEmail = provider === 'gmail' || provider === 'microsoft';
  // Account-manager sign-in is the fallback for other providers, but not iCloud.
  const showAccountManager = provider === 'other';

  const choose = (method: SignInMethod) => {
    updateFlowState({ signInMethod: method });
    if (method === 'bank') {
      // Only the bank path runs the fake scan + savings estimate.
      navigate('/connecting');
    } else {
      // Email and account-manager go straight to contact preferences.
      navigate('/contact-method');
    }
  };

  return (
    <Sheet step={1} onBack={() => navigate('/congrats')}>
      <p style={EYEBROW_STYLE}>Sign in</p>
      <h1 style={{ ...HEADING_STYLE, marginTop: 12 }}>How would you like to sign in?</h1>
      <p style={{ ...BODY_STYLE, marginTop: 12 }}>
        This is how Sugar starts working on your savings.
      </p>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {showEmail && (
          <OptionButton onClick={() => choose('email')}>✉️ &nbsp;Sign in via email</OptionButton>
        )}

        <OptionButton onClick={() => choose('bank')}>🏦 &nbsp;Sign in via bank</OptionButton>

        {showAccountManager && (
          <OptionButton onClick={() => choose('account_manager')}>
            🧑‍💼 &nbsp;Sign in with your account manager
          </OptionButton>
        )}
      </div>
    </Sheet>
  );
};

export default SignIn;
