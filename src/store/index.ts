import { Event, Guest } from '../types';

const EVENTS_KEY = 'ledger_events';
const GUESTS_KEY = 'ledger_guests';
const INITIALIZED_KEY = 'ledger_initialized_v2';

export function getEvents(): Event[] {
  const raw = localStorage.getItem(EVENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getEvent(id: string): Event | undefined {
  return getEvents().find(e => e.id === id);
}

export function saveEvent(event: Event): void {
  const events = getEvents();
  const idx = events.findIndex(e => e.id === event.id);
  if (idx >= 0) {
    events[idx] = { ...event, updatedAt: new Date().toISOString() };
  } else {
    events.push(event);
  }
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function getGuests(): Guest[] {
  const raw = localStorage.getItem(GUESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getGuest(id: string): Guest | undefined {
  return getGuests().find(g => g.id === id);
}

export function saveGuest(guest: Guest): void {
  const guests = getGuests();
  const idx = guests.findIndex(g => g.id === guest.id);
  if (idx >= 0) {
    guests[idx] = { ...guest, updatedAt: new Date().toISOString() };
  } else {
    guests.push(guest);
  }
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
}

export function deleteGuest(id: string): void {
  const guests = getGuests().filter(g => g.id !== id);
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
}

export function getGuestGatheringHistory(guestId: string): Event[] {
  return getEvents()
    .filter(e => e.guestIds.includes(guestId))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function initializeSampleData(): void {
  if (localStorage.getItem(INITIALIZED_KEY)) return;

  const guests: Guest[] = [
    {
      id: 'guest-sofia',
      name: 'Comtesse Sofia de Montague',
      relationship: 'Close friend',
      dietary: 'No shellfish. Prefers white wine to red.',
      preferences: 'Adores French cuisine, especially anything with seasonal vegetables. Always appreciates a cheese course.',
      conversationTopics: 'Sailing, contemporary art, education philosophy, Swiss politics',
      personalNotes: 'Two children \u2014 L\u00e9a (12) and Mathieu (9). Recently returned from sailing in Sardinia. Collects first-edition cookbooks.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-isabelle',
      name: 'Isabelle Hartley-Ross',
      relationship: 'Close friend',
      dietary: '',
      preferences: 'Enjoys bold reds and seasonal menus. Partial to anything with garden herbs.',
      conversationTopics: 'Garden design, travel, literature, Proust',
      personalNotes: 'Avid gardener. Currently reading Proust in the original French. Has a beautiful walled garden in Vevey.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-alexandra',
      name: 'Alexandra Chen-Beaumont',
      relationship: 'Close friend',
      dietary: 'Shellfish allergy.',
      preferences: 'Appreciates Asian-influenced cuisine alongside classical French. Loves a bold Burgundy.',
      conversationTopics: 'Sailing, contemporary art, philanthropy, education',
      personalNotes: 'Collector of contemporary Chinese art. Shared love of sailing with Sofia \u2014 seat them together. On the board of Art Basel.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-james',
      name: 'James Aldridge',
      relationship: 'Friend',
      dietary: '',
      preferences: 'Enjoys a good Bordeaux. Appreciates hearty, well-prepared classics.',
      conversationTopics: 'Wine, history, cricket, architecture',
      personalNotes: 'Catherine\'s husband. Wonderfully warm conversationalist. Recently renovated their ch\u00e2teau near Lausanne.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-catherine',
      name: 'Catherine Aldridge',
      relationship: 'Friend',
      dietary: '',
      preferences: 'Loves cheese courses. Partial to Champagne.',
      conversationTopics: 'Interior design, opera, education, the arts',
      personalNotes: 'James\'s wife. On the board of the Geneva Opera. Exquisite taste in table arrangements.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
  ];

  const sampleEvent: Event = {
    id: 'event-spring-montreux',
    date: '2025-03-15',
    title: 'A Spring Evening in Montreux',
    occasion: 'dinner',
    location: 'Villa Pierrefeu, Lake Geneva Terrace',
    guestIds: ['guest-sofia', 'guest-isabelle', 'guest-alexandra', 'guest-james', 'guest-catherine'],
    guestOfHonorId: 'guest-sofia',
    menu: {
      courses: [
        { type: 'soup', dish: 'Asparagus velout\u00e9', notes: 'Made with white asparagus from the Valais' },
        { type: 'fish', dish: 'Dover sole meuni\u00e8re', notes: 'Paired beautifully with the Chablis' },
        { type: 'main', dish: 'Rack of lamb with spring vegetables', notes: 'The lamb rested too long \u2014 slightly cool by service' },
        { type: 'cheese', dish: 'Cheese selection', notes: 'Comt\u00e9, Vacherin Mont-d\'Or, and aged Gruy\u00e8re' },
        { type: 'dessert', dish: 'Tarte Tatin with cr\u00e8me fra\u00eeche', notes: 'A triumph \u2014 must make again' },
      ],
      wines: [
        { course: 'Soup', name: 'Chasselas', notes: 'Local \u2014 a lovely pairing with the velout\u00e9' },
        { course: 'Fish', name: 'Chablis Premier Cru', notes: 'Crisp and mineral, perfect with the sole' },
        { course: 'Main', name: 'Pomerol 2018', notes: 'Decanted two hours before \u2014 excellent' },
      ],
      notes: 'All ingredients sourced locally where possible. The asparagus was exceptional this season.',
    },
    atmosphere: {
      tableSettings: 'White linen, grandmother\'s Limoges china, silver candlesticks',
      flowers: 'White peonies and trailing ivy',
      lighting: 'Beeswax candles, dimmed overhead',
      music: 'Debussy on low \u2014 Clair de Lune, Arabesque',
      scent: 'The peonies and beeswax were enough \u2014 no additional scent needed',
    },
    seatingNotes: 'Sofia at right hand. Alexandra and James opposite \u2014 they had a wonderful exchange about sailing.',
    plannedTimeline: [
      { time: '18:30', activity: 'Aperitifs on the terrace \u2014 Champagne and goug\u00e8res' },
      { time: '19:15', activity: 'Move to dining room' },
      { time: '19:30', activity: 'First course served' },
      { time: '21:00', activity: 'Cheese and dessert' },
      { time: '21:45', activity: 'Digestifs in the drawing room' },
      { time: '22:30', activity: 'Evening concludes' },
    ],
    reflection: {
      overallRating: 4,
      pacing: 'perfect',
      menuHighlights: 'The tarte Tatin was universally adored. The Chablis with the sole was a perfect match.',
      menuMisses: 'The lamb rested too long \u2014 slightly cool by service. Must time more carefully next time.',
      conversationQuality: 5,
      guestChemistry: 'Sofia and Alexandra discovered a shared love of sailing \u2014 seat them together again. James was in wonderful form.',
      whatToChange: 'Start aperitifs 15 minutes earlier. The terrace at sunset was too beautiful to rush.',
      unexpectedDelights: 'The light on the lake at sunset was extraordinary. Everyone lingered on the terrace longer than planned \u2014 and it was perfect.',
      freeNotes: 'One of the loveliest evenings of the spring. The intimacy of five guests felt exactly right for the terrace setting.',
    },
    status: 'completed',
    createdAt: '2025-03-10T00:00:00.000Z',
    updatedAt: '2025-03-16T00:00:00.000Z',
  };

  guests.forEach(g => saveGuest(g));
  saveEvent(sampleEvent);
  localStorage.setItem(INITIALIZED_KEY, 'true');
}
