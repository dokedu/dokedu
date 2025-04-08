CREATE INDEX "entry_events_event_id_entry_id_index" ON "entry_events" USING btree ("event_id","entry_id");--> statement-breakpoint
CREATE INDEX "entry_tags_tag_id_entry_id_index" ON "entry_tags" USING btree ("tag_id","entry_id");--> statement-breakpoint
CREATE INDEX "entry_users_user_id_entry_id_index" ON "entry_users" USING btree ("user_id","entry_id");--> statement-breakpoint
CREATE INDEX "user_competences_user_id_entry_id_index" ON "user_competences" USING btree ("user_id","entry_id");