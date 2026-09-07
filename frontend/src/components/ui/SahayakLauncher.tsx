import { Bot } from 'lucide-react';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

interface SahayakLauncherProps {
  onOpen: () => void;
}

export function SahayakLauncher({ onOpen }: SahayakLauncherProps) {
  const { t } = useUiPreferences();

  return (
    <aside aria-label="Karmayogi Sahayak Quick Launch" className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={onOpen}
        aria-label={t('sahayakLauncherLabel')}
        aria-haspopup="dialog"
        title={t('sahayakLauncherLabel')}
        className="grid h-14 w-14 place-items-center rounded-full border border-amber-300/80 bg-[#0B2E63] text-amber-300 shadow-lg transition-transform hover:scale-105 hover:bg-[#123E82] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      >
        <Bot className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">{t('sahayakTitle')}</span>
      </button>
    </aside>
  );
}
