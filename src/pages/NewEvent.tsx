import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Event, Guest, Course, Wine, TimelineEntry, OCCASION_LABELS, COURSE_TYPES, COURSE_LABELS } from '../types';
import { saveEvent, getGuests, saveGuest, getGuestGatheringHistory } from '../store';
import PageTransition from '../components/PageTransition';

type Step = 'occasion' | 'guests' | 'menu' | 'atmosphere' | 'timeline' | 'review';

const STEPS: { key: Step; label: string }[] = [
  { key: 'occasion', label: 'The Occasion' },
  { key: 'guests', label: 'The Guests' },
  { key: 'menu', label: 'The Menu' },
  { key: 'atmosphere', label: 'The Atmosphere' },
  { key: 'timeline', label: 'The Timeline' },
  { key: 'review', label: 'Review' },
];

const GuestIntelligence: React.FC<{ guest: Guest; isGuestOfHonor: boolean }> = ({ guest, isGuestOfHonor }) => {
  const [expanded, setExpanded] = useState(false);
  const history = getGuestGatheringHistory(guest.id);

  if (history.length === 0 && !guest.dietary && !guest.preferences) return null;

  const lastEvent = history[0];
  const previouslyServed = lastEvent?.menu.courses.map(c => c.dish).join(', ');
  const previousWines = lastEvent?.menu.wines.map(w => w.name).join(', ');

  return (
    <div
      className="mt-2 ml-0 border-l-2 border-gold/20 pl-3 transition-all duration-400"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="font-body text-xs text-warm-gray/60 italic hover:text-warm-gray transition-colors duration-300"
      >
        {expanded ? 'Hide details' : 'View history & notes'}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5 animate-fade-in">
          {lastEvent && (
            <>
              <p className="font-body text-xs text-warm-gray italic">
                Last gathering: {lastEvent.title} ({new Date(lastEvent.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })})
              </p>
              {previouslyServed && (
                <p className="font-body text-xs text-warm-gray/70 italic">
                  Previously served: {previouslyServed}
                </p>
              )}
              {previousWines && (
                <p className="font-body text-xs text-warm-gray/70 italic">
                  Wines: {previousWines}
                </p>
              )}
              {lastEvent.seatingNotes && (
                <p className="font-body text-xs text-warm-gray/70 italic">
                  Seating: {lastEvent.seatingNotes}
                </p>
              )}
            </>
          )}
          {guest.dietary && (
            <p className="font-body text-xs text-warm-gray italic">
              Note: {guest.dietary}
            </p>
          )}
          {guest.preferences && (
            <p className="font-body text-xs text-warm-gray/70 italic">
              Preferences: {guest.preferences}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const NewEvent: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('occasion');

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [occasion, setOccasion] = useState<Event['occasion']>('dinner');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<Event['status']>('planning');

  // Guests
  const [existingGuests, setExistingGuests] = useState<Guest[]>([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
  const [guestOfHonorId, setGuestOfHonorId] = useState<string>('');
  const [newGuestName, setNewGuestName] = useState('');

  // Menu
  const [courses, setCourses] = useState<Course[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [menuNotes, setMenuNotes] = useState('');
  const [newCourseType, setNewCourseType] = useState<Course['type']>('starter');
  const [newCourseDish, setNewCourseDish] = useState('');
  const [newCourseNotes, setNewCourseNotes] = useState('');
  const [newWineName, setNewWineName] = useState('');
  const [newWineCourse, setNewWineCourse] = useState('');
  const [newWineNotes, setNewWineNotes] = useState('');

  // Atmosphere
  const [tableSettings, setTableSettings] = useState('');
  const [flowers, setFlowers] = useState('');
  const [lighting, setLighting] = useState('');
  const [music, setMusic] = useState('');
  const [scent, setScent] = useState('');

  // Timeline
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');

  // Seating
  const [seatingNotes, setSeatingNotes] = useState('');

  useEffect(() => {
    setExistingGuests(getGuests().sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setCurrentStep(next.key);
  };

  const goPrev = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setCurrentStep(prev.key);
  };

  const toggleGuest = (id: string) => {
    setSelectedGuestIds(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const addNewGuest = () => {
    if (!newGuestName.trim()) return;
    const guest: Guest = {
      id: uuidv4(),
      name: newGuestName.trim(),
      relationship: '',
      dietary: '',
      preferences: '',
      personalNotes: '',
      conversationTopics: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveGuest(guest);
    setExistingGuests(prev => [...prev, guest].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedGuestIds(prev => [...prev, guest.id]);
    setNewGuestName('');
  };

  const addCourse = () => {
    if (!newCourseDish.trim()) return;
    setCourses(prev => [...prev, { type: newCourseType, dish: newCourseDish.trim(), notes: newCourseNotes.trim() }]);
    setNewCourseDish('');
    setNewCourseNotes('');
  };

  const removeCourse = (index: number) => {
    setCourses(prev => prev.filter((_, i) => i !== index));
  };

  const addWine = () => {
    if (!newWineName.trim()) return;
    setWines(prev => [...prev, { course: newWineCourse.trim(), name: newWineName.trim(), notes: newWineNotes.trim() }]);
    setNewWineName('');
    setNewWineCourse('');
    setNewWineNotes('');
  };

  const removeWine = (index: number) => {
    setWines(prev => prev.filter((_, i) => i !== index));
  };

  const addTimelineEntry = () => {
    if (!newTime.trim() || !newActivity.trim()) return;
    setTimeline(prev => [...prev, { time: newTime.trim(), activity: newActivity.trim() }]);
    setNewTime('');
    setNewActivity('');
  };

  const removeTimelineEntry = (index: number) => {
    setTimeline(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const event: Event = {
      id: uuidv4(),
      date,
      title,
      occasion,
      location,
      guestIds: selectedGuestIds,
      guestOfHonorId: guestOfHonorId || undefined,
      menu: { courses, wines, notes: menuNotes },
      atmosphere: { tableSettings, flowers, lighting, music, scent },
      seatingNotes,
      plannedTimeline: timeline,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveEvent(event);
    navigate(`/event/${event.id}`);
  };

  const selectedGuests = existingGuests.filter(g => selectedGuestIds.includes(g.id));

  const StepIndicator = () => (
    <div className="flex flex-wrap items-center gap-2 mb-10">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <button
            onClick={() => setCurrentStep(step.key)}
            className={`font-sans text-[10px] uppercase tracking-label transition-colors duration-300
              ${i === stepIndex ? 'text-gold' : i < stepIndex ? 'text-ink/60' : 'text-warm-gray/40'}
            `}
          >
            {step.label}
          </button>
          {i < STEPS.length - 1 && (
            <span className="text-rule text-[10px]">&mdash;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const NavigationButtons = () => (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-rule">
      {stepIndex > 0 ? (
        <button
          onClick={goPrev}
          className="font-sans text-[11px] uppercase tracking-label text-warm-gray hover:text-ink transition-colors duration-300"
        >
          &larr; Back
        </button>
      ) : (
        <div />
      )}
      {currentStep === 'review' ? (
        <button
          onClick={handleSave}
          disabled={!title.trim() || !date}
          className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400 disabled:opacity-30 disabled:cursor-default"
        >
          Save to Ledger
        </button>
      ) : (
        <button
          onClick={goNext}
          className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
        >
          Continue &rarr;
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate('/')}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; Library
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          New Gathering
        </h1>
        <div className="border-t border-rule mb-8 mt-6" />

        <StepIndicator />

        {/* Step: The Occasion */}
        {currentStep === 'occasion' && (
          <div className="space-y-6">
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="A Spring Evening in Montreux"
                className="font-display text-xl"
              />
            </div>

            <div>
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

            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(OCCASION_LABELS) as Event['occasion'][]).map(occ => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`font-sans text-[11px] uppercase tracking-label px-4 py-2 border transition-all duration-300
                      ${occasion === occ
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-rule text-warm-gray hover:border-gold/40'
                      }
                    `}
                  >
                    {OCCASION_LABELS[occ]}
                  </button>
                ))}
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
                placeholder="Villa Pierrefeu, Lake Geneva Terrace"
              />
            </div>

            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {(['planning', 'upcoming', 'completed'] as Event['status'][]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`font-sans text-[11px] uppercase tracking-label px-4 py-2 border transition-all duration-300
                      ${status === s
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-rule text-warm-gray hover:border-gold/40'
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: The Guests */}
        {currentStep === 'guests' && (
          <div className="space-y-6">
            {existingGuests.length > 0 && (
              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
                  Select Guests
                </label>
                <div className="space-y-0">
                  {existingGuests.map(guest => {
                    const isSelected = selectedGuestIds.includes(guest.id);
                    return (
                      <div key={guest.id} className="border-b border-rule">
                        <button
                          type="button"
                          onClick={() => toggleGuest(guest.id)}
                          className={`w-full text-left py-3 transition-all duration-300
                            ${isSelected ? 'text-ink' : 'text-warm-gray/60'}
                          `}
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="font-body">{guest.name}</span>
                            <div className="flex items-center gap-2">
                              {guest.id === guestOfHonorId && (
                                <span className="font-sans text-[9px] uppercase tracking-label text-gold">
                                  Guest of Honour
                                </span>
                              )}
                              {isSelected && (
                                <span className="font-sans text-[9px] uppercase tracking-label text-gold">
                                  Selected
                                </span>
                              )}
                            </div>
                          </div>
                          {guest.relationship && isSelected && (
                            <span className="font-body text-xs text-warm-gray/50 italic">{guest.relationship}</span>
                          )}
                        </button>
                        {isSelected && (
                          <GuestIntelligence guest={guest} isGuestOfHonor={guest.id === guestOfHonorId} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Add New Guest
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={e => setNewGuestName(e.target.value)}
                  placeholder="Name"
                  className="flex-1"
                  onKeyDown={e => e.key === 'Enter' && addNewGuest()}
                />
                <button
                  type="button"
                  onClick={addNewGuest}
                  className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300 shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {selectedGuests.length > 0 && (
              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                  Guest of Honour
                </label>
                <select
                  value={guestOfHonorId}
                  onChange={e => setGuestOfHonorId(e.target.value)}
                  className="font-body"
                >
                  <option value="">None</option>
                  {selectedGuests.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Seating Notes
              </label>
              <textarea
                value={seatingNotes}
                onChange={e => setSeatingNotes(e.target.value)}
                placeholder="Notes on seating arrangements..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step: The Menu */}
        {currentStep === 'menu' && (
          <div className="space-y-6">
            {courses.length > 0 && (
              <div className="space-y-3">
                {courses.map((course, i) => (
                  <div key={i} className="flex items-start justify-between border-b border-rule pb-3">
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/70">
                        {COURSE_LABELS[course.type]}
                      </span>
                      <p className="font-display text-lg text-ink font-light">{course.dish}</p>
                      {course.notes && <p className="font-body text-sm text-warm-gray italic">{course.notes}</p>}
                    </div>
                    <button
                      onClick={() => removeCourse(i)}
                      className="font-sans text-[10px] text-warm-gray/40 hover:text-warm-gray transition-colors duration-300 ml-3 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block">
                Add Course
              </label>
              <select
                value={newCourseType}
                onChange={e => setNewCourseType(e.target.value as Course['type'])}
                className="font-body"
              >
                {COURSE_TYPES.map(ct => (
                  <option key={ct} value={ct}>{COURSE_LABELS[ct]}</option>
                ))}
              </select>
              <input
                type="text"
                value={newCourseDish}
                onChange={e => setNewCourseDish(e.target.value)}
                placeholder="Dish name"
                className="font-display text-lg"
              />
              <input
                type="text"
                value={newCourseNotes}
                onChange={e => setNewCourseNotes(e.target.value)}
                placeholder="Notes (optional)"
              />
              <button
                type="button"
                onClick={addCourse}
                className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                + Add Course
              </button>
            </div>

            <div className="border-t border-rule pt-6 mt-6 space-y-3">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block">
                Wines
              </label>
              {wines.length > 0 && (
                <div className="space-y-2 mb-4">
                  {wines.map((wine, i) => (
                    <div key={i} className="flex items-baseline justify-between border-b border-rule pb-2">
                      <div>
                        <span className="font-body text-ink">{wine.name}</span>
                        {wine.course && (
                          <span className="font-body text-sm text-warm-gray italic ml-2">with {wine.course}</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeWine(i)}
                        className="font-sans text-[10px] text-warm-gray/40 hover:text-warm-gray transition-colors duration-300 ml-3"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={newWineName}
                onChange={e => setNewWineName(e.target.value)}
                placeholder="Wine name"
              />
              <input
                type="text"
                value={newWineCourse}
                onChange={e => setNewWineCourse(e.target.value)}
                placeholder="Paired with (e.g. Fish, Main)"
              />
              <input
                type="text"
                value={newWineNotes}
                onChange={e => setNewWineNotes(e.target.value)}
                placeholder="Notes (optional)"
              />
              <button
                type="button"
                onClick={addWine}
                className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                + Add Wine
              </button>
            </div>

            <div className="border-t border-rule pt-6 mt-6">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Menu Notes
              </label>
              <textarea
                value={menuNotes}
                onChange={e => setMenuNotes(e.target.value)}
                placeholder="General notes about the menu..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step: The Atmosphere */}
        {currentStep === 'atmosphere' && (
          <div className="space-y-6">
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Table Settings
              </label>
              <textarea
                value={tableSettings}
                onChange={e => setTableSettings(e.target.value)}
                placeholder="Linens, china, crystal, silver..."
                rows={2}
              />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Flowers
              </label>
              <input
                type="text"
                value={flowers}
                onChange={e => setFlowers(e.target.value)}
                placeholder="White peonies and trailing ivy"
              />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Lighting
              </label>
              <input
                type="text"
                value={lighting}
                onChange={e => setLighting(e.target.value)}
                placeholder="Beeswax candles, dimmed overhead"
              />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Music
              </label>
              <input
                type="text"
                value={music}
                onChange={e => setMusic(e.target.value)}
                placeholder="Debussy on low"
              />
            </div>
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Scent
              </label>
              <input
                type="text"
                value={scent}
                onChange={e => setScent(e.target.value)}
                placeholder="Diptyque Figuier, or let the flowers speak"
              />
            </div>
          </div>
        )}

        {/* Step: The Timeline */}
        {currentStep === 'timeline' && (
          <div className="space-y-6">
            {timeline.length > 0 && (
              <div className="space-y-2">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-rule pb-2">
                    <span className="font-sans text-sm text-warm-gray w-14 shrink-0">{entry.time}</span>
                    <span className="font-body text-ink text-sm flex-1">{entry.activity}</span>
                    <button
                      onClick={() => removeTimelineEntry(i)}
                      className="font-sans text-[10px] text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block">
                Add Entry
              </label>
              <div className="flex gap-3">
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-28 font-sans"
                />
                <input
                  type="text"
                  value={newActivity}
                  onChange={e => setNewActivity(e.target.value)}
                  placeholder="Aperitifs on the terrace"
                  className="flex-1"
                  onKeyDown={e => e.key === 'Enter' && addTimelineEntry()}
                />
              </div>
              <button
                type="button"
                onClick={addTimelineEntry}
                className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                + Add to Timeline
              </button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Title</span>
              <p className="font-display text-xl text-ink font-light">{title || <span className="text-warm-gray/40 italic">Untitled</span>}</p>
            </div>

            <div className="flex gap-8">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Date</span>
                <p className="font-body text-ink text-sm">{date || '\u2014'}</p>
              </div>
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Occasion</span>
                <p className="font-body text-ink text-sm">{OCCASION_LABELS[occasion]}</p>
              </div>
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Status</span>
                <p className="font-body text-ink text-sm capitalize">{status}</p>
              </div>
            </div>

            {location && (
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Location</span>
                <p className="font-body text-ink text-sm italic">{location}</p>
              </div>
            )}

            {selectedGuests.length > 0 && (
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">
                  {selectedGuests.length} Guest{selectedGuests.length !== 1 ? 's' : ''}
                </span>
                <p className="font-body text-ink text-sm">
                  {selectedGuests.map(g => g.name).join(', ')}
                </p>
              </div>
            )}

            {courses.length > 0 && (
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Menu</span>
                <p className="font-body text-ink text-sm">
                  {courses.map(c => c.dish).join(' \u00b7 ')}
                </p>
              </div>
            )}

            {wines.length > 0 && (
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Wines</span>
                <p className="font-body text-ink text-sm">
                  {wines.map(w => w.name).join(', ')}
                </p>
              </div>
            )}

            {timeline.length > 0 && (
              <div>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-1">Timeline</span>
                <p className="font-body text-ink text-sm">
                  {timeline.length} planned moment{timeline.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        <NavigationButtons />
      </div>
    </PageTransition>
  );
};

export default NewEvent;
