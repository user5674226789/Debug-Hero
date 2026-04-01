const MobDisplay = ({ image, isBoss }) => {
  return (
    <div className="relative">
      <img 
        src={image} 
        alt="Bug"
        className={`
          transition-all duration-500 
          ${isBoss ? 'w-48 h-48 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]' : 'w-32 h-32'}
          animate-bounce
        `}
      />
      {/* Ефект "глюка" для босів */}
      {isBoss && <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay animate-pulse" />}
    </div>
  );
};

export default MobDisplay;
