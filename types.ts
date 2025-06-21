import { z } from "zod";
import { userModes } from "./constants";
import { groupMembersSchema, groupsSchema, sosSchema, usersSchema } from "./zodSchema";

export type userModesT = typeof userModes[number]

export type userT = z.infer<typeof usersSchema>
export type groupT = z.infer<typeof groupsSchema>
export type groupMemberT = z.infer<typeof groupMembersSchema>
export type sosT =z.infer<typeof sosSchema>
export type withoutIdT<T> = Omit<T, "id">