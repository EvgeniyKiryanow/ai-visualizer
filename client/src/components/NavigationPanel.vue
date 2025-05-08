<template>
    <div class="panel">
      <button :class="{ active: activeView === 'html' }" @click="setView('html')">HTML</button>
      <button :class="{ active: activeView === 'css' }" @click="setView('css')">CSS</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { activeView, setView } from '../store/uiState'
  </script>
  
  <style scoped>
  .panel {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 8px;
    z-index: 100;
    display: flex;
    gap: 10px;
  }
  button {
    border: none;
    background: transparent;
    font-weight: bold;
    padding: 6px 12px;
    cursor: pointer;
  }
  button.active {
    background: #444;
    color: #fff;
    border-radius: 4px;
  }
  </style>
  