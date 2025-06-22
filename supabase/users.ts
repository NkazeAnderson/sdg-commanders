import { tables } from "@/constants";
import { userT } from "@/types";
import { parseDatabaseResponse } from "@/utils";
import { usersSchema } from "@/zodSchema";
import { supabase } from ".";

const userTableRef = supabase.from(tables.users)



export async function createUser(user:userT ) {
   return await userTableRef.insert(user)
}

export async function getUserByEmail(email:string) {
  const res =  await userTableRef.select("*").eq("email", email).single();
    return parseDatabaseResponse(res, usersSchema);
}

export async function getUserByPhone(phone:number) {
  const res =  await userTableRef.select("*").eq("phone", phone).single();
    return parseDatabaseResponse(res, usersSchema);
}

export async function getUserById(id:string) {
   const res = await userTableRef.select("*").eq("id", id).single()
    return parseDatabaseResponse(res, usersSchema);
}

export async function updateUser( user:Partial<userT> & {id:string}) {
    const {id, ...rest} = user; // Exclude id from the update
    const res = await userTableRef.update(rest).eq("id", id);
    return res
}

export async function deleteUser(id:string) {
    return await userTableRef.delete().eq("id", id);
}