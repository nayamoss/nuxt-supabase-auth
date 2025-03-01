<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <h2>Login</h2>
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" required>
      </div>
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="message" class="message">{{ message }}</p>
      <p class="links">
        <NuxtLink to="/signup">Create Account</NuxtLink> |
        <NuxtLink to="/reset-password">Forgot Password?</NuxtLink>
      </p>
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

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
.message {
  color: #2196F3;
  margin-top: 10px;
}
.links {
  margin-top: 15px;
  text-align: center;
}
.links a {
  color: #4CAF50;
  text-decoration: none;
  margin: 0 5px;
}
</style> 