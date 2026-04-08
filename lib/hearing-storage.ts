import { Categories } from "@/app/hearing/config";

export const HEARING_STORAGE_KEY = "hear-navi.answers";
export const HEARING_STORAGE_EVENT = "hear-navi:answers-updated";

export type HearingAnswers = Record<string, string>;

const emptyHearingAnswers: HearingAnswers = {};

let cachedStoredValue: string | null = null;
let cachedAnswers: HearingAnswers = emptyHearingAnswers;

export function getSectionLabelMap() {
    return Object.values(Categories).reduce<Record<string, string>>((accumulator, category) => {
        category.sections.forEach((section) => {
            accumulator[section.title] = section.label;
        });

        return accumulator;
    }, {});
}

function parseHearingAnswers(stored: string | null) {
    if (!stored) {
        return emptyHearingAnswers;
    }

    try {
        const parsed = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object") {
            return emptyHearingAnswers;
        }

        const normalizedAnswers = Object.entries(parsed).reduce<HearingAnswers>((accumulator, [key, value]) => {
            if (typeof value === "string") {
                accumulator[key] = value;
            }

            return accumulator;
        }, {});

        return Object.keys(normalizedAnswers).length > 0 ? normalizedAnswers : emptyHearingAnswers;
    } catch {
        return emptyHearingAnswers;
    }
}

export function readHearingAnswers(): HearingAnswers {
    if (typeof window === "undefined") {
        return emptyHearingAnswers;
    }

    const stored = window.sessionStorage.getItem(HEARING_STORAGE_KEY);

    if (stored === cachedStoredValue) {
        return cachedAnswers;
    }

    cachedStoredValue = stored;
    cachedAnswers = parseHearingAnswers(stored);

    return cachedAnswers;
}

export function writeHearingAnswer(section: string, value: string) {
    if (typeof window === "undefined") {
        return;
    }

    const answers = readHearingAnswers();
    const nextAnswers = { ...answers, [section]: value };

    window.sessionStorage.setItem(HEARING_STORAGE_KEY, JSON.stringify(nextAnswers));
    window.dispatchEvent(new CustomEvent(HEARING_STORAGE_EVENT));
}