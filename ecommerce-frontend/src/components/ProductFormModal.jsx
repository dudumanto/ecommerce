import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  FormHelperText,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/api";
import { IMAGE_BASE_URL } from "../config";

export default function ProductFormModal({ open, onClose, productId, onSave }) {
  const isEdit = Boolean(productId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- ESTADO DE VALIDAÇÃO ---
  const [errors, setErrors] = useState({});

  const clearForm = useCallback(() => {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setImage(null);
    setPreview(null);
    setErrors({});
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Erro categorias:", err);
    }
  };

  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      const p = res.data.data;
      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price || "");
      if (p.category?.id) setCategoryId(String(p.category.id));
      else if (p.category_id) setCategoryId(String(p.category_id));
      if (p.image_url) setPreview(`${IMAGE_BASE_URL}${p.image_url}`);
    } catch (err) {
      console.error("Erro ao carregar produto:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (isEdit) fetchProductData();
      else clearForm();
    }
  }, [open, productId, isEdit, fetchProductData, clearForm]);

  // --- LÓGICA DE VALIDAÇÃO ---
  const validate = () => {
    let tempErrors = {};
    
    // Validação de Nome
    if (!name.trim()) tempErrors.name = "O nome do produto é obrigatório.";
    else if (name.length < 3) tempErrors.name = "O nome deve ter pelo menos 3 caracteres.";

    // Validação de Preço
    if (!price) tempErrors.price = "O preço é obrigatório.";
    else if (parseFloat(price) <= 0) tempErrors.price = "O preço deve ser maior que zero.";

    // Validação de Categoria
    if (!categoryId) tempErrors.categoryId = "Selecione uma categoria.";

    // Validação de Descrição
    if (!description.trim()) {
      tempErrors.description = "A descrição é obrigatória.";
    } else if (description.length < 10) {
      tempErrors.description = "A descrição deve ter pelo menos 10 caracteres.";
    }

    // Validação de Foto (Obrigatória no cadastro e na edição se não houver preview)
    if (!preview && !image) {
      tempErrors.image = "A foto do produto é obrigatória.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "A imagem deve ter no máximo 2MB" });
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      // Limpa o erro de imagem assim que uma é selecionada
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);

    if (image instanceof File) {
      formData.append("image", image);
    }

    if (isEdit) {
      formData.append("_method", "PUT");
    }

    try {
      const url = isEdit ? `/products/${productId}` : "/products";
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSave();
      onClose();
    } catch (err) {
      console.error("Erro no envio:", err.response?.data);
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        setErrors({
          name: serverErrors.name?.[0],
          price: serverErrors.price?.[0],
          categoryId: serverErrors.category_id?.[0],
          image: serverErrors.image?.[0],
          description: serverErrors.description?.[0]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
        {loading && !name ? "Carregando..." : isEdit ? `Editar: ${name}` : "Cadastrar Novo Produto"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <TextField
                label="Nome"
                fullWidth
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Preço"
                fullWidth
                required
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{ inputProps: { min: 0, step: "0.01" } }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth required error={!!errors.categoryId} sx={{ mb: 2 }}>
                <InputLabel id="select-categoria-label">Categoria</InputLabel>
                <Select
                  labelId="select-categoria-label"
                  value={categoryId}
                  label="Categoria"
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (errors.categoryId) setErrors({ ...errors, categoryId: "" });
                  }}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
              </FormControl>

              <TextField
                label="Descrição"
                fullWidth
                required
                multiline
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  border: errors.image ? "2px dashed #d32f2f" : "2px dashed #ccc",
                  textAlign: "center",
                  p: 2,
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                {preview ? (
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "contain" }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                      sx={{ position: "absolute", top: -10, right: -10, bgcolor: "white", boxShadow: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ py: 2 }}>
                    <PhotoCamera sx={{ fontSize: 40, color: errors.image ? "#d32f2f" : "#ccc" }} />
                    <Typography variant="body2" color={errors.image ? "error" : "textSecondary"}>
                      Foto Obrigatória
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  color={errors.image ? "error" : "primary"}
                  sx={{ mt: 2 }}
                >
                  {preview ? "Trocar Foto" : "Selecionar Foto"}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                
                {errors.image && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
            {loading ? "Salvando..." : isEdit ? "Salvar Alterações" : "Cadastrar Produto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}