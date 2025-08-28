import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const textHistoryEntries = pgTable("text_history_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  originalText: text("original_text").notNull(),
  modifiedText: text("modified_text").notNull(),
  toneType: text("tone_type").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  metadata: jsonb("metadata"),
});

export const insertTextHistorySchema = createInsertSchema(textHistoryEntries).omit({
  id: true,
  timestamp: true,
});

export type InsertTextHistory = z.infer<typeof insertTextHistorySchema>;
export type TextHistory = typeof textHistoryEntries.$inferSelect;

// Tone adjustment request/response schemas
export const toneAdjustmentRequestSchema = z.object({
  text: z.string().min(1, "Text cannot be empty"),
  toneType: z.enum(["formal-professional", "casual-friendly", "technical-precise", "creative-engaging"]),
  sessionId: z.string().optional(),
});

export const toneAdjustmentResponseSchema = z.object({
  originalText: z.string(),
  modifiedText: z.string(),
  toneType: z.string(),
  sessionId: z.string(),
  historyId: z.string(),
});

export type ToneAdjustmentRequest = z.infer<typeof toneAdjustmentRequestSchema>;
export type ToneAdjustmentResponse = z.infer<typeof toneAdjustmentResponseSchema>;
