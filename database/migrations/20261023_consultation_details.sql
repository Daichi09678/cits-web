-- Preserve visitor requirements and the service/product description visible when submitting.
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS consultation_details JSONB DEFAULT '{}'::jsonb;
