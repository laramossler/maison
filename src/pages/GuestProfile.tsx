import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Guest, Event } from '../types';
import { getGuest, saveGuest, getGuestGatheringHistory } from '../store';
import PageTransition from '../components/PageTransition';

const GuestProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [history, setHistory] = useState<Event[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  // Editable field refs
  const [dietary, setDietary] = useState('');
  const [preferences, setPreferences] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [conversationTopics, setConversationTopics] = useState('');
  const [relationship, setRelationship] = useState('');

  useEffect(() => {
    if (id) {
      const g = getGuest(id);
      if (g) {
        setGuest(g);
        setDietary(g.dietary);
        setPreferences(g.preferences);
        setPersonalNotes(g.personalNotes);
        setConversationTopics(g.conversationTopics);
        setRelationship(g.relationship);
        setHistory(getGuestGatheringHistory(id));
      }
    }
  }, [id]);

  if (!guest) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">Guest not found.</p>
          <Link to="/guests" className="inline-block mt-6 font-sans text-[11px] uppercase tracking-label text-gold">
            Return to Guest Book
          </Link>
        </div>
      </PageTransition>
    );
  }

  const saveField = (field: string) => {
    const updated = {
      ...guest,
      dietary,
      preferences,
      personalNotes,
      conversationTopics,
      relationship,
    };
    saveGuest(updated);
    setGuest(updated);
    setEditing(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const EditableSection: React.FC<{
    label: string;
    field: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    multiline?: boolean;
  }> = ({ label, field, value, onChange, placeholder, multiline }) => {
    const isEditing = editing === field;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
            {label}
          </span>
          {isEditing ? (
            <button
              onClick={() => saveField(field)}
              className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(field)}
              className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full"
              autoFocus
            />
          )
        ) : (
          <p className={`font-body text-sm leading-relaxed ${value ? 'text-ink' : 'text-warm-gray/40 italic'}`}>
            {value || placeholder}
          </p>
        )}
      </div>
    );
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <Link
          to="/guests"
          className="inline-block font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8"
        >
          &larr; Guest Book
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-1">
          {guest.name}
        </h1>

        {editing === 'relationship' ? (
          <div className="flex items-center gap-2 mb-8">
            <input
              type="text"
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              placeholder="Relationship"
              className="font-body text-sm italic text-warm-gray w-48"
              autoFocus
            />
            <button
              onClick={() => saveField('relationship')}
              className="font-sans text-[10px] uppercase tracking-label text-gold"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing('relationship')}
            className="block mb-8"
          >
            <span className={`font-body text-sm italic ${relationship ? 'text-warm-gray' : 'text-warm-gray/40'}`}>
              {relationship || 'Add relationship'}
            </span>
          </button>
        )}

        <div className="border-t border-rule mb-8" />

        <EditableSection
          label="Dietary & Allergies"
          field="dietary"
          value={dietary}
          onChange={setDietary}
          placeholder="Dietary needs, restrictions, allergies..."
          multiline
        />

        <EditableSection
          label="Preferences"
          field="preferences"
          value={preferences}
          onChange={setPreferences}
          placeholder="What they enjoy \u2014 foods, drinks, styles..."
          multiline
        />

        <EditableSection
          label="Personal Notes"
          field="personalNotes"
          value={personalNotes}
          onChange={setPersonalNotes}
          placeholder="Children, travels, interests, milestones..."
          multiline
        />

        <EditableSection
          label="Conversation Topics"
          field="conversationTopics"
          value={conversationTopics}
          onChange={setConversationTopics}
          placeholder="What lights them up..."
        />

        {/* Gathering History */}
        {history.length > 0 && (
          <>
            <div className="border-t border-rule mb-8 mt-4" />
            <div className="mb-8">
              <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-4">
                Gathering History
              </span>
              <div className="space-y-6">
                {history.map(event => {
                  const isGuestOfHonor = event.guestOfHonorId === guest.id;
                  const courseSummary = event.menu.courses.map(c => c.dish).join(', ');
                  const wineSummary = event.menu.wines.map(w => w.name).join(', ');

                  // Extract guest-specific notes from reflection
                  let guestNote = '';
                  if (event.reflection?.guestChemistry) {
                    const name = guest.name.split(' ')[0];
                    const lastName = guest.name.split(' ').pop() || '';
                    const sentences = event.reflection.guestChemistry.split(/[.!]/).filter(Boolean);
                    const relevant = sentences.filter(s =>
                      s.includes(name) || s.includes(lastName)
                    );
                    if (relevant.length > 0) {
                      guestNote = relevant.map(s => s.trim()).join('. ') + '.';
                    }
                  }

                  return (
                    <div key={event.id} className="border-l-2 border-gold/20 pl-4">
                      <Link
                        to={`/event/${event.id}`}
                        className="group"
                      >
                        <h4 className="font-display text-base text-ink font-light group-hover:text-gold transition-colors duration-300">
                          {event.title}
                        </h4>
                        <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
                          {formatDate(event.date)}
                        </span>
                      </Link>
                      {isGuestOfHonor && (
                        <span className="font-sans text-[9px] uppercase tracking-label text-gold ml-2">
                          Guest of Honour
                        </span>
                      )}
                      {courseSummary && (
                        <p className="font-body text-xs text-warm-gray mt-2">
                          <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/60">Served: </span>
                          {courseSummary}
                        </p>
                      )}
                      {wineSummary && (
                        <p className="font-body text-xs text-warm-gray mt-1">
                          <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/60">Wines: </span>
                          {wineSummary}
                        </p>
                      )}
                      {event.seatingNotes && (
                        <p className="font-body text-xs text-warm-gray/70 italic mt-1">
                          {event.seatingNotes}
                        </p>
                      )}
                      {guestNote && (
                        <p className="font-body text-xs text-warm-gray italic mt-1">
                          &ldquo;{guestNote}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default GuestProfile;
