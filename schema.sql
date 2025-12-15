
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Trips Table
create table trips (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  budget numeric not null default 0,
  status text check (status in ('active', 'planned', 'completed')) default 'planned',
  start_date date,
  end_date date,
  image_url text,
  category_budgets jsonb default '[]'::jsonb
);

-- Accounts Table
create table accounts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text check (type in ('checking', 'savings', 'credit', 'investment', 'cash')) not null,
  balance numeric not null default 0,
  currency text default 'USD'
);

-- Expenses Table
create table expenses (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  amount numeric not null,
  date date not null default CURRENT_DATE,
  location text,
  category text,
  trip_id uuid references trips(id) on delete set null
);

-- Seed Data (Optional)
insert into accounts (name, type, balance) values
('Main Checking', 'checking', 4200),
('Travel Savings', 'savings', 12500),
('Chase Sapphire', 'credit', -850);

insert into trips (name, budget, status, start_date) values
('Tokyo, Japan', 3500, 'completed', '2023-11-01'),
('Paris, France', 2500, 'active', '2023-12-05'),
('Barcelona, Spain', 2000, 'planned', '2024-03-10');

insert into expenses (description, amount, location, date, category) values
('Flight to Paris', 650, 'Paris, France', '2023-12-05', 'Transport'),
('Hotel Booking', 420, 'Paris, France', '2023-12-08', 'Accommodation'),
('Sushi Dinner', 85, 'Tokyo, Japan', '2023-11-05', 'Food');
