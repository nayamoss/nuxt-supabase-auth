<template>
  <div class="min-h-screen bg-background">
    <nav class="p-5 bg-white shadow">
      <div class="container mx-auto flex flex-wrap items-center">
        <NuxtLink to="/" class="btn btn-primary mr-3">Home</NuxtLink>
        <template v-if="!user">
          <NuxtLink to="/login" class="btn btn-secondary mr-3">Login</NuxtLink>
          <NuxtLink to="/signup" class="btn btn-secondary mr-3">Sign Up</NuxtLink>
        </template>
        <NuxtLink v-else to="/dashboard" class="btn btn-secondary mr-3">Dashboard</NuxtLink>
      </div>
    </nav>
    <main class="container mx-auto p-5">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style>
.router-link-active.btn-secondary {
  @apply bg-[#EFEFEF];
}

.router-link-active.btn-primary {
  @apply bg-primary/90;
}
</style>
