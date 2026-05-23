-- Replace environment-specific image URLs with portable relative URLs.
-- Run this in Supabase SQL Editor for the live project.

UPDATE public.products
SET images = (
  SELECT array_agg(
    regexp_replace(
      image_url,
      '^https?://(localhost:5173|localhost:3000|petals-and-pots\.vercel\.app)',
      ''
    )
    ORDER BY image_order
  )
  FROM unnest(images) WITH ORDINALITY AS product_image(image_url, image_order)
)
WHERE images IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM unnest(images) AS product_image(image_url)
    WHERE image_url ~ '^https?://(localhost:5173|localhost:3000|petals-and-pots\.vercel\.app)/'
  );

UPDATE public.user_plants
SET plant_image = regexp_replace(
  plant_image,
  '^https?://(localhost:5173|localhost:3000|petals-and-pots\.vercel\.app)',
  ''
)
WHERE plant_image ~ '^https?://(localhost:5173|localhost:3000|petals-and-pots\.vercel\.app)/';
