-- Akıllı Kafe & Restoran Deneyim Uygulaması - Supabase PostgreSQL Şeması
-- İleride Supabase bağlantısı yapıldığında SQL Editor üzerinden doğrudan çalıştırılabilir.

create extension if not exists "pgcrypto";

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  logo_url text,
  primary_color text not null default '#D9A05B',
  google_review_url text,
  instagram_url text,
  tiktok_url text,
  spotify_url text,
  created_at timestamptz default now()
);

create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  table_number integer not null,
  status text not null default 'occupied',
  unique(venue_id, table_number)
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  prep_time text,
  media_url text not null,
  media_type text not null default 'image',
  allergens text[] default '{}',
  paired_product_id uuid references products(id) on delete set null,
  pairing_note text,
  badge text
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  table_id uuid not null references tables(id) on delete cascade,
  type text not null check (type in ('waiter', 'bill', 'water')),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz default now()
);

create table if not exists demo_orders (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  table_id uuid not null references tables(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null default 0
);

create table if not exists feedbacks (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  table_id uuid not null references tables(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  redirected_to_google boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  table_id uuid not null references tables(id) on delete cascade,
  amount numeric(10, 2) not null,
  department text not null check (department in ('barista', 'kitchen', 'service')),
  note text,
  created_at timestamptz default now()
);

create table if not exists gift_cards (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues(id) on delete cascade,
  code text not null unique,
  amount numeric(10, 2) not null,
  package_name text,
  sender_name text not null,
  message text,
  is_redeemed boolean not null default false,
  created_at timestamptz default now()
);

-- Realtime yayınları
alter publication supabase_realtime add table service_requests;
alter publication supabase_realtime add table demo_orders;
alter publication supabase_realtime add table feedbacks;
alter publication supabase_realtime add table tips;
