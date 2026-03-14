import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/api';
import './ListingScreens.css';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAvailable();
      setVehicles(response.data);
    } catch (err) {
      setError('Erro ao carregar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRental = (vehicle) => {
    navigate('/rental/vehicle', { state: { vehicle, type: 'vehicle' } });
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
        <h1 className="listing-title">Veículos Disponíveis</h1>
        <p className="listing-subtitle">{vehicles.length} veículos</p>
        <button onClick={loadVehicles} className="refresh-btn">Atualizar</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="listing-grid">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="listing-card">
            <div className="card-header">
              <h2 className="card-title">{vehicle.name}</h2>
              <span className="price">R$ {parseFloat(vehicle.daily_price).toFixed(2)}/dia</span>
            </div>

            <div className="card-details">
              <p className="detail">{vehicle.brand} {vehicle.model}</p>
              <p className="detail">{vehicle.year} • {vehicle.color}</p>
              <p className="detail">Placa: {vehicle.license_plate}</p>
            </div>

            <button 
              onClick={() => handleRental(vehicle)}
              className="rental-button"
            >
              Alugar
            </button>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !loading && (
        <div className="empty-state">
          <p>Sem veiculos</p>
        </div>
      )}
    </div>
  );
};

export default VehiclesScreen;
