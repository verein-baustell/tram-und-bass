import { get } from "svelte/store";
import { cookieConsent, currentLine, currentTime, lastState, allLines } from "../store";
import { setCookie, deleteCookie, getCookie } from '../utils/cookieUtils';
import compareStationNames from "../utils/compareStationNames";

export const giveConsent = () => {
    // Get the current consent value
    const currentConsent = get(cookieConsent);

    // If consent is not already given, set the cookie and update the store
    if (!currentConsent) {
        setCookie('cookieConsent', 'true', 365); // Set cookie for 1 year
        cookieConsent.set(true); // Update the store to reflect consent
    }
};

export const revokeConsent = () => {
    // Get the current consent value
    const currentConsent = get(cookieConsent);

    // If consent is currently given, delete the cookie and update the store
    if (currentConsent) {
        deleteCookie('cookieConsent'); // Remove the cookie
        cookieConsent.set(false); // Update the store to reflect no consent
    }
};

/**
 * Ensures that a cookie is set before the window is reloaded or closed.
 */
export function setCookieBeforeUnload(name: string, value: string, days: number): void {
    if (typeof window !== 'undefined') {
        console.log('set cookie before unload')
        // Listen for the beforeunload event to set the cookie before reload/close
        window.addEventListener('beforeunload', () => {
            setCookie(name, value, days);
        });
    }
}

// Set curret state of the player
export const setState = () => {
    // Listen for the beforeunload event to set the cookie before reload/close
    window.addEventListener('beforeunload', () => {
        const line = get(currentLine)
        if (line) {
            setCookie('line', line.id, 2);
        }
        const time = get(currentTime);
        setCookie('time', time.toString(), 2);
    });
};

// Function to set state and calculate cookie age
export const getState = () => {
    const currentTime = new Date().getTime();
    const lastLineCookie = getCookie('line');
    const lastTime = getCookie('time');


    let lastLine;
    if (lastLineCookie) {
        const lines = get(allLines);
        lastLine = lines.find((line) =>
            compareStationNames(line.id, lastLineCookie)
          );
    }

    lastState.set({
        line: lastLine ? lastLine : undefined,
        time: lastTime ? Number(lastTime) : 0,
    });
};