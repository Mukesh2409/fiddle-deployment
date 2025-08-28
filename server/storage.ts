import { type TextHistory, type InsertTextHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTextHistory(sessionId: string): Promise<TextHistory[]>;
  createTextHistoryEntry(entry: InsertTextHistory): Promise<TextHistory>;
  getTextHistoryEntry(id: string): Promise<TextHistory | undefined>;
}

export class MemStorage implements IStorage {
  private textHistory: Map<string, TextHistory>;

  constructor() {
    this.textHistory = new Map();
  }

  async getTextHistory(sessionId: string): Promise<TextHistory[]> {
    return Array.from(this.textHistory.values())
      .filter(entry => entry.sessionId === sessionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createTextHistoryEntry(insertEntry: InsertTextHistory): Promise<TextHistory> {
    const id = randomUUID();
    const entry: TextHistory = {
      ...insertEntry,
      id,
      timestamp: new Date(),
    };
    this.textHistory.set(id, entry);
    return entry;
  }

  async getTextHistoryEntry(id: string): Promise<TextHistory | undefined> {
    return this.textHistory.get(id);
  }
}

export const storage = new MemStorage();
