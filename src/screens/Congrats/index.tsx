import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SugarWordmark from '../../components/SugarWordmark';
import { Page, Card, PrimaryButton, Confetti, HEADING_STYLE, BODY_STYLE } from '../../components/ui';

const Congrats = () => {
  const navigate = useNavigate();

  return (
    <Page maxWidth={520}>
      <Confetti />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <SugarWordmark marginBottom={0} />
      </div>

      <Card style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9B86EA 0%, #7B66CA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(155, 134, 234, 0.4)'
          }}
        >
          <motion.svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        <h1 style={HEADING_STYLE}>
          Congratulations!
          <br />
          Let&rsquo;s go get that money 💸
        </h1>
        <p style={{ ...BODY_STYLE, marginTop: 16 }}>
          <strong style={{ color: '#221A51' }}>$3,000 back in your pocket</strong> or your
          money back.
        </p>

        <div style={{ marginTop: 28 }}>
          <PrimaryButton onClick={() => navigate('/sign-in')}>Let&rsquo;s Go!</PrimaryButton>
        </div>
      </Card>
    </Page>
  );
};

export default Congrats;
