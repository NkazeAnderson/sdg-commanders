// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const url = "https://www.dklo.co/api/tara/order"
const urlMOMOCM = "https://www.dklo.co/api/tara/cmmobile"
const webHookUrl = "https://webhook.site/fd991dda-0624-4c0c-bdb8-a8675eaf672a"
const apiKey= Deno.env.get("TARASANDBOXKEY")
const businessId = Deno.env.get("TARABUSINESSID")

type subscriptionT = {
    id: string,
   name:string,
   price:number,
   maximumSubAccounts:number,
}

  // subscription:uuid().references(()=>SubscriptionsTable.id, {onDelete:"set null"}).notNull(),
  // by:uuid().references(()=>usersTable.id, {onDelete:"set null"}).notNull(),
  // amount:integer().notNull(),
  // phone:integer(),
  // status:PaymentStatusEnum().default("pending"),
  // date:timestamp({mode:"string"}).notNull().defaultNow(),
  // months:integer().notNull().default(1),
  // group:uuid().references(()=>GroupsTable.id, {onDelete:"set null"})

//   {
//   "apiKey": "HLyNtehaq6DVTlWxcwIX4xbP",
//   "businessId": "ubRBeAcIjm",
//   "productId": "product-456",
//   "productName": "Product name",
//   "productPrice": 100,
//   "phoneNumber": "6xxxxxxxx",
//   "webHookUrl": "https://example.com/webhook"
// }

Deno.serve(async (req) => {
  const {   subscription,
  phone,
  months,
  group } = await req.json()
  const authorization = req.headers.get('Authorization')!
  const token = authorization.replace('Bearer ', '')
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
  { global: { headers: { Authorization:authorization  } } }    ) ;
  
  const {data: {user }, error: userError} = await supabase.auth.getUser(token)
  if (userError || !user) {
    return  new Response(
    JSON.stringify(userError),
    { headers: { "Content-Type": "application/json" }, status:403 },
  )
  }
  const { data, error } = await supabase.from('subscriptions').select('*').eq("id", subscription).limit(1).single()
  const dataInfo : subscriptionT  = data
  
  const paymentInfo = {
    subscription,
    by:user.id,
    amount:dataInfo.price * months,
    phone: parseInt(phone),
    months: parseInt(months),
    group
  }
  const { data:{id:paymentId}, error:paymentError } = await supabase.from('payments').insert(paymentInfo).select().single()

  if (error ) {
    return  new Response(
    JSON.stringify(error),
    { headers: { "Content-Type": "application/json" }, status:404 },
  )
  }
  if (paymentError ) {
    return  new Response(
    JSON.stringify(paymentError),
    { headers: { "Content-Type": "application/json" }, status:404 },
  )
  }
  const res = phone ? await fetch(urlMOMOCM,{
  method:"POST",
  body:JSON .stringify({
  apiKey,
  businessId,
  "productId": paymentId,
  "productName": dataInfo.name.toUpperCase(),
  "productPrice": paymentInfo.amount ,
  "phoneNumber": String(paymentInfo.phone),
  webHookUrl
})
})  :  await fetch(url,{
  method:"POST",
  body:JSON .stringify({
  apiKey,
  businessId,
  "productId": paymentId,
  "productName": dataInfo.name.toUpperCase(),
  "productPrice": paymentInfo.amount,
  "productDescription": `SKG COMMANDERS subscription for ${dataInfo.maximumSubAccounts} ${dataInfo.maximumSubAccounts<1 ? "person" :"people"}}`,
  "productPictureUrl": "https://example.com/image.jpg",
  "returnUrl": "https://example.com/return",
  webHookUrl
})
})
const resData= await res.json()
  
return new Response(
    JSON.stringify(resData),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/tara-payments' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
