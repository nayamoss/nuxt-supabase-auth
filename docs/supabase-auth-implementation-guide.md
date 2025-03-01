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
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss'  // Add Tailwind CSS module
  ],

  supabase: {
    // Disable default redirects to handle them manually
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signup', '/reset-password', '/*']
    }
  },
  
  runtimeConfig: {
    public: {
      // Supabase credentials (Auto-used by @nuxtjs/supabase)
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})
```

## 3. Create .env File
```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

## 4. Install and Configure Tailwind CSS

### Install Tailwind CSS Module
```bash
npm install -D @nuxtjs/tailwindcss
```

### Create tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 5. Create Auth Pages

### Login Page (pages/login.vue)
```vue
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
```

### Signup Page (pages/signup.vue)
```vue
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
```

### Reset Password Page (pages/reset-password.vue)
```vue
<template>
  <div class="reset-container">
    <!-- Show password reset request form if no code is present -->
    <form v-if="!resetCode" @submit.prevent="handleResetRequest" class="form-input">
      <h2 class="text-2xl font-bold mb-4">Reset Password</h2>
      <div class="form-group">
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
      <button type="submit" class="btn-primary w-full mt-4">Send Reset Link</button>
      <p v-if="error" class="form-error mt-2">{{ error }}</p>
      <p v-if="success" class="form-success mt-2">{{ success }}</p>
      <p class="mt-4 text-center">
        <NuxtLink to="/login" class="text-primary-600 hover:underline">Back to Login</NuxtLink>
      </p>
    </form>

    <!-- Show password update form if code is present -->
    <form v-else @submit.prevent="handlePasswordUpdate" class="form-input">
      <h2 class="text-2xl font-bold mb-4">Update Password</h2>
      <div class="form-group">
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
      <button type="submit" class="btn-primary w-full mt-4">Update Password</button>
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

<style scoped>
.reset-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}
</style>
```

## 6. Create Dashboard Page (pages/dashboard.vue)
```vue
<template>
  <div v-if="isVerified" class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Protected Dashboard</h1>
    <p class="text-lg text-gray-600 mb-8">Welcome {{ user?.email }}</p>
    <button 
      @click="handleLogout" 
      class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
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
```

## 7. Create Auth Middleware (middleware/auth.js)
```javascript
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
```

## 8. Create Main App Layout (app.vue)
```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="p-5 bg-white shadow">
      <div class="container mx-auto flex flex-wrap items-center">
        <NuxtLink to="/" class="btn-primary">Home</NuxtLink>
        <template v-if="!user">
          <NuxtLink to="/login" class="btn-primary">Login</NuxtLink>
          <NuxtLink to="/signup" class="btn-primary">Sign Up</NuxtLink>
        </template>
        <NuxtLink v-else to="/dashboard" class="btn-primary">Dashboard</NuxtLink>
      </div>
    </nav>
    <main class="container mx-auto p-5">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
</script>

<style>
.btn-primary {
  @apply px-4 py-2 mr-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors;
}

.router-link-active {
  @apply bg-blue-700;
}
</style>
```

## 9. Supabase Dashboard Configuration
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Settings
3. Enable:
   - Email provider
   - Email confirmation (required)
   - Secure email change
   - Password requirements (minimum length: 6)
4. Configure your email provider settings

## 10. Testing the Implementation
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

## Dashboard Route Protection Details
The dashboard route is protected through multiple layers:

1. **Route Middleware**:
   - The auth middleware checks if the user is authenticated
   - It verifies that the user's email is confirmed
   - It redirects unauthenticated or unverified users to the login page

2. **Component-Level Verification**:
   - The dashboard component performs additional verification when mounted
   - It uses the `isVerified` ref to control whether dashboard content is displayed
   - It redirects users with unverified emails

3. **Session Management**:
   - The logout functionality properly clears the user session
   - Auth pages clear existing sessions to prevent conflicts

## Tailwind CSS Integration
Tailwind CSS is integrated throughout the application for consistent styling:

1. **Installation**:
   - The `@nuxtjs/tailwindcss` module is installed and configured in nuxt.config.js
   - A tailwind.config.js file defines content paths and theme settings

2. **Usage in Components**:
   - Utility classes are used directly in templates for styling
   - Custom components use the `@apply` directive to apply multiple utility classes
   - The navigation uses a custom `.btn-primary` class for consistent button styling

3. **Responsive Design**:
   - Container classes ensure proper content width on different screen sizes
   - Flex utilities create responsive layouts
   - Padding and margin utilities provide consistent spacing

4. **Theme Consistency**:
   - Color classes maintain a consistent color scheme
   - Typography classes ensure readable text
   - Shadow and rounded utilities add depth and polish

## Common Issues to Watch For
1. Make sure environment variables are set correctly
2. Verify email provider is configured in Supabase
3. Check that email confirmation is enabled
4. Ensure redirect URLs are correct in Supabase dashboard
5. Clear local storage and browser cache if testing changes
6. If Tailwind styles aren't applying, check that the module is properly configured
7. Ensure the auth middleware is correctly checking protected routes 