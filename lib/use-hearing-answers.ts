"use client";

import { useSyncExternalStore } from "react";

import { HEARING_STORAGE_EVENT, readHearingAnswers, type HearingAnswers } from "@/lib/hearing-storage";

const emptyAnswers: HearingAnswers = {};

function subscribeToHearingAnswers(onStoreChange: () => void) {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    window.addEventListener("storage", onStoreChange);
    window.addEventListener(HEARING_STORAGE_EVENT, onStoreChange);

    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(HEARING_STORAGE_EVENT, onStoreChange);
    };
}

export function useHearingAnswers() {
    return useSyncExternalStore(subscribeToHearingAnswers, readHearingAnswers, () => emptyAnswers);
}