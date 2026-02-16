import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WeeklyMenu } from '../types';
import { getMenu, getProfile } from '../store';
import { LedgerProfile } from '../types';
import PageTransition from '../components/PageTransition';

const WeeklyMenuView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [profile, setProfile] = useState<LedgerProfile | null>(null);

  useEffect(() => {
    if (id) {
      const m = getMenu(id);
      if (m) setMenu(m);
    }
    setProfile(getProfile());
  }, [id]);

  if (!menu) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">This menu page seems to be missing.</p>
          <Link to="/menu" className="inline-block mt-6 font-sans text-[11px] uppercase tracking-label text-gold">
            Return to House Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  const formatWeekLabel = () => {
    const start = new Date(menu.weekStartDate + 'T00:00:00');
    return `Week of ${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  const formatDayShort = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long' });
  };

  const hasMeals = menu.days.some(d => d.breakfast || d.lunch || d.dinner);
  const hasPantry = menu.pantrySlots.some(s => s.content);
  const hasReadyBoard = menu.readyBoard.some(i => i.available);

  return (
    <PageTransition>
      <div className="pt-8">
        <Link
          to="/menu"
          className="inline-block font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8"
        >
          &larr; House Menu
        </Link>

        {/* Published header — the showpiece */}
        <div className="text-center mb-10">
          {/* Decorative top rule */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>

          <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold/50 mb-2">
            The House Menu
          </p>

          {profile && profile.familyName && (
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-3">
              {profile.familyName}
            </p>
          )}

          <h1 className="font-display text-2xl md:text-3xl text-ink font-light tracking-display mb-2">
            {formatWeekLabel()}
          </h1>

          {menu.seasonalNotes && (
            <p className="font-body text-sm text-warm-brown italic mt-3">
              {menu.seasonalNotes}
            </p>
          )}

          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 border-t border-gold/20" />
            <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
            <div className="flex-1 border-t border-gold/20" />
          </div>
        </div>

        {/* Daily Meals */}
        {hasMeals && (
          <div className="mb-10">
            <div className="space-y-6">
              {menu.days.map((day, i) => {
                if (!day.breakfast && !day.lunch && !day.dinner) return null;
                return (
                  <div key={i} className="text-center">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-3">
                      {formatDayShort(day.date)}
                    </p>
                    <div className="space-y-1.5">
                      {day.breakfast && (
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50">Breakfast</span>
                          <p className="font-display text-base text-ink font-light">{day.breakfast}</p>
                        </div>
                      )}
                      {day.lunch && (
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50">Lunch</span>
                          <p className="font-display text-base text-ink font-light">{day.lunch}</p>
                        </div>
                      )}
                      {day.dinner && (
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-label text-warm-gray/50">Dinner</span>
                          <p className="font-display text-lg text-ink font-light">{day.dinner}</p>
                        </div>
                      )}
                    </div>
                    {day.notes && (
                      <p className="font-body text-xs text-warm-gray/50 italic mt-2">{day.notes}</p>
                    )}
                    {i < menu.days.length - 1 && menu.days.slice(i + 1).some(d => d.breakfast || d.lunch || d.dinner) && (
                      <div className="border-t border-rule-light mt-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pantry Rhythm */}
        {hasPantry && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 border-t border-rule" />
              <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-warm-gray/40">The Pantry</span>
              <div className="flex-1 border-t border-rule" />
            </div>

            <div className="space-y-4 mb-10">
              {menu.pantrySlots.map((slot, i) => {
                if (!slot.content) return null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-base shrink-0 mt-0.5">{slot.icon}</span>
                    <div className="flex-1">
                      <span className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60">
                        {slot.name}
                      </span>
                      <p className="font-body text-sm text-ink">{slot.content}</p>
                      {(slot.day || slot.status) && (
                        <p className="font-body text-xs text-warm-gray/50 italic">
                          {[slot.day, slot.status].filter(Boolean).join(' \u2014 ')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Ready Board */}
        {hasReadyBoard && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 border-t border-rule" />
              <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-warm-gray/40">The Ready Board</span>
              <div className="flex-1 border-t border-rule" />
            </div>

            <div className="text-center mb-10">
              <p className="font-body text-sm text-ink/70 italic">
                {menu.readyBoard
                  .filter(i => i.available)
                  .map(i => i.notes ? `${i.item} (${i.notes})` : i.item)
                  .join(' \u00b7 ')
                }
              </p>
            </div>
          </>
        )}

        {/* Hosting & Notes */}
        {(menu.hostingPlanned || menu.specialNotes) && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 border-t border-rule" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-rule" />
            </div>

            <div className="text-center space-y-3 mb-10">
              {menu.hostingPlanned && menu.hostingNotes && (
                <p className="font-body text-sm text-ink">
                  <span className="font-sans text-[9px] uppercase tracking-label text-gold/60 block mb-1">Hosting</span>
                  {menu.hostingNotes}
                </p>
              )}
              {menu.specialNotes && (
                <p className="font-body text-sm text-warm-gray italic">{menu.specialNotes}</p>
              )}
            </div>
          </>
        )}

        {/* Footer ornament */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 border-t border-gold/20" />
          <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
          <div className="flex-1 border-t border-gold/20" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Link
            to={`/menu/${menu.id}/edit`}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            Edit Menu
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default WeeklyMenuView;
