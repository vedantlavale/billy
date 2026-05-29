-- Migration to allow users to delete their own invoices

create policy "Users can delete own invoices"
  on public.invoices for delete
  using (auth.uid() = user_id);
