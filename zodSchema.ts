import { createInsertSchema } from 'drizzle-zod';
import { GroupMembersTable, GroupsTable, MessagesTable, NotificationsTable, PaymentsTable, SOSResponsesTable, SOSTable, SubscriptionsTable, usersTable } from './dbSchema';

export const usersSchema = createInsertSchema(usersTable, {
    email:(schema)=> schema.email().min(1, "Email is required").max(255, "Email must be less than 255 characters").toLowerCase(),
    phone:(schema)=> schema
        .min(600000000, "Phone number too short. Cameroon only.")
        .max(699999999, "Phone number too longs. Cameroon only."),
    home_address:(schema) => schema.min(10, "Too short").max(50, "Too long"),
    accepted_terms:(schema) => schema.refine(val => val, "You must accept the terms and conditions"),
    name:(schema)=>schema,
    emergency_phone: (schema)=> schema
        .min(600000000, "Phone number too short. Cameroon only.")
        .max(699999999, "Phone number too longs. Cameroon only."),
    id:(schema)=>schema.refine(item=>String(item))
})

export const groupMembersSchema = createInsertSchema(GroupMembersTable, {id:(schema)=>schema.refine(item=>String(item))})
export const groupsSchema = createInsertSchema(GroupsTable, {id:(schema)=>schema.refine(item=>String(item))})

export const sosSchema = createInsertSchema(SOSTable, {id:(schema)=>schema.refine(item=>String(item))})

export const sosResponseSchema = createInsertSchema(SOSResponsesTable, {id:(schema)=>schema.refine(item=>String(item))})

export const messagesSchema = createInsertSchema(MessagesTable, {id:(schema)=>schema.refine(item=>String(item))})

export const notificationsSchema = createInsertSchema(NotificationsTable, {id:(schema)=>schema.refine(item=>String(item))})

export const subscriptionsSchema = createInsertSchema(SubscriptionsTable,{id:(schema)=>schema.refine(item=>String(item))})

export const paymentsSchema = createInsertSchema(PaymentsTable, {id:(schema)=>schema.refine(item=>String(item))})
