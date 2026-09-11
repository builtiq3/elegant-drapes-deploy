CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  fabric text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  is_bestseller boolean NOT NULL DEFAULT false,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products readable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "products writable by everyone" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products updatable by everyone" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "products deletable by everyone" ON public.products FOR DELETE USING (true);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  stars integer NOT NULL DEFAULT 5,
  review_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews readable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews writable by everyone" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews updatable by everyone" ON public.reviews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "reviews deletable by everyone" ON public.reviews FOR DELETE USING (true);

CREATE TABLE IF NOT EXISTS public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  whatsapp_number text NOT NULL DEFAULT '919880253666',
  announcement_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings insertable by everyone" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "settings updatable by everyone" ON public.settings FOR UPDATE USING (true) WITH CHECK (true);

INSERT INTO public.settings (id, whatsapp_number, announcement_text)
VALUES (1, '919880253666', 'Complimentary shipping on all orders across India')
ON CONFLICT (id) DO NOTHING;