import React, { useState } from 'react';
import { Container, Typography, Alert, Snackbar } from '@mui/material';
import TerrenoForm from '../components/TerrenoForm';
import TerrenoList from '../components/TerrenoList';

const TerreniPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTerrenoCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setSuccessMessage('Terreno creato con successo!');
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Portale Fascicolo Aziendale Agricolo
      </Typography>
      
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Gestione Terreni Coltivati e Particelle Catastali
      </Typography>

      <TerrenoForm onSuccess={handleTerrenoCreated} />
      <TerrenoList refreshTrigger={refreshTrigger} />

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TerreniPage;