type SugarWordmarkProps = {
  marginBottom?: number | string;
};

const SugarWordmark = ({
  marginBottom = 'clamp(24px, 12vw, 88px)'
}: SugarWordmarkProps) => {
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#9B86EA',
        fontSize: 'clamp(32px, 8vw, 39px)',
        letterSpacing: '-0.05em',
        fontFamily: 'Octarine, system-ui, sans-serif',
        fontWeight: 700,
        lineHeight: 1,
        marginBottom
      }}
    >
      sugar
    </div>
  );
};

export default SugarWordmark;
