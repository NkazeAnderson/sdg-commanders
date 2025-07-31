ALTER TABLE "groups" ADD COLUMN "subcription" uuid;--> statement-breakpoint
ALTER TABLE "groups" ADD COLUMN "subcriptionExpiration" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_subcription_subscriptions_id_fk" FOREIGN KEY ("subcription") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;