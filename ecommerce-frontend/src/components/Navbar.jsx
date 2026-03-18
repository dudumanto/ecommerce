import { AppBar, Toolbar, Typography, Button, Box, Container, Tooltip } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings'; // Ícone para Gerenciar

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: 'white', color: '#333' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          
          <Typography
            variant="h5"
            component={Link}
            to="/products"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 800,
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ fontSize: '1.5rem' }}>🛒</Box> 
            MY-SHOP
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {token ? (
              <>
                <Button 
                  component={Link} to="/products" 
                  color={isActive('/products') ? 'primary' : 'inherit'}
                >
                  Vitrine
                </Button>

                <Button 
                  startIcon={<SettingsIcon />}
                  component={Link} to="/admin/products"
                  color={isActive('/admin/products') ? 'primary' : 'inherit'}
                >
                  Gerenciar
                </Button>

                <Button 
                  startIcon={<CategoryIcon />}
                  component={Link} to="/categories/new"
                  color={isActive('/categories/new') ? 'primary' : 'inherit'}
                >
                  Categorias
                </Button>

                <Button 
                  startIcon={<AddCircleOutlineIcon />}
                  component={Link} to="/products/new"
                  color={isActive('/products/new') ? 'primary' : 'inherit'}
                >
                  Novo Produto
                </Button>

                {/* Usuário e Logout */}
                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                    Olá, {userName}
                  </Typography>
                  <Tooltip title="Sair do Sistema">
                    <Button 
                      onClick={handleLogout}
                      variant="outlined" 
                      color="error" 
                      size="small"
                      startIcon={<ExitToAppIcon />}
                      sx={{ ml: 1 }}
                    >
                      Sair
                    </Button>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Entrar
                </Button>
                <Button 
                  component={Link} to="/register" 
                  variant="contained" 
                  color="primary"
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Criar Conta
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}