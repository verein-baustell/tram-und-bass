/**
 * Sets a cookie with the specified name, value, and expiration days.
 * @param name - The name of the cookie.
 * @param value - The value to store in the cookie.
 * @param days - The number of days until the cookie expires.
 */
export function setCookie(name: string, value: string, days: number): void {
    if (typeof document !== 'undefined') {  // Check if `document` exists
        const expires = new Date(Date.now() + days * 864e5).toUTCString(); // Calculate expiration date
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }
}

/**
 * Retrieves the value of a cookie by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if it doesn't exist.
 */
export function getCookie(name: string): string | null {
    if (typeof document !== 'undefined') {  // Check if `document` exists
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
    }
    return null;
}

/**
 * Deletes a cookie by name.
 * @param name - The name of the cookie to delete.
 */
export function deleteCookie(name: string): void {
    if (typeof document !== 'undefined') {  // Check if `document` exists
        document.cookie = `${name}=; max-age=0; path=/`; // Set max-age to 0 to delete the cookie
    }
}