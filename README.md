# Supasheet

> The admin panel you've been waiting for

Supasheet is a powerful admin panel designed to work seamlessly with Supabase. It provides an intuitive interface for managing your data, users, and settings, making it easier than ever to build and maintain your applications.

## Features

- [x] Authentication
- [x] User management
- [x] Authorization (RBAC)
- [x] Resource (CRUD)
- [x] Customizable UI
- [x] Internationalization (i18n)
- [ ] Dashboards
- [ ] Analytics
- [ ] Reports
- [ ] SQL Editor
- [ ] File Storage
- [ ] Notifications
- [ ] Custom Actions
- [ ] Custom Widgets

## Getting Started

To get started with Supasheet, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/htmujahid/supasheet.git
   ```

2. Navigate to the project directory:
   ```bash
   cd supasheet
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Place your Supabase URL and API key in the `.env.dev` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_api_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Technology Stack

1. **Frontend**: Next.js, React, Tailwind CSS
2. **Backend**: Supabase (PostgreSQL, Auth, Storage)
3. **Deployment**: Vercel (for frontend), Supabase (for backend)
4. **MISC**: Diceui, React Query, TanStack Table, React Hook Form, Zod, i18next

## Contributing
We welcome contributions to Supasheet!