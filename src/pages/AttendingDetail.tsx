import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  AttendingEvent,
  AttendingPhase,
  ConversationTheme,
  DebriefGuestNote,
  AttendingFollowUp,
  ThankYouMethod,
  ATTENDING_PHASE_LABELS,
  FORMALITY_LABELS,
  THANK_YOU_METHOD_LABELS,
} from '../types';
import { getAttendingEvent, saveAttendingEvent, deleteAttendingEvent } from '../store';
import PageTransition from '../components/PageTransition';

const PHASES: AttendingPhase[] = ['invited', 'preparing', 'day-of', 'debrief', 'follow-up', 'complete'];

const PhaseIndicator: React.FC<{ current: AttendingPhase; onSelect: (p: AttendingPhase) => void }> = ({ current, onSelect }) => {
  const currentIdx = PHASES.indexOf(current);
  return (
    <div className="flex flex-wrap items-center gap-2 mb-10">
      {PHASES.map((phase, i) => (
        <React.Fragment key={phase}>
          <button
            onClick={() => onSelect(phase)}
            className={`font-sans text-[10px] uppercase tracking-label transition-colors duration-300
              ${i === currentIdx ? 'text-gold' : i < currentIdx ? 'text-ink/60' : 'text-warm-gray/40'}
            `}
          >
            {ATTENDING_PHASE_LABELS[phase]}
          </button>
          {i < PHASES.length - 1 && (
            <span className="text-rule text-[10px]">&mdash;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-4">{title}</h3>
    {children}
  </div>
);

const AttendingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<AttendingEvent | null>(null);

  // Conversation prep
  const [newThemeTopic, setNewThemeTopic] = useState('');
  const [newThemeQuestion, setNewThemeQuestion] = useState('');

  // Gift
  const [giftDesc, setGiftDesc] = useState('');
  const [giftNotes, setGiftNotes] = useState('');

  // Outfit
  const [outfitDesc, setOutfitDesc] = useState('');
  const [outfitDesigner, setOutfitDesigner] = useState('');

  // Debrief
  const [overallImpression, setOverallImpression] = useState('');
  const [newDebriefName, setNewDebriefName] = useState('');
  const [conversationHighlights, setConversationHighlights] = useState('');
  const [hostNotes, setHostNotes] = useState('');

  // Thank you
  const [thankYouMethod, setThankYouMethod] = useState<ThankYouMethod>('text');
  const [thankYouContent, setThankYouContent] = useState('');

  // Follow-up
  const [newFollowUpName, setNewFollowUpName] = useState('');
  const [newFollowUpAction, setNewFollowUpAction] = useState('');

  useEffect(() => {
    if (id) {
      const e = getAttendingEvent(id);
      if (e) {
        setEvent(e);
        // Populate editable fields from existing data
        setGiftDesc(e.gift?.description || '');
        setGiftNotes(e.gift?.notes || '');
        setOutfitDesc(e.outfit?.description || '');
        setOutfitDesigner(e.outfit?.designer || '');
        setOverallImpression(e.debrief?.overallImpression || '');
        setConversationHighlights(e.debrief?.conversationHighlights || '');
        setHostNotes(e.debrief?.hostNotes || '');
        setThankYouMethod(e.thankYou?.method || 'text');
        setThankYouContent(e.thankYou?.content || '');
      }
    }
  }, [id]);

  if (!event) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">This invitation seems to be missing.</p>
          <Link to="/attending" className="inline-block mt-6 font-sans text-[11px] uppercase tracking-label text-gold">
            Return to Attending
          </Link>
        </div>
      </PageTransition>
    );
  }

  const save = (updates: Partial<AttendingEvent>) => {
    const updated = { ...event, ...updates };
    saveAttendingEvent(updated);
    setEvent(updated);
  };

  const advancePhase = () => {
    const idx = PHASES.indexOf(event.phase);
    if (idx < PHASES.length - 1) {
      save({ phase: PHASES[idx + 1] });
    }
  };

  const setPhase = (phase: AttendingPhase) => {
    save({ phase });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // --- Conversation Prep ---
  const addTheme = () => {
    if (!newThemeTopic.trim()) return;
    const theme: ConversationTheme = {
      topic: newThemeTopic.trim(),
      openingQuestion: newThemeQuestion.trim() || undefined,
    };
    const themes = [...event.conversationPrep.themes, theme];
    save({ conversationPrep: { ...event.conversationPrep, themes } });
    setNewThemeTopic('');
    setNewThemeQuestion('');
  };

  const removeTheme = (index: number) => {
    const themes = event.conversationPrep.themes.filter((_, i) => i !== index);
    save({ conversationPrep: { ...event.conversationPrep, themes } });
  };

  const saveMinefields = (minefields: string) => {
    save({ conversationPrep: { ...event.conversationPrep, minefields } });
  };

  // --- Gift ---
  const saveGift = () => {
    if (!giftDesc.trim()) {
      save({ gift: null });
    } else {
      save({ gift: { description: giftDesc.trim(), notes: giftNotes.trim() || undefined } });
    }
  };

  // --- Outfit ---
  const saveOutfit = () => {
    if (!outfitDesc.trim()) {
      save({ outfit: null });
    } else {
      save({ outfit: { description: outfitDesc.trim(), designer: outfitDesigner.trim() || undefined } });
    }
  };

  // --- Debrief ---
  const saveDebrief = () => {
    save({
      debrief: {
        overallImpression: overallImpression.trim() || undefined,
        guestNotes: event.debrief?.guestNotes || [],
        conversationHighlights: conversationHighlights.trim() || undefined,
        hostNotes: hostNotes.trim() || undefined,
      },
    });
  };

  const addDebriefGuest = () => {
    if (!newDebriefName.trim()) return;
    const note: DebriefGuestNote = { name: newDebriefName.trim() };
    const guestNotes = [...(event.debrief?.guestNotes || []), note];
    save({
      debrief: {
        overallImpression: overallImpression.trim() || undefined,
        guestNotes,
        conversationHighlights: conversationHighlights.trim() || undefined,
        hostNotes: hostNotes.trim() || undefined,
      },
    });
    setNewDebriefName('');
  };

  const updateDebriefGuest = (index: number, updates: Partial<DebriefGuestNote>) => {
    const guestNotes = [...(event.debrief?.guestNotes || [])];
    guestNotes[index] = { ...guestNotes[index], ...updates };
    save({
      debrief: {
        ...event.debrief,
        overallImpression: overallImpression.trim() || undefined,
        guestNotes,
        conversationHighlights: conversationHighlights.trim() || undefined,
        hostNotes: hostNotes.trim() || undefined,
      },
    });
  };

  // --- Thank You ---
  const saveThankYou = () => {
    save({
      thankYou: {
        method: thankYouMethod,
        sent: event.thankYou?.sent || false,
        sentDate: event.thankYou?.sentDate,
        content: thankYouContent.trim() || undefined,
      },
    });
  };

  const markThankYouSent = () => {
    save({
      thankYou: {
        method: thankYouMethod,
        sent: true,
        sentDate: new Date().toISOString().split('T')[0],
        content: thankYouContent.trim() || undefined,
      },
    });
  };

  // --- Follow-ups ---
  const addFollowUp = () => {
    if (!newFollowUpName.trim() || !newFollowUpAction.trim()) return;
    const followUp: AttendingFollowUp = {
      guestName: newFollowUpName.trim(),
      action: newFollowUpAction.trim(),
      completed: false,
    };
    save({ followUps: [...event.followUps, followUp] });
    setNewFollowUpName('');
    setNewFollowUpAction('');
  };

  const toggleFollowUp = (index: number) => {
    const followUps = [...event.followUps];
    followUps[index] = {
      ...followUps[index],
      completed: !followUps[index].completed,
      completedDate: !followUps[index].completed ? new Date().toISOString().split('T')[0] : undefined,
    };
    save({ followUps });
  };

  const removeFollowUp = (index: number) => {
    save({ followUps: event.followUps.filter((_, i) => i !== index) });
  };

  const handleDelete = () => {
    if (window.confirm('Remove this event from your ledger?')) {
      deleteAttendingEvent(event.id);
      navigate('/attending');
    }
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <Link
          to="/attending"
          className="inline-block font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8"
        >
          &larr; Attending
        </Link>

        {/* Header */}
        <div className="mb-4 flex items-baseline justify-between">
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
            {formatDate(event.date)}{event.time && <> &middot; {event.time}</>}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60">
            {FORMALITY_LABELS[event.formalityLevel]}
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          {event.eventName}
        </h1>
        <p className="font-body text-sm text-warm-gray italic mb-1">
          Hosted by {event.hostName}
          {event.location && <> &mdash; {event.location}</>}
        </p>
        {event.dressCode && (
          <p className="font-body text-xs text-warm-gray/60 italic">
            Dress code: {event.dressCode}
          </p>
        )}

        <div className="border-t border-rule mb-6 mt-6" />

        {/* Phase indicator */}
        <PhaseIndicator current={event.phase} onSelect={setPhase} />

        {/* Known guests */}
        {event.guestList.length > 0 && (
          <>
            <Section title="Known Guests">
              <div className="space-y-1">
                {event.guestList.map((g, i) => (
                  <p key={i} className="font-body text-sm text-ink">{g.name}</p>
                ))}
              </div>
            </Section>
            <div className="border-t border-rule mb-8" />
          </>
        )}

        {/* ═══ PREPARATION ═══ */}
        {(event.phase === 'preparing' || event.phase === 'day-of' || event.phase === 'invited') && (
          <>
            {/* Conversation Prep */}
            <Section title="Conversation Preparation">
              {event.conversationPrep.themes.length > 0 && (
                <div className="space-y-3 mb-6">
                  {event.conversationPrep.themes.map((theme, i) => (
                    <div key={i} className="border-l-2 border-gold/20 pl-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-body text-sm text-ink">{theme.topic}</p>
                          {theme.openingQuestion && (
                            <p className="font-body text-xs text-warm-gray italic mt-0.5">
                              &ldquo;{theme.openingQuestion}&rdquo;
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeTheme(i)}
                          className="font-sans text-[10px] text-warm-gray/40 hover:text-warm-gray transition-colors duration-300 ml-3"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  value={newThemeTopic}
                  onChange={e => setNewThemeTopic(e.target.value)}
                  placeholder="A conversation topic..."
                  className="font-body text-sm"
                />
                <input
                  type="text"
                  value={newThemeQuestion}
                  onChange={e => setNewThemeQuestion(e.target.value)}
                  placeholder="An opening question (optional)"
                  className="font-body text-sm italic"
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTheme(); } }}
                />
                <button
                  type="button"
                  onClick={addTheme}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  + Add Topic
                </button>
              </div>

              <div className="mt-4">
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60 block mb-2">
                  Minefields &mdash; topics to avoid
                </label>
                <input
                  type="text"
                  value={event.conversationPrep.minefields || ''}
                  onChange={e => saveMinefields(e.target.value)}
                  placeholder="Politics with the Harringtons, don't mention the divorce..."
                  className="font-body text-sm italic"
                />
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />

            {/* Gift */}
            <Section title="Hostess Gift">
              <div className="space-y-3">
                <input
                  type="text"
                  value={giftDesc}
                  onChange={e => setGiftDesc(e.target.value)}
                  onBlur={saveGift}
                  placeholder="What will you bring?"
                  className="font-body"
                />
                <input
                  type="text"
                  value={giftNotes}
                  onChange={e => setGiftNotes(e.target.value)}
                  onBlur={saveGift}
                  placeholder="Notes — why this gift, where from..."
                  className="font-body text-sm italic"
                />
                {event.formalityLevel === 'casual' && (
                  <p className="font-body text-xs text-warm-gray/40 italic">
                    Casual: wine, flowers, something homemade, seasonal item from your pantry
                  </p>
                )}
                {event.formalityLevel === 'semi-formal' && (
                  <p className="font-body text-xs text-warm-gray/40 italic">
                    Semi-formal: a nicer wine, quality chocolates, a book you loved
                  </p>
                )}
                {event.formalityLevel === 'formal' && (
                  <p className="font-body text-xs text-warm-gray/40 italic">
                    Formal: flowers sent in advance, a handwritten note with the gift
                  </p>
                )}
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />

            {/* Outfit */}
            <Section title="What I&rsquo;ll Wear">
              <div className="space-y-3">
                <input
                  type="text"
                  value={outfitDesc}
                  onChange={e => setOutfitDesc(e.target.value)}
                  onBlur={saveOutfit}
                  placeholder="Navy silk dress with the gold earrings"
                  className="font-body italic"
                />
                <input
                  type="text"
                  value={outfitDesigner}
                  onChange={e => setOutfitDesigner(e.target.value)}
                  onBlur={saveOutfit}
                  placeholder="Designer (optional)"
                  className="font-body text-sm"
                />
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />
          </>
        )}

        {/* ═══ DAY-OF PREP CARD ═══ */}
        {event.phase === 'day-of' && (
          <>
            <Section title="Your Prep Summary">
              <div className="border border-gold/20 p-5 space-y-4">
                {event.conversationPrep.themes.length > 0 && (
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Conversation Topics</span>
                    {event.conversationPrep.themes.map((t, i) => (
                      <p key={i} className="font-body text-sm text-ink">{t.topic}</p>
                    ))}
                  </div>
                )}
                {event.gift && (
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Gift</span>
                    <p className="font-body text-sm text-ink">{event.gift.description}</p>
                  </div>
                )}
                {event.outfit && (
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Wearing</span>
                    <p className="font-body text-sm text-ink italic">{event.outfit.description}</p>
                  </div>
                )}
                {event.conversationPrep.minefields && (
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Avoid</span>
                    <p className="font-body text-sm text-warm-gray italic">{event.conversationPrep.minefields}</p>
                  </div>
                )}
                {event.guestList.length > 0 && (
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Guests</span>
                    <p className="font-body text-sm text-ink">{event.guestList.map(g => g.name).join(', ')}</p>
                  </div>
                )}
              </div>
            </Section>
            <div className="border-t border-rule mb-8" />
          </>
        )}

        {/* ═══ DEBRIEF ═══ */}
        {(event.phase === 'debrief' || event.phase === 'follow-up' || event.phase === 'complete') && (
          <>
            <Section title="The Debrief">
              <div className="space-y-6">
                <div>
                  <label className="font-display text-lg text-ink font-light tracking-display block mb-3">
                    How was it?
                  </label>
                  <textarea
                    value={overallImpression}
                    onChange={e => setOverallImpression(e.target.value)}
                    onBlur={saveDebrief}
                    placeholder="Tell me about the evening..."
                    rows={4}
                    className="font-body italic"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
                    Who did you talk to?
                  </label>

                  {(event.debrief?.guestNotes || []).map((note, i) => (
                    <div key={i} className="border-l-2 border-gold/20 pl-3 mb-4">
                      <p className="font-body text-sm text-ink font-medium mb-2">{note.name}</p>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={note.whatILearned || ''}
                          onChange={e => updateDebriefGuest(i, { whatILearned: e.target.value })}
                          placeholder="What did you learn about them?"
                          className="font-body text-sm italic"
                        />
                        <input
                          type="text"
                          value={note.followUpNeeded || ''}
                          onChange={e => updateDebriefGuest(i, { followUpNeeded: e.target.value })}
                          placeholder="Any follow-up needed?"
                          className="font-body text-sm italic"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newDebriefName}
                      onChange={e => setNewDebriefName(e.target.value)}
                      placeholder="Add someone you talked to..."
                      className="flex-1 font-body text-sm"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDebriefGuest(); } }}
                    />
                    <button
                      type="button"
                      onClick={addDebriefGuest}
                      className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                    Conversation Highlights
                  </label>
                  <textarea
                    value={conversationHighlights}
                    onChange={e => setConversationHighlights(e.target.value)}
                    onBlur={saveDebrief}
                    placeholder="What topics worked well at this gathering?"
                    rows={2}
                    className="font-body text-sm italic"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                    Notes for Next Time with This Host
                  </label>
                  <textarea
                    value={hostNotes}
                    onChange={e => setHostNotes(e.target.value)}
                    onBlur={saveDebrief}
                    placeholder="They serve late, parking is tricky, the house is cold..."
                    rows={2}
                    className="font-body text-sm italic"
                  />
                </div>
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />
          </>
        )}

        {/* ═══ FOLLOW-UP ═══ */}
        {(event.phase === 'follow-up' || event.phase === 'debrief' || event.phase === 'complete') && (
          <>
            {/* Thank You */}
            <Section title="Thank-You Note">
              <div className="space-y-4">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60 block mb-2">
                    Method
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(THANK_YOU_METHOD_LABELS) as ThankYouMethod[]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => { setThankYouMethod(method); setTimeout(saveThankYou, 0); }}
                        className={`font-sans text-[11px] uppercase tracking-label px-3 py-1.5 border transition-all duration-300
                          ${thankYouMethod === method
                            ? 'border-gold text-gold bg-gold/5'
                            : 'border-rule text-warm-gray hover:border-gold/40'
                          }
                        `}
                      >
                        {THANK_YOU_METHOD_LABELS[method]}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={thankYouContent}
                  onChange={e => setThankYouContent(e.target.value)}
                  onBlur={saveThankYou}
                  placeholder={`Thank you so much for ${event.eventName.toLowerCase().includes('dinner') ? 'Friday evening' : 'the lovely evening'}. The...`}
                  rows={3}
                  className="font-body text-sm italic"
                />

                {event.thankYou?.sent ? (
                  <p className="font-body text-sm text-gold italic">
                    Sent on {event.thankYou.sentDate && new Date(event.thankYou.sentDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                  </p>
                ) : (
                  <button
                    onClick={markThankYouSent}
                    className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                  >
                    Mark as Sent
                  </button>
                )}
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />

            {/* Follow-ups */}
            <Section title="Follow-Ups">
              {event.followUps.length > 0 && (
                <div className="space-y-3 mb-6">
                  {event.followUps.map((fu, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <button
                        onClick={() => toggleFollowUp(i)}
                        className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-300
                          ${fu.completed ? 'border-gold bg-gold/10' : 'border-rule'}
                        `}
                      >
                        {fu.completed && <span className="text-gold text-[10px]">&#10003;</span>}
                      </button>
                      <div className="flex-1">
                        <p className={`font-body text-sm ${fu.completed ? 'text-warm-gray/50 line-through' : 'text-ink'}`}>
                          {fu.action}
                        </p>
                        <p className="font-body text-xs text-warm-gray/50 italic">{fu.guestName}</p>
                      </div>
                      <button
                        onClick={() => removeFollowUp(i)}
                        className="font-sans text-[10px] text-warm-gray/30 hover:text-warm-gray transition-colors duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFollowUpName}
                    onChange={e => setNewFollowUpName(e.target.value)}
                    placeholder="For whom?"
                    className="w-1/3 font-body text-sm"
                  />
                  <input
                    type="text"
                    value={newFollowUpAction}
                    onChange={e => setNewFollowUpAction(e.target.value)}
                    placeholder="Send the recipe, check in about..."
                    className="flex-1 font-body text-sm"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFollowUp(); } }}
                  />
                </div>
                <button
                  type="button"
                  onClick={addFollowUp}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
                >
                  + Add Follow-Up
                </button>
              </div>
            </Section>

            <div className="border-t border-rule mb-8" />
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-6">
            {event.phase !== 'complete' && (
              <button
                onClick={advancePhase}
                className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-6 py-2.5 hover:bg-gold/5 transition-all duration-400"
              >
                {event.phase === 'follow-up' ? 'Mark Complete' : `Move to ${ATTENDING_PHASE_LABELS[PHASES[PHASES.indexOf(event.phase) + 1]]}`}
              </button>
            )}
            {event.phase === 'complete' && (
              <span className="font-body text-sm text-warm-gray/50 italic">
                Complete &mdash; the evening lives in your ledger.
              </span>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="font-sans text-[10px] uppercase tracking-label text-warm-gray/30 hover:text-warm-gray transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AttendingDetail;
