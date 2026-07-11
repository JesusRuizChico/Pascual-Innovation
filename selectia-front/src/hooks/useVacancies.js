// src/hooks/useVacancies.js
import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const useVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/vacancies/mine');
      setVacancies(res.data);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar tus vacantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  return { vacancies, loading, error, refetch: fetchVacancies };
};

export default useVacancies;
