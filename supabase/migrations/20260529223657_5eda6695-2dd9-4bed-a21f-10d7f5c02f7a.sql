
-- Fix WARN 1: search_path on touch_updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Fix WARN 2: tighten article update policy
drop policy "authenticated can edit articles" on public.articles;
create policy "authenticated can edit articles"
  on public.articles for update to authenticated
  using (auth.uid() is not null)
  with check (updated_by = auth.uid());

-- Fix WARN 3-6: revoke execute on security definer functions
revoke execute on function public.has_role(uuid, app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
