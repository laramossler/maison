import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, Reflection as ReflectionType, OVERALL_RATING_LABELS, CONVERSATION_RATING_LABELS } from '../types';
import { getEvent, saveEvent } from '../store';
import PageTransition from '../components/PageTransition';
import WordRating from '../components/WordRating';

const Reflection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);

  const [overallRating, setOverallRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [pacing, setPacing] = useState<'rushed' | 'slow' | 'perfect'>('perfect');
  const [menuHighlights, setMenuHighlights] = useState('');
  const [menuMisses, setMenuMisses] = useState('');
  const [conversationQuality, setConversationQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [guestChemistry, setGuestChemistry] = useState('');
  const [whatToChange, setWhatToChange] = useState('');
  const [unexpectedDelights, setUnexpectedDelights] = useState('');
  const [freeNotes, setFreeNotes] = useState('');

  useEffect(() => {
    if (id) {
      const e = getEvent(id);
      if (e) {
        setEvent(e);
        if (e.reflection) {
          setOverallRating(e.reflection.overallRating);
          setPacing(e.reflection.pacing);
          setMenuHighlights(e.reflection.menuHighlights);
          setMenuMisses(e.reflection.menuMisses);
          setConversationQuality(e.reflection.conversationQuality);
          setGuestChemistry(e.reflection.guestChemistry);
          setWhatToChange(e.reflection.whatToChange);
          setUnexpectedDelights(e.reflection.unexpectedDelights);
          setFreeNotes(e.reflection.freeNotes);
        }
      }
    }
  }, [id]);

  if (!event) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">Event not found.</p>
        </div>
      </PageTransition>
    );
  }

  const handleSave = () => {
    const reflection: ReflectionType = {
      overallRating,
      pacing,
      menuHighlights,
      menuMisses,
      conversationQuality,
      guestChemistry,
      whatToChange,
      unexpectedDelights,
      freeNotes,
    };
    const updated = { ...event, reflection };
    saveEvent(updated);
    navigate(`/event/${event.id}`);
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate(`/event/${event.id}`)}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; Back to Event
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-1">
          Reflections
        </h1>
        <p className="font-body text-warm-gray italic text-sm mb-2">
          {event.title}
        </p>

        <div className="border-t border-rule mb-8 mt-6" />

        <p className="font-body text-warm-gray text-sm mb-10 leading-relaxed">
          Take a moment to consider the evening. What worked beautifully?
          What would you do differently? These notes become your most valuable
          reference when planning future gatherings.
        </p>

        <div className="space-y-8">
          <WordRating
            value={overallRating}
            labels={OVERALL_RATING_LABELS}
            onChange={(v) => setOverallRating(v as 1 | 2 | 3 | 4 | 5)}
            label="How was the evening overall?"
          />

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
              Pacing
            </label>
            <div className="flex gap-4">
              {(['rushed', 'perfect', 'slow'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPacing(p)}
                  className={`font-body text-sm italic transition-all duration-400
                    ${pacing === p
                      ? 'text-gold'
                      : 'text-warm-gray/30 hover:text-warm-gray/60'
                    }
                  `}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Menu Highlights
            </label>
            <textarea
              value={menuHighlights}
              onChange={e => setMenuHighlights(e.target.value)}
              placeholder="What dishes or pairings were particularly successful?"
              rows={3}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              What to Improve
            </label>
            <textarea
              value={menuMisses}
              onChange={e => setMenuMisses(e.target.value)}
              placeholder="Any dishes that didn't quite work?"
              rows={3}
            />
          </div>

          <WordRating
            value={conversationQuality}
            labels={CONVERSATION_RATING_LABELS}
            onChange={(v) => setConversationQuality(v as 1 | 2 | 3 | 4 | 5)}
            label="Conversation"
          />

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Guest Chemistry
            </label>
            <textarea
              value={guestChemistry}
              onChange={e => setGuestChemistry(e.target.value)}
              placeholder="Which guests connected well? Any pairings to repeat \u2014 or avoid?"
              rows={3}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              What to Change Next Time
            </label>
            <textarea
              value={whatToChange}
              onChange={e => setWhatToChange(e.target.value)}
              placeholder="Timing, quantities, arrangements..."
              rows={3}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Unexpected Delights
            </label>
            <textarea
              value={unexpectedDelights}
              onChange={e => setUnexpectedDelights(e.target.value)}
              placeholder="The moments you couldn't have planned"
              rows={3}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Free Notes
            </label>
            <textarea
              value={freeNotes}
              onChange={e => setFreeNotes(e.target.value)}
              placeholder="Anything else worth remembering..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSave}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400"
          >
            Save Reflections
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Reflection;
