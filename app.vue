<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <template v-if="!user">
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/signup">Sign Up</NuxtLink>
      </template>
      <NuxtLink v-else to="/dashboard">Dashboard</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style>
nav {
  padding: 20px;
  background: #f8f9fa;
}
nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  color: #4CAF50;
}
</style>
