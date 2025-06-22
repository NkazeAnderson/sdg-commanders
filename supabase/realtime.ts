import { REALTIME_SUBSCRIBE_STATES, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from ".";

export const postgresChangesChannel = supabase
  .channel('schema-db-changes')

export  function registerToPostgresChanges(callback:(payload:RealtimePostgresChangesPayload<{
    [key: string]: any;
}>)=>void, updateRegistrationStatus:(registered:boolean)=>void) {
  postgresChangesChannel
  .on(
    'postgres_changes',
    {
      event: '*', // Listen only to INSERTs
      schema: 'public',
    },
    (payload) => callback(payload)
  )
  .subscribe((status)=>{
    console.log({status});
    status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED && updateRegistrationStatus(true)
  })
  }