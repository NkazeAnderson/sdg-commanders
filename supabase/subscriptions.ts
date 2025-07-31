import { tables } from "@/constants";
import { parseDatabaseResponse } from "@/utils";
import { subscriptionsSchema } from "@/zodSchema";
import { supabase } from ".";

const subscriptionsTableRef = supabase.from(tables.subscriptions)

export async function getSubscriptions() {
    const res= await subscriptionsTableRef.select("*")
    return parseDatabaseResponse(res, subscriptionsSchema)
}