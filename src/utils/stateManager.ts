import { get, writable } from "svelte/store";
import { history, currentLine, currentTime } from "../store";

const cookieIsSet = writable<boolean>(false);

/**
 * Adds a new state as the first element in `history`, keeping a maximum of 10 states.
 * @param newState - The new state to be added to the beginning of the list.
 */
export function addState() {
    history.update((states) => {
        const line = get(currentLine);
        const time = get(currentTime);
        const newState = { line, time };

        if (time !== 0 && line) {
            const updatedStates = [newState, ...states];
            // Limit to 10 states by slicing if necessary
            return updatedStates.slice(0, 10);
        }
        return states;
    });
}

/**
 * Removes and returns the state at the specified index from `history`.
 * @param index - The index of the state to remove.
 * @returns The removed state, or `undefined` if the index is out of bounds.
 */
export function recoverState(index: number): State | undefined {
    let removedState: State | undefined = undefined;

    history.update((states) => {
        // Check if the index is within the bounds of the array
        if (index >= 0 && index < states.length) {
            // Remove the element at the specified index
            removedState = states[index];
            return states.slice(0, index).concat(states.slice(index + 1));
        }
        return states; // Return the list unmodified if index is out of bounds
    });
    return removedState;
}

/**
 * Clears all states from `history`.
 */
export function clearState() {
    history.update(() => []);
}

// Set curret state of the player at unload/reload
export const initFinalState = (mode: boolean = false) => {

    const setState = () => {
        if (!get(cookieIsSet)) {
            cookieIsSet.set(true)
            addState();
        }
    }
    // Depending on the environment different eventListener are necessary
    // Listen for the beforeunload event to set the cookie before reload/close
    window.addEventListener('beforeunload', () => {
        setTimeout(() => {
            setState();
        }, 100);  // Delay for 100ms
    });
    // Use the unload event to ensure cookies are set before the page is unloaded
    window.addEventListener('unload', () => {
        setState();
    });
    // Manually Triggering the Cookie Update
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            setState();
        }
    });
};