-- Function: set_user_unsafe_on_sos_insert
create or replace function set_user_unsafe_on_sos_insert()
returns trigger
language plpgsql
security definer
as $$
begin
  update users
  set is_safe = false
  where id = new.sent_by;
  return new;
end;
$$;

-- Trigger: runs after each insert on sos table
drop trigger if exists set_user_unsafe_trigger on sos;

create trigger set_user_unsafe_trigger
after insert on sos
for each row
execute procedure set_user_unsafe_on_sos_insert();