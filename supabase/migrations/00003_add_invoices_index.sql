
-- Migration to add a composite index on invoices (user_id, created_at DESC)
-- to speed up the dashboard page loading query

CREATE INDEX IF NOT EXISTS invoices_user_id_created_at_idx 
ON public.invoices (user_id, created_at DESC);
