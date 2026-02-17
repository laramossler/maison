import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Guest } from '../types';
import { getGuests, getEvents } from '../store';
import PageTransition from '../components/PageTransition';

const GuestBook: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [gatheringCounts, setGatheringCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const allGuests = getGuests().sort((a, b) => a.name.localeCompare(b.name));
    setGuests(allGuests);

    const events = getEvents();
    const counts: Record<string, number> = {};
    allGuests.forEach(g => {
      counts[g.id] = events.filter(e => e.guestIds.includes(g.id)).length;
    });
    setGatheringCounts(counts);
  }, []);

  const filteredGuests = guests.filter(guest => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      guest.name.toLowerCase().includes(q) ||
      guest.relationship.toLowerCase().includes(q) ||
      guest.dietary.toLowerCase().includes(q) ||
      guest.preferences.toLowerCase().includes(q) ||
      guest.personalNotes.toLowerCase().includes(q) ||
      guest.conversationTopics.toLowerCase().includes(q)
    );
  });

  if (guests.length === 0) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <div className="border-t border-rule mb-12" />
          <p className="font-display text-2xl md:text-3xl text-ink/80 italic font-light leading-relaxed">
            Your guest book is waiting
          </p>
          <p className="font-body text-warm-gray mt-4 text-sm leading-relaxed max-w-sm mx-auto">
            The people who gather around your table are the heart of every evening.
            Begin by adding your first guest.
          </p>
          <Link
            to="/guests/new"
            className="inline-block mt-10 font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400"
          >
            Add a Guest
          </Link>
          <div className="border-t border-rule mt-12" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
            Guest Book
          </h2>
          <Link
            to="/guests/new"
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + New
          </Link>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guests..."
            className="font-body text-sm !border-0 !border-b !border-rule !py-1.5 text-ink placeholder:text-warm-gray/30 w-full max-w-[200px]"
          />
        </div>

        {filteredGuests.length === 0 && search.trim() && (
          <div className="text-center py-12">
            <p className="font-body text-sm text-warm-gray/50 italic">
              No guests match &ldquo;{search}&rdquo;
            </p>
          </div>
        )}

        <div className="space-y-0">
          {filteredGuests.map((guest, index) => (
            <Link
              key={guest.id}
              to={`/guest/${guest.id}`}
              className="block group"
            >
              {index > 0 && <div className="border-t border-rule" />}
              <div className="py-5 transition-all duration-300 group-hover:pl-2">
                <h3 className="font-display text-lg md:text-xl text-ink font-light group-hover:text-gold transition-colors duration-400">
                  {guest.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {guest.relationship && (
                    <span className="font-body text-sm text-warm-gray italic">
                      {guest.relationship}
                    </span>
                  )}
                  {guest.relationship && gatheringCounts[guest.id] > 0 && (
                    <span className="text-rule">&middot;</span>
                  )}
                  {gatheringCounts[guest.id] > 0 && (
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">
                      {gatheringCounts[guest.id]} gathering{gatheringCounts[guest.id] !== 1 ? 's' : ''}
                    </span>
                  )}
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

export default GuestBook;
