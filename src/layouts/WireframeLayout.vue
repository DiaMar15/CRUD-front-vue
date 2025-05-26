<template>
  <div :class="['dashboard-layout', { 'dark-mode': isDarkMode }]">
    <!-- Sidebar Menú -->
    <div class="sidebar" :class="{ open: isOpen }">
      <div class="logo-details">
        <span v-if="isOpen" class="logo_name">Ventryx</span>
        <button class="menu-btn" @click="toggleSidebar" aria-label="Desplegar menú">
          <i
            class="bx"
            :class="isOpen ? 'bx-menu-alt-right bx-md' : 'bx-menu bx-md'"
          ></i>
        </button>
      </div>
      <ul class="nav-list">
        <li v-if="isOpen">
          <i class='bx bx-search bx-md'></i>
          <input type="text" placeholder="Buscar...">
          <span class="tooltip">Buscar</span>
        </li>
        <li v-for="item in menuItems" :key="item.to">
          <router-link :to="item.to">
            <i class="bx bx-md" :class="item.icon"></i>
            <span class="links_name" v-if="isOpen">{{ item.label }}</span>
          </router-link>
          <span class="tooltip" v-if="!isOpen">{{ item.label }}</span>
        </li>
      </ul>
    </div>
    <!-- Fin Sidebar -->

    <div class="main-content">
      <HeaderWireframeComponent />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderWireframeComponent from '../components/HeaderWireframeComponent.vue'
import { ref } from 'vue'

const isDarkMode = ref(false)
const isOpen = ref(false)

function toggleSidebar() {
  isOpen.value = !isOpen.value
}

const menuItems = [
  { to: '/home', icon: 'bx-grid-alt', label: 'Inicio' },
  { to: '/inventario', icon: 'bx-folder', label: 'Inventario' },
  { to: '/categories', icon: 'bx-menu', label: 'Categorías' },
  { to: '/orders', icon: 'bx-package', label: 'Pedidos' },
  { to: '/clients', icon: 'bx-chart', label: 'Clientes' },
  { to: '/contact', icon: 'bx-cog', label: 'Contacto' }
]
</script>

<style scoped>
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

.dashboard-layout {
  display: flex;
  height: 100vh;
}

/* Sidebar styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 90px;
  background: #000;
  z-index: 1001;
  transition: width 0.5s;
  display: flex;
  flex-direction: column;
  box-shadow: none;
}

.sidebar.open {
  width: 250px;
}

.logo-details {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 0 0;
  gap: 8px;
  border-bottom: none !important;
  box-shadow: none !important;
}

.logo_name {
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
  transition: opacity 0.3s;
}

.menu-btn {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 0 0 24px; /* Centra el icono del menú */
  margin-left: 0;
  width: 100%;
  height: 60px;
}

.menu-btn i {
  color: #fff;
  font-size: 32px;
  line-height: 1;
}

/* NAV LIST ICONS ALIGNED CENTER IN CIRCLE */
.sidebar .nav-list {
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 0;
  align-items: center;
}

.sidebar li {
  position: relative;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.sidebar li a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.4s ease;
  background: #18192a;
  color: #fff;
  position: relative;
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.sidebar li a:hover {
  background: #fff;
  color: #11101D;
}

.sidebar li a .bx {
  font-size: 28px;
  margin: 0;
  transition: margin 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.open li a {
  width: 100%;
  justify-content: flex-start;
  padding-left: 18px;
  background: #11101D;
  border-radius: 12px;
}

.sidebar.open li a .bx {
  margin-right: 12px;
}

.sidebar li a .links_name {
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s;
  margin-left: 0;
}

.sidebar.open li a .links_name {
  opacity: 1;
  pointer-events: auto;
  margin-left: 0;
}

.sidebar li a:hover .links_name,
.sidebar li a:hover .bx {
  color: #11101D;
}

.sidebar li .tooltip {
  position: absolute;
  top: 50%;
  left: calc(100% + 15px);
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 400;
  opacity: 0;
  white-space: nowrap;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity 0.4s;
  color: #11101D;
}

.sidebar li:hover .tooltip {
  opacity: 1;
  pointer-events: auto;
}

.sidebar.open li .tooltip {
  display: none;
}

/* Main content styles */
.main-content {
  flex: 1;
  margin-left: 90px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.5s;
}

.sidebar.open ~ .main-content,
.dashboard-layout .sidebar.open ~ .main-content {
  margin-left: 250px;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f4f4;
}
</style>
