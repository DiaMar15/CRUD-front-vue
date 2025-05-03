<template>
    <div class="inventory-container">
      <div class="controls">
        <button class="add-button" @click="addProduct">Agregar producto</button>
        <input class="search-input" v-model="search" placeholder="Buscar Producto" />
        <select class="category-select" v-model="selectedCategory">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
  
      <table class="inventory-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Stock Mínimo</th>
            <th>Unidad</th>
            <th>Alerta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredProducts" :key="item.codigo" :class="{ 'low-stock': item.stock < item.stockMinimo }">
            <td>{{ item.codigo }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.categoria }}</td>
            <td>{{ item.stock }} {{ item.unidad }}</td>
            <td>{{ item.stockMinimo }} {{ item.unidad }}</td>
            <td>{{ item.unidad }}</td>
            <td>
              <span v-if="item.stock < item.stockMinimo" class="alert-icon">⚠️</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const search = ref('');
  const selectedCategory = ref('');
  
  const products = ref([
    { codigo: '001', nombre: 'Costilla de cerdo', categoria: 'Carnes', stock: 20, stockMinimo: 10, unidad: 'kilos' },
    { codigo: '012', nombre: 'Cerveza poker', categoria: 'Bebidas', stock: 30, stockMinimo: 50, unidad: 'Botellas' },
    { codigo: '035', nombre: 'Queso Doblecrema', categoria: 'Lacteos', stock: 8, stockMinimo: 5, unidad: 'kilos' },
    { codigo: '054', nombre: 'Tomate', categoria: 'Frutas y Verduras', stock: 7, stockMinimo: 10, unidad: 'kilos' },
    { codigo: '067', nombre: 'Arroz', categoria: 'Granos', stock: 15, stockMinimo: 25, unidad: 'kilos' }
  ]);
  
  const categories = computed(() => [...new Set(products.value.map(p => p.categoria))]);
  
  const filteredProducts = computed(() => {
    return products.value.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(search.value.toLowerCase());
      const matchesCategory = selectedCategory.value ? p.categoria === selectedCategory.value : true;
      return matchesSearch && matchesCategory;
    });
  });
  
  function addProduct() {
    alert('Función agregar producto aún no implementada.');
  }
  </script>
  
  <style scoped>
  .inventory-container {
    padding: 1rem;
    font-family: Arial, sans-serif;
  }
  .controls {
    margin-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .add-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .add-button:hover {
    background-color: #2563eb;
  }
  .search-input, .category-select {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .inventory-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    color: #333;
  }
  .inventory-table th, .inventory-table td {
    border: 1px solid #ddd;
    padding: 0.6rem;
    text-align: left;
  }
  .inventory-table th {
    background-color: #f4f4f4;
    color: #333;
  }
  .low-stock {
    background-color: #fa3142;
    color: #000000;
  }
  .alert-icon {
    color: red;
    font-size: 1.2rem;
  }
  </style>
  