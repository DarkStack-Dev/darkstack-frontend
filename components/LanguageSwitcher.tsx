'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const locales = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocaleCode = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
    setIsOpen(false);
  };

  const currentLocale = locales.find(l => l.code === currentLocaleCode);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Change language"
      >
        <span className="text-xl">{currentLocale?.flag}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1 z-10 w-40"
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul>
            {locales.map((locale) => (
              <li key={locale.code}>
                <button
                  onClick={() => handleSwitch(locale.code)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <span className="text-xl">{locale.flag}</span>
                  <span>{locale.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}