import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { WeeklyReflection } from '../types';
import { getReflection, getProfile, deleteReflection } from '../store';
import { LedgerProfile } from '../types';
import PageTransition from '../components/PageTransition';

const Tags: React.FC<{ tags: string[] }> = ({ tags }) => {
  if (tags.length === 0) return null;
  return (
    <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-gold/60 mt-2">
      {tags.join(' \u00b7 ')}
    </p>
  );
};

const OrnamentalRule: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 border-t border-gold/20" />
    <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
    <div className="flex-1 border-t border-gold/20" />
  </div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-6 mt-10">
    <div className="flex-1 border-t border-rule" />
    <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/60 shrink-0">
      {children}
    </span>
    <div className="flex-1 border-t border-rule" />
  </div>
);

const WeeklyReflectionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [profile, setProfile] = useState<LedgerProfile | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (id) {
      const r = getReflection(id);
      if (r) setReflection(r);
    }
    setProfile(getProfile());
  }, [id]);

  if (!reflection) {
    return (
      <PageTransition>
        <div className="pt-16 text-center">
          <p className="font-body text-warm-gray italic">This reflection seems to be missing.</p>
          <Link to="/menu" className="inline-block mt-6 font-sans text-[11px] uppercase tracking-label text-gold">
            Return to House Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  const formatWeekLabel = () => {
    const start = new Date(reflection.weekStartDate + 'T00:00:00');
    return `Week of ${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  const handleDelete = () => {
    deleteReflection(reflection.id);
    navigate('/menu');
  };

  const hasWhatLanded = reflection.whatLanded.length > 0;
  const hasWhatILearned = reflection.whatILearned.length > 0;
  const hasDidntMake = reflection.didntMake.length > 0;
  const hasIdeasSparked = reflection.ideasSparked.length > 0;
  const hasRecipeBox = reflection.recipeBox.length > 0;
  const hasPatternInsight = reflection.patternInsight.trim().length > 0;
  const hasKitchenNotes = reflection.kitchenNotes.length > 0;
  const hasCarryForward = reflection.carryForward.makeNextWeek.length > 0 || reflection.carryForward.futureProjects.length > 0;

  return (
    <PageTransition>
      <div className="pt-8">
        <Link
          to="/menu"
          className="inline-block font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8"
        >
          &larr; House Menu
        </Link>

        {/* Published header */}
        <div className="text-center mb-10">
          <OrnamentalRule />

          <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold/50 mt-6 mb-2">
            Weekly Kitchen Reflection
          </p>

          {profile && profile.familyName && (
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60 mb-3">
              {profile.familyName}
            </p>
          )}

          <h1 className="font-display text-2xl md:text-3xl text-ink font-light tracking-display mb-2">
            {formatWeekLabel()}
          </h1>

          <div className="mt-6">
            <OrnamentalRule />
          </div>
        </div>

        {/* WHAT LANDED */}
        {hasWhatLanded && (
          <>
            <SectionHeader>What Landed</SectionHeader>
            <div className="space-y-5">
              {reflection.whatLanded.map((entry, i) => (
                <div key={i} className="border-l-2 border-gold/30 pl-4">
                  <h3 className="font-display text-lg text-ink font-light tracking-display">
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p className="font-body text-sm text-warm-gray mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                  <Tags tags={entry.tags} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* WHAT I LEARNED */}
        {hasWhatILearned && (
          <>
            <SectionHeader>What I Learned</SectionHeader>
            <div className="space-y-5">
              {reflection.whatILearned.map((entry, i) => (
                <div key={i} className="border-l-2 border-gold/30 pl-4">
                  <h3 className="font-display text-lg text-ink font-light tracking-display">
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p className="font-body text-sm text-warm-gray mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                  <Tags tags={entry.tags} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* DIDN'T MAKE */}
        {hasDidntMake && (
          <>
            <SectionHeader>Didn&rsquo;t Make</SectionHeader>
            <div className="space-y-3">
              {reflection.didntMake.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-gold/40 text-xs mt-0.5">&mdash;</span>
                  <div>
                    <span className="font-body text-sm text-ink">{entry.title}</span>
                    {entry.description && (
                      <p className="font-body text-xs text-warm-gray/60 italic mt-0.5">
                        {entry.description}
                      </p>
                    )}
                    {entry.carryForward && (
                      <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-gold/50 mt-1 block">
                        Carrying forward
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* IDEAS SPARKED */}
        {hasIdeasSparked && (
          <>
            <SectionHeader>Ideas Sparked</SectionHeader>
            <div className="space-y-5">
              {reflection.ideasSparked.map((entry, i) => (
                <div key={i} className="border-l-2 border-gold/30 pl-4">
                  <h3 className="font-display text-lg text-ink font-light tracking-display">
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p className="font-body text-sm text-warm-gray mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                  <Tags tags={entry.tags} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* RECIPE BOX — two-up cards */}
        {hasRecipeBox && (
          <>
            <SectionHeader>Added to the Recipe Box</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reflection.recipeBox.map((entry, i) => (
                <div key={i} className="border border-rule p-5">
                  <h3 className="font-display text-lg text-ink font-light tracking-display mb-2">
                    {entry.title}
                  </h3>
                  <p className="font-body text-sm text-warm-gray leading-relaxed">
                    {entry.quickRecipe}
                  </p>
                  <p className="font-sans text-[9px] uppercase tracking-[0.12em] text-gold/60 mt-3">
                    {entry.status === 'new_keeper' ? 'NEW KEEPER' : 'NEEDS TWEAKING'}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* THE PATTERN THIS WEEK — editorial voice */}
        {hasPatternInsight && (
          <>
            <SectionHeader>The Pattern This Week</SectionHeader>
            <div className="text-center px-4 md:px-12">
              <p className="font-body text-base text-ink/80 italic leading-relaxed">
                {reflection.patternInsight}
              </p>
            </div>
          </>
        )}

        {/* KITCHEN NOTES — key-value table */}
        {hasKitchenNotes && (
          <>
            <SectionHeader>Kitchen Notes</SectionHeader>
            <div className="space-y-3">
              {reflection.kitchenNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="font-sans text-[10px] uppercase tracking-label text-gold shrink-0 mt-0.5 w-32">
                    {note.item}
                  </span>
                  <p className="font-body text-sm text-warm-gray leading-relaxed flex-1">
                    {note.note}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CARRY FORWARD — two columns */}
        {hasCarryForward && (
          <>
            <SectionHeader>Carry Forward</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reflection.carryForward.makeNextWeek.length > 0 && (
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
                    Make Next Week
                  </h4>
                  <div className="space-y-2">
                    {reflection.carryForward.makeNextWeek.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gold/40 text-xs mt-0.5">&mdash;</span>
                        <span className="font-body text-sm text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {reflection.carryForward.futureProjects.length > 0 && (
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-label text-warm-gray mb-3">
                    Future Projects
                  </h4>
                  <div className="space-y-2">
                    {reflection.carryForward.futureProjects.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gold/40 text-xs mt-0.5">&mdash;</span>
                        <span className="font-body text-sm text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12">
          <OrnamentalRule />
          <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-warm-gray/40 text-center mt-4">
            The Ledger &middot; Weekly Kitchen Reflection
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Link
            to={`/reflection/${reflection.id}/edit`}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            Edit Reflection
          </Link>
          {reflection.linkedMenuId && (
            <Link
              to={`/menu/${reflection.linkedMenuId}`}
              className="font-sans text-[11px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300"
            >
              View Menu
            </Link>
          )}
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="font-sans text-[11px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray transition-colors duration-300"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-body text-xs text-warm-gray italic">Are you sure?</span>
              <button
                onClick={handleDelete}
                className="font-sans text-[11px] uppercase tracking-label text-red-600/70 hover:text-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default WeeklyReflectionView;
