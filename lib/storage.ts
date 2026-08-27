import { SavedMemPopCard } from '@/types/storage';
import { MemPopContent } from '@/types/mem-pop';

const STORAGE_KEY = 'mem_pop_saved_cards_v1';

export function getSavedCards(): SavedMemPopCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved cards from localStorage', err);
    return [];
  }
}

export function saveCard(content: MemPopContent): SavedMemPopCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedCards();
    // 동일 키워드가 있으면 제거 후 최신으로 추가 (중복 방지)
    const filtered = existing.filter(
      (c) => c.keyword.toLowerCase() !== content.keyword.toLowerCase()
    );
    const newCard: SavedMemPopCard = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      keyword: content.keyword,
      content,
      savedAt: Date.now(),
    };
    const updated = [newCard, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save card to localStorage', err);
    return getSavedCards();
  }
}

export function removeCard(id: string): SavedMemPopCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedCards();
    const updated = existing.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete card from localStorage', err);
    return getSavedCards();
  }
}

export function isCardSaved(keyword: string): boolean {
  if (typeof window === 'undefined') return false;
  const cards = getSavedCards();
  return cards.some((c) => c.keyword.toLowerCase() === keyword.toLowerCase());
}
