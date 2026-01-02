import { useEffect } from 'react';

/**
 * useDebounce
 * @param {any} value - the value to watch
 * @param {Function} callback - function to call after debounce
 * @param {number} delay - debounce delay in ms (default 300ms)
 */
const useDebounce = (value, callback, delay = 300) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            callback(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, callback, delay]);
};

export default useDebounce;
