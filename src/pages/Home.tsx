import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, OCCASION_LABELS, STATUS_LABELS } from '../types';
import { getEvents } from '../store';
import PageTransition from '../components/PageTransition';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getEvents().sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (events.length === 0) {
    return (
      <PageTransition>
        <div className="pt-12 text-center">
          <div className="border-t border-rule mb-12" />
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
          <div className="border-t border-rule mt-12" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-6">
        <div className="flex items-center justify-end mb-8">
          <Link
            to="/new"
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + New Gathering
          </Link>
        </div>

        <div className="space-y-0">
          {events.map((event, index) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="block group"
            >
              {index > 0 && <div className="border-t border-rule" />}
              <div className="py-6 transition-all duration-300 group-hover:pl-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
                    {formatDate(event.date)}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60">
                    {STATUS_LABELS[event.status]}
                  </span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-ink font-light group-hover:text-gold transition-colors duration-400">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">
                    {OCCASION_LABELS[event.occasion]}
                  </span>
                  <span className="text-rule">&middot;</span>
                  <span className="font-body text-sm text-warm-gray italic">
                    {event.location}
                  </span>
                  <span className="text-rule">&middot;</span>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">
                    {event.guestIds.length} guest{event.guestIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-rule mt-2" />
      </div>
    </PageTransition>
  );
};

export default Home;
