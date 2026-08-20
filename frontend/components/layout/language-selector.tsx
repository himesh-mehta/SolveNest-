"use client";

import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { clsx } from 'clsx';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' }
  ];

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-neutral-700 hover:text-brand-neutral-900 border border-brand-neutral-200 bg-white hover:bg-brand-neutral-50 rounded-brand-md transition-colors"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe className="h-4 w-4" />
          <span>{languages.find(l => l.code === currentLang)?.name.split(' ')[0]}</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 z-20 mt-1 w-40 origin-top-right rounded-brand-md bg-white border border-brand-neutral-200 shadow-brand-md focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={clsx(
                    "flex items-center justify-between w-full px-4 py-2.5 text-sm text-left hover:bg-brand-neutral-50 transition-colors",
                    {
                      "text-brand-green-700 font-medium": currentLang === lang.code,
                      "text-brand-neutral-900": currentLang !== lang.code
                    }
                  )}
                  role="menuitem"
                >
                  <span>{lang.name}</span>
                  {currentLang === lang.code && <Check className="h-4 w-4 text-brand-green-700" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
