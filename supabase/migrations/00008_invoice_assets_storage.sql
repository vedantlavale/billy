-- Storage bucket for invoice logo/stamp images.
--
-- Previously these images were stored as base64 data URLs inside the invoices
-- `data` JSONB column, which bloated every list query to multiple MB. They now
-- live in object storage and the invoice row keeps only a short public URL.

-- Public bucket so <img src> and server-side PDF rendering can read assets
-- without a signed request. Writes are still gated by the policies below.
insert into storage.buckets (id, name, public)
values ('invoice-assets', 'invoice-assets', true)
on conflict (id) do nothing;

-- Anyone can read (assets are public, non-sensitive branding images).
create policy "Public read invoice assets"
  on storage.objects for select
  using (bucket_id = 'invoice-assets');

-- Authenticated users may only write within their own "<user_id>/..." folder.
create policy "Users upload own invoice assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invoice-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own invoice assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'invoice-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own invoice assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'invoice-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
