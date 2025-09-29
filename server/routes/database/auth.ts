import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq, and } from 'drizzle-orm';
import { users } from "../../db/schema.ts";
import { JWT_EXPIRES_IN, JWT_SECRET } from "./config.ts";
import { db } from "../../db/client.ts";
import { requireAuth } from "../../utils/authmiddleware.ts";
import type { AuthRequest } from '../../utils/authmiddleware.ts';

const router = Router();

/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
  console.log("creating an account");
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        provider: "local",
        providerId: "",
        profilePicture: "pfp.jpg", 
      })
      .returning();

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    res.json(user);
  } catch (err: any) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.put(
  "/update-profile-picture",
  requireAuth,
  async (req: AuthRequest, res) => {
    const { profile_pic } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update props and/or video url
    const [updated] = await db
      .update(users)
      .set({ profilePicture: profile_pic })
      .where(eq(users.id, Number(userId)))
      .returning();

    res.json({ message: "User profile picture updated successfully", user: updated });
  }
);


router.put(
  "/update-username",
  requireAuth,
  async (req: AuthRequest, res) => {
    const { username } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }
    const [updated] = await db
      .update(users)
      .set({ name: username })
      .where(eq(users.id, Number(userId)))
      .returning();

    res.json({ message: "Username updated successfully", user: updated });
  }
);


export default router;
