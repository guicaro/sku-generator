// src/SKUSearch.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { TextField, Button, Grid, Container } from '@mui/material';

function SKUSearch() {
  const [sku, setSKU] = useState('');
  const [skuData, setSKUData] = useState(null);

  const handleSearch = async () => {
    let { data, error } = await supabase
      .from('sku')
      .select(`
        sku,
        item:item (
          name,
          category:category (
            description
          ),
          brand:brand (
            description
          ),
          year,
          item_code
        ),
        variation:variation (
          description
        ),
        size:size (
          description
        ),
        warehouse_locations:warehouselocation (
          location
        )
      `)
      .eq('sku', sku)
      .limit(1);

    if (error || data.length < 0) {
      console.error('Error fetching SKU:', error);
    } else {
      //TODO: Replace this [0] with something in the query
      setSKUData(data[0]);
    }
  };

  return (
    <Container>
      <h1>SKU Search</h1>
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
          <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
            Search
          </Button>
        </Grid>

        {/* Display SKU Data */}
        {skuData && (
          <Grid item xs={12}>
            <h2>SKU Details</h2>
            <p>
              <strong>Item Name:</strong> {skuData.item.name}
            </p>
            <p>
              <strong>Category:</strong> {skuData.item.category.description}
            </p>
            <p>
              <strong>Brand:</strong> {skuData.item.brand.description}
            </p>
            <p>
              <strong>Variation:</strong> {skuData.variation.description}
            </p>
            <p>
              <strong>Size:</strong> {skuData.size.description}
            </p>
            <p>
              <strong>Warehouse Locations:</strong>{' '}
              {skuData.warehouse_locations.map((loc) => loc.location).join(', ')}
            </p>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default SKUSearch;
