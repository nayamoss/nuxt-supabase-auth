# Supabase Authentication Setup Guide

## 1. Install Supabase Module
```bash
npm install @nuxtjs/supabase
```

## 2. Configure nuxt.config.js
```javascript
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase'
  ],

  supabase: {
    // Disable default redirects to handle them manually
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signup', '/reset-password', '/*']
    }
  }
})
```

## 3. Create .env File
```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

## 4. Create Auth Pages

### Login Page (pages/login.vue)
```vue
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="max-w-md mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      
      <div class="space-y-4">
        <SoftInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        
        <SoftInput
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />

        <div class="flex justify-between items-center">
          <BaseButton type="submit" class="w-full">
            Login
          </BaseButton>
        </div>
      </div>

      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      <p v-if="message" class="text-blue-500 mt-4">{{ message }}</p>

      <div class="mt-6 text-center space-y-2">
        <p>
          <NuxtLink to="/signup" class="text-blue-500 hover:underline">
            Create Account
          </NuxtLink>
        </p>
        <p>
          <NuxtLink to="/reset-password" class="text-blue-500 hover:underline">
            Forgot Password?
          </NuxtLink>
        </p>
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

const message = computed(() => route.query.message)

onMounted(async () => {
  try {
    // Clear any existing sessions
    await client.auth.signOut()
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
```

### Signup Page (pages/signup.vue)
```vue
<template>
  <div class="signup-container">
    <form @submit.prevent="handleSignup" class="max-w-md mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
      
      <div class="space-y-4">
        <SoftInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />
        
        <SoftInput
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />

        <BaseButton type="submit" class="w-full">
          Sign Up
        </BaseButton>
      </div>

      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      
      <div v-if="success" class="mt-4">
        <p class="text-green-500">{{ success }}</p>
        <div class="bg-gray-50 p-4 mt-4 rounded-lg">
          <p class="font-semibold">Development Mode Instructions:</p>
          <ol class="list-decimal ml-4 mt-2 space-y-1">
            <li>Go to your Supabase project dashboard</li>
            <li>Click on "Authentication" in the sidebar</li>
            <li>Look for your email in the "Users" list</li>
            <li>Click on the email to see verification details</li>
          </ol>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <NuxtLink to="/login" class="text-blue-500 hover:underline">
            Login
          </NuxtLink>
        </p>
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

onMounted(async () => {
  try {
    await client.auth.signOut()
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
    
    await client.auth.signOut()
    
    const { error: err, data } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    })
    if (err) throw err
    
    if (data?.user?.id) {
      success.value = 'Account created successfully! Please verify your email to continue.'
      email.value = ''
      password.value = ''
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>
```

### Reset Password Page (pages/reset-password.vue)
```vue
<template>
  <div class="reset-password-container">
    <form @submit.prevent="handleResetPassword" class="max-w-md mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Reset Password</h2>
      
      <div class="space-y-4">
        <SoftInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
        />

        <BaseButton type="submit" class="w-full">
          Reset Password
        </BaseButton>
      </div>

      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      <p v-if="success" class="text-green-500 mt-4">{{ success }}</p>

      <div class="mt-6 text-center">
        <NuxtLink to="/login" class="text-blue-500 hover:underline">
          Back to Login
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
const email = ref('')
const error = ref(null)
const success = ref(null)
const client = useSupabaseClient()

async function handleResetPassword() {
  try {
    error.value = null
    success.value = null
    
    const { error: err } = await client.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`
    })
    
    if (err) throw err
    
    success.value = 'Password reset instructions have been sent to your email'
    email.value = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>
```

## 5. Create Auth Middleware (middleware/auth.js)
```javascript
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  if (to.path.startsWith('/dashboard')) {
    if (!user.value) {
      return navigateTo('/login')
    }

    try {
      const { data: { user: userData }, error } = await client.auth.getUser()
      if (error) throw error
      
      if (!userData?.email_confirmed_at) {
        return navigateTo('/login', {
          query: {
            message: 'Please verify your email before accessing the dashboard'
          }
        })
      }
    } catch (err) {
      return navigateTo('/login', {
        query: {
          message: 'Your session has expired. Please login again.'
        }
      })
    }
  }
})
```

## 6. Supabase Dashboard Configuration
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Settings
3. Enable:
   - Email provider
   - Email confirmation (required)
   - Secure email change
   - Password requirements (minimum length: 6)
4. Configure your email provider settings

## 7. Testing the Implementation
1. Create a new account using the signup page
2. Verify your email (in development, use the Supabase dashboard)
3. Try logging in with verified credentials
4. Test password reset flow
5. Verify that `/dashboard` routes are protected
6. Test logout functionality
7. Verify that unverified users cannot access protected routes

## Security Features Implemented
- Email verification required
- Protected routes with middleware
- Secure password reset flow
- Session cleanup on critical pages
- Proper error handling
- Clear session management

## Common Issues to Watch For
1. Make sure environment variables are set correctly
2. Verify email provider is configured in Supabase
3. Check that email confirmation is enabled
4. Ensure redirect URLs are correct in Supabase dashboard
5. Clear local storage and browser cache if testing changes 