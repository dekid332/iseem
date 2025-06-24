import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { insertLeaderboardSchema, leaderboard } from "../shared/schema";
import { desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { db } = await import("./db");
      const entries = await db
        .select()
        .from(leaderboard)
        .orderBy(desc(leaderboard.score))
        .limit(50);
      
      res.json(entries);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Submit score to leaderboard
  app.post("/api/leaderboard", async (req, res) => {
    try {
      const result = insertLeaderboardSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid data", 
          details: result.error.errors 
        });
      }

      const { db } = await import("./db");
      const [newEntry] = await db
        .insert(leaderboard)
        .values(result.data)
        .returning();

      log(`New leaderboard entry: ${result.data.username} - ${result.data.score} points`);
      res.json(newEntry);
    } catch (error) {
      console.error("Error submitting score:", error);
      res.status(500).json({ error: "Failed to submit score" });
    }
  });

  const httpServer = createServer(app);

  // Setup Vite or static serving
  if (app.get("env") === "development") {
    setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  return httpServer;
}
