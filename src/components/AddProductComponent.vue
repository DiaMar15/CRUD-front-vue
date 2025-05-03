<template>
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Agregar producto</h2>
          <button class="close-button" @click="$emit('close')">✖</button>
        </div>
        <div class="modal-body">
          <label>Código</label>
          <input v-model="product.codigo" type="text" />
  
          <label>Nombre del producto</label>
          <input v-model="product.nombre" type="text" />
  
          <label>Categoría</label>
          <input v-model="product.categoria" type="text" />

          <label>Stock</label>
          <input v-model="product.stock" type="number" />
  
          <label>Stock mínimo</label>
          <input v-model="product.stockMinimo" type="number" />
  
          <label>Unidad</label>
          <input v-model="product.unidad" type="text" />
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="$emit('close')">Cancelar</button>
          <button class="save-button" @click="save">Guardar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  import { defineEmits, reactive } from 'vue';
  import axios from 'axios';
  
  interface Producto {
    codigo: string;
    nombre: string;
    categoria: string;
    stock: number;
    stockMinimo: number;
    unidad: string;
  }
  
  const emits = defineEmits<{
    (event: 'save', product: Producto): void;
    (event: 'close'): void;
  }>();
  
  const product = reactive<Producto>({
    codigo: '',
    nombre: '',
    categoria: '',
    stock: 0,
    stockMinimo: 0,
    unidad: '',
  });
  
  async function save() {
    try {
      // Realizar la solicitud POST al backend
      const response = await axios.post('http://localhost:3333/api/v1/inventario', {
        codigo: product.codigo,
        nombre_producto: product.nombre,
        categoria: product.categoria,
        stock: product.stock,
        min_stock: product.stockMinimo,
        u_m: product.unidad,
      });
  
      console.log('Producto agregado:', response.data);
      alert('Producto agregado exitosamente');
  
      // Emitir el evento 'save' con el producto agregado
      emits('save', { ...product });
  
      // Limpiar el formulario
      product.codigo = '';
      product.nombre = '';
      product.categoria = '';
      product.stock = 0;
      product.stockMinimo = 0;
      product.unidad = '';
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Ocurrió un error al agregar el producto');
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background: white;
    padding: 1.5rem;
    border-radius: 16px;
    width: 350px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 2px solid black;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .modal-title {
    background-color: #4f6df5;
    color: white; 
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: bold;
  }
  
  .close-button {
    background: #f87171;
    border: none;
    font-size: 1.2rem;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
  }
  
  .modal-body label {
    display: block;
    margin-top: 0.7rem;
    font-weight: bold;
    color: #333; 
  }
  
  .modal-body input {
    width: 100%;
    margin-top: 0.2rem;
    padding: 0.4rem;
    border: 2px solid #333;
    border-radius: 10px;
    background-color: #f0f0f0;
  }
  
  .modal-footer {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  
  .cancel-button, .save-button {
    padding: 0.4rem 1.2rem;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .cancel-button {
    background-color: #e2e2e2;
  }
  
  .save-button {
    background-color: #4f6df5;
    color: white;
    border: 2px solid #7c3aed;
  }
  </style>
