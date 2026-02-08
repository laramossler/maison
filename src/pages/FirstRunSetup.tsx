import React, { useState } from 'react';
import { LedgerProfile } from '../types';
import { saveProfile } from '../store';

interface FirstRunSetupProps {
  onComplete: () => void;
}

const FirstRunSetup: React.FC<FirstRunSetupProps> = ({ onComplete }) => {
  const [familyName, setFamilyName] = useState('');
  const [residence, setResidence] = useState('');
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');

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

  if (step === 'welcome') {
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
            Welcome to The Ledger
          </h1>

          <p className="font-body text-warm-gray text-sm leading-relaxed max-w-sm mx-auto mb-12">
            A private record of the evenings you create &mdash;
            the menus, the guests, the atmosphere, the memories
            that make a house a home.
          </p>

          <button
            onClick={() => setStep('form')}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-10 py-3 hover:bg-gold/5 transition-all duration-400"
          >
            Begin
          </button>

          {/* Decorative double-line rule */}
          <div className="mt-12">
            <div className="border-t border-gold/30" />
            <div className="border-t border-gold/30 mt-[2px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-page w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-ink tracking-display font-light mb-3">
            Your Ledger
          </h2>
          <p className="font-body text-warm-gray text-sm italic">
            Personalise the cover of your entertaining record
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Family Name
            </label>
            <input
              type="text"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="The Montague Household"
              className="font-display text-xl text-center"
              autoFocus
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Residence
            </label>
            <input
              type="text"
              value={residence}
              onChange={e => setResidence(e.target.value)}
              placeholder="Villa Pierrefeu, Montreux"
              className="font-body text-center"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSkip}
            className="font-sans text-[11px] uppercase tracking-label text-warm-gray/50 hover:text-warm-gray transition-colors duration-300"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400"
          >
            Open The Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstRunSetup;
