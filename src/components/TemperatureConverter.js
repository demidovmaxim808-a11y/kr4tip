import React, { useState, useEffect } from 'react';

const TemperatureConverter = () => {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [conversionHistory, setConversionHistory] = useState([]);

  // Загрузка истории из localStorage при монтировании
  useEffect(() => {
    const savedHistory = localStorage.getItem('temperatureHistory');
    if (savedHistory) {
      setConversionHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Сохранение истории в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('temperatureHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]);

  const convertCelsiusToFahrenheit = (celsiusValue) => {
    return (celsiusValue * 9/5) + 32;
  };

  const convertFahrenheitToCelsius = (fahrenheitValue) => {
    return (fahrenheitValue - 32) * 5/9;
  };

  const handleCelsiusChange = (e) => {
    const value = e.target.value;
    setCelsius(value);

    if (value === '') {
      setFahrenheit('');
      return;
    }

    const celsiusNum = parseFloat(value);
    if (!isNaN(celsiusNum)) {
      const fahrenheitValue = convertCelsiusToFahrenheit(celsiusNum);
      setFahrenheit(fahrenheitValue.toFixed(2));
      
      // Добавляем в историю
      addToHistory(`${celsiusNum}°C = ${fahrenheitValue.toFixed(2)}°F`);
    }
  };

  const handleFahrenheitChange = (e) => {
    const value = e.target.value;
    setFahrenheit(value);

    if (value === '') {
      setCelsius('');
      return;
    }

    const fahrenheitNum = parseFloat(value);
    if (!isNaN(fahrenheitNum)) {
      const celsiusValue = convertFahrenheitToCelsius(fahrenheitNum);
      setCelsius(celsiusValue.toFixed(2));
      
      // Добавляем в историю
      addToHistory(`${fahrenheitNum}°F = ${celsiusValue.toFixed(2)}°C`);
    }
  };

  const addToHistory = (conversion) => {
    const timestamp = new Date().toLocaleString();
    const historyItem = {
      id: Date.now(),
      conversion,
      timestamp
    };
    
    setConversionHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Храним последние 10 конвертаций
  };

  const clearHistory = () => {
    setConversionHistory([]);
    localStorage.removeItem('temperatureHistory');
  };

  const clearAll = () => {
    setCelsius('');
    setFahrenheit('');
    clearHistory();
  };

  return (
    <div className="converter-container">
      <h1>Конвертер температур</h1>
      <p>Конвертация между градусами Цельсия (°C) и Фаренгейта (°F)</p>
      
      <div className="input-group">
        <label htmlFor="celsius">Градусы Цельсия (°C):</label>
        <input
          id="celsius"
          type="number"
          value={celsius}
          onChange={handleCelsiusChange}
          placeholder="Введите температуру в °C"
        />
      </div>

      <div className="input-group">
        <label htmlFor="fahrenheit">Градусы Фаренгейта (°F):</label>
        <input
          id="fahrenheit"
          type="number"
          value={fahrenheit}
          onChange={handleFahrenheitChange}
          placeholder="Введите температуру в °F"
        />
      </div>

      <div className="buttons">
        <button onClick={clearAll} className="clear-btn">
          Очистить все
        </button>
      </div>

      {conversionHistory.length > 0 && (
        <div className="history">
          <h2>История конвертаций (последние 10):</h2>
          <button onClick={clearHistory} className="clear-history-btn">
            Очистить историю
          </button>
          <ul>
            {conversionHistory.map(item => (
              <li key={item.id}>
                <span className="conversion">{item.conversion}</span>
                <span className="timestamp">{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemperatureConverter;