import React from 'react';
import './HIS.css';

function HIS({ value = 0, mode }) {
  return (
    <div className="his-container">
      {mode === 'text' ? (
        <div>Heading: {value} degrees</div>
      ) : (
        <div className="his-visual">
          <div className="compass">
            {[{ deg: 0, left: '50%', top: '-10px' },
              { deg: 90, left: '100%', top: '50%', transform: 'translateY(-50%)' },
              { deg: 180, left: '50%', bottom: '-10px' },
              { deg: 270, left: '-10px', top: '50%', transform: 'translateY(-50%)' }].map((dir) => (
                <div key={dir.deg} className="his-label" style={dir}>
                  {dir.deg}
                </div>
              ))}
            {/* Static upward arrow */}
            <div className="static-arrow"></div>
            {/* Moving needle */}
            <div className="needle" style={{ transform: `rotate(${value}deg)` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HIS;