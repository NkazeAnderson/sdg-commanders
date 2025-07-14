ALTER TABLE "messages" RENAME COLUMN "user" TO "sentTo";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_agent_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sentTo_users_id_fk" FOREIGN KEY ("sentTo") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "agent";