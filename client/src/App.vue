<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/tree">Tree Visualization</router-link></li> 
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
nav {
  margin: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline;
  margin-right: 10px;
}
</style>
