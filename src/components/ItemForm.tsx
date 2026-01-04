import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid
} from '@mui/material';
import { Item } from '../types';

interface ItemFormProps {
  onSubmit: (item: { name: string; description: string; price: string }) => void;
  initialItem?: Item | null;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialItem, onCancel }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
    },
  });

  useEffect(() => {
    if (initialItem) {
      reset({
        name: initialItem.name,
        description: initialItem.description,
        price: String(initialItem.price),
      });
    } else {
      reset({
        name: '',
        description: '',
        price: '',
      });
    }
  }, [initialItem, reset]);

  const onSubmitForm = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {initialItem?.id ? 'Edit Item' : 'Add Item'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ mt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                variant="outlined"
              />
            )}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={3}
              />
            )}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="price"
            control={control}
            rules={{
              required: 'Price is required',
              validate: (value) => {
                const num = parseFloat(value);
                return !isNaN(num) && num > 0 || 'Price must be a positive number';
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Price"
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
                variant="outlined"
                inputProps={{ step: '0.01' }}
              />
            )}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {initialItem?.id ? 'Update' : 'Add'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ItemForm;