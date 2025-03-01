<template>
  <div v-if="isVerified" class="dashboard">
    <h1>Protected Dashboard</h1>
    <p>Welcome {{ user?.email }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()
const isVerified = ref(false)

// Check verification status on mount
onMounted(async () => {
  try {
    const { data: { user: userData }, error } = await client.auth.getUser()
    if (error) throw error
    isVerified.value = Boolean(userData?.email_confirmed_at)
    if (!isVerified.value) {
      router.push('/login?message=Please verify your email before accessing the dashboard')
    }
  } catch (err) {
    router.push('/login')
  }
})

async function handleLogout() {
  try {
    const { error } = await client.auth.signOut()
    if (error) throw error
    router.push('/login')
  } catch (err) {
    console.error('Error signing out:', err)
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}
button {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
</style> 