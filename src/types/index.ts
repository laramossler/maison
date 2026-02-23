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

export type HostingFrequency = 'few-times-year' | 'monthly' | 'weekly' | 'aspirational';
export type HostingChallenge = 'remembering' | 'pairing' | 'guest-mix' | 'organizing';
export type HostingMotivation = 'details' | 'people' | 'tradition' | 'ease';

export interface LedgerProfile {
  familyName: string;
  residence: string;
  // Onboarding insights
  hostingFrequency?: HostingFrequency;
  biggestChallenge?: HostingChallenge;
  whatMatters?: HostingMotivation;
}

export interface LifeEvent {
  type: 'loss' | 'birth' | 'wedding' | 'move' | 'promotion' | 'retirement' | 'illness' | 'divorce' | 'graduation' | 'other';
  description: string;
  date: string;
  acknowledged?: boolean;
  acknowledgment?: string;
}

export interface GiftEntry {
  date: string;
  occasion: string;
  gift: string;
  notes?: string;
  direction: 'given' | 'received';
}

export interface ChildBirthday {
  name: string;
  date: string;
}

export interface Guest {
  id: string;
  name: string;
  relationship: string;
  dietary: string;
  preferences: string;
  personalNotes: string;
  conversationTopics: string;

  // Key dates
  birthday?: string;
  anniversary?: string;
  childrenBirthdays?: ChildBirthday[];

  // Life events
  lifeEvents?: LifeEvent[];

  // Cultural context
  nationality?: string;
  culturalBackground?: string;
  languages?: string[];
  religiousObservances?: string[];

  // Gift history
  giftHistory?: GiftEntry[];

  createdAt: string;
  updatedAt: string;
}

export const LIFE_EVENT_TYPES: { key: LifeEvent['type']; label: string }[] = [
  { key: 'loss', label: 'Loss' },
  { key: 'birth', label: 'Birth' },
  { key: 'wedding', label: 'Wedding' },
  { key: 'move', label: 'Move' },
  { key: 'promotion', label: 'Promotion' },
  { key: 'retirement', label: 'Retirement' },
  { key: 'illness', label: 'Illness' },
  { key: 'divorce', label: 'Divorce' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'other', label: 'Other' },
];

export const LIFE_EVENT_LABELS: Record<LifeEvent['type'], string> = {
  loss: 'Loss',
  birth: 'Birth',
  wedding: 'Wedding',
  move: 'Move',
  promotion: 'Promotion',
  retirement: 'Retirement',
  illness: 'Illness',
  divorce: 'Divorce',
  graduation: 'Graduation',
  other: 'Other',
};

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

// --- Attending Mode ---

export type AttendingPhase = 'invited' | 'preparing' | 'day-of' | 'debrief' | 'follow-up' | 'complete';
export type InvitationType = 'text' | 'email' | 'verbal' | 'formal' | 'calendar';
export type FormalityLevel = 'casual' | 'semi-formal' | 'formal';
export type ThankYouMethod = 'text' | 'handwritten' | 'email' | 'call';

export const ATTENDING_PHASE_LABELS: Record<AttendingPhase, string> = {
  'invited': 'Invited',
  'preparing': 'Preparing',
  'day-of': 'Day Of',
  'debrief': 'Debrief',
  'follow-up': 'Follow-Up',
  'complete': 'Complete',
};

export const FORMALITY_LABELS: Record<FormalityLevel, string> = {
  'casual': 'Casual',
  'semi-formal': 'Semi-Formal',
  'formal': 'Formal',
};

export const INVITATION_TYPE_LABELS: Record<InvitationType, string> = {
  'text': 'Text',
  'email': 'Email',
  'verbal': 'Verbal',
  'formal': 'Formal Invitation',
  'calendar': 'Calendar',
};

export const THANK_YOU_METHOD_LABELS: Record<ThankYouMethod, string> = {
  'text': 'Text Message',
  'handwritten': 'Handwritten Note',
  'email': 'Email',
  'call': 'Phone Call',
};

export interface ConversationTheme {
  topic: string;
  openingQuestion?: string;
  notes?: string;
}

export interface AttendingGuestEntry {
  guestId?: string;
  name: string;
  relationship?: string;
  notes?: string;
}

export interface DebriefGuestNote {
  guestId?: string;
  name: string;
  whatILearned?: string;
  followUpNeeded?: string;
}

export interface AttendingFollowUp {
  guestId?: string;
  guestName: string;
  action: string;
  dueDate?: string;
  completed: boolean;
  completedDate?: string;
}

export interface AttendingEvent {
  id: string;
  mode: 'attending';

  // Phase 1: Invitation
  eventName: string;
  hostName: string;
  hostId?: string;
  date: string;
  time?: string;
  location?: string;
  dressCode?: string;
  invitationType: InvitationType;
  formalityLevel: FormalityLevel;
  guestList: AttendingGuestEntry[];

  // Phase 2: Preparation
  conversationPrep: {
    themes: ConversationTheme[];
    minefields?: string;
  };
  gift: {
    description: string;
    category?: string;
    notes?: string;
  } | null;
  outfit: {
    description: string;
    designer?: string;
    accessories?: string;
  } | null;

  // Phase 4: Debrief
  debrief: {
    overallImpression?: string;
    guestNotes: DebriefGuestNote[];
    conversationHighlights?: string;
    hostNotes?: string;
  } | null;

  // Phase 5: Follow-up
  thankYou: {
    method: ThankYouMethod;
    sent: boolean;
    sentDate?: string;
    content?: string;
  } | null;
  followUps: AttendingFollowUp[];

  // Status
  phase: AttendingPhase;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
