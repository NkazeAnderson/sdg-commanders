import { z } from "zod";
import { userModes } from "./constants";
import { groupMembersSchema, groupsSchema, messagesSchema, notificationsSchema, sosResponseSchema, sosSchema, usersSchema } from "./zodSchema";

export type userModesT = typeof userModes[number]

export type userT = z.infer<typeof usersSchema>
export type groupT = z.infer<typeof groupsSchema>
export type groupMemberT = z.infer<typeof groupMembersSchema>
export type sosT =z.infer<typeof sosSchema>
export type sosResponseT =z.infer<typeof sosResponseSchema>
export type messageT =z.infer<typeof messagesSchema> & { pending?: boolean, unread?: boolean }
export type notificationT =z.infer<typeof notificationsSchema>
export type withoutIdT<T> = Omit<T, "id">