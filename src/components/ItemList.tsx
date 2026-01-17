import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TableSortLabel,
  TablePagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import React from 'react';
import { Item } from '../types';

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete, sortField, sortOrder, onSortChange, total, page, pageSize, onPageChange, onPageSizeChange }) => {
  const handleSort = (field: string) => {
    if (sortField === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Items List
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortField === 'name' ? sortOrder : undefined}>
                <TableSortLabel active={sortField === 'name'} direction={sortOrder} onClick={() => handleSort('name')}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={sortField === 'description' ? sortOrder : undefined}>
                <TableSortLabel active={sortField === 'description'} direction={sortOrder} onClick={() => handleSort('description')}>
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(item)} color="primary" size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total || 0}
        page={page}
        onPageChange={(event, page) => onPageChange(page)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(event) => onPageSizeChange(parseInt(event.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default ItemList;