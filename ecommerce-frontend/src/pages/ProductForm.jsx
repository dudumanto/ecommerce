import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Card,
  CardMedia,
  FormHelperText,
  InputAdornment,
  Divider,
  Avatar,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  PhotoCamera,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { IMAGE_BASE_URL } from "../config";

export default function ProductForm() {
  const theme = useTheme();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  // Estado de erro centralizado
  const [errors, setErrors] = useState({});

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCat = await api.get("/categories");
        setCategories(resCat.data.data);

        if (isEdit) {
          const resProd = await api.get(`/products/${id}`);
          const p = resProd.data.data;

          setName(p.name);
          setDescription(p.description || "");
          setPrice(p.price);
          setCategoryId(p.category_id);

          if (p.image_url) {
            setPreview(`${IMAGE_BASE_URL}${p.image_url}`);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados", err);
        setNotification({
          open: true,
          message: "Erro ao carregar dados do formulário",
          severity: "error",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification({
          open: true,
          message: "Por favor, selecione apenas arquivos de imagem",
          severity: "error",
        });
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // Ajustado para 2MB para consistência
        setNotification({
          open: true,
          message: "A imagem não pode ser maior que 2MB",
          severity: "error",
        });
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  // --- NOVA LÓGICA DE VALIDAÇÃO COMPLETA ---
  const validateForm = () => {
    const newErrors = {};

    // Validação Nome
    if (!name.trim()) {
      newErrors.name = "O nome do produto é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "O nome deve ter pelo menos 3 caracteres";
    }

    // Validação Preço
    if (!price) {
      newErrors.price = "O preço é obrigatório";
    } else if (parseFloat(price) <= 0) {
      newErrors.price = "O preço deve ser maior que zero";
    }

    // Validação Categoria
    if (!categoryId) {
      newErrors.categoryId = "Selecione uma categoria";
    }

    // Validação Descrição
    if (!description.trim()) {
      newErrors.description = "A descrição é obrigatória";
    } else if (description.trim().length < 10) {
      newErrors.description = "A descrição deve ser mais detalhada (mín. 10 caracteres)";
    }

    // Validação Imagem (Obrigatória se for novo ou se não houver preview no edit)
    if (!image && !preview) {
      newErrors.image = "A foto do produto é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        open: true,
        message: "Verifique os erros no formulário antes de continuar",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("category_id", categoryId);

    if (image) formData.append("image", image);
    if (isEdit) formData.append("_method", "PUT");

    try {
      const url = isEdit ? `/products/${id}` : "/products";
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification({
        open: true,
        message: isEdit ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
        severity: "success",
      });

      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        // Mapeia erros vindos do backend (Laravel/Node/etc)
        const serverErrors = err.response.data.errors;
        setErrors({
          name: serverErrors.name?.[0],
          price: serverErrors.price?.[0],
          categoryId: serverErrors.category_id?.[0],
          description: serverErrors.description?.[0],
          image: serverErrors.image?.[0],
        });
      }
      setNotification({
        open: true,
        message: err.response?.data?.message || "Erro ao processar produto",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", pt: 4, pb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate("/admin/products")} sx={{ mr: 2, bgcolor: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {isEdit ? "Editar Produto" : "Novo Produto"}
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #eee" }}>
            <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: "white" }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                <InventoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Informações do Produto
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    
                    {/* NOME */}
                    <TextField
                      label="Nome do Produto"
                      fullWidth
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({...errors, name: null});
                      }}
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (<InputAdornment position="start"><InventoryIcon color="primary" /></InputAdornment>),
                      }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        {/* PREÇO */}
                        <TextField
                          label="Preço"
                          fullWidth
                          required
                          type="number"
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value);
                            if (errors.price) setErrors({...errors, price: null});
                          }}
                          error={!!errors.price}
                          helperText={errors.price}
                          InputProps={{
                            startAdornment: (<InputAdornment position="start"><AttachMoneyIcon color="primary" /></InputAdornment>),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {/* CATEGORIA */}
                        <FormControl fullWidth required error={!!errors.categoryId}>
                          <InputLabel>Categoria</InputLabel>
                          <Select
                            value={categoryId}
                            label="Categoria"
                            onChange={(e) => {
                              setCategoryId(e.target.value);
                              if (errors.categoryId) setErrors({...errors, categoryId: null});
                            }}
                            startAdornment={(<InputAdornment position="start"><CategoryIcon color="primary" /></InputAdornment>)}
                          >
                            {categories.map((c) => (
                              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                          </Select>
                          {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* DESCRIÇÃO */}
                    <TextField
                      label="Descrição detalhada"
                      fullWidth
                      required
                      multiline
                      rows={5}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) setErrors({...errors, description: null});
                      }}
                      error={!!errors.description}
                      helperText={errors.description}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Imagem do Produto <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  
                  <Card sx={{ 
                    borderRadius: 3, 
                    border: errors.image ? "2px dashed red" : "2px dashed #ccc",
                    bgcolor: errors.image ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.primary.main, 0.02)
                  }}>
                    {preview ? (
                      <Box sx={{ position: "relative" }}>
                        <CardMedia component="img" image={preview} sx={{ height: 250, objectFit: "contain", p: 2 }} />
                        <IconButton 
                          color="error" 
                          onClick={() => { setImage(null); setPreview(null); }}
                          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ height: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: alpha(theme.palette.primary.main, 0.1), mb: 2 }}>
                          <PhotoCamera color="primary" />
                        </Avatar>
                        <Typography variant="body2" color={errors.image ? "error" : "textSecondary"}>
                          {errors.image || "A foto é obrigatória"}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
                      <Button fullWidth variant="outlined" component="label" startIcon={<PhotoCamera />}>
                        {preview ? "Trocar Foto" : "Selecionar Foto"}
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      </Button>
                    </Box>
                  </Card>
                  {errors.image && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: "block", fontWeight: 'bold' }}>
                      {errors.image}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" size="large" onClick={() => navigate("/admin/products")}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}>
                  {loading ? "Processando..." : isEdit ? "Atualizar Produto" : "Salvar Produto"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>
    </>
  );
}