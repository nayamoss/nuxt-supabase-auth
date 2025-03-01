<template>
  <div class="signup-container">
    <form @submit.prevent="handleSignup">
      <h2>Sign Up</h2>
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" required>
      </div>
      <button type="submit">Sign Up</button>
      <p v-if="error" class="error">{{ error }}</p>
      <div v-if="success" class="success">
        <p>{{ success }}</p>
        <div class="info-box">
          <p><strong>Development Mode Instructions:</strong></p>
          <ol>
            <li>Go to your Supabase project dashboard</li>
            <li>Click on "Authentication" in the sidebar</li>
            <li>Look for your email in the "Users" list</li>
            <li>Click on the email to see verification details</li>
          </ol>
        </div>
        <small>You must verify your email before accessing the dashboard.</small>
      </div>
      <p class="links">
        Already have an account? <NuxtLink to="/login">Login</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const error = ref(null)
const success = ref(null)
const client = useSupabaseClient()
const router = useRouter()

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

async function handleSignup() {
  try {
    error.value = null
    success.value = null
    
    // First ensure we're logged out
    await client.auth.signOut()
    
    const { error: err, data } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })
    if (err) throw err
    
    // Check if the user was created
    if (data?.user?.id) {
      success.value = 'Account created successfully! Please verify your email to continue.'
      // Clear form
      email.value = ''
      password.value = ''
    } else {
      throw new Error('No user data received')
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.signup-container {
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
.success {
  color: green;
  margin-top: 10px;
}
.info-box {
  background: #e3f2fd;
  border: 1px solid #2196F3;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  color: #0d47a1;
}
.info-box ol {
  margin: 10px 0 10px 20px;
  padding: 0;
}
.info-box li {
  margin: 5px 0;
}
.success small {
  display: block;
  margin-top: 5px;
  color: #666;
}
.links {
  margin-top: 15px;
  text-align: center;
}
.links a {
  color: #4CAF50;
  text-decoration: none;
}
</style> 