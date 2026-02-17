import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event, Guest, OCCASION_LABELS, COURSE_LABELS, Course } from '../types';
import { getEvent, getGuests, getProfile } from '../store';
import { LedgerProfile } from '../types';
import PageTransition from '../components/PageTransition';

const KitchenBrief: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [profile, setProfile] = useState<LedgerProfile | null>(null);

  useEffect(() => {
    if (id) {
      const e = getEvent(id);
      if (e) {
        setEvent(e);
        const allGuests = getGuests();
        setGuests(allGuests.filter(g => e.guestIds.includes(g.id)));
      }
    }
    setProfile(getProfile());
  }, [id]);

  if (!event) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">This page seems to be missing from the ledger.</p>
          <Link to="/" className="inline-block mt-6 font-sans text-[11px] uppercase tracking-label text-gold">
            Return to Your Gatherings
          </Link>
        </div>
      </PageTransition>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const guestsWithDietary = guests.filter(g => g.dietary);

  return (
    <PageTransition>
      <div className="pt-8">
        {/* Screen-only back nav and print button */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            to={`/event/${event.id}`}
            className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300"
          >
            &larr; Back to Event
          </Link>
          <button
            onClick={() => window.print()}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-6 py-2 hover:bg-gold/5 transition-all duration-400"
          >
            Print Brief
          </button>
        </div>

        {/* The Brief */}
        <div className="print:pt-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 border-t border-gold/20" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-gold/20" />
            </div>

            <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold/50 mb-2">
              Kitchen Brief
            </p>

            {profile && profile.familyName && (
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-3">
                {profile.familyName}
              </p>
            )}

            <h1 className="font-display text-2xl md:text-3xl text-ink font-light tracking-display mb-2">
              {event.title}
            </h1>

            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/60">
              {formatDate(event.date)}
              {' '}&mdash;{' '}
              {OCCASION_LABELS[event.occasion]}
              {event.location && <> &mdash; {event.location}</>}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 border-t border-gold/20" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-gold/20" />
            </div>
          </div>

          {/* Guest Count & Names */}
          <div className="mb-8">
            <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
              Guests ({guests.length})
            </h2>
            <div className="space-y-1">
              {guests.map(guest => (
                <div key={guest.id} className="flex items-baseline gap-2">
                  <span className="font-body text-sm text-ink">{guest.name}</span>
                  {guest.id === event.guestOfHonorId && (
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold">
                      Guest of Honour
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Requirements */}
          {guestsWithDietary.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
                Dietary Requirements
              </h2>
              <div className="space-y-2">
                {guestsWithDietary.map(guest => (
                  <div key={guest.id}>
                    <span className="font-body text-sm text-ink font-medium">{guest.name}</span>
                    <p className="font-body text-sm text-warm-gray italic">{guest.dietary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-rule mb-8" />

          {/* Menu */}
          {event.menu.courses.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-4">
                Menu
              </h2>
              <div className="space-y-4">
                {event.menu.courses.map((course, i) => (
                  <div key={i}>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">
                      {COURSE_LABELS[course.type as Course['type']] || course.type}
                    </span>
                    <p className="font-display text-lg text-ink font-light mt-0.5">
                      {course.dish}
                    </p>
                    {course.notes && (
                      <p className="font-body text-sm text-warm-gray italic mt-0.5">{course.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {event.menu.notes && (
                <p className="font-body text-sm text-warm-gray italic mt-6">{event.menu.notes}</p>
              )}
            </div>
          )}

          {/* Wines */}
          {event.menu.wines.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
                Wine Service
              </h2>
              <div className="space-y-3">
                {event.menu.wines.map((wine, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-body text-ink">{wine.name}</span>
                      {wine.vintage && (
                        <span className="font-sans text-[10px] text-warm-gray">{wine.vintage}</span>
                      )}
                    </div>
                    <p className="font-body text-sm text-warm-gray italic">
                      With {wine.course.toLowerCase()}
                      {wine.notes && <> &mdash; {wine.notes}</>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-rule mb-8" />

          {/* Timeline */}
          {event.plannedTimeline.length > 0 && (
            <div className="mb-8">
              <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-4">
                Timeline
              </h2>
              <div className="space-y-3">
                {event.plannedTimeline.map((entry, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="font-sans text-sm text-warm-gray w-14 shrink-0">{entry.time}</span>
                    <span className="font-body text-ink text-sm">{entry.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seating */}
          {event.seatingNotes && (
            <div className="mb-8">
              <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
                Seating
              </h2>
              <p className="font-body text-sm text-ink">{event.seatingNotes}</p>
            </div>
          )}

          {/* Footer ornament */}
          <div className="flex items-center gap-3 mt-10">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default KitchenBrief;
