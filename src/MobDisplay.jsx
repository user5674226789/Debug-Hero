import React from 'react';

const MobDisplay = ({ image, isBoss }) => {
  // Цей рядок дозволяє Vite динамічно знаходити картинки в папці assets
  const getImageUrl = (name) => {
    return new URL(`./assets/${name}`, import.meta.url).href;
  };

  return (
    <div className={`relative flex flex-col items-center ${isBoss ? 'scale-125' : 'scale-100'}`}>
      <div className="w-48 h-48 bg-green-900/20 rounded-full absolute blur-3xl animate-pulse"></div>
      <img 
        src={getImageUrl(image)} 
        alt="Enemy" 
        className="w-40 h-40 object-contain relative z-10"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=BUG_FOUND'; }}
      />
    </div>
  );
};

export default MobDisplay;