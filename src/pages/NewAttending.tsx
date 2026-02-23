import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  AttendingEvent,
  AttendingGuestEntry,
  InvitationType,
  FormalityLevel,
  INVITATION_TYPE_LABELS,
  FORMALITY_LABELS,
} from '../types';
import { saveAttendingEvent } from '../store';
import PageTransition from '../components/PageTransition';

const NewAttending: React.FC = () => {
  const navigate = useNavigate();

  // Phase 1 fields
  const [eventName, setEventName] = useState('');
  const [hostName, setHostName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [invitationType, setInvitationType] = useState<InvitationType>('text');
  const [formalityLevel, setFormalityLevel] = useState<FormalityLevel>('casual');
  const [guestList, setGuestList] = useState<AttendingGuestEntry[]>([]);
  const [newGuestName, setNewGuestName] = useState('');

  const addGuest = () => {
    if (!newGuestName.trim()) return;
    setGuestList(prev => [...prev, { name: newGuestName.trim() }]);
    setNewGuestName('');
  };

  const removeGuest = (index: number) => {
    setGuestList(prev => prev.filter((_, i) => i !== index));
  };

  // Determine initial phase based on date
  const getInitialPhase = (): AttendingEvent['phase'] => {
    if (!date) return 'invited';
    const eventDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (eventDate < today) return 'debrief';
    if (eventDate.getTime() === today.getTime()) return 'day-of';
    return 'preparing';
  };

  const handleSave = () => {
    if (!eventName.trim() || !hostName.trim() || !date) return;

    const event: AttendingEvent = {
      id: uuidv4(),
      mode: 'attending',
      eventName: eventName.trim(),
      hostName: hostName.trim(),
      date,
      time: time || undefined,
      location: location.trim() || undefined,
      dressCode: dressCode.trim() || undefined,
      invitationType,
      formalityLevel,
      guestList,
      conversationPrep: { themes: [] },
      gift: null,
      outfit: null,
      debrief: null,
      thankYou: null,
      followUps: [],
      phase: getInitialPhase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAttendingEvent(event);
    navigate(`/attending/${event.id}`);
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate('/attending')}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; Attending
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          New Invitation
        </h1>
        <p className="font-body text-sm text-warm-gray italic mb-6">
          You&rsquo;ve been invited somewhere. Let&rsquo;s capture the details.
        </p>
        <div className="border-t border-rule mb-8" />

        <div className="space-y-6">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              placeholder="Friday Dinner at the Harringtons"
              className="font-display text-xl"
              autoFocus
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Host
            </label>
            <input
              type="text"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
              placeholder="Sarah and David Harrington"
              className="font-body"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="font-body"
              />
            </div>
            <div className="w-32">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="font-body"
              />
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Their home in Vevey"
              className="font-body"
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Dress Code
            </label>
            <input
              type="text"
              value={dressCode}
              onChange={e => setDressCode(e.target.value)}
              placeholder="Smart casual, festive, black tie..."
              className="font-body italic"
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
              How Were You Invited?
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(INVITATION_TYPE_LABELS) as InvitationType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInvitationType(type)}
                  className={`font-sans text-[11px] uppercase tracking-label px-4 py-2 border transition-all duration-300
                    ${invitationType === type
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-rule text-warm-gray hover:border-gold/40'
                    }
                  `}
                >
                  {INVITATION_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
              Formality
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FORMALITY_LABELS) as FormalityLevel[]).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormalityLevel(level)}
                  className={`font-sans text-[11px] uppercase tracking-label px-4 py-2 border transition-all duration-300
                    ${formalityLevel === level
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-rule text-warm-gray hover:border-gold/40'
                    }
                  `}
                >
                  {FORMALITY_LABELS[level]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Known Guests
            </label>

            {guestList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {guestList.map((guest, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 font-body text-sm text-ink border border-rule px-3 py-1.5"
                  >
                    {guest.name}
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
                placeholder="Who else is going?"
                className="flex-1 font-body"
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
        </div>

        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSave}
            disabled={!eventName.trim() || !hostName.trim() || !date}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400 disabled:opacity-30 disabled:cursor-default"
          >
            Save &amp; Start Preparing
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewAttending;
