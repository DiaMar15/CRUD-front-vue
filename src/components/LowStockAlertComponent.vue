<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal">
        <h2>Alerta de Bajo Stock</h2>
        <p>El producto <strong>{{ product.nombre }}</strong> tiene un stock bajo.</p>
        <p>Stock actual: <strong>{{ product.stock }}</strong> {{ product.unidad }}.</p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    show: Boolean,
    product: Object
  })
  
  const emit = defineEmits(['close'])
  
  function closeModal() {
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    color: #333; 
    font-family: Arial, sans-serif; 
  }
  
  h2 {
    color: #e53e3e; 
  }
  
  p {
    color: #444; 
  }
  
  button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2563eb;
  }
  </style>
  