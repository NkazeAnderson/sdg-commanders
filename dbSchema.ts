import { boolean, integer, json, pgEnum, pgTable, time, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// const userRolesEnum = pgEnum('user_roles', userRoles);
const daysEnum = pgEnum("days", ["monday", "tuesday", "wednesday", "thursday", "saturday", "sunday"])

const locationObject = json().$type<{longitude:number, latitude:number}>()

export const usersTable = pgTable("users", {
  id: uuid().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone:integer().notNull().unique(),
  password: varchar(),
  home_address:varchar({length:225}).notNull(),
  accepted_terms:boolean().notNull(),
  last_known_location: locationObject,
  created_at:timestamp({mode:"string"}).defaultNow().notNull(),
  is_safe:boolean(),
  is_agent:boolean().default(false).notNull(), 
});

export const GroupMembersTable = pgTable("group_members", {
  member_id:uuid().notNull(),
  role:varchar({length:50}).notNull(),
  invitation_accepted: boolean()
})

export const GroupsTable = pgTable("groups",{
  id:uuid().notNull().primaryKey(),
  admin_id: uuid().notNull(),
  is_organisation:boolean().notNull().default(false),
  name:varchar().notNull()
})

export const SOSTable = pgTable("sos",{
  id:uuid().notNull().primaryKey(),
  sent_by: uuid().notNull(),
  message:varchar(),
  resolved:boolean(),
  created_at: timestamp({mode:"string"}).defaultNow(),
  updated_at: timestamp({mode:"string"})
})

export const SOSResponsesTable = pgTable("sos_responses",{
  id:uuid().notNull().primaryKey(),
  sos: uuid(),
  response_by: uuid().notNull(),
  description:varchar(),
  images:varchar().array().notNull(),
  created_at: timestamp({mode:"string"}).defaultNow()
})

export const AgentDutiesTable = pgTable("agent_duty",{
  id: uuid().primaryKey().defaultRandom(),
  agent_id: uuid(),
  assigned_location: locationObject,
  purpose: varchar(),
  days: daysEnum().array().notNull(), 
  start_time: time().notNull(),
  end_time:time().notNull(),
  active:boolean().default(true).notNull(),
  created_at:timestamp({mode:"string"}).defaultNow(),
})