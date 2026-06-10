-- Hardening database schema with updated_at triggers, status constraint, and atomic counters

-- Add updated_at columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS handle_updated_at_invoices ON public.invoices;
CREATE TRIGGER handle_updated_at_invoices
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Add CHECK constraint on status column of invoices table
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS check_invoice_status;
ALTER TABLE public.invoices ADD CONSTRAINT check_invoice_status CHECK (status IN ('draft', 'sent', 'paid', 'void'));

-- Create increment_invoice_count RPC function
CREATE OR REPLACE FUNCTION public.increment_invoice_count(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET invoice_count = COALESCE(invoice_count, 0) + 1
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
