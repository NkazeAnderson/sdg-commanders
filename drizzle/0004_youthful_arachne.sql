CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" varchar NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"price" integer NOT NULL,
	"maximumSubAccounts" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deviceIds" varchar[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subcription" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subcriptionExpiration" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_subcription_subscriptions_id_fk" FOREIGN KEY ("subcription") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;