-- ==============================================================================
-- NURSURY E-COMMERCE DATABASE SCHEMA & ROW LEVEL SECURITY
-- Compatible with React + Vite Web Client and Future Native Android (Kotlin) App
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES & ROLES ARCHITECTURE
-- ==============================================================================

-- Customer Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Secure User Roles table
-- Kept separate from profiles so customers cannot escalate privileges
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on user_roles for fast authorization lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Helper function: Check if the calling user is an authorized Administrator
-- Marked SECURITY DEFINER to bypass RLS inside the authorization check itself
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role = 'admin'
  );
$$;

-- Helper function: Get user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid()),
    'customer'
  );
$$;

-- Trigger function: Automatically create profile and default customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = now();

  -- Assign default customer role
  INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
  VALUES (
    NEW.id,
    'customer',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 3. CATEGORIES TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  badge TEXT,
  tagline TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);


-- ==============================================================================
-- 4. PRODUCTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  plant_type TEXT,
  light_requirement TEXT,
  size TEXT,
  watering TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_beginner_friendly BOOLEAN NOT NULL DEFAULT false,
  is_low_light BOOLEAN NOT NULL DEFAULT false,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  care_guide JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);


-- ==============================================================================
-- 5. ORDERS & ORDER ITEMS TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
  shipping_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);


-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone logged in can read their own profile; admins can read all profiles
CREATE POLICY "Users can read own profile or admin reads all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile (name, phone, bio, avatar)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- USER ROLES POLICIES (Strict Security)
-- ------------------------------------------------------------------------------
-- Users can view their own role; admin can view all
CREATE POLICY "Users can read own role or admin reads all"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Only admins can insert, update, or delete roles
CREATE POLICY "Only admins can modify user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public/anon and customers can view active categories; admins can view all
CREATE POLICY "Public can view active categories or admin views all"
  ON public.categories
  FOR SELECT
  TO public
  USING (is_active = true OR public.is_admin());

-- Only admins can create categories
CREATE POLICY "Only admins can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update categories
CREATE POLICY "Only admins can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete categories
CREATE POLICY "Only admins can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- PRODUCTS POLICIES
-- ------------------------------------------------------------------------------
-- Public/anon can view active products; admins can view all
CREATE POLICY "Public can view active products or admin views all"
  ON public.products
  FOR SELECT
  TO public
  USING (is_active = true OR public.is_admin());

-- Only admins can insert products
CREATE POLICY "Only admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Only admins can update products
CREATE POLICY "Only admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- ORDERS POLICIES
-- ------------------------------------------------------------------------------
-- Customers can view only their own orders; admins can view all orders
CREATE POLICY "Customers view own orders or admin views all"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid() OR public.is_admin());

-- Authenticated customers can insert their own orders; admins can insert any
CREATE POLICY "Authenticated users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

-- ONLY admins can update orders (e.g. status change, fulfillment)
-- Prevents customers from marking their orders as paid or delivered
CREATE POLICY "Only admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete orders
CREATE POLICY "Only admins can delete orders"
  ON public.orders
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- ORDER ITEMS POLICIES
-- ------------------------------------------------------------------------------
-- Customers view items of their own orders; admins view all
CREATE POLICY "Customers view own order items or admin views all"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- Customers can insert items for their own orders; admins can insert any
CREATE POLICY "Customers insert items for own orders"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
        AND (o.customer_id = auth.uid() OR public.is_admin())
    )
  );

-- Only admins can update or delete order items
CREATE POLICY "Only admins can modify order items"
  ON public.order_items
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- 7. SECURE SERVER-SIDE ORDER PLACEMENT & STOCK MANAGEMENT (RPC)
-- ==============================================================================
-- Validates real prices from products table and decreases stock atomically
CREATE OR REPLACE FUNCTION public.create_order_secure(
  p_items JSONB,              -- Array of { "productId": "uuid", "quantity": int }
  p_shipping_address JSONB,   -- Address object
  p_payment_method TEXT,      -- e.g. 'UPI', 'Card', 'COD'
  p_delivery_fee NUMERIC DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC(10, 2) := 0;
  v_final_total NUMERIC(10, 2) := 0;
  v_item RECORD;
  v_prod RECORD;
  v_line_total NUMERIC(10, 2);
  v_random_digits TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to place an order.';
  END IF;

  -- Fetch customer profile
  SELECT email, full_name INTO v_user_email, v_user_name
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_user_email IS NULL THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
    v_user_name := COALESCE(v_user_name, 'Valued Customer');
  END IF;

  -- Generate order number NUR-XXXXX
  v_random_digits := lpad(floor(random() * 90000 + 10000)::text, 5, '0');
  v_order_number := 'NUR-' || v_random_digits;

  -- Verify each item, validate price and stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    "productId" UUID,
    "quantity" INTEGER
  )
  LOOP
    IF v_item."quantity" <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for item %', v_item."productId";
    END IF;

    SELECT id, name, slug, price, stock_quantity, image_url, is_active
    INTO v_prod
    FROM public.products
    WHERE id = v_item."productId";

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist', v_item."productId";
    END IF;

    IF NOT v_prod.is_active THEN
      RAISE EXCEPTION 'Plant "%" is no longer available for purchase', v_prod.name;
    END IF;

    IF v_prod.stock_quantity < v_item."quantity" THEN
      RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %',
        v_prod.name, v_prod.stock_quantity, v_item."quantity";
    END IF;

    v_line_total := v_prod.price * v_item."quantity";
    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  v_final_total := v_subtotal + COALESCE(p_delivery_fee, 0);

  -- Create order record
  INSERT INTO public.orders (
    order_number,
    customer_id,
    customer_name,
    customer_email,
    status,
    subtotal,
    delivery_fee,
    discount,
    total_amount,
    payment_method,
    payment_status,
    shipping_address
  )
  VALUES (
    v_order_number,
    v_user_id,
    v_user_name,
    v_user_email,
    'Confirmed',
    v_subtotal,
    COALESCE(p_delivery_fee, 0),
    0,
    v_final_total,
    COALESCE(p_payment_method, 'UPI'),
    'Pending',
    p_shipping_address
  )
  RETURNING id INTO v_order_id;

  -- Create order items and decrement stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    "productId" UUID,
    "quantity" INTEGER
  )
  LOOP
    SELECT id, name, slug, price, image_url
    INTO v_prod
    FROM public.products
    WHERE id = v_item."productId";

    v_line_total := v_prod.price * v_item."quantity";

    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_slug,
      unit_price,
      quantity,
      line_total,
      image_url
    )
    VALUES (
      v_order_id,
      v_prod.id,
      v_prod.name,
      v_prod.slug,
      v_prod.price,
      v_item."quantity",
      v_line_total,
      v_prod.image_url
    );

    -- Decrement stock
    UPDATE public.products
    SET stock_quantity = stock_quantity - v_item."quantity",
        updated_at = now()
    WHERE id = v_item."productId";
  END LOOP;

  RETURN jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number,
    'totalAmount', v_final_total,
    'subtotal', v_subtotal,
    'deliveryFee', p_delivery_fee,
    'status', 'Confirmed'
  );
END;
$$;
