import { get, writable } from "svelte/store";
import { cookieConsent, currentLine, currentTime } from "../store";
import { setCookie, deleteCookie } from '../utils/cookieUtils';
import { addState } from "./stateManager";

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