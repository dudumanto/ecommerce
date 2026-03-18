import { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, TextField, Button, Box, 
  Paper, Snackbar, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import api from '../api/api';
import Navbar from '../components/Navbar';

export default function CategoryManager() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [fetching, setFetching] = useState(true); 
  const [editId, setEditId] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false, message: '', severity: 'success'
  });

  
  const fetchCategories = useCallback(async () => {
    try {
      setFetching(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      showNotification('Erro ao carregar categorias', 'error');
    } finally {
      setFetching(false);
    }
  }, []);

  
  useEffect(() => { 
    fetchCategories(); 
  }, [fetchCategories]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setLoading(true);
    try {
      await api.delete(`/categories/${categoryToDelete.id}`);
      showNotification('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (err) {
      showNotification('Erro ao excluir. Verifique vínculos.', 'error');
    } finally {
      setLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name: name.trim() });
        showNotification('Categoria atualizada!');
      } else {
        await api.post('/categories', { name: name.trim() });
        showNotification('Categoria criada!');
      }
      setName('');
      setEditId(null);
      fetchCategories();
    } catch (err) {
      showNotification('Erro ao processar requisição', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        
        {/* FORMULÁRIO */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            {editId ? 'Editar Categoria' : 'Nova Categoria'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nome da Categoria"
              fullWidth
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              error={!!error}
              helperText={error}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ height: '56px', px: 4 }}
            >
              {editId ? 'Atualizar' : 'Salvar'}
            </Button>
            {editId && (
              <Button 
                onClick={() => { setEditId(null); setName(''); setError(''); }} 
                sx={{ height: '56px' }}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </Paper>

        {/* TABELA COM LOADING STATE */}
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetching ? (
                // Feedback visual de carregamento
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                      Buscando categorias...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">Nenhuma categoria cadastrada.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="primary" 
                        onClick={() => { setEditId(cat.id); setName(cat.name); }}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(cat)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DIALOG DE CONFIRMAÇÃO */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" /> Confirmar Exclusão
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir a categoria <strong>{categoryToDelete?.name}</strong>? 
              Esta ação não pode ser desfeita e pode afetar produtos vinculados.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDeleteDialog} color="inherit" disabled={loading}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              variant="contained" 
              disabled={loading}
              startIcon={loading && <CircularProgress size={16} color="inherit" />}
            >
              Excluir permanentemente
            </Button>
          </DialogActions>
        </Dialog>

        {/* NOTIFICAÇÃO */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={3000} 
          onClose={() => setNotification({...notification, open: false})}
        >
          <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>

      </Container>
    </>
  );
}