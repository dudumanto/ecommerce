import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton width="60%" height={40} />
              <Skeleton width="40%" height={30} sx={{ my: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton width="30%" height={50} sx={{ mt: 4 }} />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  if (!product)
    return (
      <Typography sx={{ p: 5, textAlign: "center" }}>
        Produto não encontrado.
      </Typography>
    );

  return (
    <>
      <Navbar />
      <Container sx={{ py: 5 }}>
        {/* Botão de Voltar */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Voltar para a listagem
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 4,
            border: "1px solid #eee",
          }}
        >
          <Grid container spacing={6}>
            {/* Lado Esquerdo: Imagem */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: 450,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f9f9f9",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image_url || "https://via.placeholder.com/400"}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>

            {/* Lado Direito: Informações */}
            <Grid item xs={12} md={6}>
              <Box>
                <Chip
                  label={product.category?.name || "Sem categoria"}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2, fontWeight: "bold" }}
                />

                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 800 }}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 3 }}
                >
                  {product.formatted_price}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Descrição:
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ lineHeight: 1.8 }}
                >
                  {product.description ||
                    "Este produto não possui uma descrição detalhada."}
                </Typography>

                <Box sx={{ mt: 5 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ py: 2, borderRadius: 2 }}
                  >
                    Adicionar ao Carrinho
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
