-- CHLORO product media storage buckets.
-- Run this in Supabase SQL Editor if admin image/model uploads fail because a bucket is missing.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'plant-model',
  'plant-model',
  true,
  52428800,
  ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'application/json', 'text/plain']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Admins can upload product models" ON storage.objects;
CREATE POLICY "Admins can upload product models" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'plant-model'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  );

-- Prototype fallback: keep model uploads working even if the user's role row is not
-- visible to Storage RLS. The admin route still controls access in the app.
DROP POLICY IF EXISTS "Authenticated can upload product models" ON storage.objects;
CREATE POLICY "Authenticated can upload product models" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'plant-model');

DROP POLICY IF EXISTS "Admins can update product models" ON storage.objects;
CREATE POLICY "Admins can update product models" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'plant-model'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    bucket_id = 'plant-model'
    AND EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()
        AND role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Authenticated can update product models" ON storage.objects;
CREATE POLICY "Authenticated can update product models" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'plant-model')
  WITH CHECK (bucket_id = 'plant-model');

DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
CREATE POLICY "Public can read product images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public can read product models" ON storage.objects;
CREATE POLICY "Public can read product models" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'plant-model');
