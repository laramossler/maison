import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-page mx-auto text-center">
          <Link to="/" className="inline-block group">
            <div className="w-12 h-12 mx-auto mb-3 border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors duration-400">
              <span className="font-display text-gold text-lg tracking-display">L</span>
            </div>
            {isHome && (
              <>
                <h1 className="font-display text-3xl md:text-4xl text-ink tracking-display font-light">
                  The Ledger
                </h1>
                <p className="font-sans text-[10px] uppercase tracking-label text-warm-gray mt-1">
                  A Digital Entertaining Intelligence System
                </p>
              </>
            )}
          </Link>
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
