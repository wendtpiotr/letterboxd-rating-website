import { useEffect } from 'react';

/**
 * useKeyboardShortcut
 * @param {Object} shortcuts - an object mapping key combinations to callback functions
 * Example:
 * useKeyboardShortcut({
 *   'Meta+K': () => setIsSearchOpen(true),
 *   'Ctrl+M': () => setIsSearchOpen(true),
 *   'Escape': () => setIsSearchOpen(false),
 * });
 */
const useKeyboardShortcut = (shortcuts) => {
    useEffect(() => {
        const normalizeKey = (key) => {
            // Uppercase letters only, leave special keys as-is
            if (key.length === 1) return key.toUpperCase();
            return key;
        };

        const handleKeyDown = (e) => {
            const keyCombo =
                `${e.metaKey ? 'Meta+' : ''}` +
                `${e.ctrlKey ? 'Ctrl+' : ''}` +
                `${e.altKey ? 'Alt+' : ''}` +
                `${e.shiftKey ? 'Shift+' : ''}` +
                `${normalizeKey(e.key)}`;

            if (shortcuts[keyCombo]) {
                e.preventDefault();
                shortcuts[keyCombo](e);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export default useKeyboardShortcut;
