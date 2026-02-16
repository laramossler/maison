import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WeeklyMenu } from '../types';
import { getMenus, getMonday, getMenuByWeek } from '../store';
import PageTransition from '../components/PageTransition';

const WeeklyMenuList: React.FC = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<WeeklyMenu[]>([]);
  const [currentWeekMenu, setCurrentWeekMenu] = useState<WeeklyMenu | null>(null);

  useEffect(() => {
    const all = getMenus().sort((a, b) => b.weekStartDate.localeCompare(a.weekStartDate));
    setMenus(all);

    const monday = getMonday(new Date());
    const weekStart = monday.toISOString().split('T')[0];
    const current = getMenuByWeek(weekStart);
    if (current) setCurrentWeekMenu(current);
  }, []);

  const formatWeekRange = (start: string, end: string) => {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const sameMonth = s.getMonth() === e.getMonth();
    if (sameMonth) {
      return `${s.getDate()}\u2013${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
    return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} \u2013 ${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const getDinnerPreview = (menu: WeeklyMenu) => {
    return menu.days
      .filter(d => d.dinner)
      .slice(0, 3)
      .map(d => d.dinner)
      .join(' \u00b7 ');
  };

  const handleNewMenu = () => {
    if (currentWeekMenu) {
      navigate(`/menu/${currentWeekMenu.id}/edit`);
    } else {
      navigate('/menu/new/edit');
    }
  };

  return (
    <PageTransition>
      <div className="pt-6">
        {/* This Week CTA */}
        <div className="text-center mb-8">
          {currentWeekMenu ? (
            <Link
              to={`/menu/${currentWeekMenu.id}`}
              className="inline-block font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400"
            >
              View This Week&rsquo;s Menu
            </Link>
          ) : (
            <button
              onClick={handleNewMenu}
              className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400"
            >
              Plan This Week&rsquo;s Menu
            </button>
          )}
        </div>

        {menus.length === 0 ? (
          <div className="text-center pt-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="flex-1 border-t border-gold/20" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-gold/20" />
            </div>

            <p className="font-display text-2xl md:text-3xl text-ink/80 italic font-light leading-relaxed">
              The kitchen awaits its rhythm
            </p>
            <p className="font-body text-warm-gray mt-4 text-sm leading-relaxed max-w-sm mx-auto">
              Plan your first weekly menu &mdash; the meals, the baking, the pantry.
              A house with a rhythm is a house that&rsquo;s alive.
            </p>

            <div className="flex items-center gap-3 mt-10">
              <div className="flex-1 border-t border-gold/20" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-gold/20" />
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/50 text-center mb-6">
              Past Menus
            </h2>

            <div className="space-y-0">
              {menus.map((menu, index) => {
                const dinnerPreview = getDinnerPreview(menu);
                const pantryCount = menu.pantrySlots.filter(s => s.content).length;

                return (
                  <Link
                    key={menu.id}
                    to={`/menu/${menu.id}`}
                    className="block group"
                  >
                    {index > 0 && <div className="border-t border-rule" />}
                    <div className="py-5 text-center transition-all duration-300">
                      <span className="block font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-2">
                        {formatWeekRange(menu.weekStartDate, menu.weekEndDate)}
                      </span>

                      {dinnerPreview && (
                        <p className="font-body text-sm text-ink/60 italic group-hover:text-gold/70 transition-colors duration-400">
                          {dinnerPreview}
                        </p>
                      )}

                      <p className="font-sans text-[9px] uppercase tracking-label text-warm-gray/40 mt-2">
                        {menu.days.filter(d => d.dinner).length} dinners planned
                        {pantryCount > 0 && <> &middot; {pantryCount} pantry items</>}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 border-t border-rule" />
              <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
              <div className="flex-1 border-t border-rule" />
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default WeeklyMenuList;
