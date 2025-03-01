<template>
  <div class="reset-container">
    <form v-if="!hash" @submit.prevent="handleResetRequest">
      <h2>Reset Password</h2>
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required>
      </div>
      <button type="submit">Send Reset Link</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <p class="links">
        <NuxtLink to="/login">Back to Login</NuxtLink>
      </p>
    </form>

    <form v-else @submit.prevent="handlePasswordUpdate">
      <h2>Update Password</h2>
      <div class="form-group">
        <input v-model="newPassword" type="password" placeholder="New Password" required>
      </div>
      <button type="submit">Update Password</button>
      <p v-if="error" class="error">{{ error }}</p>
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

// Get hash from URL if present
const hash = computed(() => route.hash.slice(1))

async function handleResetRequest() {
  try {
    error.value = null
    success.value = null
    const { error: err } = await client.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (err) throw err
    success.value = 'Please check your email for password reset link'
  } catch (err) {
    error.value = err.message
  }
}

async function handlePasswordUpdate() {
  try {
    error.value = null
    const { error: err } = await client.auth.updateUser({
      password: newPassword.value
    })
    if (err) throw err
    router.push('/login')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.reset-container {
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
.links {
  margin-top: 15px;
  text-align: center;
}
.links a {
  color: #4CAF50;
  text-decoration: none;
}
</style> 