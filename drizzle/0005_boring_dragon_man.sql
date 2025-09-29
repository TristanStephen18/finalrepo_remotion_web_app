ALTER TABLE "renders" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "renders" ADD CONSTRAINT "renders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;