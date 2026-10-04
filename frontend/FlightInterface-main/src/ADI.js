import React from 'react';
import './ADI.css';

function ADI({ value = 0, mode }) {
  const clampedAdi = Math.max(-100, Math.min(100, value));
  
  const groundHeight = 50 - (clampedAdi * 0.5); 

  return (
    <div className="adi-container">
      {mode === 'text' ? (
        <div>
          <div>Adi: {clampedAdi}</div>
        </div>
      ) : (
        <div className="adi-visual">
          <div
            className="ground"
            style={{
              height: `${groundHeight}%`, // Ground height adjusts based on value
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ADI;