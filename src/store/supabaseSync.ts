import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Event, Guest, LedgerProfile, WeeklyMenu } from '../types';

// Mapping helpers: Supabase snake_case ↔ app camelCase

function guestToRow(guest: Guest, userId: string) {
  return {
    id: guest.id,
    user_id: userId,
    name: guest.name,
    relationship: guest.relationship,
    dietary: guest.dietary,
    preferences: guest.preferences,
    personal_notes: guest.personalNotes,
    conversation_topics: guest.conversationTopics,
    birthday: guest.birthday || null,
    anniversary: guest.anniversary || null,
    children_birthdays: guest.childrenBirthdays || [],
    life_events: guest.lifeEvents || [],
    nationality: guest.nationality || null,
    cultural_background: guest.culturalBackground || null,
    languages: guest.languages || [],
    religious_observances: guest.religiousObservances || [],
    gift_history: guest.giftHistory || [],
    created_at: guest.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function rowToGuest(row: Record<string, unknown>): Guest {
  return {
    id: row.id as string,
    name: row.name as string,
    relationship: (row.relationship as string) || '',
    dietary: (row.dietary as string) || '',
    preferences: (row.preferences as string) || '',
    personalNotes: (row.personal_notes as string) || '',
    conversationTopics: (row.conversation_topics as string) || '',
    birthday: (row.birthday as string) || undefined,
    anniversary: (row.anniversary as string) || undefined,
    childrenBirthdays: (row.children_birthdays as Guest['childrenBirthdays']) || undefined,
    lifeEvents: (row.life_events as Guest['lifeEvents']) || undefined,
    nationality: (row.nationality as string) || undefined,
    culturalBackground: (row.cultural_background as string) || undefined,
    languages: (row.languages as string[]) || undefined,
    religiousObservances: (row.religious_observances as string[]) || undefined,
    giftHistory: (row.gift_history as Guest['giftHistory']) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function eventToRow(event: Event, userId: string) {
  return {
    id: event.id,
    user_id: userId,
    date: event.date,
    title: event.title,
    purpose: event.purpose || null,
    occasion: event.occasion,
    location: event.location,
    guest_ids: event.guestIds,
    guest_of_honor_id: event.guestOfHonorId || null,
    menu: event.menu,
    atmosphere: event.atmosphere,
    outfit: event.outfit || null,
    seating_notes: event.seatingNotes,
    planned_timeline: event.plannedTimeline,
    reflection: event.reflection || null,
    status: event.status,
    created_at: event.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function rowToEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    date: row.date as string,
    title: row.title as string,
    purpose: (row.purpose as string) || undefined,
    occasion: row.occasion as Event['occasion'],
    location: (row.location as string) || '',
    guestIds: (row.guest_ids as string[]) || [],
    guestOfHonorId: (row.guest_of_honor_id as string) || undefined,
    menu: row.menu as Event['menu'],
    atmosphere: row.atmosphere as Event['atmosphere'],
    outfit: (row.outfit as Event['outfit']) || undefined,
    seatingNotes: (row.seating_notes as string) || '',
    plannedTimeline: (row.planned_timeline as Event['plannedTimeline']) || [],
    reflection: (row.reflection as Event['reflection']) || undefined,
    status: (row.status as Event['status']) || 'planning',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function menuToRow(menu: WeeklyMenu, userId: string) {
  return {
    id: menu.id,
    user_id: userId,
    week_start_date: menu.weekStartDate,
    week_end_date: menu.weekEndDate,
    days: menu.days,
    pantry_slots: menu.pantrySlots,
    ready_board: menu.readyBoard,
    special_notes: menu.specialNotes,
    hosting_planned: menu.hostingPlanned,
    hosting_notes: menu.hostingNotes,
    seasonal_notes: menu.seasonalNotes,
    created_at: menu.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function rowToMenu(row: Record<string, unknown>): WeeklyMenu {
  return {
    id: row.id as string,
    weekStartDate: row.week_start_date as string,
    weekEndDate: row.week_end_date as string,
    days: row.days as WeeklyMenu['days'],
    pantrySlots: row.pantry_slots as WeeklyMenu['pantrySlots'],
    readyBoard: row.ready_board as WeeklyMenu['readyBoard'],
    specialNotes: (row.special_notes as string) || '',
    hostingPlanned: (row.hosting_planned as boolean) || false,
    hostingNotes: (row.hosting_notes as string) || '',
    seasonalNotes: (row.seasonal_notes as string) || '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// --- Sync: pull all data from Supabase into localStorage ---

export async function syncFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Fetch profile
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileRow && (profileRow.family_name || profileRow.residence)) {
    const profile: LedgerProfile = {
      familyName: profileRow.family_name || '',
      residence: profileRow.residence || '',
    };
    localStorage.setItem('ledger_profile', JSON.stringify(profile));
  }

  // Fetch guests
  const { data: guestRows } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', user.id);

  if (guestRows) {
    const guests = guestRows.map(rowToGuest);
    localStorage.setItem('ledger_guests', JSON.stringify(guests));
  }

  // Fetch events
  const { data: eventRows } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id);

  if (eventRows) {
    const events = eventRows.map(rowToEvent);
    localStorage.setItem('ledger_events', JSON.stringify(events));
  }

  // Fetch menus
  const { data: menuRows } = await supabase
    .from('menus')
    .select('*')
    .eq('user_id', user.id);

  if (menuRows) {
    const menus = menuRows.map(rowToMenu);
    localStorage.setItem('ledger_menus', JSON.stringify(menus));
  }
}

// --- Write-through: save to Supabase when saving locally ---

export async function syncProfileToSupabase(profile: LedgerProfile): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      family_name: profile.familyName,
      residence: profile.residence,
      updated_at: new Date().toISOString(),
    });
}

export async function syncGuestToSupabase(guest: Guest): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('guests')
    .upsert(guestToRow(guest, user.id));
}

export async function syncDeleteGuestToSupabase(guestId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);
}

export async function syncEventToSupabase(event: Event): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('events')
    .upsert(eventToRow(event, user.id));
}

export async function syncDeleteEventToSupabase(eventId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from('events')
    .delete()
    .eq('id', eventId);
}

export async function syncMenuToSupabase(menu: WeeklyMenu): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('menus')
    .upsert(menuToRow(menu, user.id));
}

export async function syncDeleteMenuToSupabase(menuId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  await supabase
    .from('menus')
    .delete()
    .eq('id', menuId);
}
