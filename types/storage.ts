import { MemPopContent } from './mem-pop';

export interface SavedMemPopCard {
  id: string;
  keyword: string;
  content: MemPopContent;
  savedAt: number;
}
