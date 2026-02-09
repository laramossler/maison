import React, { useState } from 'react';
import { LedgerProfile } from '../types';
import { saveProfile } from '../store';

interface FirstRunSetupProps {
  onComplete: () => void;
}

const FirstRunSetup: React.FC<FirstRunSetupProps> = ({ onComplete }) => {
  const [familyName, setFamilyName] = useState('');
  const [residence, setResidence] = useState('');

  const handleSave = () => {
    const profile: LedgerProfile = {
      familyName: familyName.trim(),
      residence: residence.trim(),
    };
    saveProfile(profile);
    onComplete();
  };

  const handleSkip = () => {
    saveProfile({ familyName: '', residence: '' });
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-page w-full text-center">
        {/* Decorative double-line rule */}
        <div className="mb-12">
          <div className="border-t border-gold/30" />
          <div className="border-t border-gold/30 mt-[2px]" />
        </div>

        <div className="w-14 h-14 mx-auto mb-6 border border-gold/40 flex items-center justify-center">
          <div className="w-[50px] h-[50px] border border-gold/20 flex items-center justify-center">
            <span className="font-display text-gold text-xl tracking-display font-light">L</span>
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-ink tracking-display font-light mb-4">
          The Ledger
        </h1>

        <p className="font-body text-warm-gray text-sm italic leading-relaxed max-w-sm mx-auto mb-12">
          Your private ledger for the art of entertaining
        </p>

        {/* Bookplate inscription fields */}
        <div className="max-w-xs mx-auto space-y-8 mb-12 text-left">
          <div>
            <label className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/70 block mb-2 text-center">
              Your Household
            </label>
            <input
              type="text"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="The Harrington Family"
              className="font-display text-lg text-center"
              autoFocus
            />
          </div>

          <div>
            <label className="font-sans text-[9px] uppercase tracking-[0.16em] text-gold/70 block mb-2 text-center">
              Your Residence
            </label>
            <input
              type="text"
              value={residence}
              onChange={e => setResidence(e.target.value)}
              placeholder="Willow House, Montreux"
              className="font-body italic text-center"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-10 py-3 hover:bg-gold/5 transition-all duration-400"
        >
          Open The Ledger
        </button>

        <div className="mt-3">
          <button
            onClick={handleSkip}
            className="font-sans text-[10px] uppercase tracking-label text-warm-gray/40 hover:text-warm-gray/60 transition-colors duration-300"
          >
            Skip for now
          </button>
        </div>

        {/* Decorative double-line rule */}
        <div className="mt-12">
          <div className="border-t border-gold/30" />
          <div className="border-t border-gold/30 mt-[2px]" />
        </div>
      </div>
    </div>
  );
};

export default FirstRunSetup;
