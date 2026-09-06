import { useEffect, useRef } from 'react';

const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const activeDialogs: HTMLDivElement[] = [];

export function useDialogAccessibility(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!isOpen || !dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    activeDialogs.push(dialog);

    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((element) => !element.closest('[hidden], [inert]') && getComputedStyle(element).display !== 'none');
    if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;
    (focusables()[0] ?? dialog).focus();

    const handleKey = (event: KeyboardEvent) => {
      if (activeDialogs[activeDialogs.length - 1] !== dialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const elements = focusables();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (activeDialogs[activeDialogs.length - 1] === dialog && !dialog.contains(event.target as Node)) {
        (focusables()[0] ?? dialog).focus();
      }
    };
    document.addEventListener('keydown', handleKey, true);
    document.addEventListener('focusin', containFocus);
    return () => {
      const index = activeDialogs.indexOf(dialog);
      if (index >= 0) activeDialogs.splice(index, 1);
      document.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('focusin', containFocus);
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isOpen]);

  return ref;
}
