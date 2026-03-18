import { Grid, Card, CardContent, Box, Typography, useTheme } from '@mui/material';

const StatCard = ({ title, value, icon: Icon, color, isCurrency }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} md={3}>
      <Card sx={{ borderRadius: 3, bgcolor: 'white', boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: color }}>
                {isCurrency ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
              </Typography>
              <Typography variant="body2" color="text.secondary">{title}</Typography>
            </Box>
            <Icon sx={{ fontSize: 40, color: color, opacity: 0.3 }} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StatCard;