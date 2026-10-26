CREATE TABLE IF NOT EXISTS public_page_content (
  page TEXT PRIMARY KEY CHECK (page IN ('about', 'portfolio')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
