<template>
  <div class="card max-w-md mx-auto my-12 p-6">
    <!-- Show password reset request form if no code is present -->
    <form v-if="!resetCode" @submit.prevent="handleResetRequest" class="space-y-4">
      <h2 class="text-2xl font-bold mb-6">Reset Password</h2>
      <div>
        <label for="email" class="form-label">Email</label>
        <input 
          id="email"
          v-model="email" 
          type="email" 
          placeholder="Enter your email" 
          class="form-input"
          required
        >
      </div>
      <button type="submit" class="btn btn-primary w-full mt-4">Send Reset Link</button>
      <p v-if="error" class="form-error mt-2">{{ error }}</p>
      <p v-if="success" class="form-success mt-2">{{ success }}</p>
      <div class="text-center text-sm mt-4">
        <NuxtLink to="/login" class="text-primary hover:underline">Back to Login</NuxtLink>
      </div>
    </form>

    <!-- Show password update form if code is present -->
    <form v-else @submit.prevent="handlePasswordUpdate" class="space-y-4">
      <h2 class="text-2xl font-bold mb-6">Update Password</h2>
      <div>
        <label for="newPassword" class="form-label">New Password</label>
        <input 
          id="newPassword"
          v-model="newPassword" 
          type="password" 
          placeholder="Enter your new password" 
          class="form-input"
          required
        >
      </div>
      <button type="submit" class="btn btn-primary w-full mt-4">Update Password</button>
      <p v-if="error" class="form-error mt-2">{{ error }}</p>
      <p v-if="success" class="form-success mt-2">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
const email = ref('')
const newPassword = ref('')
const error = ref(null)
const success = ref(null)
const client = useSupabaseClient()
const router = useRouter()
const route = useRoute()

// Get code from URL query parameter if present
const resetCode = computed(() => route.query.code)

// If we have a code, we need to verify it's valid
onMounted(async () => {
  if (resetCode.value) {
    try {
      // When the page loads with a code, we need to verify the code is valid
      // This is handled automatically by Supabase client
      const { error: err } = await client.auth.exchangeCodeForSession(resetCode.value)
      if (err) {
        error.value = "Invalid or expired reset code. Please request a new password reset link."
      }
    } catch (err) {
      error.value = err.message || "An error occurred verifying your reset code."
    }
  }
})

async function handleResetRequest() {
  try {
    error.value = null
    success.value = null
    
    const { error: err } = await client.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (err) throw err
    success.value = 'Please check your email for the password reset link'
  } catch (err) {
    error.value = err.message || "Failed to send reset email. Please try again."
  }
}

async function handlePasswordUpdate() {
  try {
    error.value = null
    success.value = null
    
    const { error: err } = await client.auth.updateUser({
      password: newPassword.value
    })
    
    if (err) throw err
    
    success.value = "Password updated successfully!"
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.message || "Failed to update password. Please try again."
  }
}
</script> 