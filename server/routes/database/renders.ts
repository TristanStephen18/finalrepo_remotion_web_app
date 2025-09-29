import { Router } from "express";
import { and, eq } from "drizzle-orm";
import type { AuthRequest } from "../../utils/authmiddleware.ts";
import { requireAuth } from "../../utils/authmiddleware.ts";
import { renders } from "../../db/schema.ts";
import { db } from "../../db/client.ts";

const router = Router();

// Get all renders for the authenticated user
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const allRenders = await db
      .select()
      .from(renders)
      .where(eq(renders.userId, userId));
    res.json(allRenders);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch renders", details: String(err) });
  }
});

// Insert a new render for the authenticated user
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { templateId, outputUrl, type } = req.body;
  if (!userId || !templateId || !outputUrl || !type) {
    return res
      .status(400)
      .json({ error: "Missing userId, templateId or outputUrl" });
  }
  try {
    const [newRender] = await db
      .insert(renders)
      .values({ userId, templateId, outputUrl, type })
      .returning();
    res.json({ message: "Render saved", render: newRender });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save render", details: String(err) });
  }
});

// Delete a render by id for the authenticated user
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const [existing] = await db
      .select()
      .from(renders)
      .where(and(eq(renders.userId, userId), eq(renders.id, id)));
    if (!existing) {
      return res.status(404).json({ error: "Render not found" });
    }
    await db.delete(renders).where(eq(renders.id, id));
    res.json({ message: "Render deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete render", details: String(err) });
  }
});

export default router;
