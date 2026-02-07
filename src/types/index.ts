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

export interface Event {
  id: string;
  date: string;
  title: string;
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
  seatingNotes: string;
  plannedTimeline: TimelineEntry[];
  reflection?: Reflection;
  status: 'planning' | 'upcoming' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  name: string;
  relationship: string;
  dietary: string[];
  allergies: string[];
  preferences: string;
  conversationTopics: string[];
  personalNotes: string;
  createdAt: string;
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
