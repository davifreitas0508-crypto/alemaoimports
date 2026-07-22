-- Migração dos produtos existentes do site para o Supabase
-- Rode depois do schema.sql, no SQL Editor do Supabase

insert into products (id, category, model, memory, color, color_hex, condition, battery, price, old_price, badges, images, position)
values
  ('ip17-pm-256-laranja', 'iphone', 'iPhone 17 Pro Max', '256GB', 'Laranja', '#c1622a', 'novo', null, 7400, null, '["Lacrado", "Garantia Apple"]'::jsonb, '["assets/img/products/iphone-17-pro-max-laranja.jpg"]'::jsonb, 0),
  ('ip17-pm-256-azul', 'iphone', 'iPhone 17 Pro Max', '256GB', 'Azul', '#31456b', 'novo', null, 7650, null, '["Lacrado", "Garantia Apple"]'::jsonb, '["assets/img/products/iphone-17-pro-max-azul.jpg"]'::jsonb, 1),
  ('ip17-pm-256-prata', 'iphone', 'iPhone 17 Pro Max', '256GB', 'Prata', '#d8d6d0', 'novo', null, 7700, null, '["Lacrado", "Garantia Apple"]'::jsonb, '["assets/img/products/iphone-17-pro-max-prata.jpg"]'::jsonb, 2),
  ('ip16-128-preto-seminovo', 'iphone', 'iPhone 16', '128GB', 'Preto', '#1c1c1e', 'seminovo', '100%', 4899, null, '["Seminovo", "Chip Físico", "Garantia Apple NOV/26"]'::jsonb, '["assets/img/products/iphone-16-preto-seminovo-1.jpg", "assets/img/products/iphone-16-preto-seminovo-2.jpg"]'::jsonb, 3),
  ('ip16-pm-256-titnat', 'iphone', 'iPhone 16 Pro Max', '256GB', 'Titânio Natural', '#8a8378', 'novo', null, 9499, 10299, '["Lacrado", "Garantia Apple"]'::jsonb, '[]'::jsonb, 4),
  ('ip16-pro-128-titdes', 'iphone', 'iPhone 16 Pro', '128GB', 'Titânio Deserto', '#c8a97e', 'novo', null, 8299, null, '["Lacrado", "Garantia Apple"]'::jsonb, '[]'::jsonb, 5),
  ('ip16-128-preto', 'iphone', 'iPhone 16', '128GB', 'Preto', '#1c1c1e', 'novo', null, 6799, null, '["Lacrado", "Garantia Apple"]'::jsonb, '[]'::jsonb, 6),
  ('ip15-pm-256-titazul', 'iphone', 'iPhone 15 Pro Max', '256GB', 'Titânio Azul', '#3c4a5c', 'seminovo', '92%', 6999, 7499, '["Seminovo", "Nota Fiscal"]'::jsonb, '[]'::jsonb, 7),
  ('ip15-128-rosa', 'iphone', 'iPhone 15', '128GB', 'Rosa', '#f2c9cf', 'novo', null, 5399, null, '["Lacrado", "Garantia Apple"]'::jsonb, '[]'::jsonb, 8),
  ('ip14-pro-256-roxo', 'iphone', 'iPhone 14 Pro', '256GB', 'Roxo Profundo', '#4c4258', 'seminovo', '89%', 5299, null, '["Seminovo", "Revisado"]'::jsonb, '[]'::jsonb, 9),
  ('ip14-128-meianoite', 'iphone', 'iPhone 14', '128GB', 'Meia-noite', '#1b1b1f', 'seminovo', '94%', 3999, 4399, '["Seminovo", "Revisado"]'::jsonb, '[]'::jsonb, 10),
  ('ip13-128-estelar', 'iphone', 'iPhone 13', '128GB', 'Estelar', '#e8e1d0', 'seminovo', '87%', 3199, null, '["Seminovo", "Revisado"]'::jsonb, '[]'::jsonb, 11),
  ('ip12-64-preto', 'iphone', 'iPhone 12', '64GB', 'Preto', '#1c1c1e', 'seminovo', '85%', 2399, null, '["Seminovo", "Revisado"]'::jsonb, '[]'::jsonb, 12),
  ('ip11-64-branco', 'iphone', 'iPhone 11', '64GB', 'Branco', '#f2f2f2', 'seminovo', '83%', 1799, 1999, '["Seminovo", "Revisado"]'::jsonb, '[]'::jsonb, 13),
  ('airpods-pro-2', 'acessorio', 'AirPods Pro (2ª geração)', 'USB-C', 'Branco', '#f2f2f2', 'novo', null, 1499, 1699, '["Lacrado"]'::jsonb, '[]'::jsonb, 14),
  ('carregador-20w', 'acessorio', 'Carregador USB-C 20W', 'Original', 'Branco', '#f2f2f2', 'novo', null, 149, null, '["Lacrado"]'::jsonb, '[]'::jsonb, 15),
  ('capinha-silicone', 'acessorio', 'Capinha de Silicone', 'Diversos modelos', 'Várias cores', '#7a7a7a', 'novo', null, 79, null, '["Lacrado"]'::jsonb, '[]'::jsonb, 16),
  ('pelicula-privacidade', 'acessorio', 'Película de Privacidade', 'Diversos modelos', 'Transparente', '#cfcfcf', 'novo', null, 59, null, '["Lacrado"]'::jsonb, '[]'::jsonb, 17)

on conflict (id) do update set
  category = excluded.category,
  model = excluded.model,
  memory = excluded.memory,
  color = excluded.color,
  color_hex = excluded.color_hex,
  condition = excluded.condition,
  battery = excluded.battery,
  price = excluded.price,
  old_price = excluded.old_price,
  badges = excluded.badges,
  images = excluded.images,
  position = excluded.position,
  updated_at = now();
