create table if not exists public.portfolio_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.portfolio_content enable row level security;

create policy "Portfolio content is publicly readable"
on public.portfolio_content for select using (true);

create policy "Authenticated admins can create portfolio content"
on public.portfolio_content for insert to authenticated
with check ((auth.jwt() ->> 'email') = 'ramatoulaye.rtg@gmail.com');

create policy "Authenticated admins can update portfolio content"
on public.portfolio_content for update to authenticated
using ((auth.jwt() ->> 'email') = 'ramatoulaye.rtg@gmail.com')
with check ((auth.jwt() ->> 'email') = 'ramatoulaye.rtg@gmail.com');

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

create policy "Portfolio assets are publicly readable"
on storage.objects for select using (bucket_id = 'portfolio-assets');

create policy "Authenticated admins can upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'ramatoulaye.rtg@gmail.com');

create policy "Authenticated admins can update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'ramatoulaye.rtg@gmail.com');
