import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { electronicsService } from '../services/api';
import './ListingScreens.css';

const ElectronicsScreen = () => {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadElectronics();
  }, []);

  const loadElectronics = async () => {
    try {
      setLoading(true);
      const response = await electronicsService.getAvailable();
      setElectronics(response.data);
    } catch (err) {
      setError('Erro ao carregar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRental = (item) => {
    navigate('/rental/electronic', { state: { item, type: 'electronic' } });
  };

  if (loading) {
    return (
      <div className="listing-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="listing-container">
      <div className="listing-header">
        <h1 className="listing-title">Eletrônicos Disponíveis</h1>
        <p className="listing-subtitle">{electronics.length} eletrônicos</p>
        <button onClick={loadElectronics} className="refresh-btn">Atualizar</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="listing-grid">
        {electronics.map(item => (
          <div key={item.id} className="listing-card">
            <div className="card-header">
              <h2 className="card-title">{item.name}</h2>
              <span className="price">R$ {parseFloat(item.daily_price).toFixed(2)}/dia</span>
            </div>

            <div className="card-details">
              <p className="detail">{item.brand}</p>
              <p className="detail">Modelo: {item.model}</p>
            </div>

            <button 
              onClick={() => handleRental(item)}
              className="rental-button"
            >
              Alugar
            </button>
          </div>
        ))}
      </div>

      {electronics.length === 0 && !loading && (
        <div className="empty-state">
          <p>Sem eletronicos</p>
        </div>
      )}
    </div>
  );
};

export default ElectronicsScreen;
