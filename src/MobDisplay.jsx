import React from 'react';

const MobDisplay = ({ image }) => {
  const getImageUrl = (name) => {
    return new URL(`./assets/${name}`, import.meta.url).href;
  };

  return (
    <img src={getImageUrl(image)} alt="Target" className="mob-sprite" />
  );
};

export default MobDisplay;