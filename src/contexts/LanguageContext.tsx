import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    teamRosterTitle: 'Team Roster & Shift Management',
    teamMembersTitle: 'Team Members',
    adminSettingsTitle: 'Admin Settings',
    statisticsTitle: 'Statistics',
    signIn: 'Sign In',
    username: 'Username',
    password: 'Password',
    invalidCredentials: 'Invalid username or password',
    companyLogo: 'Company Logo',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    weekOf: 'Week of',
    month: 'Month',
    week: 'Week',
    addTeamMember: 'Add Team Member',
    editTeamMember: 'Edit Team Member',
    name: 'Name',
    role: 'Role',
    avatarUrl: 'Avatar URL',
    optional: 'optional',
    preview: 'Preview',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    exportCalendar: 'Export Calendar',
    generatingPDF: 'Generating PDF...',
    deleteShiftConfirm: 'Are you sure you want to delete this shift?',
    deleteTeamMemberConfirm: 'Are you sure you want to remove this team member?',
    tagName: 'Tag Name',
    color: 'Color',
    tags: 'Tags',
    addTag: 'Add Tag',
    editTag: 'Edit Tag',
    deleteTag: 'Delete Tag',
    startTime: 'Start Time',
    endTime: 'End Time',
    comment: 'Comment',
    addShift: 'Add Shift',
    updateShift: 'Update Shift',
    deleteShift: 'Delete Shift',
    monthlyWorkHours: 'Monthly Work Hours',
    yearlyWorkHours: 'Yearly Work Hours',
    statistics: 'Statistics',
    roster: 'Roster',
    team: 'Team',
    admin: 'Admin',
    logout: 'Logout',
    language: 'Language',
    settings: 'Settings',
    companyName: 'Company Name',
    saveChanges: 'Save Changes',
    hours: 'hours',
    total: 'Total'
  },
  de: {
    teamRosterTitle: 'Team Dienstplan & Schichtmanagement',
    teamMembersTitle: 'Teammitglieder',
    adminSettingsTitle: 'Admin Einstellungen',
    statisticsTitle: 'Statistiken',
    signIn: 'Anmelden',
    username: 'Benutzername',
    password: 'Passwort',
    invalidCredentials: 'Ungültiger Benutzername oder Passwort',
    companyLogo: 'Firmenlogo',
    sun: 'So',
    mon: 'Mo',
    tue: 'Di',
    wed: 'Mi',
    thu: 'Do',
    fri: 'Fr',
    sat: 'Sa',
    weekOf: 'Woche vom',
    month: 'Monat',
    week: 'Woche',
    addTeamMember: 'Teammitglied hinzufügen',
    editTeamMember: 'Teammitglied bearbeiten',
    name: 'Name',
    role: 'Position',
    avatarUrl: 'Avatar URL',
    optional: 'optional',
    preview: 'Vorschau',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    update: 'Aktualisieren',
    exportCalendar: 'Kalender exportieren',
    generatingPDF: 'PDF wird erstellt...',
    deleteShiftConfirm: 'Möchten Sie diese Schicht wirklich löschen?',
    deleteTeamMemberConfirm: 'Möchten Sie dieses Teammitglied wirklich entfernen?',
    tagName: 'Tag Name',
    color: 'Farbe',
    tags: 'Tags',
    addTag: 'Tag hinzufügen',
    editTag: 'Tag bearbeiten',
    deleteTag: 'Tag löschen',
    startTime: 'Startzeit',
    endTime: 'Endzeit',
    comment: 'Kommentar',
    addShift: 'Schicht hinzufügen',
    updateShift: 'Schicht aktualisieren',
    deleteShift: 'Schicht löschen',
    monthlyWorkHours: 'Monatliche Arbeitsstunden',
    yearlyWorkHours: 'Jährliche Arbeitsstunden',
    statistics: 'Statistiken',
    roster: 'Dienstplan',
    team: 'Team',
    admin: 'Admin',
    logout: 'Abmelden',
    language: 'Sprache',
    settings: 'Einstellungen',
    companyName: 'Firmenname',
    saveChanges: 'Änderungen speichern',
    hours: 'Stunden',
    total: 'Gesamt'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}