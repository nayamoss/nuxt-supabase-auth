<template>
  <div class="home">
    <h1>Welcome to Supabase Test</h1>
    <p>This is a test project to verify Supabase authentication.</p>
    <div v-if="!user" class="cta">
      <NuxtLink to="/login" class="button">Login to continue</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}
.cta {
  margin-top: 30px;
}
.button {
  display: inline-block;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style> 