-- SpiNuts Database Schema
-- Run this in your Supabase SQL editor

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_inr numeric not null,
  price_usd numeric not null,
  original_price_inr numeric,
  original_price_usd numeric,
  category text not null check (category in ('spices','nuts','seeds','millets','dry-fruits')),
  weight text,
  stock integer not null default 0,
  images text[] default '{}',
  origin text,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Customers
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  country text default 'India',
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  items jsonb not null,
  total numeric not null,
  currency text not null default 'INR',
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_method text not null check (payment_method in ('razorpay','stripe','cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  address jsonb not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;

-- Products: public read, admin write
create policy "Public can read active products" on products
  for select using (active = true);

create policy "Admin can manage products" on products
  for all using (auth.role() = 'authenticated');

-- Orders: authenticated admin read/write
create policy "Admin can manage orders" on orders
  for all using (auth.role() = 'authenticated');

-- Customers: authenticated admin read/write
create policy "Admin can manage customers" on customers
  for all using (auth.role() = 'authenticated');

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'products');

create policy "Authenticated can upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
