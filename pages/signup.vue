<template>
  <div class="card max-w-md mx-auto my-12 p-6">
    <form @submit.prevent="handleSignup">
      <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
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
        <button type="submit" class="btn btn-primary w-full mt-2">Sign Up</button>
        <p v-if="error" class="form-error mt-2">{{ error }}</p>
        
        <div v-if="success" class="mt-4">
          <p class="form-success">{{ success }}</p>
          <div class="bg-[#f5f5f5] border border-[#EFEFEF] rounded-md p-4 mt-2">
            <p class="font-medium">Development Mode Instructions:</p>
            <ol class="list-decimal ml-5 mt-2 text-sm">
              <li>Go to your Supabase project dashboard</li>
              <li>Click on "Authentication" in the sidebar</li>
              <li>Look for your email in the "Users" list</li>
              <li>Click on the email to see verification details</li>
            </ol>
            <p class="text-xs text-muted-foreground mt-2">You must verify your email before accessing the dashboard.</p>
          </div>
        </div>
        
        <div class="text-center text-sm mt-4">
          Already have an account? <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink>
        </div>
      </div>
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