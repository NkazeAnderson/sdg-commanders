import { tables } from "@/constants";
import { sosT, withoutIdT } from "@/types";
import { parseDatabaseResponse } from "@/utils";
import { sosSchema } from "@/zodSchema";
import { supabase } from ".";

const sosTableRef = supabase.from(tables.sos)
export async function createSOS(data:withoutIdT<sosT>) {
   const res = await sosTableRef.insert(data).select().single()
   return parseDatabaseResponse(res, sosSchema)
}

export async function addMessageToSOS({id, message}:{id:string, message:string}) {
   const res = await sosTableRef.update({message}).eq("id", id)
   return res
}

