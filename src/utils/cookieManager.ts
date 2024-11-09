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

// Set curret state of the player
export const setState = () => {

    const init_state = () => {
        const line = get(currentLine)
        const time = get(currentTime);
        if(time != 0) {
            if (line) {
                setCookie('line', line.id, 2);
            }
            setCookie('time', time.toString(), 2);
        }
    }

    // Depending on the environment different eventListener are necessary
    // Listen for the beforeunload event to set the cookie before reload/close
    window.addEventListener('beforeunload', () => {
        setTimeout(() => {
            init_state();
        }, 100);  // Delay for 100ms
    });
    // Use the unload event to ensure cookies are set before the page is unloaded
    window.addEventListener('unload', () => {
        init_state();
    });
    // Manually Triggering the Cookie Update
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            init_state();
        }
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