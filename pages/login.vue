<template>
  <div class="card max-w-md mx-auto my-12 p-6">
    <form @submit.prevent="handleLogin">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <div class="space-y-4">
        <div>
          <label for="email" class="form-label">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-input" 
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label for="password" class="form-label">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="form-input" 
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-full mt-2">Login</button>
        <p v-if="error" class="form-error mt-2">{{ error }}</p>
        <p v-if="message" class="text-primary mt-2">{{ message }}</p>
        <div class="flex justify-between text-sm mt-4">
          <NuxtLink to="/signup" class="text-primary hover:underline">Create Account</NuxtLink>
          <NuxtLink to="/reset-password" class="text-primary hover:underline">Forgot Password?</NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const error = ref(null)
const client = useSupabaseClient()
const router = useRouter()
const route = useRoute()

// Get message from query params (e.g., verification required message)
const message = computed(() => route.query.message)

// Clear any existing session on mount
onMounted(async () => {
  try {
    const { error } = await client.auth.signOut()
    if (error) console.error('Error clearing session:', error)
    
    // Clear localStorage
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('supabase.auth.refreshToken')
    localStorage.removeItem('supabase.auth.user')
  } catch (err) {
    console.error('Error during cleanup:', err)
  }
})

async function handleLogin() {
  try {
    error.value = null
    
    // First ensure we're logged out
    await client.auth.signOut()
    
    const { error: err, data } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (err) throw err
    
    if (!data.user.email_confirmed_at) {
      error.value = 'Please verify your email before logging in'
      await client.auth.signOut()
      return
    }
    
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script> 