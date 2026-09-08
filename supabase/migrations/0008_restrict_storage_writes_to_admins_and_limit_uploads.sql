drop policy if exists "authenticated can upload girl images" on storage.objects;
drop policy if exists "authenticated can update girl images" on storage.objects;
drop policy if exists "authenticated can delete girl images" on storage.objects;

create policy "admins can upload girl images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'girls-images' and public.is_admin());

create policy "admins can update girl images" on storage.objects
  for update to authenticated
  using (bucket_id = 'girls-images' and public.is_admin());

create policy "admins can delete girl images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'girls-images' and public.is_admin());

update storage.buckets
set file_size_limit = 10485760, -- 10MB
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'girls-images';
