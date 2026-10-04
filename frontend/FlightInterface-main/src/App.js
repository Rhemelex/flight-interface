import React, { useEffect, useState } from 'react';
import './App.css';
import Altitude from './Altitude'; 
import HIS from './HIS';
import ADI from './ADI';

function App() {
  const [displayMode, setDisplayMode] = useState('text');
  const [altitude, setAltitude] = useState(0);
  const [his, setHis] = useState(0);
  const [adi, setAdi] = useState(0);
  const [showInputs, setShowInputs] = useState(false); // Toggle input form
  const [inputAltitude, setInputAltitude] = useState('');
  const [inputHis, setInputHis] = useState('');
  const [inputAdi, setInputAdi] = useState('');

  useEffect(() => {
    let active = true;

    fetch('/controlpanel')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load saved flight data');
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setAltitude(data.altitude);
        setHis(data.his);
        setAdi(data.adi);
      })
      .catch((error) => console.error('Error loading flight data:', error));

    return () => {
      active = false;
    };
  }, []);

  const handleTextClick = () => {
    setDisplayMode('text');
  };

  const handleVisualClick = () => {
    setDisplayMode('visual');
  };

  const toggleInputs = () => {
    setShowInputs(!showInputs);
  };

  const handleSendClick = async () => {
    const data = {
      altitude: Number(inputAltitude),
      his: Number(inputHis),
      adi: Number(inputAdi),
    };

    // Basic validation
    if (inputAltitude.trim() === '' || inputHis.trim() === '' || inputAdi.trim() === '' ||
      isNaN(data.altitude) || isNaN(data.his) || isNaN(data.adi) || data.altitude < 0 || data.altitude > 3000 || data.his < 0 || data.his > 360 ||
        data.adi < -100 || data.adi > 100) {
      alert('Please enter valid numbers');
      return;
    }

    try {
      const response = await fetch('/controlpanel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Assuming server returns the validated data
        setAltitude(result.altitude);
        setHis(result.his);
        setAdi(result.adi);
        setShowInputs(false); // Hide inputs after successful send
        console.log('Data updated successfully:', result);
      } else {
        alert('Server rejected the data');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="App">
      <div className="controls">
        <button onClick={handleTextClick}>TEXT</button>
        <button onClick={handleVisualClick}>VISUAL</button>
        <button onClick={toggleInputs}>+</button>
      </div>

      {showInputs && (
        <div className="input-form">
          <input
            type="number"
            placeholder="Altitude (0-3000)"
            value={inputAltitude}
            onChange={(e) => setInputAltitude(e.target.value)}
          />
          <input
            type="number"
            placeholder="HIS (0-360)"
            value={inputHis}
            onChange={(e) => setInputHis(e.target.value)}
          />
          <input
            type="number"
            placeholder="ADI (-100 to 100)"
            value={inputAdi}
            onChange={(e) => setInputAdi(e.target.value)}
          />
          <button onClick={handleSendClick}>SEND</button>
        </div>
      )}

      <div className="data-display">
        <div className="altitude">
          <h3>Altitude</h3>
          <Altitude value={altitude} mode={displayMode} />
        </div>
        <div className="his">
          <h3>HIS (Horizontal Situation Indicator)</h3>
          <HIS value={his} mode={displayMode} />
        </div>
        <div className="adi">
          <h3>ADI (Attitude Direction Indicator)</h3>
          <ADI value={adi} mode={displayMode} />
        </div>
      </div>
    </div>
  );
}

export default App;