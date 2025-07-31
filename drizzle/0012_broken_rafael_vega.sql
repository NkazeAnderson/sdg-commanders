ALTER TABLE "payments" RENAME COLUMN "subscripton" TO "subscription";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscripton_subscriptions_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_subscriptions_id_fk" FOREIGN KEY ("subscription") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;