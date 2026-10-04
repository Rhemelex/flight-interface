import React from 'react';
import './Altitude.css';

function Altitude({ value = 0, mode }) {
  return (
    <div className="altitude-container">
      {mode === 'text' ? (
        <div>Altitude: {value} meters</div>
      ) : (
        <div className="altitude-visual">
          <div className="scale">
            {[0, 1000, 2000, 3000].map((alt) => (
              <div key={alt} className="altitude-label" style={{ bottom: `${(alt / 3000) * 100}%` }}>
                {alt}
              </div>
            ))}
            <div className="marker" style={{ bottom: `${(value / 3000) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Altitude;
