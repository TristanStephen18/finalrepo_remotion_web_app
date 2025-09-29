CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "renders" DROP CONSTRAINT "renders_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "template_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "renders" ADD COLUMN "rendered_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renders" ADD CONSTRAINT "renders_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "renders" DROP COLUMN "project_id";--> statement-breakpoint
ALTER TABLE "renders" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "renders" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "renders" DROP COLUMN "updated_at";