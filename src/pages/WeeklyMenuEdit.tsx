import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { WeeklyMenu, DayMenu, PantrySlot, ReadyBoardItem, READY_BOARD_CATEGORIES } from '../types';
import { getMenu, getMenuByWeek, saveMenu, createBlankMenu, getMonday, saveReadyBoard } from '../store';
import PageTransition from '../components/PageTransition';

type Section = 'meals' | 'pantry' | 'ready' | 'notes';

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'meals', label: 'Daily Meals' },
  { key: 'pantry', label: 'The Pantry' },
  { key: 'ready', label: 'Ready Board' },
  { key: 'notes', label: 'Notes' },
];

const WeeklyMenuEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('meals');
  const [activeDay, setActiveDay] = useState(0);

  // Ready board new item
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState<ReadyBoardItem['category']>('other');
  const [newItemNotes, setNewItemNotes] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = getMenu(id);
      if (existing) {
        setMenu(existing);
        return;
      }
    }
    // New menu — check if one already exists for this week
    const monday = getMonday(new Date());
    const weekStart = monday.toISOString().split('T')[0];
    const existing = getMenuByWeek(weekStart);
    if (existing && !id) {
      // Redirect to edit existing
      navigate(`/menu/${existing.id}/edit`, { replace: true });
      return;
    }
    const blank = createBlankMenu(new Date());
    blank.id = uuidv4();
    setMenu(blank);
  }, [id, navigate]);

  if (!menu) return null;

  const updateDay = (index: number, field: keyof DayMenu, value: string) => {
    const days = [...menu.days];
    days[index] = { ...days[index], [field]: value };
    setMenu({ ...menu, days });
  };

  const updatePantrySlot = (index: number, field: keyof PantrySlot, value: string) => {
    const slots = [...menu.pantrySlots];
    slots[index] = { ...slots[index], [field]: value };
    setMenu({ ...menu, pantrySlots: slots });
  };

  const addPantrySlot = () => {
    setMenu({
      ...menu,
      pantrySlots: [...menu.pantrySlots, { name: '', icon: '', content: '', day: '', status: '' }],
    });
  };

  const removePantrySlot = (index: number) => {
    setMenu({
      ...menu,
      pantrySlots: menu.pantrySlots.filter((_, i) => i !== index),
    });
  };

  const toggleReadyItem = (index: number) => {
    const board = [...menu.readyBoard];
    board[index] = { ...board[index], available: !board[index].available };
    setMenu({ ...menu, readyBoard: board });
  };

  const addReadyItem = () => {
    if (!newItem.trim()) return;
    const item: ReadyBoardItem = {
      item: newItem.trim(),
      category: newCategory,
      available: true,
      notes: newItemNotes.trim(),
    };
    setMenu({ ...menu, readyBoard: [...menu.readyBoard, item] });
    setNewItem('');
    setNewItemNotes('');
  };

  const removeReadyItem = (index: number) => {
    setMenu({
      ...menu,
      readyBoard: menu.readyBoard.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    saveMenu(menu);
    // Persist ready board state for carry-forward
    saveReadyBoard(menu.readyBoard);
    navigate(`/menu/${menu.id}`);
  };

  const formatWeekLabel = () => {
    const start = new Date(menu.weekStartDate + 'T00:00:00');
    return `Week of ${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  const sectionIndex = SECTIONS.findIndex(s => s.key === activeSection);

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate('/menu')}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; House Menu
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-1">
          {formatWeekLabel()}
        </h1>
        <p className="font-body text-xs text-warm-gray/50 italic mb-6">
          Plan your kitchen rhythm for the week
        </p>
        <div className="border-t border-rule mb-8" />

        {/* Section tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {SECTIONS.map((section, i) => (
            <React.Fragment key={section.key}>
              <button
                onClick={() => setActiveSection(section.key)}
                className={`font-sans text-[10px] uppercase tracking-label transition-colors duration-300
                  ${i === sectionIndex ? 'text-gold' : 'text-warm-gray/40 hover:text-warm-gray'}
                `}
              >
                {section.label}
              </button>
              {i < SECTIONS.length - 1 && (
                <span className="text-rule text-[10px]">&mdash;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Daily Meals */}
        {activeSection === 'meals' && (
          <div>
            {/* Day selector */}
            <div className="flex gap-1 mb-6 overflow-x-auto">
              {menu.days.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`font-sans text-[10px] uppercase tracking-label px-3 py-2 border transition-all duration-300 shrink-0
                    ${i === activeDay
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-rule text-warm-gray/50 hover:border-gold/40'
                    }
                  `}
                >
                  {day.dayOfWeek.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-2">
                {menu.days[activeDay].dayOfWeek}, {new Date(menu.days[activeDay].date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
              </p>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                  Breakfast
                </label>
                <input
                  type="text"
                  value={menu.days[activeDay].breakfast}
                  onChange={e => updateDay(activeDay, 'breakfast', e.target.value)}
                  placeholder="Granola with yoghurt and seasonal fruit"
                  className="font-body"
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                  Lunch
                </label>
                <input
                  type="text"
                  value={menu.days[activeDay].lunch}
                  onChange={e => updateDay(activeDay, 'lunch', e.target.value)}
                  placeholder="Leftovers from Sunday, or a simple salad"
                  className="font-body"
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                  Dinner
                </label>
                <input
                  type="text"
                  value={menu.days[activeDay].dinner}
                  onChange={e => updateDay(activeDay, 'dinner', e.target.value)}
                  placeholder="Roast chicken with root vegetables"
                  className="font-body"
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                  Notes
                </label>
                <input
                  type="text"
                  value={menu.days[activeDay].notes}
                  onChange={e => updateDay(activeDay, 'notes', e.target.value)}
                  placeholder="Pizza night \u2014 invite the neighbours"
                  className="font-body italic"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pantry Rhythm */}
        {activeSection === 'pantry' && (
          <div className="space-y-6">
            <p className="font-body text-sm text-warm-gray italic">
              The background rhythm of the kitchen &mdash; what&rsquo;s baking, fermenting, growing, and ready.
            </p>

            {menu.pantrySlots.map((slot, i) => (
              <div key={i} className="border-b border-rule pb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{slot.icon}</span>
                    <input
                      type="text"
                      value={slot.name}
                      onChange={e => updatePantrySlot(i, 'name', e.target.value)}
                      placeholder="Slot name"
                      className="font-sans text-[11px] uppercase tracking-label text-ink !border-0 !py-0 w-32"
                    />
                  </div>
                  <button
                    onClick={() => removePantrySlot(i)}
                    className="font-sans text-[10px] text-warm-gray/30 hover:text-warm-gray transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={slot.content}
                  onChange={e => updatePantrySlot(i, 'content', e.target.value)}
                  placeholder="Sourdough boule, oat scones for the weekend"
                  className="font-body mb-2"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={slot.day}
                    onChange={e => updatePantrySlot(i, 'day', e.target.value)}
                    placeholder="Day (e.g. Wednesday)"
                    className="font-body text-sm flex-1"
                  />
                  <input
                    type="text"
                    value={slot.status}
                    onChange={e => updatePantrySlot(i, 'status', e.target.value)}
                    placeholder="Status (e.g. Day 4, Rising)"
                    className="font-body text-sm italic flex-1"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addPantrySlot}
              className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
            >
              + Add Slot
            </button>
          </div>
        )}

        {/* Ready Board */}
        {activeSection === 'ready' && (
          <div className="space-y-6">
            <p className="font-body text-sm text-warm-gray italic">
              What a drop-by guest can be served within five minutes. The open-door state of the kitchen.
            </p>

            {menu.readyBoard.length > 0 && (
              <div className="space-y-2">
                {menu.readyBoard.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-rule pb-2">
                    <button
                      onClick={() => toggleReadyItem(i)}
                      className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300
                        ${item.available ? 'border-gold bg-gold/10 text-gold' : 'border-rule text-transparent'}
                      `}
                    >
                      <span className="text-xs">{item.available ? '\u2713' : ''}</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`font-body text-sm ${item.available ? 'text-ink' : 'text-warm-gray/40 line-through'}`}>
                        {item.item}
                      </span>
                      {item.notes && (
                        <span className="font-body text-xs text-warm-gray/50 italic ml-2">
                          {item.notes}
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/40 shrink-0">
                      {READY_BOARD_CATEGORIES.find(c => c.key === item.category)?.label}
                    </span>
                    <button
                      onClick={() => removeReadyItem(i)}
                      className="font-sans text-[10px] text-warm-gray/30 hover:text-warm-gray transition-colors duration-300 shrink-0"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block">
                Add to Board
              </label>
              <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="Toasted walnuts"
                className="font-body"
                onKeyDown={e => e.key === 'Enter' && addReadyItem()}
              />
              <div className="flex gap-3">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as ReadyBoardItem['category'])}
                  className="font-body flex-1"
                >
                  {READY_BOARD_CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={e => setNewItemNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  className="font-body flex-1"
                />
              </div>
              <button
                type="button"
                onClick={addReadyItem}
                className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
              >
                + Add Item
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        {activeSection === 'notes' && (
          <div className="space-y-6">
            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Notes for the Week
              </label>
              <textarea
                value={menu.specialNotes}
                onChange={e => setMenu({ ...menu, specialNotes: e.target.value })}
                placeholder="Anything to remember this week..."
                rows={3}
              />
            </div>

            <div>
              <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
                Seasonal Notes
              </label>
              <input
                type="text"
                value={menu.seasonalNotes}
                onChange={e => setMenu({ ...menu, seasonalNotes: e.target.value })}
                placeholder="First rhubarb from the garden"
                className="font-body italic"
              />
            </div>

            <div className="border-t border-rule pt-6">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setMenu({ ...menu, hostingPlanned: !menu.hostingPlanned })}
                  className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300
                    ${menu.hostingPlanned ? 'border-gold bg-gold/10 text-gold' : 'border-rule text-transparent'}
                  `}
                >
                  <span className="text-xs">{menu.hostingPlanned ? '\u2713' : ''}</span>
                </button>
                <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray">
                  Hosting planned this week
                </span>
              </div>
              {menu.hostingPlanned && (
                <input
                  type="text"
                  value={menu.hostingNotes}
                  onChange={e => setMenu({ ...menu, hostingNotes: e.target.value })}
                  placeholder="Saturday dinner for 6"
                  className="font-body"
                />
              )}
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSave}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400"
          >
            Save Menu
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default WeeklyMenuEdit;
