import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LedgerProfile } from '../types';
import { getProfile, saveProfile } from '../store';
import PageTransition from '../components/PageTransition';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState('');
  const [residence, setResidence] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setFamilyName(profile.familyName);
      setResidence(profile.residence);
    }
  }, []);

  const handleSave = () => {
    const profile: LedgerProfile = {
      familyName: familyName.trim(),
      residence: residence.trim(),
    };
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate('/')}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; Library
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          Settings
        </h1>
        <div className="border-t border-rule mb-8 mt-6" />

        <div className="space-y-6">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Family Name
            </label>
            <input
              type="text"
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="The Montague Household"
              className="font-display text-xl"
            />
            <p className="font-body text-xs text-warm-gray/50 italic mt-2">
              Displayed on the cover of your ledger
            </p>
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
              className="font-body"
            />
            <p className="font-body text-xs text-warm-gray/50 italic mt-2">
              Your home, estate, or address
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          {saved && (
            <span className="font-body text-sm text-gold italic mr-4 transition-opacity duration-400">
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400"
          >
            Save
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
