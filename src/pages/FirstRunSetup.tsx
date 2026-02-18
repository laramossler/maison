import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LedgerProfile, Guest, Event, HostingFrequency, HostingChallenge, HostingMotivation } from '../types';
import { saveProfile, saveGuest, saveEvent } from '../store';

interface FirstRunSetupProps {
  onComplete: () => void;
}

type Step =
  | 'invitation'
  | 'bookplate'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'evening-title'
  | 'evening-date'
  | 'evening-purpose'
  | 'evening-guests'
  | 'evening-menu'
  | 'evening-outfit'
  | 'evening-notes'
  | 'reveal';

const STEP_ORDER: Step[] = [
  'invitation',
  'bookplate',
  'q1',
  'q2',
  'q3',
  'evening-title',
  'evening-date',
  'evening-purpose',
  'evening-guests',
  'evening-menu',
  'evening-outfit',
  'evening-notes',
  'reveal',
];

// --- Shared UI pieces ---

const Monogram: React.FC<{ size?: 'lg' | 'sm' }> = ({ size = 'lg' }) => {
  const outer = size === 'lg' ? 'w-16 h-16' : 'w-14 h-14';
  const inner = size === 'lg' ? 'w-[58px] h-[58px]' : 'w-[50px] h-[50px]';
  const text = size === 'lg' ? 'text-2xl' : 'text-xl';
  return (
    <div className={`${outer} mx-auto mb-6 border border-gold/40 flex items-center justify-center`}>
      <div className={`${inner} border border-gold/20 flex items-center justify-center`}>
        <span className={`font-display text-gold ${text} tracking-display font-light`}>L</span>
      </div>
    </div>
  );
};

const OrnamentalRule: React.FC = () => (
  <div className="flex items-center gap-3 my-8">
    <div className="flex-1 border-t border-gold/20" />
    <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
    <div className="flex-1 border-t border-gold/20" />
  </div>
);

const FadeIn: React.FC<{ children: React.ReactNode; step: Step }> = ({ children, step }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {children}
    </div>
  );
};

// --- Main component ---

const FirstRunSetup: React.FC<FirstRunSetupProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('invitation');

  // Bookplate
  const [familyName, setFamilyName] = useState('');
  const [residence, setResidence] = useState('');

  // Questions
  const [q1, setQ1] = useState<HostingFrequency | null>(null);
  const [q2, setQ2] = useState<HostingChallenge | null>(null);
  const [q3, setQ3] = useState<HostingMotivation | null>(null);

  // First evening
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventPurpose, setEventPurpose] = useState('');
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [eventMenu, setEventMenu] = useState('');
  const [eventOutfit, setEventOutfit] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  const goTo = useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[idx + 1]);
    }
  }, [currentStep]);

  const addGuest = () => {
    if (!newGuestName.trim()) return;
    setGuestNames(prev => [...prev, newGuestName.trim()]);
    setNewGuestName('');
  };

  const removeGuest = (index: number) => {
    setGuestNames(prev => prev.filter((_, i) => i !== index));
  };

  // Auto-advance for question screens
  const handleQ1 = (val: HostingFrequency) => {
    setQ1(val);
    setTimeout(() => goTo('q2'), 400);
  };

  const handleQ2 = (val: HostingChallenge) => {
    setQ2(val);
    setTimeout(() => goTo('q3'), 400);
  };

  const handleQ3 = (val: HostingMotivation) => {
    setQ3(val);
    setTimeout(() => goTo('evening-title'), 400);
  };

  // Save everything and complete
  const handleComplete = () => {
    // Save profile
    const profile: LedgerProfile = {
      familyName: familyName.trim(),
      residence: residence.trim(),
      hostingFrequency: q1 || undefined,
      biggestChallenge: q2 || undefined,
      whatMatters: q3 || undefined,
    };
    saveProfile(profile);

    // Create guests from names
    const createdGuestIds: string[] = [];
    guestNames.forEach(name => {
      const guest: Guest = {
        id: uuidv4(),
        name,
        relationship: '',
        dietary: '',
        preferences: '',
        personalNotes: '',
        conversationTopics: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveGuest(guest);
      createdGuestIds.push(guest.id);
    });

    // Create event if they entered at least a title
    if (eventTitle.trim()) {
      const courses = eventMenu.trim()
        ? eventMenu.split(',').map(dish => ({
            type: 'main' as const,
            dish: dish.trim(),
            notes: '',
          })).filter(c => c.dish)
        : [];

      const event: Event = {
        id: uuidv4(),
        date: eventDate || new Date().toISOString().split('T')[0],
        title: eventTitle.trim(),
        purpose: eventPurpose.trim() || undefined,
        occasion: 'dinner',
        location: '',
        guestIds: createdGuestIds,
        menu: { courses, wines: [], notes: '' },
        atmosphere: { tableSettings: '', flowers: '', lighting: '', music: '', scent: '' },
        outfit: eventOutfit.trim() ? { description: eventOutfit.trim() } : undefined,
        seatingNotes: '',
        plannedTimeline: [],
        reflection: eventNotes.trim() ? {
          overallRating: 4,
          pacing: 'perfect',
          menuHighlights: '',
          menuMisses: '',
          conversationQuality: 4,
          guestChemistry: '',
          whatToChange: '',
          unexpectedDelights: '',
          freeNotes: eventNotes.trim(),
        } : undefined,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveEvent(event);
    }

    // Set flag for reveal toast on Home
    localStorage.setItem('ledger_first_reveal', 'true');

    onComplete();
  };

  // --- Render screens ---

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-page w-full">
        <FadeIn step={currentStep}>

          {/* ──── Screen 1: The Invitation ──── */}
          {currentStep === 'invitation' && (
            <div className="text-center">
              <OrnamentalRule />

              <Monogram />

              <h1 className="font-display text-4xl md:text-5xl text-ink tracking-display font-light mb-6">
                The Ledger
              </h1>

              <p className="font-body text-warm-gray text-sm italic leading-relaxed max-w-sm mx-auto mb-10">
                You&rsquo;ve been invited to The Ledger by Lara.
              </p>

              <div className="border-l-2 border-gold/30 pl-6 text-left max-w-md mx-auto mb-12">
                <p className="font-body text-ink/80 text-sm leading-relaxed italic">
                  &ldquo;At Villa Pierrefeu, we learned that the hostess ledger was the most
                  underrated tool in the house. Every great home kept one. This is the digital
                  version &mdash; a private record of the art of entertaining. I thought of you
                  immediately.&rdquo;
                </p>
                <p className="font-body text-warm-gray/60 text-xs mt-3 not-italic">
                  &mdash; Lara
                </p>
              </div>

              <button
                onClick={() => goTo('bookplate')}
                className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-10 py-3 hover:bg-gold/5 transition-all duration-400"
              >
                Open Your Ledger
              </button>

              <OrnamentalRule />
            </div>
          )}

          {/* ──── Screen 2: The Bookplate ──── */}
          {currentStep === 'bookplate' && (
            <div className="text-center">
              <OrnamentalRule />

              <Monogram size="sm" />

              <p className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-2">
                Inscribe Your Ledger
              </p>
              <p className="font-body text-warm-gray text-sm italic leading-relaxed max-w-sm mx-auto mb-10">
                Every great ledger begins with a bookplate. Who does this ledger belong to?
              </p>

              <div className="max-w-xs mx-auto space-y-8 mb-10 text-left">
                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/70 block mb-2 text-center">
                    Family or Household Name
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={e => setFamilyName(e.target.value)}
                    placeholder="The Harrington Family"
                    className="font-display text-lg text-center"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/70 block mb-2 text-center">
                    Residence Name &amp; Location
                  </label>
                  <input
                    type="text"
                    value={residence}
                    onChange={e => setResidence(e.target.value)}
                    placeholder="Willow House, Montreux"
                    className="font-body italic text-center"
                  />
                </div>
              </div>

              <p className="font-body text-xs text-warm-gray/40 italic mb-8">
                You can always change this later.
              </p>

              <button
                onClick={goNext}
                className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-10 py-3 hover:bg-gold/5 transition-all duration-400"
              >
                Inscribe
              </button>

              <OrnamentalRule />
            </div>
          )}

          {/* ──── Screen 3a: Question 1 — Hosting frequency ──── */}
          {currentStep === 'q1' && (
            <div className="text-center">
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/60 mb-8">
                I &mdash; III
              </p>

              <p className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-10">
                How often do you gather people<br />in your home?
              </p>

              <div className="max-w-sm mx-auto space-y-3">
                {([
                  { value: 'few-times-year' as HostingFrequency, label: 'A few times a year for special occasions' },
                  { value: 'monthly' as HostingFrequency, label: 'Monthly — it\u2019s part of my rhythm' },
                  { value: 'weekly' as HostingFrequency, label: 'Weekly — my door is always open' },
                  { value: 'aspirational' as HostingFrequency, label: 'I\u2019m not hosting much right now, but I want to be' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQ1(opt.value)}
                    className={`w-full text-left px-5 py-4 border transition-all duration-300
                      ${q1 === opt.value
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-rule text-warm-gray hover:border-gold/40 hover:text-ink'
                      }
                    `}
                  >
                    <span className="font-body text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── Screen 3b: Question 2 — Biggest challenge ──── */}
          {currentStep === 'q2' && (
            <div className="text-center">
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/60 mb-8">
                II &mdash; III
              </p>

              <p className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-10">
                When you&rsquo;re planning an evening,<br />what&rsquo;s hardest?
              </p>

              <div className="max-w-sm mx-auto space-y-3">
                {([
                  { value: 'remembering' as HostingChallenge, label: 'Remembering what I\u2019ve served before' },
                  { value: 'pairing' as HostingChallenge, label: 'Knowing what to pair — wine, music, flowers' },
                  { value: 'guest-mix' as HostingChallenge, label: 'Getting the guest mix right' },
                  { value: 'organizing' as HostingChallenge, label: 'Honestly, just getting organized' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQ2(opt.value)}
                    className={`w-full text-left px-5 py-4 border transition-all duration-300
                      ${q2 === opt.value
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-rule text-warm-gray hover:border-gold/40 hover:text-ink'
                      }
                    `}
                  >
                    <span className="font-body text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── Screen 3c: Question 3 — What matters most ──── */}
          {currentStep === 'q3' && (
            <div className="text-center">
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/60 mb-8">
                III &mdash; III
              </p>

              <p className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-10">
                What matters most to you<br />about entertaining?
              </p>

              <div className="max-w-sm mx-auto space-y-3">
                {([
                  { value: 'details' as HostingMotivation, label: 'The details — menus, table settings, atmosphere' },
                  { value: 'people' as HostingMotivation, label: 'The people — who\u2019s there and how they connect' },
                  { value: 'tradition' as HostingMotivation, label: 'The tradition — building something over time' },
                  { value: 'ease' as HostingMotivation, label: 'The ease — I want it to feel effortless' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleQ3(opt.value)}
                    className={`w-full text-left px-5 py-4 border transition-all duration-300
                      ${q3 === opt.value
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-rule text-warm-gray hover:border-gold/40 hover:text-ink'
                      }
                    `}
                  >
                    <span className="font-body text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ──── Screen 4: The First Evening ──── */}

          {/* 4a: Title */}
          {currentStep === 'evening-title' && (
            <div className="text-center">
              <OrnamentalRule />

              <p className="font-body text-warm-gray text-sm italic leading-relaxed max-w-sm mx-auto mb-10">
                The best way to start a ledger is to write in it. Think of a gathering
                you hosted recently &mdash; a dinner, a cocktail evening, even a casual lunch.
                Let&rsquo;s capture it.
              </p>

              <div className="max-w-sm mx-auto text-left mb-8">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  What shall we call this evening?
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="Spring Dinner at the Lake House"
                  className="font-display text-xl"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4b: Date */}
          {currentStep === 'evening-date' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-8">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  When was it?
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="font-body"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => goTo('evening-title')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4c: Purpose */}
          {currentStep === 'evening-purpose' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-4">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  What was the purpose of this evening?
                </label>
                <input
                  type="text"
                  value={eventPurpose}
                  onChange={e => setEventPurpose(e.target.value)}
                  placeholder="To celebrate the end of a long winter"
                  className="font-body italic text-warm-brown"
                  autoFocus
                />
                <p className="font-body text-xs text-warm-gray/40 italic mt-2">
                  The best evenings have a reason, even a simple one.
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => goTo('evening-date')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4d: Guests */}
          {currentStep === 'evening-guests' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-4">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  Who was there?
                </label>

                {guestNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {guestNames.map((name, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 font-body text-sm text-ink border border-rule px-3 py-1.5"
                      >
                        {name}
                        <button
                          onClick={() => removeGuest(i)}
                          className="text-warm-gray/40 hover:text-warm-gray text-xs ml-1 transition-colors duration-300"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newGuestName}
                    onChange={e => setNewGuestName(e.target.value)}
                    placeholder="Start typing a name\u2026"
                    className="flex-1 font-body"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGuest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addGuest}
                    className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => goTo('evening-purpose')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4e: Menu */}
          {currentStep === 'evening-menu' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-4">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  What did you serve?
                </label>
                <input
                  type="text"
                  value={eventMenu}
                  onChange={e => setEventMenu(e.target.value)}
                  placeholder="Roast chicken with herbs, gratin dauphinois, a simple green salad"
                  className="font-body italic"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => goTo('evening-guests')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4f: Outfit */}
          {currentStep === 'evening-outfit' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-4">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  What did you wear?
                </label>
                <input
                  type="text"
                  value={eventOutfit}
                  onChange={e => setEventOutfit(e.target.value)}
                  placeholder="The navy Johanna Ortiz dress with gold sandals"
                  className="font-body italic"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => goTo('evening-menu')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 4g: Notes / Reflection */}
          {currentStep === 'evening-notes' && (
            <div className="text-center">
              <div className="max-w-sm mx-auto text-left mb-4">
                <label className="font-display text-lg text-ink font-light tracking-display block mb-4">
                  Anything you&rsquo;d want to remember?
                </label>
                <textarea
                  value={eventNotes}
                  onChange={e => setEventNotes(e.target.value)}
                  placeholder="Marie and Philippe hadn't met before — seated them together and they talked all night."
                  rows={3}
                  className="font-body italic"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={() => goTo('evening-outfit')}
                  className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
                >
                  &larr; Back
                </button>
                <button
                  onClick={goNext}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ──── Screen 5: The Reveal ──── */}
          {currentStep === 'reveal' && (
            <div className="text-center">
              <OrnamentalRule />

              {/* Render the event in ledger format */}
              {eventTitle.trim() ? (
                <div className="mb-10">
                  {eventDate && (
                    <span className="block font-sans text-[10px] uppercase tracking-[0.16em] text-gold/70 mb-3">
                      {new Date(eventDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}

                  <h2 className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-4">
                    {eventTitle}
                  </h2>

                  {eventPurpose && (
                    <p className="font-body text-sm text-warm-brown italic leading-relaxed max-w-md mx-auto mb-5">
                      {eventPurpose}
                    </p>
                  )}

                  {eventMenu && (
                    <p className="font-body text-sm text-ink/60 italic leading-relaxed mb-4">
                      {eventMenu}
                    </p>
                  )}

                  {eventOutfit && (
                    <p className="font-body text-xs text-warm-gray/50 italic mb-4">
                      Wore: {eventOutfit}
                    </p>
                  )}

                  {guestNames.length > 0 && (
                    <p className="font-sans text-[8px] uppercase tracking-[0.16em] text-warm-gray/40 mt-4">
                      {guestNames.join(' \u00b7 ')}
                    </p>
                  )}

                  {eventNotes && (
                    <div className="mt-6 border-l-2 border-gold/20 pl-4 text-left max-w-sm mx-auto">
                      <p className="font-body text-sm text-warm-gray italic leading-relaxed">
                        {eventNotes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-10">
                  <p className="font-display text-2xl md:text-3xl text-ink/80 italic font-light leading-relaxed">
                    Your Ledger Awaits
                  </p>
                </div>
              )}

              <OrnamentalRule />

              <p className="font-body text-sm text-warm-gray italic leading-relaxed max-w-sm mx-auto mb-10">
                Your ledger has begun. Every evening you record becomes part of your story.
              </p>

              <button
                onClick={handleComplete}
                className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-10 py-3 hover:bg-gold/5 transition-all duration-400"
              >
                Enter Your Ledger
              </button>

              <OrnamentalRule />
            </div>
          )}

        </FadeIn>

        {/* Skip option for evening steps */}
        {currentStep.startsWith('evening-') && (
          <div className="text-center mt-6">
            <button
              onClick={() => goTo('reveal')}
              className="font-sans text-[10px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray/50 transition-colors duration-300"
            >
              Skip to my ledger
            </button>
          </div>
        )}

        {/* Skip option for question steps */}
        {(currentStep === 'q1' || currentStep === 'q2' || currentStep === 'q3') && (
          <div className="text-center mt-8">
            <button
              onClick={() => goTo('evening-title')}
              className="font-sans text-[10px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray/50 transition-colors duration-300"
            >
              Skip questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstRunSetup;
