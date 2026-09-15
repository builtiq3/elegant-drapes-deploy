CREATE POLICY "saree images readable" ON storage.objects FOR SELECT USING (bucket_id = 'saree-images');
CREATE POLICY "saree images uploadable" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'saree-images');
CREATE POLICY "saree images updatable" ON storage.objects FOR UPDATE USING (bucket_id = 'saree-images') WITH CHECK (bucket_id = 'saree-images');
CREATE POLICY "saree images deletable" ON storage.objects FOR DELETE USING (bucket_id = 'saree-images');