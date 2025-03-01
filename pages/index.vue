<template>
  <div class="card max-w-4xl mx-auto my-12 p-8 text-center">
    <h1 class="text-3xl font-bold mb-4">Welcome to Supabase Test</h1>
    <p class="text-lg mb-8">This is a test project to verify Supabase authentication.</p>
    <div v-if="!user" class="mt-8">
      <NuxtLink to="/login" class="btn btn-primary">Login to continue</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script> 