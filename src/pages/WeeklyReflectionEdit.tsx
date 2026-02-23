import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  WeeklyReflection,
  ReflectionEntry,
  DidntMakeEntry,
  RecipeBoxEntry,
  KitchenNote,
  ALL_REFLECTION_TAGS,
} from '../types';
import { getReflection, getReflectionByMenuId, getMenu, getMonday, saveReflection } from '../store';
import PageTransition from '../components/PageTransition';

const TagPicker: React.FC<{
  selected: string[];
  onChange: (tags: string[]) => void;
}> = ({ selected, onChange }) => {
  const [showAll, setShowAll] = useState(false);
  const [custom, setCustom] = useState('');

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const addCustom = () => {
    const t = custom.trim().toUpperCase();
    if (t && !selected.includes(t)) {
      onChange([...selected, t]);
      setCustom('');
    }
  };

  const displayTags = showAll ? ALL_REFLECTION_TAGS : ALL_REFLECTION_TAGS.slice(0, 8);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {displayTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`font-sans text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 border transition-all duration-200
              ${selected.includes(tag)
                ? 'border-gold text-gold bg-gold/5'
                : 'border-rule text-warm-gray/50 hover:border-gold/40'
              }
            `}
          >
            {tag}
          </button>
        ))}
        {!showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="font-sans text-[9px] uppercase tracking-label text-warm-gray/40 px-2.5 py-1 hover:text-warm-gray transition-colors"
          >
            more...
          </button>
        )}
      </div>
      {/* Show custom tags already selected but not in default list */}
      {selected.filter(t => !ALL_REFLECTION_TAGS.includes(t)).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {selected.filter(t => !ALL_REFLECTION_TAGS.includes(t)).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="font-sans text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 border border-gold text-gold bg-gold/5"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="Custom tag..."
          className="font-sans text-[10px] uppercase tracking-label flex-1"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
        />
        {custom.trim() && (
          <button
            type="button"
            onClick={addCustom}
            className="font-sans text-[9px] uppercase tracking-label text-gold"
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-6 mt-10">
    <div className="flex-1 border-t border-rule" />
    <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/60 shrink-0">
      {children}
    </span>
    <div className="flex-1 border-t border-rule" />
  </div>
);

const WeeklyReflectionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  // Core state
  const [reflectionId, setReflectionId] = useState('');
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [linkedMenuId, setLinkedMenuId] = useState<string | undefined>();
  const [rawInput, setRawInput] = useState('');

  // Sections
  const [whatLanded, setWhatLanded] = useState<ReflectionEntry[]>([]);
  const [whatILearned, setWhatILearned] = useState<ReflectionEntry[]>([]);
  const [didntMake, setDidntMake] = useState<DidntMakeEntry[]>([]);
  const [ideasSparked, setIdeasSparked] = useState<ReflectionEntry[]>([]);
  const [recipeBox, setRecipeBox] = useState<RecipeBoxEntry[]>([]);
  const [patternInsight, setPatternInsight] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState<KitchenNote[]>([]);
  const [makeNextWeek, setMakeNextWeek] = useState<string[]>([]);
  const [futureProjects, setFutureProjects] = useState<string[]>([]);

  // Temp add fields
  const [newMakeItem, setNewMakeItem] = useState('');
  const [newFutureItem, setNewFutureItem] = useState('');

  useEffect(() => {
    if (isNew) {
      // Check if linked from a menu via query param
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const menuId = params.get('menu');

      if (menuId) {
        // Check if a reflection already exists for this menu
        const existing = getReflectionByMenuId(menuId);
        if (existing) {
          navigate(`/reflection/${existing.id}/edit`, { replace: true });
          return;
        }
        const menu = getMenu(menuId);
        if (menu) {
          setLinkedMenuId(menuId);
          setWeekStartDate(menu.weekStartDate);
          setWeekEndDate(menu.weekEndDate);
        }
      }

      if (!weekStartDate) {
        const monday = getMonday(new Date());
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        setWeekStartDate(monday.toISOString().split('T')[0]);
        setWeekEndDate(sunday.toISOString().split('T')[0]);
      }

      setReflectionId(uuidv4());
    } else if (id) {
      const existing = getReflection(id);
      if (existing) {
        setReflectionId(existing.id);
        setWeekStartDate(existing.weekStartDate);
        setWeekEndDate(existing.weekEndDate);
        setLinkedMenuId(existing.linkedMenuId);
        setRawInput(existing.rawInput || '');
        setWhatLanded(existing.whatLanded);
        setWhatILearned(existing.whatILearned);
        setDidntMake(existing.didntMake);
        setIdeasSparked(existing.ideasSparked);
        setRecipeBox(existing.recipeBox);
        setPatternInsight(existing.patternInsight);
        setKitchenNotes(existing.kitchenNotes);
        setMakeNextWeek(existing.carryForward.makeNextWeek);
        setFutureProjects(existing.carryForward.futureProjects);
      }
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatWeekLabel = () => {
    if (!weekStartDate) return 'This Week';
    const start = new Date(weekStartDate + 'T00:00:00');
    return `Week of ${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  // --- Entry helpers ---

  const addReflectionEntry = (
    list: ReflectionEntry[],
    setList: React.Dispatch<React.SetStateAction<ReflectionEntry[]>>
  ) => {
    setList([...list, { title: '', description: '', tags: [] }]);
  };

  const updateReflectionEntry = (
    list: ReflectionEntry[],
    setList: React.Dispatch<React.SetStateAction<ReflectionEntry[]>>,
    index: number,
    field: keyof ReflectionEntry,
    value: string | string[]
  ) => {
    const updated = [...list];
    const entry = { ...updated[index] };
    if (field === 'tags') {
      entry.tags = value as string[];
    } else {
      entry[field] = value as string;
    }
    updated[index] = entry;
    setList(updated);
  };

  const removeReflectionEntry = (
    list: ReflectionEntry[],
    setList: React.Dispatch<React.SetStateAction<ReflectionEntry[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const reflection: WeeklyReflection = {
      id: reflectionId,
      weekStartDate,
      weekEndDate,
      linkedMenuId,
      whatLanded: whatLanded.filter(e => e.title.trim()),
      whatILearned: whatILearned.filter(e => e.title.trim()),
      didntMake: didntMake.filter(e => e.title.trim()),
      ideasSparked: ideasSparked.filter(e => e.title.trim()),
      recipeBox: recipeBox.filter(e => e.title.trim()),
      patternInsight,
      kitchenNotes: kitchenNotes.filter(e => e.item.trim()),
      carryForward: {
        makeNextWeek: makeNextWeek.filter(s => s.trim()),
        futureProjects: futureProjects.filter(s => s.trim()),
      },
      sourceType: 'text',
      rawInput: rawInput || undefined,
      createdAt: isNew ? new Date().toISOString() : (getReflection(reflectionId)?.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString(),
    };

    saveReflection(reflection);
    navigate(`/reflection/${reflection.id}`);
  };

  // Auto-populate carry forward from didntMake
  useEffect(() => {
    const carryItems = didntMake.filter(d => d.carryForward && d.title.trim()).map(d => d.title.trim());
    const existing = makeNextWeek.filter(m => !didntMake.some(d => d.title.trim() === m));
    const merged = Array.from(new Set([...existing, ...carryItems]));
    if (JSON.stringify(merged) !== JSON.stringify(makeNextWeek)) {
      setMakeNextWeek(merged);
    }
  }, [didntMake]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate(isNew ? '/menu' : `/reflection/${reflectionId}`)}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; {isNew ? 'House Menu' : 'View Reflection'}
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          {isNew ? 'Kitchen Reflection' : 'Edit Reflection'}
        </h1>
        <p className="font-body text-sm text-warm-gray italic mb-2">
          {formatWeekLabel()}
        </p>
        <p className="font-body text-xs text-warm-gray/50 italic mb-6">
          Talk through your week. What worked, what didn&rsquo;t, what you learned.
        </p>
        <div className="border-t border-rule mb-6" />

        {/* Quick Notes — raw input */}
        <div className="mb-8">
          <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
            Quick Notes
          </label>
          <p className="font-body text-xs text-warm-gray/50 italic mb-3">
            Dump your thoughts here first &mdash; voice note transcript, quick text, whatever comes to mind.
          </p>
          <textarea
            value={rawInput}
            onChange={e => setRawInput(e.target.value)}
            placeholder="The lamb chili was amazing, I shared it with Bill. The king cake was a disaster though..."
            className="font-body text-sm w-full min-h-[100px]"
          />
        </div>

        {/* WHAT LANDED */}
        <SectionLabel>What Landed</SectionLabel>
        <div className="space-y-6">
          {whatLanded.map((entry, i) => (
            <div key={i} className="border-l-2 border-gold/30 pl-4">
              <div className="flex items-start justify-between gap-2">
                <input
                  type="text"
                  value={entry.title}
                  onChange={e => updateReflectionEntry(whatLanded, setWhatLanded, i, 'title', e.target.value)}
                  placeholder="Dish or technique name"
                  className="font-display text-lg font-light flex-1"
                />
                <button
                  onClick={() => removeReflectionEntry(whatLanded, setWhatLanded, i)}
                  className="text-warm-gray/30 hover:text-warm-gray text-xs mt-2"
                >
                  &times;
                </button>
              </div>
              <textarea
                value={entry.description}
                onChange={e => updateReflectionEntry(whatLanded, setWhatLanded, i, 'description', e.target.value)}
                placeholder="What happened, what made it good..."
                className="font-body text-sm w-full mt-2 min-h-[60px]"
              />
              <div className="mt-2">
                <TagPicker
                  selected={entry.tags}
                  onChange={tags => updateReflectionEntry(whatLanded, setWhatLanded, i, 'tags', tags)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addReflectionEntry(whatLanded, setWhatLanded)}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Entry
          </button>
        </div>

        {/* WHAT I LEARNED */}
        <SectionLabel>What I Learned</SectionLabel>
        <div className="space-y-6">
          {whatILearned.map((entry, i) => (
            <div key={i} className="border-l-2 border-gold/30 pl-4">
              <div className="flex items-start justify-between gap-2">
                <input
                  type="text"
                  value={entry.title}
                  onChange={e => updateReflectionEntry(whatILearned, setWhatILearned, i, 'title', e.target.value)}
                  placeholder="Lesson or discovery"
                  className="font-display text-lg font-light flex-1"
                />
                <button
                  onClick={() => removeReflectionEntry(whatILearned, setWhatILearned, i)}
                  className="text-warm-gray/30 hover:text-warm-gray text-xs mt-2"
                >
                  &times;
                </button>
              </div>
              <textarea
                value={entry.description}
                onChange={e => updateReflectionEntry(whatILearned, setWhatILearned, i, 'description', e.target.value)}
                placeholder="What went wrong, what was discovered..."
                className="font-body text-sm w-full mt-2 min-h-[60px]"
              />
              <div className="mt-2">
                <TagPicker
                  selected={entry.tags}
                  onChange={tags => updateReflectionEntry(whatILearned, setWhatILearned, i, 'tags', tags)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addReflectionEntry(whatILearned, setWhatILearned)}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Entry
          </button>
        </div>

        {/* DIDN'T MAKE */}
        <SectionLabel>Didn&rsquo;t Make</SectionLabel>
        <div className="space-y-4">
          {didntMake.map((entry, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={entry.title}
                  onChange={e => {
                    const updated = [...didntMake];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setDidntMake(updated);
                  }}
                  placeholder="Dish that didn't happen"
                  className="font-body text-sm w-full"
                />
                <input
                  type="text"
                  value={entry.description || ''}
                  onChange={e => {
                    const updated = [...didntMake];
                    updated[i] = { ...updated[i], description: e.target.value };
                    setDidntMake(updated);
                  }}
                  placeholder="Brief note (optional)"
                  className="font-body text-xs text-warm-gray/60 w-full mt-1"
                />
              </div>
              <label className="flex items-center gap-1.5 shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={entry.carryForward}
                  onChange={e => {
                    const updated = [...didntMake];
                    updated[i] = { ...updated[i], carryForward: e.target.checked };
                    setDidntMake(updated);
                  }}
                  className="accent-gold"
                />
                <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50">Carry forward</span>
              </label>
              <button
                onClick={() => setDidntMake(didntMake.filter((_, idx) => idx !== i))}
                className="text-warm-gray/30 hover:text-warm-gray text-xs mt-1"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDidntMake([...didntMake, { title: '', carryForward: true }])}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Entry
          </button>
        </div>

        {/* IDEAS SPARKED */}
        <SectionLabel>Ideas Sparked</SectionLabel>
        <div className="space-y-6">
          {ideasSparked.map((entry, i) => (
            <div key={i} className="border-l-2 border-gold/30 pl-4">
              <div className="flex items-start justify-between gap-2">
                <input
                  type="text"
                  value={entry.title}
                  onChange={e => updateReflectionEntry(ideasSparked, setIdeasSparked, i, 'title', e.target.value)}
                  placeholder="New idea or creative riff"
                  className="font-display text-lg font-light flex-1"
                />
                <button
                  onClick={() => removeReflectionEntry(ideasSparked, setIdeasSparked, i)}
                  className="text-warm-gray/30 hover:text-warm-gray text-xs mt-2"
                >
                  &times;
                </button>
              </div>
              <textarea
                value={entry.description}
                onChange={e => updateReflectionEntry(ideasSparked, setIdeasSparked, i, 'description', e.target.value)}
                placeholder="The spark, what could be done..."
                className="font-body text-sm w-full mt-2 min-h-[60px]"
              />
              <div className="mt-2">
                <TagPicker
                  selected={entry.tags}
                  onChange={tags => updateReflectionEntry(ideasSparked, setIdeasSparked, i, 'tags', tags)}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addReflectionEntry(ideasSparked, setIdeasSparked)}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Entry
          </button>
        </div>

        {/* RECIPE BOX */}
        <SectionLabel>Added to the Recipe Box</SectionLabel>
        <div className="space-y-6">
          {recipeBox.map((entry, i) => (
            <div key={i} className="border border-rule p-4">
              <div className="flex items-start justify-between gap-2">
                <input
                  type="text"
                  value={entry.title}
                  onChange={e => {
                    const updated = [...recipeBox];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setRecipeBox(updated);
                  }}
                  placeholder="Recipe name"
                  className="font-display text-lg font-light flex-1"
                />
                <button
                  onClick={() => setRecipeBox(recipeBox.filter((_, idx) => idx !== i))}
                  className="text-warm-gray/30 hover:text-warm-gray text-xs mt-2"
                >
                  &times;
                </button>
              </div>
              <textarea
                value={entry.quickRecipe}
                onChange={e => {
                  const updated = [...recipeBox];
                  updated[i] = { ...updated[i], quickRecipe: e.target.value };
                  setRecipeBox(updated);
                }}
                placeholder="Quick recipe — ingredients + method in 2-3 lines"
                className="font-body text-sm w-full mt-2 min-h-[60px]"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...recipeBox];
                    updated[i] = { ...updated[i], status: 'new_keeper' };
                    setRecipeBox(updated);
                  }}
                  className={`font-sans text-[9px] uppercase tracking-[0.12em] px-3 py-1 border transition-all duration-200
                    ${entry.status === 'new_keeper'
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-rule text-warm-gray/50'
                    }
                  `}
                >
                  New Keeper
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...recipeBox];
                    updated[i] = { ...updated[i], status: 'needs_tweaking' };
                    setRecipeBox(updated);
                  }}
                  className={`font-sans text-[9px] uppercase tracking-[0.12em] px-3 py-1 border transition-all duration-200
                    ${entry.status === 'needs_tweaking'
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-rule text-warm-gray/50'
                    }
                  `}
                >
                  Needs Tweaking
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRecipeBox([...recipeBox, { title: '', quickRecipe: '', status: 'new_keeper' }])}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Recipe
          </button>
        </div>

        {/* THE PATTERN THIS WEEK */}
        <SectionLabel>The Pattern This Week</SectionLabel>
        <p className="font-body text-xs text-warm-gray/50 italic mb-3">
          The meta-observation &mdash; how you cooked this week and what it means.
        </p>
        <textarea
          value={patternInsight}
          onChange={e => setPatternInsight(e.target.value)}
          placeholder="You cook best when... The improvised meals were... Your instincts are excellent when..."
          className="font-body text-sm italic w-full min-h-[100px]"
        />

        {/* KITCHEN NOTES */}
        <SectionLabel>Kitchen Notes</SectionLabel>
        <p className="font-body text-xs text-warm-gray/50 italic mb-3">
          Equipment calibration, fermentation logs, starter status &mdash; your kitchen&rsquo;s institutional knowledge.
        </p>
        <div className="space-y-3">
          {kitchenNotes.map((note, i) => (
            <div key={i} className="flex items-start gap-3">
              <input
                type="text"
                value={note.item}
                onChange={e => {
                  const updated = [...kitchenNotes];
                  updated[i] = { ...updated[i], item: e.target.value };
                  setKitchenNotes(updated);
                }}
                placeholder="Item"
                className="font-sans text-[11px] uppercase tracking-label text-gold w-32 shrink-0"
              />
              <input
                type="text"
                value={note.note}
                onChange={e => {
                  const updated = [...kitchenNotes];
                  updated[i] = { ...updated[i], note: e.target.value };
                  setKitchenNotes(updated);
                }}
                placeholder="Note"
                className="font-body text-sm flex-1"
              />
              <button
                onClick={() => setKitchenNotes(kitchenNotes.filter((_, idx) => idx !== i))}
                className="text-warm-gray/30 hover:text-warm-gray text-xs mt-1"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setKitchenNotes([...kitchenNotes, { item: '', note: '' }])}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            + Add Note
          </button>
        </div>

        {/* CARRY FORWARD */}
        <SectionLabel>Carry Forward</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
              Make Next Week
            </label>
            <div className="space-y-2">
              {makeNextWeek.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const updated = [...makeNextWeek];
                      updated[i] = e.target.value;
                      setMakeNextWeek(updated);
                    }}
                    className="font-body text-sm flex-1"
                  />
                  <button
                    onClick={() => setMakeNextWeek(makeNextWeek.filter((_, idx) => idx !== i))}
                    className="text-warm-gray/30 hover:text-warm-gray text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMakeItem}
                  onChange={e => setNewMakeItem(e.target.value)}
                  placeholder="Add dish..."
                  className="font-body text-sm flex-1"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newMakeItem.trim()) {
                      e.preventDefault();
                      setMakeNextWeek([...makeNextWeek, newMakeItem.trim()]);
                      setNewMakeItem('');
                    }
                  }}
                />
                {newMakeItem.trim() && (
                  <button
                    type="button"
                    onClick={() => { setMakeNextWeek([...makeNextWeek, newMakeItem.trim()]); setNewMakeItem(''); }}
                    className="font-sans text-[9px] uppercase tracking-label text-gold"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-3">
              Future Projects
            </label>
            <div className="space-y-2">
              {futureProjects.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const updated = [...futureProjects];
                      updated[i] = e.target.value;
                      setFutureProjects(updated);
                    }}
                    className="font-body text-sm flex-1"
                  />
                  <button
                    onClick={() => setFutureProjects(futureProjects.filter((_, idx) => idx !== i))}
                    className="text-warm-gray/30 hover:text-warm-gray text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFutureItem}
                  onChange={e => setNewFutureItem(e.target.value)}
                  placeholder="Add project..."
                  className="font-body text-sm flex-1"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newFutureItem.trim()) {
                      e.preventDefault();
                      setFutureProjects([...futureProjects, newFutureItem.trim()]);
                      setNewFutureItem('');
                    }
                  }}
                />
                {newFutureItem.trim() && (
                  <button
                    type="button"
                    onClick={() => { setFutureProjects([...futureProjects, newFutureItem.trim()]); setNewFutureItem(''); }}
                    className="font-sans text-[9px] uppercase tracking-label text-gold"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSave}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400"
          >
            {isNew ? 'Save Reflection' : 'Save Changes'}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default WeeklyReflectionEdit;
