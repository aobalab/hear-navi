"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const stepDefinitions = [
    { key: "softness", label: "柔らかい/硬い", left: "柔らかい", right: "硬い" },
    { key: "warmth", label: "あたたかい/つめたい", left: "あたたかい", right: "つめたい" },
    { key: "weight", label: "軽い/重い", left: "軽い", right: "重い" },
    { key: "shape", label: "なめらか/尖っている", left: "なめらか", right: "尖っている" },
] as const;

const stepValues = [0, 25, 50, 75, 100] as const;
const stepDotSizes = ["size-7", "size-5", "size-3", "size-5", "size-7"] as const;

type StepKey = (typeof stepDefinitions)[number]["key"];

const defaultValues: Record<StepKey, number> = {
    softness: 50,
    warmth: 50,
    weight: 50,
    shape: 50,
};

function parseStoredNumber(value: string) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 50;
    }

    const normalizedValue = Math.max(0, Math.min(100, parsed));

    return stepValues.reduce((closest, current) =>
        Math.abs(current - normalizedValue) < Math.abs(closest - normalizedValue) ? current : closest
    );
}

export default function AbstractQuestion() {
    const [values, setValues] = useState<Record<StepKey, number>>(defaultValues);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().abstract ?? "";
        const { values: parsedValues } = parseLabeledAnswer(stored, stepDefinitions.map((item) => item.label));

        setValues({
            softness: parseStoredNumber(parsedValues["柔らかい/硬い"] ?? "50"),
            warmth: parseStoredNumber(parsedValues["あたたかい/つめたい"] ?? "50"),
            weight: parseStoredNumber(parsedValues["軽い/重い"] ?? "50"),
            shape: parseStoredNumber(parsedValues["なめらか/尖っている"] ?? "50"),
        });
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "abstract",
            formatLabeledAnswer([
                ["柔らかい/硬い", String(values.softness)],
                ["あたたかい/つめたい", String(values.warmth)],
                ["軽い/重い", String(values.weight)],
                ["なめらか/尖っている", String(values.shape)],
            ])
        );
    }, [isReady, values]);

    const updateValue = (key: StepKey, nextValue: number) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: nextValue,
        }));
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    4 つの軸について、5 段階のステップから近い印象を選択してください。
                </FieldDescription>
                <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
                    {stepDefinitions.map((definition) => (
                        <div key={definition.key} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
                            <div className="flex items-center gap-4">
                                <span className="w-16 shrink-0 text-left text-sm text-slate-700 md:w-24">
                                    {definition.left}
                                </span>
                                <div className="flex flex-1 items-center justify-between gap-3" role="radiogroup" aria-label={definition.label}>
                                    {stepValues.map((stepValue, index) => {
                                        const isSelected = values[definition.key] === stepValue;

                                        return (
                                            <button
                                                key={`${definition.key}-${stepValue}`}
                                                type="button"
                                                role="radio"
                                                aria-checked={isSelected}
                                                aria-label={`${definition.label} ${index + 1} / 5`}
                                                onClick={() => updateValue(definition.key, stepValue)}
                                                className={cn(
                                                    "shrink-0 rounded-full border-2 bg-transparent transition-colors",
                                                    stepDotSizes[index],
                                                    isSelected
                                                        ? "border-[#1C5D99] bg-[#1C5D99]"
                                                        : "border-slate-300 hover:border-slate-400"
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                                <span className="w-16 shrink-0 text-right text-sm text-slate-700 md:w-24">
                                    {definition.right}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </FieldContent>
        </Field>
    );
}