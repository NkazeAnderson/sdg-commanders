// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TWILIO_ACCOUNT_ID = Deno.env.get("TWILIO_ACCOUNT_ID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");


Deno.serve(async (req) => {
  //implement trottling
  if(req.method === "GET"){
    return new Response(JSON.stringify({"hello":"world"}))
  }
  try {
    const { phone, message } = await req.json();
    console.log({phone, message})
    if (!phone || typeof phone !== "string" || phone.length !== 9) {
      return new Response(
        JSON.stringify({ error: "Phone number must be a string of 9 digits." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!message || typeof message !== "string" || message.length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Twilio credentials from environment variables
 
    if (!TWILIO_ACCOUNT_ID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials are not set." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format phone number (assuming country code +XXX, adjust as needed)
    const toPhone = `+237${phone}`; 

    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_ID}/Messages.json`;
    const body = new URLSearchParams({
      To: toPhone,
      From: TWILIO_FROM_NUMBER,
      Body: message,
    });

    const auth = btoa(`${TWILIO_ACCOUNT_ID}:${TWILIO_AUTH_TOKEN}`);
    const twilioRes = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!twilioRes.ok) {
      const errorText = await twilioRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to send SMS", details: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const twilioData = await twilioRes.json();
    return new Response(
      JSON.stringify({ success: true, sid: twilioData.sid }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid request", details: err }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/sendsms' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
