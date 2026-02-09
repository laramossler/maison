import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProfile } from '../store';
import { LedgerProfile } from '../types';

const OrnamentalRule: React.FC = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 border-t border-gold/20" />
    <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
    <div className="flex-1 border-t border-gold/20" />
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isTopLevel = location.pathname === '/' || location.pathname === '/guests';
  const isGuestSection = location.pathname.startsWith('/guest');
  const [profile, setProfile] = useState<LedgerProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-page mx-auto text-center">
          {isTopLevel ? (
            <>
              {/* Full bookplate header on top-level pages */}
              <Link to="/settings" className="inline-block group" title="Settings">
                <div className="w-14 h-14 mx-auto border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors duration-400">
                  <div className="w-[50px] h-[50px] border border-gold/20 flex items-center justify-center group-hover:border-gold/40 transition-colors duration-400">
                    <span className="font-display text-gold text-xl tracking-display font-light">L</span>
                  </div>
                </div>
              </Link>

              <h1 className="font-display text-3xl md:text-4xl text-ink tracking-display font-light mt-4">
                The Ledger
              </h1>

              <p className="font-body text-xs text-warm-gray/50 italic mt-2">
                Your private ledger for the art of entertaining
              </p>

              {/* Bookplate: family name & residence */}
              {profile && (profile.familyName || profile.residence) && (
                <div className="mt-4">
                  {profile.familyName && (
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-gold/60">
                      {profile.familyName}
                    </p>
                  )}
                  {profile.residence && (
                    <p className="font-body text-xs text-warm-gray/40 italic mt-0.5">
                      {profile.residence}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 mb-1">
                <OrnamentalRule />
              </div>

              <nav className="mt-4 flex items-center justify-center gap-8">
                <Link
                  to="/"
                  className={`font-sans text-[10px] uppercase tracking-[0.16em] transition-colors duration-400 pb-1
                    ${!isGuestSection
                      ? 'text-gold border-b border-gold/40'
                      : 'text-warm-gray/50 hover:text-warm-gray border-b border-transparent'
                    }
                  `}
                >
                  Your Gatherings
                </Link>
                <Link
                  to="/guests"
                  className={`font-sans text-[10px] uppercase tracking-[0.16em] transition-colors duration-400 pb-1
                    ${isGuestSection
                      ? 'text-gold border-b border-gold/40'
                      : 'text-warm-gray/50 hover:text-warm-gray border-b border-transparent'
                    }
                  `}
                >
                  Guest Book
                </Link>
              </nav>
            </>
          ) : (
            <>
              {/* Smaller monogram on sub-pages with optional family name */}
              <Link to="/settings" className="inline-block group" title="Settings">
                <div className="w-10 h-10 mx-auto border border-gold/20 flex items-center justify-center group-hover:border-gold/40 transition-colors duration-400">
                  <div className="w-[34px] h-[34px] border border-gold/10 flex items-center justify-center group-hover:border-gold/20 transition-colors duration-400">
                    <span className="font-display text-gold/70 text-sm tracking-display font-light">L</span>
                  </div>
                </div>
              </Link>
              {profile && profile.familyName && (
                <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-warm-gray/30 mt-2">
                  {profile.familyName}
                </p>
              )}
            </>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="max-w-page mx-auto">
          {children}
        </div>
      </main>

      <footer className="py-8 px-6">
        <div className="max-w-page mx-auto">
          <div className="pt-6 text-center">
            <OrnamentalRule />
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/40 mt-4">
              Effortless is a system
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
