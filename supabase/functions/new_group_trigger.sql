create or replace function add_main_member_to_group()
returns trigger as $$
begin
  insert into group_members (group_id, member_id, role, invitation_accepted)
  values (
    new.id,
    auth.uid(),
    'main',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger if it already exists to avoid duplication
drop trigger if exists add_main_member_trigger on groups;

-- Create the trigger to call the function after each insert
create trigger add_main_member_trigger
after insert on groups
for each row
execute procedure add_main_member_to_group();