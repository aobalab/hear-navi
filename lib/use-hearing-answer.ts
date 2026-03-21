"use client";

import { useEffect, useState } from "react";

import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export function useHearingAnswer(section: string) {
    const [value, setValue] = useState("");

    useEffect(() => {
        const answers = readHearingAnswers();
        setValue(answers[section] ?? "");
    }, [section]);

    const updateValue = (nextValue: string) => {
        setValue(nextValue);
        writeHearingAnswer(section, nextValue);
    };

    return [value, updateValue] as const;
}