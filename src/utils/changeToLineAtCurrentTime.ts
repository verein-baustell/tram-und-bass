import { get } from "svelte/store";
import { currentLine, muxVideoObject } from "../store";
import { hmsToSeconds } from "./timeFormatter";

export const changeToLineAtTime = (line: Line, time: number) => {
    currentLine.set(line);
    const muxPlayer = get(muxVideoObject);
    if (muxPlayer) {
        muxPlayer.currentTime = time;
        muxPlayer.play();
    }
};
