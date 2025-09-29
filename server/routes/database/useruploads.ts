import { Router } from "express";
import { eq, and } from "drizzle-orm";
import type { AuthRequest } from "../../utils/authmiddleware.ts";
import { requireAuth } from "../../utils/authmiddleware.ts";
import { uploads } from "../../db/schema.ts";
import { db } from "../../db/client.ts";

const router = Router();

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { type, url } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!type || !url) {
    return res.status(400).json({ error: "Missing type or url" });
  }

  try {
    const [newUpload] = await db
      .insert(uploads)
      .values({ userId, type, url })
      .returning();
    res.json({ message: "Upload saved", upload: newUpload });
  } catch (err) {
    res.status(500).json({ error: "Failed to save upload", details: String(err) });
  }
});

// Delete upload
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const [existing] = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.userId, userId), eq(uploads.id, Number(id))));
    if (!existing) {
      return res.status(404).json({ error: "Upload not found" });
    }
    await db.delete(uploads).where(eq(uploads.id, Number(id)));
    res.json({ message: "Upload deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete upload", details: String(err) });
  }
});

// Get all uploads for the authenticated user
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const userUploads = await db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId));
    res.json(userUploads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch uploads", details: String(err) });
  }
});

// Get all images for the authenticated user
router.get("/images", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const userImages = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.userId, userId), eq(uploads.type, "image")));
    res.json(userImages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images", details: String(err) });
  }
});

// Get all videos for the authenticated user
router.get("/videos", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const userVideos = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.userId, userId), eq(uploads.type, "video")));
    res.json(userVideos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos", details: String(err) });
  }
});

export default router;
