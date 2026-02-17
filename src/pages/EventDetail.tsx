import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event, Guest, OCCASION_LABELS, STATUS_LABELS, COURSE_LABELS, Course, OVERALL_RATING_LABELS, CONVERSATION_RATING_LABELS } from '../types';
import { getEvent, getGuests, saveEvent } from '../store';
import PageTransition from '../components/PageTransition';
import WordRating from '../components/WordRating';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    if (id) {
      const e = getEvent(id);
      if (e) {
        setEvent(e);
        const allGuests = getGuests();
        setGuests(allGuests.filter(g => e.guestIds.includes(g.id)));
      }
    }
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

  const handleStatusChange = (status: Event['status']) => {
    const updated = { ...event, status };
    saveEvent(updated);
    setEvent(updated);
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-10">
      <h3 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <PageTransition>
      <div className="pt-8">
        <Link
          to="/"
          className="inline-block font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8"
        >
          &larr; Your Gatherings
        </Link>

        <div className="mb-4 flex items-baseline justify-between">
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
            {formatDate(event.date)}
          </span>
          <div className="flex items-center gap-3">
            {event.status === 'planning' && (
              <button
                onClick={() => handleStatusChange('upcoming')}
                className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                Mark Upcoming
              </button>
            )}
            {event.status === 'upcoming' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                Mark Completed
              </button>
            )}
            <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60">
              {STATUS_LABELS[event.status]}
            </span>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          {event.title}
        </h1>

        {event.purpose && (
          <p className="font-body text-sm text-warm-brown italic mb-3">
            {event.purpose}
          </p>
        )}

        <div className="flex items-center gap-3 mb-10">
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
            {OCCASION_LABELS[event.occasion]}
          </span>
          <span className="text-rule">&middot;</span>
          <span className="font-body text-sm text-warm-gray italic">
            {event.location}
          </span>
        </div>

        <div className="border-t border-rule mb-10" />

        {/* Guests */}
        <Section title="The Guests">
          <div className="space-y-2">
            {guests.map(guest => (
              <div key={guest.id} className="flex items-baseline gap-2">
                <Link
                  to={`/guest/${guest.id}`}
                  className="font-body text-ink hover:text-gold transition-colors duration-300"
                >
                  {guest.name}
                </Link>
                {guest.id === event.guestOfHonorId && (
                  <span className="font-sans text-[9px] uppercase tracking-label text-gold">
                    Guest of Honour
                  </span>
                )}
              </div>
            ))}
          </div>
          {event.seatingNotes && (
            <p className="font-body text-sm text-warm-gray italic mt-4">{event.seatingNotes}</p>
          )}
        </Section>

        <div className="border-t border-rule mb-10" />

        {/* Menu */}
        {event.menu.courses.length > 0 && (
          <>
            <Section title="The Menu">
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

              {event.menu.wines.length > 0 && (
                <div className="mt-8">
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
                    Wines
                  </span>
                  <div className="space-y-3">
                    {event.menu.wines.map((wine, i) => (
                      <div key={i} className="flex items-baseline gap-3">
                        <span className="font-body text-ink">{wine.name}</span>
                        {wine.vintage && (
                          <span className="font-sans text-[10px] text-warm-gray">{wine.vintage}</span>
                        )}
                        <span className="font-body text-sm text-warm-gray italic">
                          with {wine.course.toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.menu.notes && (
                <p className="font-body text-sm text-warm-gray italic mt-6">{event.menu.notes}</p>
              )}
            </Section>
            <div className="border-t border-rule mb-10" />
          </>
        )}

        {/* Atmosphere */}
        {(event.atmosphere.flowers || event.atmosphere.tableSettings || event.atmosphere.lighting || event.atmosphere.music || event.atmosphere.scent) && (
          <>
            <Section title="The Atmosphere">
              <div className="space-y-3">
                {event.atmosphere.flowers && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Flowers</span>
                    <p className="font-body text-ink text-sm mt-0.5">{event.atmosphere.flowers}</p>
                  </div>
                )}
                {event.atmosphere.tableSettings && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Table</span>
                    <p className="font-body text-ink text-sm mt-0.5">{event.atmosphere.tableSettings}</p>
                  </div>
                )}
                {event.atmosphere.lighting && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Lighting</span>
                    <p className="font-body text-ink text-sm mt-0.5">{event.atmosphere.lighting}</p>
                  </div>
                )}
                {event.atmosphere.music && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Music</span>
                    <p className="font-body text-ink text-sm mt-0.5">{event.atmosphere.music}</p>
                  </div>
                )}
                {event.atmosphere.scent && (
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Scent</span>
                    <p className="font-body text-ink text-sm mt-0.5">{event.atmosphere.scent}</p>
                  </div>
                )}
              </div>
            </Section>
            <div className="border-t border-rule mb-10" />
          </>
        )}

        {/* What I Wore */}
        {event.outfit && event.outfit.description && (
          <>
            <Section title="What I Wore">
              <p className="font-body text-ink italic">
                {event.outfit.description}
              </p>
              {event.outfit.designer && (
                <p className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70 mt-2">
                  {event.outfit.designer}
                </p>
              )}
              {event.outfit.notes && (
                <p className="font-body text-sm text-warm-gray italic mt-2">
                  {event.outfit.notes}
                </p>
              )}
            </Section>
            <div className="border-t border-rule mb-10" />
          </>
        )}

        {/* Timeline */}
        {event.plannedTimeline.length > 0 && (
          <>
            <Section title="The Timeline">
              <div className="space-y-3">
                {event.plannedTimeline.map((entry, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="font-sans text-sm text-warm-gray w-14 shrink-0">{entry.time}</span>
                    <span className="font-body text-ink text-sm">{entry.activity}</span>
                  </div>
                ))}
              </div>
            </Section>
            <div className="border-t border-rule mb-10" />
          </>
        )}

        {/* Reflection */}
        {event.reflection && (
          <Section title="Reflections">
            <div className="space-y-6">
              <div className="space-y-4">
                <WordRating
                  value={event.reflection.overallRating}
                  labels={OVERALL_RATING_LABELS}
                  label="Overall"
                />
                <WordRating
                  value={event.reflection.conversationQuality}
                  labels={CONVERSATION_RATING_LABELS}
                  label="Conversation"
                />
              </div>

              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Pacing</span>
                <p className="font-body text-ink text-sm mt-0.5 italic">
                  {event.reflection.pacing.charAt(0).toUpperCase() + event.reflection.pacing.slice(1)}
                </p>
              </div>

              {event.reflection.menuHighlights && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Menu Highlights</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.menuHighlights}</p>
                </div>
              )}

              {event.reflection.menuMisses && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">To Improve</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.menuMisses}</p>
                </div>
              )}

              {event.reflection.guestChemistry && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Guest Chemistry</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.guestChemistry}</p>
                </div>
              )}

              {event.reflection.whatToChange && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Next Time</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.whatToChange}</p>
                </div>
              )}

              {event.reflection.unexpectedDelights && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Unexpected Delights</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.unexpectedDelights}</p>
                </div>
              )}

              {event.reflection.freeNotes && (
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">Notes</span>
                  <p className="font-body text-ink text-sm mt-0.5">{event.reflection.freeNotes}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 mt-10 mb-4">
          {event.status === 'completed' && !event.reflection && (
            <Link
              to={`/event/${event.id}/reflect`}
              className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-6 py-2.5 hover:bg-gold/5 transition-all duration-400"
            >
              Add Reflections
            </Link>
          )}
          {event.status === 'completed' && event.reflection && (
            <Link
              to={`/event/${event.id}/reflect`}
              className="font-sans text-[11px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300"
            >
              Edit Reflections
            </Link>
          )}
          <Link
            to={`/event/${event.id}/brief`}
            className="font-sans text-[11px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300"
          >
            Kitchen Brief
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default EventDetail;
