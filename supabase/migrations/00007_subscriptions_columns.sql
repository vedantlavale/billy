-- Aligning subscriptions table with Dodo Payments identifiers

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS dodo_subscription_id TEXT;
