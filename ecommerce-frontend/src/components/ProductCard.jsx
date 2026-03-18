import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config";

export default function ProductCard({ product }) {
  
  const getImageUrl = () => {
    // DEBUG 1: Verificar o que está chegando da API para este produto
    console.log(`[Debug] Processando imagem de: ${product.name}`);
    console.log(`[Debug] image_url original do BD:`, product.image_url);

    if (!product.image_url) {
      console.warn(`[Debug] Produto ${product.id} está sem URL de imagem.`);
      return "https://via.placeholder.com/300x200?text=Sem+Imagem";
    }

    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }

    const baseUrl = IMAGE_BASE_URL.endsWith('/') 
      ? IMAGE_BASE_URL.slice(0, -1) 
      : IMAGE_BASE_URL;
      
    const path = product.image_url.startsWith('/') 
      ? product.image_url 
      : `/${product.image_url}`;

    const finalUrl = `${baseUrl}${path}`;
    
    // DEBUG 2: Ver a URL final montada
    console.log(`[Debug] URL Final Montada:`, finalUrl);
    
    return finalUrl;
  };

  // Se você quiser que o navegador PARE a execução aqui para você inspecionar as variáveis:
  // Descomente a linha abaixo:
  // debugger;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
      }}
    >
      <CardActionArea sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Box sx={{ width: "100%", bgcolor: "#f5f5f5", position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={getImageUrl()}
            alt={product.name}
            sx={{ objectFit: "contain", p: 1 }}
            onError={(e) => {
              // DEBUG 3: Capturar o erro exato de carregamento
              console.error('[Debug] ERRO DE CARREGAMENTO NO NAVEGADOR!');
              console.error('- Tentou acessar:', e.target.src);
              console.error('- Verifique se o arquivo físico existe em: storage/app/public/products/...');
              
              if (e.target.src !== "https://via.placeholder.com/300x200?text=Erro+ao+carregar") {
                e.target.src = "https://via.placeholder.com/300x200?text=Erro+ao+carregar";
              }
            }}
          />
          {product.category && (
            <Chip
              label={product.category.name}
              size="small"
              sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,0.8)" }}
            />
          )}
        </Box>

        <CardContent sx={{ width: "100%" }}>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: "bold", lineHeight: 1.2, height: "2.4em", overflow: "hidden" }}>
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "3em", mb: 2 }}>
            {product.description || "Sem descrição disponível."}
          </Typography>

          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
            {product.formatted_price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}