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
        // Acessando res.data.data conforme o padrão do seu Laravel Resource
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
        // Garante que o MUI sempre tenha uma string para não dar erro de "uncontrolled component"
        value={value || ''}
        label="Filtrar por Categoria"
        onChange={(e) => onChange(e.target.value || null)}
        disabled={loading}
        // Ícone de carregamento discreto dentro do select
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