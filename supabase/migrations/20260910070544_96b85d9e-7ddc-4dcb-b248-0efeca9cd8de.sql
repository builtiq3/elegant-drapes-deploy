ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS has_offer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_price integer;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_offer_price_check;

ALTER TABLE public.products
  ADD CONSTRAINT products_offer_price_check
  CHECK (has_offer = false OR (offer_price IS NOT NULL AND offer_price > 0 AND offer_price < price));