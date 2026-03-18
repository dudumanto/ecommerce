import { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, InputAdornment } from '@mui/material';
import api from '../api/api';

export default function CategoryFilter({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error("Erro ao carregar categorias no filtro:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <FormControl fullWidth sx={{ mb: { xs: 2, md: 0 } }}>
      <InputLabel id="category-select-label">Filtrar por Categoria</InputLabel>
      <Select
        labelId="category-select-label"
    
        value={value || ''}
        label="Filtrar por Categoria"
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}

        endAdornment={
          loading ? (
            <InputAdornment position="end" sx={{ mr: 3 }}>
              <CircularProgress size={20} />
            </InputAdornment>
          ) : null
        }
      >
        <MenuItem value="">
          <em>Todas as Categorias</em>
        </MenuItem>
        
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}