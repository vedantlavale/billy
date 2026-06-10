-- Adding analytics tracking columns to profiles and updating increment function

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_source TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_invoice_at TIMESTAMP;

-- Update increment_invoice_count RPC to record first_invoice_at atomically on the first invoice creation
CREATE OR REPLACE FUNCTION public.increment_invoice_count(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    first_invoice_at = CASE WHEN COALESCE(invoice_count, 0) = 0 THEN NOW() ELSE first_invoice_at END,
    invoice_count = COALESCE(invoice_count, 0) + 1
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
