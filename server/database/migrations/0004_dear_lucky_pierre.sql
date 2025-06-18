ALTER TABLE "report_templates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "report_templates" CASCADE;--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_template_id_report_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "reports_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "student_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "content" jsonb;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "file_id" text;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "options";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "template_id";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "created_by";