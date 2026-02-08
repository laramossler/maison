import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isTopLevel = location.pathname === '/' || location.pathname === '/guests';
  const isGuestSection = location.pathname.startsWith('/guest');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-page mx-auto text-center">
          <Link to="/" className="inline-block group">
            <div className="w-12 h-12 mx-auto mb-3 border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors duration-400">
              <span className="font-display text-gold text-lg tracking-display font-light">L</span>
            </div>
            {isTopLevel && (
              <h1 className="font-display text-3xl md:text-4xl text-ink tracking-display font-light">
                The Ledger
              </h1>
            )}
          </Link>

          {isTopLevel && (
            <nav className="mt-6 flex items-center justify-center gap-6">
              <Link
                to="/"
                className={`font-sans text-[11px] uppercase tracking-label transition-colors duration-400
                  ${!isGuestSection ? 'text-gold' : 'text-warm-gray/50 hover:text-warm-gray'}
                `}
              >
                Your Gatherings
              </Link>
              <span className="text-rule text-xs">&middot;</span>
              <Link
                to="/guests"
                className={`font-sans text-[11px] uppercase tracking-label transition-colors duration-400
                  ${isGuestSection ? 'text-gold' : 'text-warm-gray/50 hover:text-warm-gray'}
                `}
              >
                Guest Book
              </Link>
            </nav>
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
          <div className="border-t border-rule pt-6 text-center">
            <p className="font-sans text-[10px] uppercase tracking-label text-warm-gray/60">
              Effortless is a system
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
