// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
  TextField,
  Button,
  Autocomplete,
  Grid,
  Container,
} from '@mui/material';

function App() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variations, setVariations] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Define the initial state for formData
  const initialFormData = {
    itemName: '',
    category: '',
    brand: '',
    year: '',
    itemCode: '',
    variation: '',
    size: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const [generatedSKU, setGeneratedSKU] = useState('');

  // Fetch symbol tables on component mount
  useEffect(() => {
    fetchSymbolTables();
  }, []);

  const fetchSymbolTables = async () => {
    let { data: categoryData } = await supabase.from('category').select('*');
    setCategories(categoryData || []);

    let { data: brandData } = await supabase.from('brand').select('*');
    setBrands(brandData || []);

    let { data: variationData } = await supabase.from('variation').select('*');
    setVariations(variationData || []);

    let { data: sizeData } = await supabase.from('size').select('*');
    setSizes(sizeData || []);
  };

  const handleInputChange = (field) => (event, value) => {
    //setFormData({ ...formData, [field]: value || event.target.value });

    const newValue = value !== undefined ? value : event?.target?.value || '';
    setFormData({ ...formData, [field]: newValue });
  };

  const generateSKU = async () => {
    // Handle categories
    let category = await getOrCreate(
      'category',
      'category_code',
      'description',
      formData.category,
      10,
      99
    );

    // Handle brands
    let brand = await getOrCreate(
      'brand',
      'brand_code',
      'description',
      formData.brand,
      0,
      999
    );

    // Handle variations
    let variation = await getOrCreate(
      'variation',
      'variation_code',
      'description',
      formData.variation,
      0,
      99
    );

    // Handle sizes
    let size = await getOrCreate(
      'size',
      'size_code',
      'description',
      formData.size,
      0,
      99
    );

    // Handle item
    let { data: itemData, error: itemError } = await supabase
      .from('item')
      .insert([
        {
          name: formData.itemName,
          category_code: category.code,
          brand_code: brand.code,
          year: parseInt(formData.year),
          item_code: parseInt(formData.itemCode),
        },
      ])
      .select();

    if (itemError) {
      console.error('Item Error:', itemError);
      return;
    }

    let item = itemData[0];

    // Handle SKU
    let skuString =
      padNumber(category.code, 2) +
      padNumber(brand.code, 3) +
      padNumber(item.unique_item_id, 5) +
      padNumber(variation.code, 2) +
      padNumber(size.code, 2);

    // Save SKU
    let { data: skuData, error: skuError } = await supabase.from('sku').insert([
      {
        sku: skuString,
        item_id: item.item_id,
        variation_code: variation.code,
        size_code: size.code,
      },
    ]);

    if (skuError) {
      console.error('SKU Error:', skuError);
      return;
    }

    setGeneratedSKU(skuString);
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setGeneratedSKU('');
  };

  const getOrCreate = async (table, codeField, descField, description, minCode, maxCode) => {
    // Check if entry exists
    let { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(descField, description)
      .limit(1);

    if (data.length > 0) {
      return { code: data[0][codeField], description: data[0][descField] };
    } else {
      // Get max code
      let { data: maxData } = await supabase
        .from(table)
        .select(codeField)
        .order(codeField, { ascending: false })
        .limit(1)

      let newCode = minCode;

      // Make sure the new entry has a code higher than the max code in DB
      if (maxData && maxData[0][codeField] < maxCode) {
        newCode = maxData[0][codeField] + 1;
      }

      // Insert new entry
      let { data: newData, error: insertError } = await supabase
        .from(table)
        .insert([{ [codeField]: newCode, [descField]: description }])
        .select();

      if (insertError) {
        console.error(`Error inserting into ${table}:`, insertError);
        return null;
      }

      return { code: newData[0][codeField], description: newData[0][descField] };
    }
  };

  const padNumber = (num, size) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  };

  return (
    <Container>
      <h1>SKU Generator</h1>
      <Grid container spacing={2}>
        {/* Item Name */}
        <Grid item xs={12}>
          <TextField
            label="Item Name"
            fullWidth
            value={formData.itemName}
            onChange={handleInputChange('itemName')}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={categories.map((option) => option.description)}
            onInputChange={handleInputChange('category')}
            renderInput={(params) => (
              <TextField {...params} label="Category" fullWidth />
            )}
            value={formData.category}
          />
        </Grid>

        {/* Brand */}
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={brands.map((option) => option.description)}
            onInputChange={handleInputChange('brand')}
            renderInput={(params) => (
              <TextField {...params} label="Brand" fullWidth />
            )}
            value={formData.brand}
          />
        </Grid>

        {/* Year */}
        <Grid item xs={6}>
          <TextField
            label="Year (2 digits)"
            fullWidth
            type="number"
            inputProps={{ maxLength: 2 }}
            value={formData.year}
            onChange={handleInputChange('year')}
          />
        </Grid>

        {/* Item Code */}
        <Grid item xs={6}>
          <TextField
            label="Item Code (3 digits)"
            fullWidth
            type="number"
            inputProps={{ maxLength: 3 }}
            value={formData.itemCode}
            onChange={handleInputChange('itemCode')}
          />
        </Grid>

        {/* Variation */}
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={variations.map((option) => option.description)}
            onInputChange={handleInputChange('variation')}
            renderInput={(params) => (
              <TextField {...params} label="Variation" fullWidth />
            )}
            value={formData.variation}
          />
        </Grid>

        {/* Size */}
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={sizes.map((option) => option.description)}
            onInputChange={handleInputChange('size')}
            renderInput={(params) => (
              <TextField {...params} label="Size" fullWidth />
            )}
            value={formData.size}
          />
        </Grid>

        {/* Generate SKU Button */}
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={generateSKU} fullWidth>
            Generate SKU
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button variant="outlined" color="secondary" onClick={clearForm} fullWidth>
            Clear
          </Button>
        </Grid>

        {/* Display Generated SKU */}
        {generatedSKU && (
          <Grid item xs={12}>
            <h2>Generated SKU: {generatedSKU}</h2>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;