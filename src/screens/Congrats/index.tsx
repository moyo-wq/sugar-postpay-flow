import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sheet, PrimaryButton, Confetti, HEADING_STYLE, BODY_STYLE, EYEBROW_STYLE } from '../../components/ui';

const Congrats = () => {
  const navigate = useNavigate();

  return (
    <Sheet step={0}>
      <Confetti />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 76,
          height: 76,
          borderRadius: 22,
          background: 'linear-gradient(135deg, #9b85e9 0%, #7B66CA 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 22,
          boxShadow: '0 14px 30px -14px rgba(123, 102, 202, 0.6)'
        }}
      >
        <motion.svg width="38" height="38" viewBox="0 0 24 24" fill="none">
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

      <p style={EYEBROW_STYLE}>You&rsquo;re in</p>
      <h1 style={{ ...HEADING_STYLE, marginTop: 12 }}>
        Congratulations! Let&rsquo;s go get that money 💸
      </h1>
      <p style={{ ...BODY_STYLE, marginTop: 14 }}>
        <strong style={{ color: '#111827' }}>$3,000 back in your pocket</strong> or your money
        back.
      </p>

      <div style={{ marginTop: 26 }}>
        <PrimaryButton onClick={() => navigate('/sign-in')}>Let&rsquo;s Go!</PrimaryButton>
      </div>
    </Sheet>
  );
};

export default Congrats;
