import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AttendingEvent, ATTENDING_PHASE_LABELS, FORMALITY_LABELS } from '../types';
import { getAttendingEvents } from '../store';
import PageTransition from '../components/PageTransition';

const AttendingList: React.FC = () => {
  const [events, setEvents] = useState<AttendingEvent[]>([]);

  useEffect(() => {
    setEvents(getAttendingEvents().sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const phaseColor = (phase: AttendingEvent['phase']) => {
    switch (phase) {
      case 'invited': return 'text-warm-gray';
      case 'preparing': return 'text-gold';
      case 'day-of': return 'text-gold';
      case 'debrief': return 'text-warm-brown';
      case 'follow-up': return 'text-warm-brown';
      case 'complete': return 'text-warm-gray/50';
    }
  };

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
            No evenings to attend &mdash; yet
          </p>
          <p className="font-body text-warm-gray mt-4 text-sm leading-relaxed max-w-sm mx-auto">
            When you&rsquo;re invited somewhere, record it here. The Ledger will help you prepare,
            remember, and follow up &mdash; so every evening leaves a lasting impression.
          </p>
          <Link
            to="/attending/new"
            className="inline-block mt-10 font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400"
          >
            Record an Invitation
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
      <div className="pt-6">
        <div className="flex items-center justify-between mb-8">
          <div />
          <Link
            to="/attending/new"
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 shrink-0"
          >
            + New Invitation
          </Link>
        </div>

        <div className="space-y-0">
          {events.map(event => (
            <Link
              key={event.id}
              to={`/attending/${event.id}`}
              className="block group border-b border-rule py-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="block font-sans text-[10px] uppercase tracking-[0.16em] text-gold/70 mb-1">
                    {formatDate(event.date)}
                    {event.time && <> &middot; {event.time}</>}
                  </span>
                  <h3 className="font-display text-xl text-ink font-light tracking-display group-hover:text-gold transition-colors duration-400">
                    {event.eventName}
                  </h3>
                  <p className="font-body text-sm text-warm-gray italic mt-1">
                    Hosted by {event.hostName}
                    {event.location && <> &mdash; {event.location}</>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-sans text-[9px] uppercase tracking-label ${phaseColor(event.phase)}`}>
                    {ATTENDING_PHASE_LABELS[event.phase]}
                  </span>
                  <span className="block font-sans text-[9px] uppercase tracking-label text-warm-gray/40 mt-1">
                    {FORMALITY_LABELS[event.formalityLevel]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default AttendingList;
