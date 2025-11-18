-- Enable the pgcrypto extension for UUID generation
create extension if not exists pgcrypto;

-- Create a storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (name) do update set public = true;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow uploads for authenticated users" on storage.objects;
drop policy if exists "Allow updates for authenticated users" on storage.objects;
drop policy if exists "Allow deletes for authenticated users" on storage.objects;

-- 1. Allow public read access to all files in the products bucket
create policy "Public Access"
on storage.objects for select
using (bucket_id = 'products');

-- 2. Allow anyone to upload files (for testing, can be restricted later)
create policy "Allow uploads"
on storage.objects for insert
to public
with check (bucket_id = 'products');

-- 3. Allow updates to any file in the products bucket (for testing)
create policy "Allow updates"
on storage.objects for update
to public
using (bucket_id = 'products')
with check (bucket_id = 'products');

-- 4. Allow deletes for any file in the products bucket (for testing)
create policy "Allow deletes"
on storage.objects for delete
to public
using (bucket_id = 'products');

-- 5. Additional policy to ensure public access to files
create or replace function public.get_public_url(bucket text, path text)
returns text as $$
begin
  return format('https://%s/storage/v1/object/public/%s/%s', 
    current_setting('app.settings.supabase_url', true),
    bucket,
    path
  );
end;
$$ language plpgsql security definer;
