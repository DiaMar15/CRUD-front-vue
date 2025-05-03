<template>
    <div v-if="showModal" class="confirm-modal">
      <div class="modal-content">
        <p class="confirmation-message">¿Estás seguro de que deseas eliminar "{{ product?.nombre }}" del inventario?</p>
        <button class="confirm-delete" @click="confirmDelete">Eliminar</button>
        <button class="cancel-delete" @click="closeModal">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  interface Product {
    codigo: string
    nombre: string
    categoria: string
    stock: number
    stockMinimo: number
    unidad: string
  }
  
  const props = defineProps<{
    product: Product
    showModal: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'delete', product: Product): void
    (e: 'close'): void
  }>()
  
  function confirmDelete() {
    emit('delete', props.product)
    emit('close')
  }
  
  function closeModal() {
    emit('close')
  }
  </script>
  
  <style scoped>
  .confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    min-width: 300px;
  }
  
  .confirmation-message {
    color: #333; 
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  
  .confirm-delete {
    background-color: red;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    margin-right: 1rem;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .cancel-delete {
    background-color: gray;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .confirm-delete:hover {
    background-color: darkred;
  }
  
  .cancel-delete:hover {
    background-color: darkgray;
  }
  </style>
  