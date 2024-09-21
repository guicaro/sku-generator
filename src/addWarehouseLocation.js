// src/AddWarehouseLocation.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { TextField, Button, Grid, Container } from '@mui/material';

function AddWarehouseLocation() {
  const [sku, setSKU] = useState('');
  const [location, setLocation] = useState('');

  const handleAddLocation = async () => {
    // Verify SKU exists
    let { data: skuData, error: skuError } = await supabase
      .from('sku')
      .select('sku')
      .eq('sku', sku)
      .limit(1);

    if (skuError || !skuData) {
      console.error('SKU does not exist');
      return;
    }

    // Insert Warehouse Location
    let { data, error } = await supabase.from('warehouselocation').insert([
      {
        sku: sku,
        location: location,
      },
    ]);

    if (error) {
      console.error('Error adding warehouse location:', error);
    } else {
      alert('Warehouse location added successfully');
    }
  };

  return (
    <Container>
      <h1>Add Warehouse Location</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="SKU"
            fullWidth
            value={sku}
            onChange={(e) => setSKU(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddLocation} fullWidth>
            Add Location
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddWarehouseLocation;
