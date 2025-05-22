import { eq } from "drizzle-orm";
import { organisations, users } from "../../../database/schema"; // Adjusted path
import { useValidatedBody } from "h3"; // Assuming H3 is used based on existing files

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  if (!secure) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // Check if user is owner or admin
  if (user.role !== "owner" && user.role !== "admin") {
    throw createError({ statusCode: 403, message: "Forbidden: Only owners or admins can change the organisation name." });
  }

  const body = await useValidatedBody(event, {
    name: (value) => typeof value === "string" && value.trim().length > 0, 
  });

  if (!body.name) {
    throw createError({ statusCode: 400, message: "Validation failed: Organisation name cannot be empty." });
  }
  
  const orgId = secure.organisationId;

  const result = await useDrizzle()
    .update(organisations)
    .set({ name: body.name, updatedAt: new Date() }) // Also update updatedAt
    .where(eq(organisations.id, orgId))
    .returning(); // Return the updated record

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: "Organisation not found or not updated." });
  }

  return { organisation: result[0] }; 
});
