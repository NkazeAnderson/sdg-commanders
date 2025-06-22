import { createInsertSchema } from 'drizzle-zod';
import { GroupMembersTable, GroupsTable, SOSTable, usersTable } from './dbSchema';

export const usersSchema = createInsertSchema(usersTable, {
    email:(schema)=> schema.email().min(1, "Email is required").max(255, "Email must be less than 255 characters").toLowerCase(),
    phone:(schema)=> schema
        .min(600000000, "Phone number too short")
        .max(699999999, "Phone number too longs"),
        home_address:(schema) => schema.min(10, "Too short").max(50, "Too long"),
        accepted_terms:(schema) => schema.refine(val => val, "You must accept the terms and conditions"),
        name:(schema)=>schema.toLowerCase(),
        
})

export const groupMembersSchema = createInsertSchema(GroupMembersTable)
export const groupsSchema = createInsertSchema(GroupsTable)

export const sosSchema = createInsertSchema(SOSTable)

