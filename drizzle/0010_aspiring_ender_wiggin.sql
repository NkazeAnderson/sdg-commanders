ALTER TABLE "payments" ALTER COLUMN "subscripton" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "group" uuid;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_group_groups_id_fk" FOREIGN KEY ("group") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;