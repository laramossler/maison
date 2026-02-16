export interface Course {
  type: 'amuse-bouche' | 'starter' | 'soup' | 'fish' | 'main' | 'salad' | 'cheese' | 'dessert' | 'petit-fours';
  dish: string;
  recipe?: string;
  notes: string;
}

export interface Wine {
  course: string;
  name: string;
  vintage?: string;
  notes: string;
}

export interface TimelineEntry {
  time: string;
  activity: string;
}

export interface Reflection {
  overallRating: 1 | 2 | 3 | 4 | 5;
  pacing: 'rushed' | 'slow' | 'perfect';
  menuHighlights: string;
  menuMisses: string;
  conversationQuality: 1 | 2 | 3 | 4 | 5;
  guestChemistry: string;
  whatToChange: string;
  unexpectedDelights: string;
  freeNotes: string;
}

export interface Outfit {
  description: string;
  designer?: string;
  notes?: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  purpose?: string;
  occasion: 'dinner' | 'luncheon' | 'cocktails' | 'tea' | 'brunch' | 'weekend' | 'holiday' | 'other';
  location: string;
  guestIds: string[];
  guestOfHonorId?: string;
  menu: {
    courses: Course[];
    wines: Wine[];
    notes: string;
  };
  atmosphere: {
    tableSettings: string;
    flowers: string;
    lighting: string;
    music: string;
    scent: string;
  };
  outfit?: Outfit;
  seatingNotes: string;
  plannedTimeline: TimelineEntry[];
  reflection?: Reflection;
  status: 'planning' | 'upcoming' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface LedgerProfile {
  familyName: string;
  residence: string;
}

export interface Guest {
  id: string;
  name: string;
  relationship: string;
  dietary: string;
  preferences: string;
  personalNotes: string;
  conversationTopics: string;
  createdAt: string;
  updatedAt: string;
}

export const OCCASION_LABELS: Record<Event['occasion'], string> = {
  dinner: 'Dinner',
  luncheon: 'Luncheon',
  cocktails: 'Cocktails',
  tea: 'Tea',
  brunch: 'Brunch',
  weekend: 'Weekend',
  holiday: 'Holiday',
  other: 'Gathering',
};

export const COURSE_TYPES: Course['type'][] = [
  'amuse-bouche', 'starter', 'soup', 'fish', 'main', 'salad', 'cheese', 'dessert', 'petit-fours'
];

export const COURSE_LABELS: Record<Course['type'], string> = {
  'amuse-bouche': 'Amuse-Bouche',
  'starter': 'Starter',
  'soup': 'Soup',
  'fish': 'Fish',
  'main': 'Main',
  'salad': 'Salad',
  'cheese': 'Cheese',
  'dessert': 'Dessert',
  'petit-fours': 'Petit-Fours',
};

export const STATUS_LABELS: Record<Event['status'], string> = {
  planning: 'Planning',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

export const OVERALL_RATING_LABELS: Record<number, string> = {
  1: 'Disappointing',
  2: 'Mixed',
  3: 'Lovely',
  4: 'Wonderful',
  5: 'Exquisite',
};

export const CONVERSATION_RATING_LABELS: Record<number, string> = {
  1: 'Stilted',
  2: 'Polite',
  3: 'Warm',
  4: 'Sparkling',
  5: 'Unforgettable',
};

// --- Weekly House Menu ---

export interface DayMenu {
  date: string;
  dayOfWeek: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  notes: string;
}

export interface PantrySlot {
  name: string;
  icon: string;
  content: string;
  day: string;
  status: string;
}

export interface ReadyBoardItem {
  item: string;
  category: 'nuts' | 'preserve' | 'cheese' | 'crackers' | 'pickles' | 'baked' | 'drinks' | 'other';
  available: boolean;
  notes: string;
}

export interface WeeklyMenu {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  days: DayMenu[];
  pantrySlots: PantrySlot[];
  readyBoard: ReadyBoardItem[];
  specialNotes: string;
  hostingPlanned: boolean;
  hostingNotes: string;
  seasonalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PANTRY_SLOTS: { name: string; icon: string }[] = [
  { name: 'The Bake', icon: '\uD83C\uDF6A' },
  { name: 'The Bread', icon: '\uD83C\uDF5E' },
  { name: 'The Ferment', icon: '\uD83E\uDED9' },
  { name: 'The Cheese', icon: '\uD83E\uDDC0' },
  { name: 'The Preserve', icon: '\uD83C\uDF6F' },
  { name: 'The Fresh', icon: '\uD83C\uDF31' },
  { name: 'The Stock', icon: '\uD83C\uDF72' },
];

export const READY_BOARD_CATEGORIES: { key: ReadyBoardItem['category']; label: string }[] = [
  { key: 'nuts', label: 'Nuts' },
  { key: 'preserve', label: 'Preserve' },
  { key: 'cheese', label: 'Cheese' },
  { key: 'crackers', label: 'Crackers & Bread' },
  { key: 'pickles', label: 'Pickles' },
  { key: 'baked', label: 'Baked Goods' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'other', label: 'Other' },
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
