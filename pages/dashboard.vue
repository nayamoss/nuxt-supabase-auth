<template>
  <div v-if="isVerified" class="card max-w-4xl mx-auto my-12 p-8">
    <h1 class="text-3xl font-bold mb-6">Protected Dashboard</h1>
    <p class="text-lg mb-8">Welcome {{ user?.email }}</p>
    <button @click="handleLogout" class="btn btn-secondary">
      Logout
    </button>
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