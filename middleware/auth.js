export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect /dashboard routes
  if (to.path.startsWith('/dashboard')) {
    const user = useSupabaseUser()
    const client = useSupabaseClient()

    // If no user at all, redirect to login
    if (!user.value) {
      return await navigateTo('/login')
    }

    try {
      // Check if email is verified
      const { data: { user: userData }, error } = await client.auth.getUser()
      
      if (error) throw error
      
      if (!userData?.email_confirmed_at) {
        return await navigateTo('/login', {
          query: {
            message: 'Please verify your email before accessing the dashboard'
          }
        })
      }
    } catch (err) {
      // If any error occurs (invalid session, etc), redirect to login
      return await navigateTo('/login', {
        query: {
          message: 'Your session has expired. Please login again.'
        }
      })
    }
  }
}) 