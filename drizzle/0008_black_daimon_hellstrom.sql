CREATE TYPE "public"."payment_status" AS ENUM('pending', 'failed', 'success');--> statement-breakpoint
CREATE TYPE "public"."subcription_groups" AS ENUM('individuals', 'groups', 'organisations');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscripton" uuid,
	"by" uuid,
	"amount" integer NOT NULL,
	"phone" integer NOT NULL,
	"status" "payment_status" DEFAULT 'pending',
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "subcriptionExpiration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "for" "subcription_groups" DEFAULT 'individuals' NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscripton_subscriptions_id_fk" FOREIGN KEY ("subscripton") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_by_users_id_fk" FOREIGN KEY ("by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;