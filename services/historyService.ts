import { HistoryItem } from '../types';

const STORAGE_KEY = 'tiktok_studio_history_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const saveHistoryItem = (item: HistoryItem): HistoryItem[] => {
  try {
    const current = getHistory();
    const updated = [item, ...current].slice(0, 50); // Keep last 50 items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving history:', error);
    return getHistory();
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};