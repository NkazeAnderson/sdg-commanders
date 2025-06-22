-- Trigger function: Insert new user into public.users after signup in private.auth
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
as $$
declare
  user_data jsonb;
begin
  -- Assume NEW.raw_user_meta_data contains the required user fields as a JSON object
  user_data := NEW.raw_user_meta_data;

  insert into public.users (
    id,
    name,
    email,
    phone,
    home_address,
    accepted_terms
  )
  values (
    NEW.id,
    user_data->>'name',
    user_data->>'email',
    (user_data->>'phone')::integer,
    user_data->>'home_address',
    (user_data->>'accepted_terms')::boolean
  );

  return NEW;
end;
$$;

-- Trigger: After insert on private.auth.users
drop trigger if exists after_auth_user_signup on auth.users;

create trigger after_auth_user_signup
after insert on auth.users
for each row
execute procedure handle_new_auth_user();