-- Adds an optional Cloudinary video URL used by the property tour section.
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS video_url TEXT;
