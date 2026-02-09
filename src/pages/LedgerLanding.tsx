import React, { useEffect, useRef } from 'react';
import './LedgerLanding.css';

const LedgerLanding: React.FC = () => {
  const ideaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const items = ideaRef.current?.querySelectorAll('.idea-item');
    items?.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="ledger-landing">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="monogram">L</div>
        <h1 className="hero-title">The Ledger</h1>
        <p className="hero-subtitle">
          A private record of the art of entertaining — the menus, the guests,
          the atmosphere, the memories that make a house a home.
        </p>
        <div className="hero-rule"></div>
        <span className="scroll-hint">Discover</span>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="philosophy">
        <div className="philosophy-ornament">
          ◆ &ensp; ◆ &ensp; ◆
        </div>
        <p className="philosophy-text">
          For generations, the world's finest hostesses have kept private
          ledgers — handwritten books recording every dinner, every guest,
          every menu, every seating arrangement. The invisible system behind
          evenings that feel <em>effortless</em>.
        </p>
        <p
          className="philosophy-text"
          style={{ marginTop: 24, fontStyle: 'italic', color: 'var(--warm-brown)' }}
        >
          Nobody has brought them into the digital age. Until now.
        </p>
      </section>

      {/* ── THE IDEA ── */}
      <section className="idea" ref={ideaRef}>
        <div className="section-rule"></div>
        <div className="idea-columns">
          <div className="idea-item">
            <div className="idea-label">The Record</div>
            <h3 className="idea-heading">Every evening, documented beautifully</h3>
            <p className="idea-body">
              The menu. The wines. The flowers on the table, the music in the
              background, the scent of beeswax candles. Every detail that made
              the evening yours — captured in a private book that belongs to
              your house.
            </p>
          </div>
          <div className="idea-item">
            <div className="idea-label">The Guest Book</div>
            <h3 className="idea-heading">A memory that never forgets</h3>
            <p className="idea-body">
              What you served the Martins last April. Who Sofia sat next to at
              Christmas. The conversation that lit up the table. Your guest book
              builds over time into something no notebook could hold.
            </p>
          </div>
          <div className="idea-item">
            <div className="idea-label">The Reflection</div>
            <h3 className="idea-heading">The art of getting better</h3>
            <p className="idea-body">
              What felt effortless. What you'd change. Which guest combinations
              sparked. The lamb that rested too long. The terrace at sunset that
              was too beautiful to rush. Every evening teaches the next.
            </p>
          </div>
        </div>
      </section>

      {/* ── SPECIMEN ── */}
      <section className="specimen">
        <div className="specimen-label">A Page from The Ledger</div>
        <div className="specimen-page">
          <div className="specimen-date">15 March 2025</div>
          <div className="specimen-title">
            A Spring Evening
            <br />
            in Montreux
          </div>
          <div className="specimen-purpose">
            "To celebrate Sofia's return from Sardinia and the first warm
            evening of spring"
          </div>
          <div className="specimen-detail">
            Dinner &ensp;·&ensp; Villa Pierrefeu, Lake Geneva Terrace
          </div>
          <div className="specimen-menu-label">
            <span>Menu</span>
          </div>
          <div className="specimen-menu">
            Asparagus velouté
            <br />
            Dover sole meunière
            <br />
            Rack of lamb with spring vegetables
            <br />
            Comté, Vacherin Mont-d'Or, aged Gruyère
            <br />
            Tarte Tatin with crème fraîche
          </div>
          <div className="specimen-outfit">
            Wore: Navy silk midi dress with cream cashmere wrap — The Row
          </div>
          <div className="specimen-guests">
            Comtesse Sofia de Montague &ensp;·&ensp; Isabelle Hartley-Ross
            <br />
            Alexandra Chen-Beaumont &ensp;·&ensp; James &amp; Catherine Aldridge
          </div>
          <div className="specimen-reflection">
            "The light on the lake at sunset was extraordinary. Everyone
            lingered on the terrace longer than planned — and it was perfect."
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="principles">
        <h2 className="principles-heading">What The Ledger Holds</h2>
        <p className="principles-sub">
          Everything a thoughtful hostess remembers — and everything she wishes
          she could.
        </p>
        <div className="principles-grid">
          <div className="principle">
            <div className="principle-name">Menus &amp; Wines</div>
            <p className="principle-desc">
              Every course, every pairing, every triumph and every lesson.
            </p>
          </div>
          <div className="principle">
            <div className="principle-name">Guest Profiles</div>
            <p className="principle-desc">
              Dietary needs, preferences, conversation topics, gifting history —
              the details that make guests feel known.
            </p>
          </div>
          <div className="principle">
            <div className="principle-name">The Atmosphere</div>
            <p className="principle-desc">
              Flowers, table settings, lighting, music, scent — the composition
              of a room.
            </p>
          </div>
          <div className="principle">
            <div className="principle-name">Reflections</div>
            <p className="principle-desc">
              Honest notes on what worked, what to change, which moments were
              magic.
            </p>
          </div>
          <div className="principle">
            <div className="principle-name">The Timeline</div>
            <p className="principle-desc">
              The choreography of the evening — from aperitifs to the last
              digestif.
            </p>
          </div>
          <div className="principle">
            <div className="principle-name">What You Wore</div>
            <p className="principle-desc">
              Because the hostess is part of her own evening — and the record of
              it.
            </p>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="closing">
        <div className="closing-rule"></div>
        <p className="closing-text">
          The most elegant evenings
          <br />
          are not improvised.
          <br />
          They are rehearsed so thoroughly
          <br />
          that improvisation becomes possible.
        </p>
        <p className="closing-italic">
          The Ledger is currently available by invitation only.
        </p>
        <div className="invite-badge">
          <span className="invite-badge-text">By Invitation Only</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <p className="footer-text">
          The Ledger &ensp;·&ensp; A private record of the art of entertaining
        </p>
      </footer>
    </div>
  );
};

export default LedgerLanding;
