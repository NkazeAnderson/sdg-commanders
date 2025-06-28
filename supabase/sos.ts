import { tables } from "@/constants";
import { sosT, withoutIdT } from "@/types";
import { parseDatabaseResponse } from "@/utils";
import { sosSchema, usersSchema } from "@/zodSchema";
import { z } from "zod";
import { supabase } from ".";

export const joinedSOSSchema = sosSchema.extend({sent_by: usersSchema})
export type joinedSOSSchemaT = z.infer<typeof joinedSOSSchema>
const sosTableRef = supabase.from(tables.sos)
export async function createSOS(data:withoutIdT<sosT>) {
   const res = await sosTableRef.insert(data).select().single()
   return parseDatabaseResponse(res, sosSchema)
}

export async function addMessageToSOS({id, message}:{id:string, message:string}) {
   const res = await sosTableRef.update({message}).eq("id", id)
   return res 
}

export async function getAllSOS() {
   const res = await sosTableRef.select("*, sent_by (*)")
   return parseDatabaseResponse(res, joinedSOSSchema)
}

