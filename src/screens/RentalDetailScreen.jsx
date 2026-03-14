import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { rentalService, insuranceService } from '../services/api';
import './RentalDetailScreen.css';

const RentalDetailScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  const { token } = useContext(AuthContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [insuranceId, setInsuranceId] = useState('');

  // Dados do item vindo do state de navegação
  const item = location.state?.vehicle || location.state?.item;
  const rentalType = location.state?.type || type;

  useEffect(() => {
    if (rentalType !== 'vehicle') {
      setInsuranceOptions([]);
      setInsuranceId('');
      return;
    }

    const loadInsurance = async () => {
      try {
        const response = await insuranceService.getAll();
        setInsuranceOptions(response.data || []);
      } catch (err) {
        console.error('Erro ao carregar seguros:', err);
      }
    };

    loadInsurance();
  }, [rentalType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Selecione datas');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Data final > inicial');
      return;
    }

    try {
      setLoading(true);
      
      if (!item?.id) {
        setError('Item nao selecionado');
        setLoading(false);
        return;
      }

      const payload = {
        start_date: startDate,
        end_date: endDate,
      };

      // Adicionar o ID correto baseado no tipo
      if (rentalType === 'vehicle') {
        payload.vehicle_id = item.id;
        if (insuranceId) {
          const selected = insuranceOptions.find((opt) => String(opt.id) === insuranceId);
          payload.insurance_selected = true;
          payload.insurance_price = Number(selected?.daily_price || 0);
        } else {
          payload.insurance_selected = false;
          payload.insurance_price = 0;
        }
      } else if (rentalType === 'electronic') {
        payload.electronic_id = item.id;
      }

      await rentalService.create(payload);
      navigate('/payment-confirmation');
    } catch (err) {
      setError('Erro na locacao');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-container">
      <button onClick={() => navigate(-1)} className="back-button">← Voltar</button>

      <div className="rental-card">
        <h1>Detalhes da Locação</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="rental-form">
          <div className="form-section">
            <h2>{item?.name || 'Item'}</h2>
            <p className="price">
              R$ {Number(item?.daily_price || 0).toFixed(2)}/dia
            </p>
          </div>

          <div className="form-group">
            <label>Data de Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Data de Término</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          {rentalType === 'vehicle' && (
            <div className="form-group">
              <label>Seguro</label>
              <select
                value={insuranceId}
                onChange={(e) => setInsuranceId(e.target.value)}
                disabled={loading}
                className="form-input"
              >
                <option value="">Sem seguro</option>
                {insuranceOptions.map((opt) => (
                  <option key={opt.id} value={String(opt.id)}>
                    {opt.name} - R$ {Number(opt.daily_price || 0).toFixed(2)}/dia
                  </option>
                ))}
              </select>
              {insuranceId && (
                <p className="insurance-note">
                  {insuranceOptions.find((opt) => String(opt.id) === insuranceId)?.description}
                </p>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentalDetailScreen;
