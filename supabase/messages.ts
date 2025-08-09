import { tables } from "@/constants";
import { messageT, userT, withoutIdT } from "@/types";
import { parseDatabaseResponse } from "@/utils";
import { messagesSchema } from "@/zodSchema";
import { supabase } from ".";

const messageTableRef = supabase.from(tables.messages)



export async function createMessage(message:withoutIdT<messageT>) {
   return await messageTableRef.insert(message)
}

export async function getMessages(user:userT) {
  const res = await messageTableRef
    .select("*")
    .or(`sentBy.eq.${user.id},sentTo.eq.${user.id}`);
    return parseDatabaseResponse(res, messagesSchema);
}


