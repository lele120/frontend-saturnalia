import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Terreno } from '../types';
import { getTerreni } from '../services/apiService';

interface TerrenoListProps {
  refreshTrigger: number;
}

const TerrenoList: React.FC<TerrenoListProps> = ({ refreshTrigger }) => {
  const [terreni, setTerreni] = useState<Terreno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTerreni = async () => {
    try {
      setLoading(true);
      const data = await getTerreni();
      setTerreni(data);
    } catch (err) {
      setError('Errore nel caricamento dei terreni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerreni();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Terreni Salvati ({terreni.length})
      </Typography>

      {terreni.length === 0 ? (
        <Typography color="text.secondary">
          Nessun terreno salvato ancora.
        </Typography>
      ) : (
        <List>
          {terreni.map((terreno) => (
            <ListItem key={terreno.id} divider>
              <ListItemText
                primary={`${terreno.nome} - ${terreno.comune}`}
                secondary={
                  <>
                    Area coltivata: {terreno.area_coltivata_m2} m² | 
                    Superficie catastale: {terreno.superficie_catastale_totale} m² | 
                    Particelle: {terreno.numero_particelle}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TerrenoList;