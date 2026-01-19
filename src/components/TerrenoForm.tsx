import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Autocomplete,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { TerrenoCreate, Particella } from '../types';
import { createTerreno, getComuni, lookupParticella } from '../services/apiService';

interface TerrenoFormProps {
  onSuccess: () => void;
}

const TerrenoForm: React.FC<TerrenoFormProps> = ({ onSuccess }) => {
  const [comuni, setComuni] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState<number | null>(null);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<TerrenoCreate>({
    defaultValues: {
      nome: '',
      area_coltivata_m2: 0,
      particelle: [{ comune: '', sezione: '', foglio: 0, particella: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'particelle',
  });

  useEffect(() => {
    const loadComuni = async () => {
      try {
        const data = await getComuni();
        setComuni(data.comuni);
      } catch (err) {
        console.error('Errore caricamento comuni:', err);
      }
    };
    loadComuni();
  }, []);

  const onSubmit = async (data: TerrenoCreate) => {
    setLoading(true);
    setError(null);
    try {
      // Trasforma i comuni da codice a nome
      const transformedData = {
        ...data,
        particelle: data.particelle.map((p) => ({
          ...p,
          comune: comuni.find((c) => c.value === p.comune)?.label || p.comune,
        })),
      };
      await createTerreno(transformedData);
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Errore durante la creazione del terreno');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (index: number, particella: Particella) => {
    console.log('handleLookup called with:', particella);
    if (!particella.comune || !particella.foglio || !particella.particella) {
      console.log('Missing required fields');
      return;
    }

    setLookupLoading(index);
    try {
      console.log('Calling lookupParticella with:', particella.comune, particella.foglio, particella.particella, particella.sezione);
      const data = await lookupParticella(
        particella.comune,
        particella.foglio,
        particella.particella,
        particella.sezione
      );
      console.log('Lookup result:', data);
      alert(`Particella trovata: ${data.comune} - Sezione: ${data.sezione} - Foglio: ${data.foglio} - Particella: ${data.particella} - Superficie: ${data.superficie_m2} m²`);
    } catch (err: any) {
      console.error('Lookup error:', err);
      alert('Particella non trovata nel catasto');
    } finally {
      setLookupLoading(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Inserisci Nuovo Terreno
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nome Terreno"
              {...control.register('nome', { required: 'Nome obbligatorio' })}
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Area Coltivata (m²)"
              {...control.register('area_coltivata_m2', {
                required: 'Area obbligatoria',
                min: { value: 0, message: 'Area deve essere positiva' },
              })}
              error={!!errors.area_coltivata_m2}
              helperText={errors.area_coltivata_m2?.message}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Particelle Catastali
        </Typography>

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
               <Grid item xs={12} md={3}>
                 <Controller
                   name={`particelle.${index}.comune`}
                   control={control}
                   rules={{ required: 'Comune obbligatorio' }}
                   render={({ field }) => (
                     <Autocomplete
                       options={comuni}
                       value={comuni.find((c) => c.value === field.value) || null}
                       getOptionLabel={(option) => option?.label || ''}
                       isOptionEqualToValue={(option, value) => option?.value === value?.value}
                       onChange={(_, value) => field.onChange(value?.value || '')}
                       renderInput={(params) => (
                         <TextField
                           {...params}
                           label="Comune"
                           error={!!errors.particelle?.[index]?.comune}
                           helperText={errors.particelle?.[index]?.comune?.message}
                         />
                       )}
                     />
                   )}
                 />
               </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Sezione (opzionale)"
                  {...control.register(`particelle.${index}.sezione`)}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Foglio"
                  {...control.register(`particelle.${index}.foglio`, {
                    required: 'Foglio obbligatorio',
                    min: { value: 1, message: 'Foglio deve essere positivo' },
                  })}
                  error={!!errors.particelle?.[index]?.foglio}
                  helperText={errors.particelle?.[index]?.foglio?.message}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Particella"
                  {...control.register(`particelle.${index}.particella`, {
                    required: 'Particella obbligatoria',
                    min: { value: 1, message: 'Particella deve essere positiva' },
                  })}
                  error={!!errors.particelle?.[index]?.particella}
                  helperText={errors.particelle?.[index]?.particella?.message}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleLookup(index, watch(`particelle.${index}`))}
                  disabled={lookupLoading === index}
                  startIcon={lookupLoading === index ? <CircularProgress size={16} /> : null}
                >
                  Verifica
                </Button>
              </Grid>

              <Grid item xs={12} md={1}>
                <IconButton
                  color="error"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => append({ comune: '', sezione: '', foglio: 0, particella: 0 })}
          >
            Aggiungi Particella
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Salva Terreno'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TerrenoForm;