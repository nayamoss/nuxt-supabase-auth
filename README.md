# Nuxt.js + Supabase Authentication

A secure authentication implementation using Nuxt.js and Supabase, featuring email verification, protected routes, and secure password management.

## Features

- Email-based authentication
- Email verification requirement
- Protected dashboard routes
- Password reset functionality
- Session management
- Secure middleware implementation
- Modern UI components

## Tech Stack

- Nuxt.js
- Supabase
- Tailwind CSS
- Vue.js

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Supabase credentials:
```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

3. Configure Supabase:
- Enable email provider in Supabase dashboard
- Configure email verification settings
- Set password requirements

4. Run the development server:
```bash
npm run dev
```

## Documentation

For detailed implementation instructions, see [Supabase Auth Implementation Guide](docs/supabase-auth-implementation-guide.md)

## Security Features

- Email verification required
- Protected routes with middleware
- Secure password reset flow
- Session cleanup on critical pages
- Proper error handling
- Clear session management

## License

MIT
