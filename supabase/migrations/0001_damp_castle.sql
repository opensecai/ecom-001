/*
  # Initial E-commerce Schema Setup

  1. New Tables
    - `site_settings`
      - Stores website configuration (logo, favicon, colors, WhatsApp number)
    - `products`
      - Product catalog with details and inventory
    - `categories` 
      - Product categories
    - `orders`
      - Customer orders with status tracking
    - `order_items`
      - Individual items in each order
    
  2. Security
    - Enable RLS on all tables
    - Admin users can manage all data
    - Customers can view products and manage their orders
*/

-- Create an admin flag for users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Site Settings
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id uuid REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  whatsapp_number TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
-- Site Settings
CREATE POLICY "Allow public read access to site_settings" ON site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin update access to site_settings" ON site_settings
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Categories
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to categories" ON categories
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access to products" ON products
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Orders
CREATE POLICY "Allow users to view their own orders" ON orders
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Allow users to create their own orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow admin full access to orders" ON orders
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Order Items
CREATE POLICY "Allow users to view their own order items" ON order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to create their own order items" ON order_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow admin full access to order items" ON order_items
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );