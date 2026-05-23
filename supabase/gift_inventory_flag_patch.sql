-- CHLORO gifts page: explicit admin-controlled product flag.
-- Run this once in Supabase SQL Editor before saving products with "Show on gift page".

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_gift BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS products_is_gift_idx ON public.products(is_gift);

-- Keep existing gift-like catalogue items visible until admins review them.
UPDATE public.products
SET is_gift = TRUE
WHERE is_gift = FALSE
  AND (
    LOWER(COALESCE(name, '')) LIKE ANY (ARRAY['%gift%', '%bundle%', '%crate%', '%terrarium%', '%duo%'])
    OR LOWER(COALESCE(category, '')) LIKE ANY (ARRAY['%gift%', '%pot%', '%planter%', '%vessel%'])
    OR EXISTS (
      SELECT 1
      FROM unnest(COALESCE(tags, ARRAY[]::TEXT[])) AS tag
      WHERE LOWER(tag) LIKE ANY (ARRAY['%gift%', '%bundle%', '%gift-set%', '%care-kit%', '%premium%'])
    )
  );

NOTIFY pgrst, 'reload schema';
