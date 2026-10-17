# Nursury Supabase Database & Security Guide

This folder contains the complete SQL migrations, seed data, and Row Level Security (RLS) policies for the **Nursury** plant e-commerce website and future native Android (Kotlin) app.

---

## Architecture Overview

- **Profiles (`public.profiles`)**: User profiles linked 1:1 with `auth.users(id)`. Automatically created by a database trigger upon user registration.
- **Roles (`public.user_roles`)**: A separate private table storing role records (`'customer'` or `'admin'`). Customers have **zero** insert/update privileges on this table, preventing role escalation.
- **RLS Function (`public.is_admin()`)**: Secure `SECURITY DEFINER` function that checks the calling user's role without leaking table access.
- **Categories (`public.categories`)**: Botanical collections. Public users can only read active collections. Admins have full CRUD.
- **Products (`public.products`)**: Plant and gardening catalog. Public users can only browse active products. Admins have full CRUD.
- **Orders (`public.orders`) & Order Items (`public.order_items`)**: Customers can only view and create their own orders. Only authorized admins can update order status (e.g. mark as shipped, delivered, or modify payment status).
- **Atomic Order Placement (`public.create_order_secure`)**: Server-side RPC that validates live database prices, verifies available stock, decrements inventory, and creates the order record atomically.
- **Android Compatibility**: Both the React web application and future Kotlin Jetpack Compose Android app share the same database tables, Supabase Auth, and RLS policies.

---

## Step-by-Step Setup Instructions

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose your organization, project name (e.g. `nursury-ecommerce`), database password, and preferred region.

### 2. Apply Database Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** (left menu).
2. Click **"New query"**.
3. Copy the entire contents of [`migrations/20261017000000_nursery_schema.sql`](./migrations/20261017000000_nursery_schema.sql).
4. Paste it into the SQL Editor and click **Run**.
5. Ensure the query completes with `Success. No rows returned`.

### 3. Apply Seed Data
1. In the SQL Editor, click **"New query"**.
2. Copy the contents of [`seed.sql`](./seed.sql).
3. Paste and click **Run**.
4. This seeds the 6 botanical categories and 10 core plants.

### 4. Configure Authentication in Supabase
1. In the Supabase Dashboard, go to **Authentication** -> **Providers** -> **Email**.
2. Ensure **Email provider** is **Enabled**.
3. *Optional for testing:* If you do not want to wait for email confirmation emails during local development, toggle **"Confirm email"** to OFF.

### 5. Create Your First Administrator Account
1. You can either:
   - Sign up on the Nursury website (`/signup`) with your email (e.g. `admin@nursury.store`), OR
   - Go to Supabase Dashboard -> **Authentication** -> **Users** -> **"Add user"** (Create user with your email and password).
2. Open the Supabase **SQL Editor** and run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' 
   FROM auth.users 
   WHERE email = 'admin@nursury.store'
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();
   ```
   *(Replace `'admin@nursury.store'` with the actual email you signed up with).*
3. Verify the role was assigned:
   ```sql
   SELECT u.email, r.role 
   FROM public.user_roles r
   JOIN auth.users u ON u.id = r.user_id;
   ```

### 6. Connect the React Application
1. In the Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL**
   - **anon / public key**
3. In the root of `nursery_web`, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in the values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-actual-anon-key-here
   ```
5. Restart Vite dev server:
   ```bash
   npm run dev
   ```
6. The app will automatically detect your live Supabase database and authenticate via Supabase Auth!

---

## Security Verification Checklist

- [x] RLS is enabled on all tables (`profiles`, `user_roles`, `categories`, `products`, `orders`, `order_items`).
- [x] Customers cannot update `user_roles` (no customer write policy).
- [x] Customers cannot update order status (`status`, `payment_status`).
- [x] Products and categories cannot be inserted or modified by unauthorized users.
- [x] Customers cannot view other customers' orders or order items.
- [x] No `service_role` or secret keys are present in frontend source code.
