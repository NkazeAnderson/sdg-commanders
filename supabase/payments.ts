import { tables } from "@/constants";
import { parseDatabaseResponse } from "@/utils";
import { paymentsSchema } from "@/zodSchema";
import { supabase } from ".";

const paymentsTableRef = supabase.from(tables.payments)

export async function getpayments() {
    const res= await paymentsTableRef.select("*")
    return parseDatabaseResponse(res, paymentsSchema)
}