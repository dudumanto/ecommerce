import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Grid,
  IconButton,
  Button,
  Chip,
  Divider,
  Rating,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import { IMAGE_BASE_URL } from "../config";

export default function ProductDetailModal({ open, onClose, product }) {
  const theme = useTheme();
  
  if (!product) return null;

  // Função para calcular desconto fictício (apenas para demonstração)
  const originalPrice = product.price ? parseFloat(product.price) * 1.15 : 0;
  const discount = product.price ? 15 : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 10,
          bgcolor: "rgba(0,0,0,0.04)",
          color: "text.secondary",
          transition: "all 0.2s",
          "&:hover": { 
            bgcolor: "rgba(0,0,0,0.08)",
            transform: "scale(1.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Grid container>
          {/* ÁREA DA IMAGEM - REDUZIDA SIGNIFICATIVAMENTE */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{ 
              bgcolor: "#f8fafc",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: { xs: 280, md: 400 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "transparent",
                  position: "relative",
                }}
              >
                {/* Badge de desconto */}
                <Chip
                  label={`-${discount}%`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bgcolor: "#ef4444",
                    color: "white",
                    fontWeight: 700,
                    zIndex: 2,
                  }}
                />
                
                {/* Imagem do produto com tamanho controlado */}
                <Box
                  component="img"
                  src={`${IMAGE_BASE_URL}${product.image_url}`}
                  alt={product.name}
                  sx={{
                    maxWidth: "85%", // Reduzido de 100% para 85%
                    maxHeight: "85%", // Reduzido de 100% para 85%
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Paper>
            </Box>
          </Grid>

          {/* ÁREA DE INFORMAÇÕES - AUMENTADA */}
          <Grid 
            item 
            xs={12} 
            md={7} 
            sx={{ 
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Categoria e avaliação */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Chip
                label={product.category?.name || "Produto"}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  border: "none",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Rating 
                  value={4.5} 
                  readOnly 
                  size="small" 
                  precision={0.5}
                  sx={{ color: "#fbbf24" }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  (45 avaliações)
                </Typography>
              </Box>
            </Box>

            {/* Nome do produto */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: "text.primary",
                lineHeight: 1.2,
                fontSize: { xs: "1.75rem", md: "2rem" },
              }}
            >
              {product.name}
            </Typography>

            {/* Preços */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                R$ {product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "line-through",
                  }}
                >
                  R$ {originalPrice.toFixed(2)}
                </Typography>
               
              </Box>
            </Box>

            {/* Opções de frete */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#f0f9ff",
                p: 2,
                borderRadius: 2,
                mb: 3,
                border: "1px solid",
                borderColor: "#bae6fd",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalShippingIcon sx={{ color: "#0284c7", fontSize: 20 }} />
              <Typography variant="body2" color="#0369a1" sx={{ fontWeight: 500 }}>
                Frete grátis para todo o Brasil
              </Typography>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* Descrição */}
            <Typography
              variant="subtitle1"
              sx={{ 
                fontWeight: 700, 
                mb: 1.5, 
                color: "text.primary",
                textTransform: "uppercase",
                fontSize: "0.875rem",
                letterSpacing: "0.5px",
              }}
            >
              Descrição do Produto
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                mb: 4, 
                lineHeight: 1.8,
                fontSize: "0.95rem",
              }}
            >
              {product.description || "Este produto não possui descrição detalhada disponível no momento. Entre em contato para mais informações."}
            </Typography>

            {/* Garantias */}
            <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SecurityIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Compra Segura
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Entrega Garantida
                </Typography>
              </Box>
            </Box>

            {/* Botão de compra */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingBagIcon />}
              sx={{
                py: 2,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 700,
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.2)",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 25px -5px rgba(0,0,0,0.3)",
                },
              }}
            >
              Adicionar ao Carrinho
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}