import { Categories } from "@/app/hearing/config";

export const HEARING_STORAGE_KEY = "hear-navi.answers";
export const HEARING_STORAGE_EVENT = "hear-navi:answers-updated";

export type HearingAnswers = Record<string, string>;

export function getSectionLabelMap() {
    return Object.values(Categories).reduce<Record<string, string>>((accumulator, category) => {
        category.sections.forEach((section) => {
            accumulator[section.title] = section.label;
        });

        return accumulator;
    }, {});
}

export function readHearingAnswers(): HearingAnswers {
    if (typeof window === "undefined") {
        return {};
    }

    const stored = window.sessionStorage.getItem(HEARING_STORAGE_KEY);

    if (!stored) {
        return {};
    }

    try {
        const parsed = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object") {
            return {};
        }

        return Object.entries(parsed).reduce<HearingAnswers>((accumulator, [key, value]) => {
            if (typeof value === "string") {
                accumulator[key] = value;
            }

            return accumulator;
        }, {});
    } catch {
        return {};
    }
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

export function buildHearingSummary(answers: HearingAnswers) {
    const sectionLabelMap = getSectionLabelMap();

    const orderedSections = Object.values(Categories).flatMap((category) =>
        category.sections.map((section) => section.title)
    );

    return orderedSections
        .filter((section) => (answers[section] ?? "").trim().length > 0)
        .map((section) => {
            const normalizedValue = answers[section]
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .join(" / ");

            return `${sectionLabelMap[section] ?? section}: ${normalizedValue}`;
        })
        .join("\n");
}