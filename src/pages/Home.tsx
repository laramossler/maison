import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, OCCASION_LABELS } from '../types';
import { getEvents, getGuests } from '../store';
import { Guest } from '../types';
import PageTransition from '../components/PageTransition';

const PageBreakRule: React.FC = () => (
  <div className="flex items-center gap-3 py-6">
    <div className="flex-1 border-t border-rule" />
    <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
    <div className="flex-1 border-t border-rule" />
  </div>
);

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState('');
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    setEvents(getEvents().sort((a, b) => b.date.localeCompare(a.date)));
    setAllGuests(getGuests());

    // Show reveal toast after first onboarding
    if (localStorage.getItem('ledger_first_reveal') === 'true') {
      setShowReveal(true);
      localStorage.removeItem('ledger_first_reveal');
      setTimeout(() => setShowReveal(false), 5000);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getGuestNames = (guestIds: string[]) => {
    return guestIds
      .map(id => allGuests.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getGuestNamesForEvent = (guestIds: string[]) => {
    return guestIds
      .map(id => allGuests.find(g => g.id === id)?.name || '')
      .filter(Boolean);
  };

  const filteredEvents = events.filter(event => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const guestNames = getGuestNamesForEvent(event.guestIds);
    const menuDishes = event.menu.courses.map(c => c.dish);
    const wineNames = event.menu.wines.map(w => w.name);
    return (
      event.title.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      (event.purpose || '').toLowerCase().includes(q) ||
      event.date.includes(q) ||
      guestNames.some(n => n.toLowerCase().includes(q)) ||
      menuDishes.some(d => d.toLowerCase().includes(q)) ||
      wineNames.some(w => w.toLowerCase().includes(q))
    );
  });

  if (events.length === 0) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>

          <p className="font-display text-2xl md:text-3xl text-ink/80 italic font-light leading-relaxed">
            The first page awaits
          </p>
          <p className="font-body text-warm-gray mt-4 text-sm leading-relaxed max-w-sm mx-auto">
            Every gathering tells a story. Begin your ledger by recording
            your first occasion &mdash; or the one you wish you had written down.
          </p>
          <Link
            to="/new"
            className="inline-block mt-10 font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400"
          >
            Record a Gathering
          </Link>

          <div className="flex items-center gap-3 mt-12">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {showReveal && (
        <div
          className="text-center py-6 mb-4 transition-opacity duration-500"
          style={{ opacity: showReveal ? 1 : 0 }}
        >
          <p className="font-body text-sm text-warm-gray italic leading-relaxed">
            Your ledger has begun. Every evening you record becomes part of your story.
          </p>
        </div>
      )}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gatherings..."
              className="font-body text-sm !border-0 !border-b !border-rule !py-1.5 text-ink placeholder:text-warm-gray/30 w-full max-w-[200px]"
            />
          </div>
          <Link
            to="/new"
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 shrink-0"
          >
            + New Gathering
          </Link>
        </div>

        {filteredEvents.length === 0 && search.trim() && (
          <div className="text-center py-12">
            <p className="font-body text-sm text-warm-gray/50 italic">
              No gatherings match &ldquo;{search}&rdquo;
            </p>
          </div>
        )}

        {filteredEvents.map((event, index) => {
          const menuPreview = event.menu.courses.slice(0, 3).map(c => c.dish).join(' \u00b7 ');
          const guestNames = getGuestNames(event.guestIds);

          return (
            <React.Fragment key={event.id}>
              {index > 0 && <PageBreakRule />}

              <Link
                to={`/event/${event.id}`}
                className="block group text-center py-8"
              >
                {/* Date */}
                <span className="block font-sans text-[10px] uppercase tracking-[0.16em] text-gold/70 mb-3">
                  {formatDate(event.date)}
                </span>

                {/* Title — large centered */}
                <h3 className="font-display text-2xl md:text-3xl text-ink font-light tracking-display leading-snug mb-4 group-hover:text-gold transition-colors duration-400">
                  {event.title}
                </h3>

                {/* Purpose — italic below title, warm brown */}
                {event.purpose && (
                  <p className="font-body text-sm text-warm-brown italic leading-relaxed max-w-md mx-auto mb-5">
                    {event.purpose}
                  </p>
                )}

                {/* Occasion & Location */}
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/60 mb-6">
                  {OCCASION_LABELS[event.occasion]}
                  {event.location && <> &mdash; <span className="normal-case tracking-normal font-body text-xs italic">{event.location}</span></>}
                </p>

                {/* Menu preview */}
                {menuPreview && (
                  <p className="font-body text-sm text-ink/60 italic leading-relaxed mb-4">
                    {menuPreview}
                  </p>
                )}

                {/* Outfit preview */}
                {event.outfit && event.outfit.description && (
                  <p className="font-body text-xs text-warm-gray/50 italic mb-6">
                    Wore: {event.outfit.description}
                    {event.outfit.designer && <> &mdash; {event.outfit.designer}</>}
                  </p>
                )}

                {/* Guest names — the quietest element */}
                {guestNames && (
                  <p className="font-sans text-[8px] uppercase tracking-[0.16em] text-warm-gray/40 mt-6 leading-relaxed">
                    {guestNames}
                  </p>
                )}
              </Link>
            </React.Fragment>
          );
        })}

        <PageBreakRule />
      </div>
    </PageTransition>
  );
};

export default Home;
