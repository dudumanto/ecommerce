import { useState, useCallback, useMemo } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button, Box, 
  Avatar, Chip, TextField, InputAdornment, Pagination, 
  FormControl, InputLabel, Select, MenuItem, alpha, useTheme, 
  Tooltip, Skeleton, Grid, Snackbar, Alert, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle, 
  CircularProgress 
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  ShoppingBag as ShoppingBagIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  ImageNotSupported as ImageNotSupportedIcon,
} from '@mui/icons-material';

// Hooks e Componentes Customizados
import { useAdminProducts } from '../hooks/useAdminProducts'; // SEU HOOK NOVO
import StatCard from '../components/ProductStats';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { IMAGE_BASE_URL } from '../config';
import ProductFormModal from '../components/ProductFormModal';

export default function AdminProducts() {
  const theme = useTheme();
  
  // 1. Usando o hook NOVO que tem totalItems
  const {
    products = [], 
    categories = [], 
    loading,
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter,
    page, 
    setPage, 
    totalValue,
    totalPages,
    totalItems, // <-- NOVO: total de produtos no banco (12)
    fetchProducts
  } = useAdminProducts();

  // 2. Estados Locais (UI e Modais)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const rowsPerPage = 8;

  // 3. Handlers de UI
  const handleShowAlert = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleOpenModal = useCallback((id = null) => {
    setSelectedProductId(id);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProductId(null);
  }, []);

  const handleOpenDeleteDialog = useCallback((product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    if (!deleteLoading) {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  }, [deleteLoading]);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);
      await fetchProducts(); // Recarrega a lista
      handleShowAlert("Produto excluído com sucesso!");
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      handleShowAlert(
        err.response?.data?.message || "Erro ao excluir produto.", 
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveSuccess = useCallback(() => {
    fetchProducts();
    handleShowAlert("Operação realizada com sucesso!");
    handleCloseModal();
  }, [fetchProducts, handleShowAlert, handleCloseModal]);

  // 4. Produtos sem imagem com verificação de segurança
  const productsWithoutImage = useMemo(() => {
    if (!products || products.length === 0) {
      return 0;
    }
    return products.filter(p => !p.image_url).length;
  }, [products]);

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        pt: 4, 
        pb: 8,
      }}>
        <Container maxWidth="xl">
          
          {/* Cabeçalho */}
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            <InventoryIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: 35 }} />
            Gerenciar Produtos
          </Typography>
          
          {/* Dashboard de Stats - AGORA USA totalItems */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <StatCard 
              title="Total de Produtos" 
              value={totalItems || products?.length || 0} // PRIORIDADE: totalItems (12)
              icon={ShoppingBagIcon} 
              color={theme.palette.primary.main} 
            />
            <StatCard 
              title="Valor em Estoque" 
              value={totalValue || 0} 
              icon={AttachMoneyIcon} 
              color={theme.palette.success.main} 
              isCurrency={true} 
            />
            <StatCard 
              title="Categorias Ativas" 
              value={categories?.length || 0} 
              icon={CategoryIcon} 
              color={theme.palette.info.main} 
            />
            <StatCard 
              title="Sem Imagem" 
              value={productsWithoutImage} 
              icon={ImageNotSupportedIcon} 
              color={theme.palette.warning.main} 
            />
          </Grid>

          {/* Barra de Filtros */}
          <Paper elevation={0} sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider', 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            alignItems: { md: 'center' }, 
            justifyContent: 'space-between' 
          }}>
            <Box sx={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Buscar produtos..."
                size="small"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 280 }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Categoria</InputLabel>
                <Select 
                  value={categoryFilter || 'all'} 
                  label="Categoria" 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">Todas as categorias</MenuItem>
                  {categories && categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {/* MOSTRAR TOTAL DE PRODUTOS */}
              <Chip 
                label={`${totalItems} produtos no total`}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
              
              <Tooltip title="Atualizar lista">
                <IconButton onClick={fetchProducts} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpenModal()} 
                sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
              >
                Novo Produto
              </Button>
            </Box>
          </Paper>

          {/* INFO DE PAGINAÇÃO */}
          {totalItems > 0 && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {products.length} de {totalItems} produtos
                {totalPages > 1 && ` (página ${page} de ${totalPages})`}
              </Typography>
            </Box>
          )}

          {/* Tabela */}
          <TableContainer component={Paper} elevation={0} sx={{ 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Foto</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Preço</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton loading
                  [...Array(5)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell colSpan={5}>
                        <Skeleton height={60} animation="wave" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length > 0 ? (
                  // Produtos
                  products.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Avatar 
                          src={product.image_url ? `${IMAGE_BASE_URL}${product.image_url}` : ''} 
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        >
                          {!product.image_url && <ImageNotSupportedIcon />}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                        {product.description && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                            {product.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.category?.name || 'Sem categoria'} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        R$ {parseFloat(product.price || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenModal(product.id)} 
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(product)} 
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Nenhum produto encontrado
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Nenhum produto encontrado
                      </Typography>
                      <Button 
                        variant="text" 
                        startIcon={<RefreshIcon />} 
                        onClick={fetchProducts}
                        sx={{ mt: 1 }}
                      >
                        Recarregar
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, v) => setPage(v)} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </Container>
      </Box>

      {/* Modal de Produto */}
      <ProductFormModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        productId={selectedProductId} 
        onSave={handleSaveSuccess} 
      />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Deseja excluir permanentemente o produto{' '}
            <strong>{productToDelete?.name}</strong>?
            <br />
            Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          onClose={handleCloseSnackbar}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}