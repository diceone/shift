import React from 'react';
import { Users, Calendar, Settings, LogOut, BarChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

interface NavigationProps {
  currentPage: 'roster' | 'team' | 'admin' | 'stats';
  onPageChange: (page: 'roster' | 'team' | 'admin' | 'stats') => void;
  onLogout: () => void;
}

export function Navigation({ currentPage, onPageChange, onLogout }: NavigationProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange('roster')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentPage === 'roster'
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>{t('roster')}</span>
      </button>
      <button
        onClick={() => onPageChange('team')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentPage === 'team'
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>{t('team')}</span>
      </button>
      <button
        onClick={() => onPageChange('stats')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentPage === 'stats'
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <BarChart className="w-5 h-5" />
        <span>{t('stats')}</span>
      </button>
      <button
        onClick={() => onPageChange('admin')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          currentPage === 'admin'
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>{t('admin')}</span>
      </button>
      <LanguageSwitch />
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-red-500 text-white hover:bg-red-600"
      >
        <LogOut className="w-5 h-5" />
        <span>{t('logout')}</span>
      </button>
    </div>
  );
}