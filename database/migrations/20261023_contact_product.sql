-- Keep the catalog ID and a name snapshot so product consultations remain clear after catalog edits.
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS product_requested TEXT;
