import { boolean, date, integer, json, pgTable, time, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { tables } from "./constants";

// const userRolesEnum = pgEnum('user_roles', userRoles);

const locationObject = json().$type<{longitude:number, latitude:number}>()

export const subscriptionsTable=pgTable(tables.subscriptions, {
   id: uuid().notNull().primaryKey().defaultRandom(),
   name:varchar({ length: 50 }).notNull(),
   price:integer().notNull(),
   maximumSubAccounts:integer().notNull(),
   is_defualt:boolean()
})

export const usersTable = pgTable(tables.users, {
  id: uuid().notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone:integer().notNull().unique(),
  emergency_phone:integer(),
  home_address:varchar({length:225}).notNull(),
  accepted_terms:boolean().notNull(),
  last_known_location: json().$type<{longitude:number, latitude:number}>(),
  created_at:timestamp({mode:"string"}).defaultNow().notNull(),
  is_safe:boolean().default(true),
  is_agent:boolean().default(false).notNull(), 
  profile_picture:varchar(),
  deviceIds:varchar().array(),
  subcription: uuid().notNull().references(() => subscriptionsTable.id),
  subcriptionExpiration:date({mode:"string"}).notNull().defaultNow()
});

export const GroupsTable = pgTable(tables.groups,{
  id:uuid().notNull().primaryKey().defaultRandom(),
  admin_id: uuid().notNull().references(() => usersTable.id),
  is_organisation:boolean().notNull().default(false),
  name:varchar().notNull()
})

export const GroupMembersTable = pgTable(tables.group_members, {
  id: uuid().notNull().primaryKey().defaultRandom(),
  group_id: uuid().notNull().references(() => GroupsTable.id),
  member_id:uuid().references(() => usersTable.id),
  role:varchar({length:50}).notNull(),
  invitation_accepted: boolean(),
  created_at: timestamp({mode:"string"}).defaultNow() // to be used for cron job
})


export const SOSTable = pgTable(tables.sos,{
  id:uuid().notNull().primaryKey().defaultRandom(),
  sent_by: uuid().notNull().references(()=>usersTable.id),
  message:varchar(),
  resolved:boolean(),
  created_at: timestamp({mode:"string"}).defaultNow(),
  updated_at: timestamp({mode:"string"}).defaultNow(),
  location: json().$type<{longitude:number, latitude:number}>().notNull(),
})

export const SOSResponsesTable = pgTable(tables.sos_responses,{
  id:uuid().notNull().primaryKey().defaultRandom(),
  sos: uuid().references(() => SOSTable.id).notNull(),
  response_by: uuid().notNull().references(()=>usersTable.id, {onDelete:"cascade"}),
  description:varchar(),
  images:varchar().array(),
  created_at: timestamp({mode:"string"}).defaultNow().notNull()
})

export const AgentDutiesTable = pgTable(tables.agent_duty,{
  id: uuid().primaryKey().defaultRandom(),
  agent_id: uuid().references(() => usersTable.id, {onDelete:"cascade"}).notNull(),
  assigned_location: json().$type<{longitude:number, latitude:number}>().notNull(),
  purpose: varchar(),
  days: varchar().array().notNull(), 
  start_time: time().notNull(),
  end_time:time().notNull(),
  active:boolean().default(true).notNull(),
  created_at:timestamp({mode:"string"}).defaultNow(),
})

export const MessagesTable = pgTable(tables.messages, {
  id: uuid().primaryKey().defaultRandom(),
  text:varchar().notNull(),
  sentTo:uuid().references(() => usersTable.id, {onDelete:"cascade"}).notNull(),
  sentBy:uuid().references(() => usersTable.id, {onDelete:"cascade"}).notNull(),
  created_at:timestamp({mode:"string"}).defaultNow(),
})

export const NotificationsTable = pgTable(tables.notifications, {
  id: uuid().primaryKey().defaultRandom(),
  text:varchar().notNull(),
  userId:uuid().references(() => usersTable.id, {onDelete:"cascade"}).notNull(),
})