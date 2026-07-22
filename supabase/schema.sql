-- Alemão Importados — schema do catálogo
-- Rode este script inteiro no SQL Editor do Supabase (Project > SQL Editor > New query > Run)

-- 1. Tabela de produtos
create table if not exists products (
  id text primary key,
  category text not null,
  model text not null,
  memory text not null,
  color text not null,
  color_hex text not null default '#1c1c1e',
  condition text not null check (condition in ('novo', 'seminovo')),
  battery text,
  price numeric not null,
  old_price numeric,
  badges jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Segurança: todo mundo pode ler o catálogo; só usuário logado pode editar
alter table products enable row level security;

drop policy if exists "Público pode ver produtos" on products;
create policy "Público pode ver produtos"
  on products for select
  using (true);

drop policy if exists "Logado pode inserir produtos" on products;
create policy "Logado pode inserir produtos"
  on products for insert
  to authenticated
  with check (true);

drop policy if exists "Logado pode editar produtos" on products;
create policy "Logado pode editar produtos"
  on products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Logado pode excluir produtos" on products;
create policy "Logado pode excluir produtos"
  on products for delete
  to authenticated
  using (true);

-- 3. Bucket de imagens para fotos de produtos enviadas pelo painel admin
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Público pode ver fotos de produtos" on storage.objects;
create policy "Público pode ver fotos de produtos"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Logado pode enviar fotos de produtos" on storage.objects;
create policy "Logado pode enviar fotos de produtos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Logado pode atualizar fotos de produtos" on storage.objects;
create policy "Logado pode atualizar fotos de produtos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Logado pode excluir fotos de produtos" on storage.objects;
create policy "Logado pode excluir fotos de produtos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
