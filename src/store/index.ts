import { Event, Guest, LedgerProfile } from '../types';

const EVENTS_KEY = 'ledger_events';
const GUESTS_KEY = 'ledger_guests';
const PROFILE_KEY = 'ledger_profile';
const INITIALIZED_KEY = 'ledger_initialized_v3';

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

export function getProfile(): LedgerProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: LedgerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
    {
      id: 'guest-philippe',
      name: 'Philippe Duval',
      relationship: 'Friend',
      dietary: '',
      preferences: 'Enjoys ros\u00e9 in summer, hearty country cooking. Partial to grilled fish.',
      conversationTopics: 'First editions, rare books, wine collecting, local history',
      personalNotes: 'Marie-Claire\'s husband. Collects first editions \u2014 discovered a shared passion with James Aldridge.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-marie-claire',
      name: 'Marie-Claire Duval',
      relationship: 'Friend',
      dietary: '',
      preferences: 'Loves patisserie. Her financiers are legendary.',
      conversationTopics: 'Baking, village life, children, gardens',
      personalNotes: 'Philippe\'s wife. Makes the most extraordinary financiers \u2014 must get the recipe. Warm and generous.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-maximilian',
      name: 'Maximilian Voss',
      relationship: 'Acquaintance',
      dietary: '',
      preferences: 'Champagne enthusiast. Appreciates bold, theatrical presentations.',
      conversationTopics: 'Vineyards, family history, travel, art markets',
      personalNotes: 'Told the most extraordinary story about his grandfather\'s vineyard at Alexandra\'s birthday. Must invite to a dinner \u2014 he\'d be wonderful at a table.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'guest-elena',
      name: 'Elena Kowalski',
      relationship: 'Friend',
      dietary: 'Vegetarian.',
      preferences: 'Loves Sauternes. Appreciates elegant, restrained presentations.',
      conversationTopics: 'Photography, architecture, contemporary dance, sustainability',
      personalNotes: 'Alexandra\'s close friend. Quiet but captivating \u2014 draws people out beautifully in conversation.',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    },
  ];

  const sampleEvent: Event = {
    id: 'event-spring-montreux',
    date: '2025-03-15',
    title: 'A Spring Evening in Montreux',
    purpose: 'To celebrate Sofia\u2019s return from Sardinia and the first warm evening of spring',
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
    outfit: {
      description: 'Navy silk midi dress with cream cashmere wrap',
      designer: 'The Row',
      notes: 'The wrap was perfect for the terrace as the evening cooled',
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

  const sampleEvent2: Event = {
    id: 'event-regatta-lunch',
    date: '2025-06-08',
    title: 'A Sunday Lunch After the Regatta',
    purpose: 'A casual gathering to celebrate the end of regatta season',
    occasion: 'luncheon',
    location: 'The Terrace, Villa Pierrefeu',
    guestIds: ['guest-isabelle', 'guest-philippe', 'guest-marie-claire', 'guest-james', 'guest-catherine'],
    menu: {
      courses: [
        { type: 'soup', dish: 'Chilled cucumber soup', notes: 'Served in small glasses on arrival \u2014 refreshing after the morning on the water' },
        { type: 'fish', dish: 'Grilled lake perch with herb butter', notes: 'The perch was caught that morning. Perfection.' },
        { type: 'dessert', dish: 'Strawberries and cream', notes: 'Local strawberries from the Lavaux. Simple and exactly right.' },
      ],
      wines: [
        { course: 'Lunch', name: 'Ros\u00e9 de Provence', notes: 'Well chilled \u2014 disappeared quickly in the sunshine' },
        { course: 'Fish', name: 'Sancerre', notes: 'Crisp and perfect with the perch' },
      ],
      notes: 'Kept it deliberately simple. The sunshine and the view did the work.',
    },
    atmosphere: {
      tableSettings: 'Blue and white striped linen, casual stoneware, wildflower jars',
      flowers: 'Wildflowers from the garden \u2014 cornflowers, daisies, grasses',
      lighting: 'Natural light \u2014 no candles needed at midday',
      music: 'We let the conversation be the music',
      scent: 'Cut grass and lake air',
    },
    outfit: {
      description: 'White linen trousers, blue striped cotton blouse, espadrilles',
      notes: 'Perfectly underdressed. The breeze off the lake was heaven.',
    },
    seatingNotes: 'Kept it loose \u2014 people moved around between courses. Philippe and James ended up deep in conversation at the far end.',
    plannedTimeline: [
      { time: '12:00', activity: 'Aperitifs on arrival \u2014 chilled cucumber soup and ros\u00e9' },
      { time: '12:45', activity: 'Sit down to lunch' },
      { time: '14:00', activity: 'Strawberries and coffee on the lawn' },
      { time: '15:30', activity: 'Guests depart at leisure' },
    ],
    reflection: {
      overallRating: 3,
      pacing: 'perfect',
      menuHighlights: 'The perch was the star. So fresh it barely needed the herb butter.',
      menuMisses: '',
      conversationQuality: 4,
      guestChemistry: 'Philippe and James discovered they both collect first editions \u2014 they barely noticed dessert.',
      whatToChange: 'Set lunch for 12:30 not 13:00 \u2014 everyone arrived early and the aperitifs stretched wonderfully.',
      unexpectedDelights: 'Marie-Claire brought her famous financiers as a hostess gift. Must get the recipe.',
      freeNotes: 'The ease of a summer lunch. No one wanted to leave. The terrace in June is unbeatable.',
    },
    status: 'completed',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-06-09T00:00:00.000Z',
  };

  const sampleEvent3: Event = {
    id: 'event-alexandra-birthday',
    date: '2025-09-20',
    title: 'Cocktails for Alexandra\u2019s Birthday',
    purpose: 'An intimate toast to Alexandra\u2019s 30th',
    occasion: 'cocktails',
    location: 'The Drawing Room',
    guestIds: ['guest-alexandra', 'guest-sofia', 'guest-isabelle', 'guest-maximilian', 'guest-elena'],
    guestOfHonorId: 'guest-alexandra',
    menu: {
      courses: [
        { type: 'amuse-bouche', dish: 'Champagne cocktails', notes: 'A twist on the classic \u2014 with a sugar cube and Angostura' },
        { type: 'starter', dish: 'Blinis with cr\u00e8me fra\u00eeche and caviar', notes: 'Served on grandmother\u2019s silver trays' },
        { type: 'starter', dish: 'Smoked salmon roulades', notes: 'With dill and a squeeze of lemon' },
        { type: 'petit-fours', dish: 'Dark chocolate truffles', notes: 'Dusted with cocoa \u2014 rich and bittersweet' },
      ],
      wines: [
        { course: 'Cocktails', name: 'Pol Roger Brut R\u00e9serve', notes: 'Alexandra\u2019s favourite \u2014 fitting for the occasion' },
        { course: 'Truffles', name: 'Sauternes', notes: 'A half-glass with the chocolate \u2014 Elena adored this pairing' },
      ],
      notes: 'Cocktails rather than dinner \u2014 everything designed to be held in one hand with a glass in the other.',
    },
    atmosphere: {
      tableSettings: 'Silver trays, crystal coupes, no sit-down table',
      flowers: 'Clusters of white roses in low glass vases',
      lighting: 'Dozens of tea lights across every surface',
      music: 'Ella Fitzgerald on low \u2014 Let\u2019s Fall in Love, Night and Day',
      scent: 'Diptyque Baies',
    },
    outfit: {
      description: 'Black cr\u00eape jumpsuit, statement gold earrings, patent heels',
      designer: 'Celine',
      notes: 'Felt exactly right for a cocktail evening.',
    },
    seatingNotes: 'No formal seating \u2014 everyone drifted between the drawing room and the small terrace.',
    plannedTimeline: [
      { time: '19:00', activity: 'Guests arrive \u2014 Champagne cocktails' },
      { time: '19:30', activity: 'Blinis and salmon roulades circulated' },
      { time: '20:30', activity: 'A quiet toast to Alexandra' },
      { time: '21:00', activity: 'Truffles and Sauternes' },
      { time: '22:00', activity: 'Evening winds down naturally' },
    ],
    reflection: {
      overallRating: 5,
      pacing: 'perfect',
      menuHighlights: 'The Champagne cocktails set the tone immediately. The Sauternes with the truffles was an inspired pairing.',
      menuMisses: '',
      conversationQuality: 5,
      guestChemistry: 'Alexandra was genuinely surprised. The intimacy of just six people made it feel like a real celebration, not a party. Max told the most extraordinary story about his grandfather\u2019s vineyard.',
      whatToChange: 'Nothing. This was exactly right.',
      unexpectedDelights: 'The tea lights reflected in the windows created the most beautiful atmosphere as darkness fell. Elena took photographs that captured it perfectly.',
      freeNotes: 'One of those evenings where everything aligned. The scale was perfect \u2014 intimate enough for real conversation, celebratory enough for a milestone birthday.',
    },
    status: 'completed',
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-21T00:00:00.000Z',
  };

  guests.forEach(g => saveGuest(g));
  saveEvent(sampleEvent);
  saveEvent(sampleEvent2);
  saveEvent(sampleEvent3);
  localStorage.setItem(INITIALIZED_KEY, 'true');
}
