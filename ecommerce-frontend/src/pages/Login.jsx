import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../api/api";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton, // Adicione estes dois
} from "@mui/material";
// Importe os ícones de olho
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidade
  const navigate = useNavigate();

  // Função para alternar o estado do olho
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user_name", res.data.data.user.name);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Bem-vindo
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              autoFocus
            />

            <TextField
              label="Senha"
              // Aqui a mágica acontece: o type muda de 'password' para 'text'
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              // Adicionando o ícone no final do input
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
              sx={{ py: 1.5, mb: 2 }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Typography variant="body2">
              Não tem uma conta?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Cadastre-se
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
