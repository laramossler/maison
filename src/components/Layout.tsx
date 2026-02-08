import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getProfile } from '../store';
import { LedgerProfile } from '../types';

const OrnamentalRule: React.FC = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 border-t border-gold/20" />
    <span className="text-gold/30 text-[8px] leading-none">&diams;</span>
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
          {/* Double-line monogram — links to settings */}
          <Link to="/settings" className="inline-block group" title="Settings">
            <div className="w-14 h-14 mx-auto mb-3 border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors duration-400">
              <div className="w-[50px] h-[50px] border border-gold/20 flex items-center justify-center group-hover:border-gold/40 transition-colors duration-400">
                <span className="font-display text-gold text-xl tracking-display font-light">L</span>
              </div>
            </div>
          </Link>

          {isTopLevel && (
            <>
              <Link to="/" className="inline-block">
                <h1 className="font-display text-3xl md:text-4xl text-ink tracking-display font-light">
                  The Ledger
                </h1>
              </Link>

              {/* Bookplate: family name & residence */}
              {profile && (profile.familyName || profile.residence) && (
                <div className="mt-3">
                  {profile.familyName && (
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/70">
                      {profile.familyName}
                    </p>
                  )}
                  {profile.residence && (
                    <p className="font-body text-xs text-warm-gray/50 italic mt-0.5">
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
