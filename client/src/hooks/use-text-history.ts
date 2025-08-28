import { useState, useCallback } from "react";

interface HistoryEntry {
  text: string;
  previousText: string;
  toneType: string;
  timestamp: number;
}

interface UseTextHistoryReturn {
  history: HistoryEntry[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  addToHistory: (entry: HistoryEntry) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  reset: () => void;
}

export function useTextHistory(): UseTextHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setHistory(prev => {
      // Remove any entries after current index (when undoing then making new changes)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.unshift(entry);
      return newHistory;
    });
    setCurrentIndex(0);
  }, [currentIndex]);

  const undo = useCallback((): HistoryEntry | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback((): HistoryEntry | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [currentIndex, history]);

  const reset = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const canUndo = currentIndex < history.length - 1;
  const canRedo = currentIndex > 0;

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    addToHistory,
    undo,
    redo,
    reset
  };
}
