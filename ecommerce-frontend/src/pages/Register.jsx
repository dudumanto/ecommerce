import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api/api';
import { 
  Container, Typography, TextField, Button, 
  Box, Paper, Alert, CircularProgress, Link 
} from '@mui/material';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/register', { name, email, password });
      
      // Opcional: Você pode salvar o token aqui e já logar direto, 
      // mas redirecionar para o login é mais seguro para validar o fluxo.
      navigate('/login', { state: { message: 'Cadastro realizado! Faça seu primeiro login.' } });
    } catch (err) {
      console.error(err);
      // Aqui pegamos os erros de validação do Laravel (ex: e-mail já existe)
      setError(err.response?.data?.message || 'Erro ao cadastrar usuário. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#f5f5f5',
        py: 4 
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
            Criar Conta
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Cadastre-se para gerenciar seus produtos
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label="Nome Completo"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              autoFocus
            />
            
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              helperText="Mínimo 8 caracteres, com letras (A-z) e números."
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{ py: 1.5, mb: 2 }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            <Typography variant="body2" align="center">
              Já tem uma conta?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Faça Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}