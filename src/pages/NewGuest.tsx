import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Guest } from '../types';
import { saveGuest } from '../store';
import PageTransition from '../components/PageTransition';

const NewGuest: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [dietary, setDietary] = useState('');
  const [preferences, setPreferences] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [conversationTopics, setConversationTopics] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    const guest: Guest = {
      id: uuidv4(),
      name: name.trim(),
      relationship: relationship.trim(),
      dietary: dietary.trim(),
      preferences: preferences.trim(),
      personalNotes: personalNotes.trim(),
      conversationTopics: conversationTopics.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveGuest(guest);
    navigate(`/guest/${guest.id}`);
  };

  return (
    <PageTransition>
      <div className="pt-8">
        <button
          onClick={() => navigate('/guests')}
          className="font-sans text-[10px] uppercase tracking-label text-warm-gray hover:text-gold transition-colors duration-300 mb-8 block"
        >
          &larr; Guest Book
        </button>

        <h1 className="font-display text-3xl md:text-4xl text-ink font-light tracking-display mb-2">
          New Guest
        </h1>
        <div className="border-t border-rule mb-8 mt-6" />

        <div className="space-y-6">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Comtesse Sofia de Montague"
              className="font-display text-xl"
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Relationship
            </label>
            <input
              type="text"
              value={relationship}
              onChange={e => setRelationship(e.target.value)}
              placeholder="Close friend, colleague, neighbour..."
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Dietary & Allergies
            </label>
            <textarea
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              placeholder="Any dietary needs, restrictions, or allergies..."
              rows={2}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Preferences
            </label>
            <textarea
              value={preferences}
              onChange={e => setPreferences(e.target.value)}
              placeholder="What they enjoy \u2014 foods, drinks, styles..."
              rows={2}
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Conversation Topics
            </label>
            <input
              type="text"
              value={conversationTopics}
              onChange={e => setConversationTopics(e.target.value)}
              placeholder="What lights them up..."
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Personal Notes
            </label>
            <textarea
              value={personalNotes}
              onChange={e => setPersonalNotes(e.target.value)}
              placeholder="Children, travels, interests, milestones..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-12 pt-8 border-t border-rule">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-2.5 hover:bg-gold/5 transition-all duration-400 disabled:opacity-30 disabled:cursor-default"
          >
            Save to Guest Book
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewGuest;
