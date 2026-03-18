import { useEffect, useState, useCallback } from "react";
import {
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  InputBase,
  Button,
  Chip,
  Zoom,
  Fade,
  Slide,
  useTheme,
  alpha,
  Pagination,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewReleasesIcon,
} from "@mui/icons-material";
import api from "../api/api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import Navbar from "../components/Navbar";
import ProductDetailModal from "../components/ProductDetailModal";

export default function ProductsList() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  
  // Estados para paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Incluir parâmetros de paginação
      const res = await api.get("/products", {
        params: { 
          search, 
          category_id: categoryId,
          page: page,
          per_page: perPage
        },
      });

      // Pegar dados e meta da resposta
      const productsData = res.data.data || [];
      const meta = res.data.meta || {};
      
      let sortedProducts = [...productsData];

      // Ordenação local
      if (sortBy === "price_asc") {
        sortedProducts.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price),
        );
      } else if (sortBy === "price_desc") {
        sortedProducts.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price),
        );
      } else if (sortBy === "name_asc") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(sortedProducts);
      
      // Atualizar informações de paginação
      setTotalPages(meta.last_page || 1);
      setTotalProducts(meta.total || productsData.length);
      
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, sortBy, page, perPage]);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPage(1);
  }, [search, categoryId, sortBy, perPage]);

  // Debounce para busca
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fetchProducts]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (event) => {
    setPerPage(event.target.value);
    setPage(1);
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Navbar cartCount={cartCount} />

      {/* Hero Section com Banner */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: "white",
          py: { xs: 6, md: 8 },
          mb: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      mb: 2,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    Descubra Ofertas Incríveis
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      fontWeight: 300,
                    }}
                  >
                    Os melhores produtos com os melhores preços você encontra
                    aqui
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Chip
                      icon={<LocalOfferIcon />}
                      label="Até 50% OFF"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                    <Chip
                      icon={<NewReleasesIcon />}
                      label="Novidades"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                    <Chip
                      icon={<TrendingUpIcon />}
                      label="Mais Vendidos"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "& .MuiChip-icon": { color: "white" },
                      }}
                    />
                  </Box>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} md={5}>
              <Fade in={true} style={{ transitionDelay: "400ms" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 200, opacity: 0.2 }} />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Barra de Pesquisa Avançada */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "white",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="O que você está procurando?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
              <CategoryFilter
                value={categoryId}
                onChange={(id) => setCategoryId(id)}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<TuneIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "divider",
                  color: "text.primary",
                }}
              >
                Filtros {showFilters ? "▲" : "▼"}
              </Button>
            </Grid>
          </Grid>

          {/* Filtros Avançados */}
          <Zoom in={showFilters}>
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Ordenar por:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label="Padrão"
                      onClick={() => setSortBy("default")}
                      color={sortBy === "default" ? "primary" : "default"}
                      variant={sortBy === "default" ? "filled" : "outlined"}
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      label="Menor Preço"
                      onClick={() => setSortBy("price_asc")}
                      color={sortBy === "price_asc" ? "primary" : "default"}
                      variant={sortBy === "price_asc" ? "filled" : "outlined"}
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      label="Maior Preço"
                      onClick={() => setSortBy("price_desc")}
                      color={sortBy === "price_desc" ? "primary" : "default"}
                      variant={sortBy === "price_desc" ? "filled" : "outlined"}
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      label="A-Z"
                      onClick={() => setSortBy("name_asc")}
                      color={sortBy === "name_asc" ? "primary" : "default"}
                      variant={sortBy === "name_asc" ? "filled" : "outlined"}
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Zoom>
        </Paper>

        {/* Produtos em Destaque - SÓ NA PÁGINA 1 */}
        {!search && !categoryId && page === 1 && products.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TrendingUpIcon color="primary" />
              Produtos em Destaque
            </Typography>
            <Grid container spacing={3}>
              {featuredProducts.map((p, index) => (
                <Grid item key={p.id} xs={12} sm={6} md={3}>
                  <Slide
                    direction="up"
                    in={true}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Box
                      onClick={() => handleOpenDetail(p)}
                      sx={{
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-8px)",
                        },
                      }}
                    >
                      <ProductCard
                        product={p}
                        onAddToCart={() => handleAddToCart(p)}
                      />
                    </Box>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Resultados da Busca */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Buscando..."
              : `${totalProducts} produtos encontrados`}
            {search && ` para "${search}"`}
            {categoryId && ` na categoria selecionada`}
            {!loading && totalPages > 1 && ` (página ${page} de ${totalPages})`}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Seletor de itens por página */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={perPage}
                onChange={handlePerPageChange}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={10}>10 / página</MenuItem>
                <MenuItem value={20}>20 / página</MenuItem>
                <MenuItem value={50}>50 / página</MenuItem>
              </Select>
            </FormControl>
            
            {search && (
              <Button
                size="small"
                onClick={() => setSearch("")}
                startIcon={<CloseIcon />}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Limpar
              </Button>
            )}
          </Box>
        </Box>

        {/* Lista de Produtos */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.length > 0 ? (
                products.map((p, index) => (
                  <Grid item key={p.id} xs={12} sm={6} md={4} lg={3}>
                    <Fade
                      in={true}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <Box
                        onClick={() => handleOpenDetail(p)}
                        sx={{
                          cursor: "pointer",
                          transition: "0.3s",
                          "&:hover": {
                            transform: "translateY(-8px)",
                          },
                          height: "100%",
                        }}
                      >
                        <ProductCard
                          product={p}
                          onAddToCart={() => handleAddToCart(p)}
                        />
                      </Box>
                    </Fade>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Fade in={true}>
                    <Paper
                      sx={{
                        p: 8,
                        textAlign: "center",
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      }}
                    >
                      <ShoppingBagIcon
                        sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nenhum produto encontrado
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Tente buscar por outros termos ou navegue por categorias
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSearch("");
                          setCategoryId("");
                          setPage(1);
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Ver todos os produtos
                      </Button>
                    </Paper>
                  </Fade>
                </Grid>
              )}
            </Grid>

            {/* Paginação */}
            {totalPages > 1 && (
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Newsletter */}
        {totalProducts > 0 && (
          <Paper
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Fique por dentro das novidades!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Receba ofertas exclusivas e lançamentos em primeira mão
            </Typography>
            <Box sx={{ display: "flex", maxWidth: 500, mx: "auto", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Seu melhor e-mail"
                size="small"
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              />
              <Button variant="contained" sx={{ borderRadius: 2, px: 4 }}>
                Inscrever
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      <ProductDetailModal
        open={detailOpen}
        onClose={handleCloseDetail}
        product={selectedProduct}
      />
    </>
  );
}