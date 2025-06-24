import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  walletAddress: text("wallet_address"),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  enemiesKilled: integer("enemies_killed").notNull(),
  gameTime: integer("game_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  username: true,
  walletAddress: true,
  score: true,
  level: true,
  enemiesKilled: true,
  gameTime: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type LeaderboardEntry = typeof leaderboard.$inferSelect;
