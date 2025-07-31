// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
// {
//   "businessId": "ubRBeAcIjm",
//   "paymentId": "8050bd6d-7148-4141-97e0-52578ef8ebe1",
//   "amount": "5000",
//   "collectionId": "493496716394",
//   "transactionCode": "COULD_NOT_WITHDRAW_FROM_CUSTOMER_TRANSACTION_DENIED_OR_NOT_ENOUGH_BALANCE",
//   "creationDate": "2025-07-31T03:43:43.810+02:00",
//   "changeDate": "2025-07-31T03:43:43.810+02:00",
//   "type": "DEPOSIT",
//   "status": "ERROR"
// }
Deno.serve(async (req) => {
  //web hook key required
   const { status, paymentId} = await req.json()
  
   const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', 
   Deno.env.get('SERVICEROLEKEY') ?? '') ;
   
  const { data: {by, group, months, date, subscription}, error } = await supabase.from('payments').update({status: status=== "SUCCESS" ? "success":"failed"}).eq("id", paymentId).select().single()

   if (status=== "SUCCESS") {
    const nextExpirationDate = new Date(date)
    nextExpirationDate.setMonth(nextExpirationDate.getMonth() + months);
 group ?  await supabase.from('groups').update({subcription:subscription,
            subcriptionExpiration:nextExpirationDate
            }).eq("id", group):
              await supabase.from('users').update({subcription:subscription,
            subcriptionExpiration:nextExpirationDate
            }).eq("id", by)
   }

  return new Response(
    JSON.stringify({}),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/tara-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
