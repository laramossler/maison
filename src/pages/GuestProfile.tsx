import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Guest, Event, GiftEntry, LifeEvent, ChildBirthday, LIFE_EVENT_TYPES, LIFE_EVENT_LABELS } from '../types';
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

  // Key dates
  const [birthday, setBirthday] = useState('');
  const [anniversary, setAnniversary] = useState('');

  // Add forms
  const [showAddGift, setShowAddGift] = useState(false);
  const [showAddLifeEvent, setShowAddLifeEvent] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  // New gift form
  const [giftDate, setGiftDate] = useState('');
  const [giftOccasion, setGiftOccasion] = useState('');
  const [giftItem, setGiftItem] = useState('');
  const [giftNotes, setGiftNotes] = useState('');
  const [giftDirection, setGiftDirection] = useState<'given' | 'received'>('given');

  // New life event form
  const [lifeEventType, setLifeEventType] = useState<LifeEvent['type']>('other');
  const [lifeEventDescription, setLifeEventDescription] = useState('');
  const [lifeEventDate, setLifeEventDate] = useState('');

  // New child form
  const [childName, setChildName] = useState('');
  const [childDate, setChildDate] = useState('');

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
        setBirthday(g.birthday || '');
        setAnniversary(g.anniversary || '');
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
      birthday: birthday || undefined,
      anniversary: anniversary || undefined,
    };
    saveGuest(updated);
    setGuest(updated);
    setEditing(null);
  };

  const saveGiftEntry = () => {
    if (!giftItem.trim() || !giftOccasion.trim()) return;
    const entry: GiftEntry = {
      date: giftDate || new Date().toISOString().split('T')[0],
      occasion: giftOccasion.trim(),
      gift: giftItem.trim(),
      notes: giftNotes.trim() || undefined,
      direction: giftDirection,
    };
    const updated = {
      ...guest,
      giftHistory: [...(guest.giftHistory || []), entry],
    };
    saveGuest(updated);
    setGuest(updated);
    setGiftDate('');
    setGiftOccasion('');
    setGiftItem('');
    setGiftNotes('');
    setGiftDirection('given');
    setShowAddGift(false);
  };

  const removeGift = (index: number) => {
    const gifts = [...(guest.giftHistory || [])];
    gifts.splice(index, 1);
    const updated = { ...guest, giftHistory: gifts };
    saveGuest(updated);
    setGuest(updated);
  };

  const saveLifeEvent = () => {
    if (!lifeEventDescription.trim()) return;
    const entry: LifeEvent = {
      type: lifeEventType,
      description: lifeEventDescription.trim(),
      date: lifeEventDate || new Date().toISOString().split('T')[0],
      acknowledged: false,
    };
    const updated = {
      ...guest,
      lifeEvents: [...(guest.lifeEvents || []), entry],
    };
    saveGuest(updated);
    setGuest(updated);
    setLifeEventType('other');
    setLifeEventDescription('');
    setLifeEventDate('');
    setShowAddLifeEvent(false);
  };

  const toggleAcknowledged = (index: number) => {
    const events = [...(guest.lifeEvents || [])];
    events[index] = { ...events[index], acknowledged: !events[index].acknowledged };
    const updated = { ...guest, lifeEvents: events };
    saveGuest(updated);
    setGuest(updated);
  };

  const saveAcknowledgment = (index: number, text: string) => {
    const events = [...(guest.lifeEvents || [])];
    events[index] = { ...events[index], acknowledgment: text, acknowledged: true };
    const updated = { ...guest, lifeEvents: events };
    saveGuest(updated);
    setGuest(updated);
  };

  const removeLifeEvent = (index: number) => {
    const events = [...(guest.lifeEvents || [])];
    events.splice(index, 1);
    const updated = { ...guest, lifeEvents: events };
    saveGuest(updated);
    setGuest(updated);
  };

  const saveChild = () => {
    if (!childName.trim()) return;
    const child: ChildBirthday = {
      name: childName.trim(),
      date: childDate,
    };
    const updated = {
      ...guest,
      childrenBirthdays: [...(guest.childrenBirthdays || []), child],
    };
    saveGuest(updated);
    setGuest(updated);
    setChildName('');
    setChildDate('');
    setShowAddChild(false);
  };

  const removeChild = (index: number) => {
    const children = [...(guest.childrenBirthdays || [])];
    children.splice(index, 1);
    const updated = { ...guest, childrenBirthdays: children };
    saveGuest(updated);
    setGuest(updated);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatBirthday = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    // If year looks like a placeholder (e.g., 1900), just show month/day
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
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

  const gifts = guest.giftHistory || [];
  const giftsGiven = gifts.filter(g => g.direction === 'given');
  const giftsReceived = gifts.filter(g => g.direction === 'received');
  const lifeEvents = guest.lifeEvents || [];
  const children = guest.childrenBirthdays || [];

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

        {/* Key Dates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
              Key Dates
            </span>
            {editing === 'dates' ? (
              <button
                onClick={() => saveField('dates')}
                className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditing('dates')}
                className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
              >
                Edit
              </button>
            )}
          </div>

          {editing === 'dates' ? (
            <div className="space-y-3">
              <div>
                <label className="font-sans text-[9px] uppercase tracking-label text-warm-gray/60 block mb-1">Birthday</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={e => setBirthday(e.target.value)}
                  className="w-full max-w-[200px]"
                />
              </div>
              <div>
                <label className="font-sans text-[9px] uppercase tracking-label text-warm-gray/60 block mb-1">Anniversary</label>
                <input
                  type="date"
                  value={anniversary}
                  onChange={e => setAnniversary(e.target.value)}
                  className="w-full max-w-[200px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {birthday && (
                <p className="font-body text-sm text-ink">
                  <span className="text-warm-gray/60">Birthday:</span> {formatBirthday(birthday)}
                </p>
              )}
              {anniversary && (
                <p className="font-body text-sm text-ink">
                  <span className="text-warm-gray/60">Anniversary:</span> {formatDate(anniversary)}
                </p>
              )}
              {children.length > 0 && (
                <div className="mt-2">
                  {children.map((child, i) => (
                    <div key={i} className="flex items-baseline gap-2">
                      <p className="font-body text-sm text-ink">
                        <span className="text-warm-gray/60">{child.name}:</span>{' '}
                        {child.date ? formatBirthday(child.date) : 'date not recorded'}
                      </p>
                      <button
                        onClick={() => removeChild(i)}
                        className="font-sans text-[9px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {!birthday && !anniversary && children.length === 0 && (
                <p className="font-body text-sm text-warm-gray/40 italic">No dates recorded yet</p>
              )}
            </div>
          )}

          {/* Children's birthdays — always visible for adding */}
          {editing !== 'dates' && (
            <div className="mt-3">
              {!showAddChild ? (
                <button
                  onClick={() => setShowAddChild(true)}
                  className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-gold transition-colors duration-300"
                >
                  + Add Child
                </button>
              ) : (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    placeholder="Child's name"
                    className="w-full max-w-[200px]"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={childDate}
                    onChange={e => setChildDate(e.target.value)}
                    className="w-full max-w-[200px]"
                  />
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={saveChild}
                      disabled={!childName.trim()}
                      className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 disabled:opacity-30"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setShowAddChild(false); setChildName(''); setChildDate(''); }}
                      className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

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
          placeholder="What they enjoy — foods, drinks, styles..."
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

        {/* Gift History */}
        <div className="border-t border-rule mb-8 mt-4" />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
              Gift History
            </span>
            {!showAddGift && (
              <button
                onClick={() => setShowAddGift(true)}
                className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-gold transition-colors duration-300"
              >
                + Add
              </button>
            )}
          </div>

          {gifts.length === 0 && !showAddGift && (
            <p className="font-body text-sm text-warm-gray/40 italic">
              No gifts recorded yet
            </p>
          )}

          {/* Gifts Given */}
          {giftsGiven.length > 0 && (
            <div className="mb-4">
              <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50 block mb-2">
                Given
              </span>
              <div className="space-y-3">
                {giftsGiven.map((gift, i) => {
                  const originalIndex = gifts.indexOf(gift);
                  return (
                    <div key={i} className="border-l-2 border-gold/20 pl-3">
                      <p className="font-body text-sm text-ink">{gift.gift}</p>
                      <p className="font-body text-xs text-warm-gray italic">
                        {gift.occasion}
                        {gift.date && <> &mdash; {formatDateShort(gift.date)}</>}
                      </p>
                      {gift.notes && (
                        <p className="font-body text-xs text-warm-gray/60 italic mt-0.5">{gift.notes}</p>
                      )}
                      <button
                        onClick={() => removeGift(originalIndex)}
                        className="font-sans text-[9px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gifts Received */}
          {giftsReceived.length > 0 && (
            <div className="mb-4">
              <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50 block mb-2">
                Received
              </span>
              <div className="space-y-3">
                {giftsReceived.map((gift, i) => {
                  const originalIndex = gifts.indexOf(gift);
                  return (
                    <div key={i} className="border-l-2 border-gold/20 pl-3">
                      <p className="font-body text-sm text-ink">{gift.gift}</p>
                      <p className="font-body text-xs text-warm-gray italic">
                        {gift.occasion}
                        {gift.date && <> &mdash; {formatDateShort(gift.date)}</>}
                      </p>
                      {gift.notes && (
                        <p className="font-body text-xs text-warm-gray/60 italic mt-0.5">{gift.notes}</p>
                      )}
                      <button
                        onClick={() => removeGift(originalIndex)}
                        className="font-sans text-[9px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Gift Form */}
          {showAddGift && (
            <div className="space-y-3 mt-4 border-l-2 border-gold/30 pl-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="giftDirection"
                    checked={giftDirection === 'given'}
                    onChange={() => setGiftDirection('given')}
                    className="!w-auto !border-0 !p-0"
                  />
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">Given</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="giftDirection"
                    checked={giftDirection === 'received'}
                    onChange={() => setGiftDirection('received')}
                    className="!w-auto !border-0 !p-0"
                  />
                  <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">Received</span>
                </label>
              </div>
              <input
                type="text"
                value={giftItem}
                onChange={e => setGiftItem(e.target.value)}
                placeholder="What was the gift?"
                autoFocus
              />
              <input
                type="text"
                value={giftOccasion}
                onChange={e => setGiftOccasion(e.target.value)}
                placeholder="Occasion — Christmas 2025, hostess gift..."
              />
              <input
                type="date"
                value={giftDate}
                onChange={e => setGiftDate(e.target.value)}
              />
              <input
                type="text"
                value={giftNotes}
                onChange={e => setGiftNotes(e.target.value)}
                placeholder="Notes — how it was received, ideas for next time..."
              />
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={saveGiftEntry}
                  disabled={!giftItem.trim() || !giftOccasion.trim()}
                  className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 disabled:opacity-30"
                >
                  Save Gift
                </button>
                <button
                  onClick={() => { setShowAddGift(false); setGiftItem(''); setGiftOccasion(''); setGiftDate(''); setGiftNotes(''); }}
                  className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Life Events */}
        <div className="border-t border-rule mb-8" />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
              Life Events
            </span>
            {!showAddLifeEvent && (
              <button
                onClick={() => setShowAddLifeEvent(true)}
                className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-gold transition-colors duration-300"
              >
                + Add
              </button>
            )}
          </div>

          {lifeEvents.length === 0 && !showAddLifeEvent && (
            <p className="font-body text-sm text-warm-gray/40 italic">
              No life events recorded
            </p>
          )}

          {lifeEvents.length > 0 && (
            <div className="space-y-4">
              {lifeEvents.map((event, i) => (
                <div key={i} className="border-l-2 border-gold/20 pl-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/70">
                      {LIFE_EVENT_LABELS[event.type]}
                    </span>
                    <span className="font-sans text-[9px] text-warm-gray/50">
                      {formatDateShort(event.date)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink mt-0.5">{event.description}</p>
                  {event.acknowledged ? (
                    <div className="mt-1">
                      {event.acknowledgment ? (
                        <p className="font-body text-xs text-warm-gray italic">
                          Acknowledged: {event.acknowledgment}
                        </p>
                      ) : (
                        <p className="font-body text-xs text-warm-gray/50 italic">Acknowledged</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => toggleAcknowledged(i)}
                        className="font-sans text-[9px] uppercase tracking-label text-gold/60 hover:text-gold transition-colors duration-300"
                      >
                        Mark Acknowledged
                      </button>
                    </div>
                  )}
                  {editing === `life-${i}` ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={event.acknowledgment || ''}
                        onChange={e => saveAcknowledgment(i, e.target.value)}
                        placeholder="Sent white roses and a note..."
                        className="text-xs"
                        autoFocus
                        onBlur={() => setEditing(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditing(`life-${i}`)}
                      className="font-sans text-[9px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300 mt-1"
                    >
                      {event.acknowledgment ? 'Edit Note' : 'Add Note'}
                    </button>
                  )}
                  <button
                    onClick={() => removeLifeEvent(i)}
                    className="font-sans text-[9px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300 mt-1 ml-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Life Event Form */}
          {showAddLifeEvent && (
            <div className="space-y-3 mt-4 border-l-2 border-gold/30 pl-3">
              <div>
                <label className="font-sans text-[9px] uppercase tracking-label text-warm-gray/60 block mb-1">Type</label>
                <select
                  value={lifeEventType}
                  onChange={e => setLifeEventType(e.target.value as LifeEvent['type'])}
                  className="w-full max-w-[200px]"
                >
                  {LIFE_EVENT_TYPES.map(t => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={lifeEventDescription}
                onChange={e => setLifeEventDescription(e.target.value)}
                placeholder="What happened..."
                autoFocus
              />
              <input
                type="date"
                value={lifeEventDate}
                onChange={e => setLifeEventDate(e.target.value)}
              />
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={saveLifeEvent}
                  disabled={!lifeEventDescription.trim()}
                  className="font-sans text-[10px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 disabled:opacity-30"
                >
                  Save Event
                </button>
                <button
                  onClick={() => { setShowAddLifeEvent(false); setLifeEventDescription(''); setLifeEventDate(''); }}
                  className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gathering History */}
        {history.length > 0 && (
          <>
            <div className="border-t border-rule mb-8" />
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
