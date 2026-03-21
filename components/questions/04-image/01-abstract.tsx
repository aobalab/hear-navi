"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const sliderDefinitions = [
    { key: "softness", label: "柔らかい/硬い", left: "柔らかい", right: "硬い" },
    { key: "warmth", label: "あたたかい/つめたい", left: "あたたかい", right: "つめたい" },
    { key: "weight", label: "軽い/重い", left: "軽い", right: "重い" },
    { key: "shape", label: "なめらか/尖っている", left: "なめらか", right: "尖っている" },
] as const;

type SliderKey = (typeof sliderDefinitions)[number]["key"];

const defaultValues: Record<SliderKey, number> = {
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

    return Math.max(0, Math.min(100, parsed));
}

export default function AbstractQuestion() {
    const [values, setValues] = useState<Record<SliderKey, number>>(defaultValues);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().abstract ?? "";
        const { values: parsedValues } = parseLabeledAnswer(stored, sliderDefinitions.map((item) => item.label));

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

    const updateValue = (key: SliderKey, nextValue: number) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: nextValue,
        }));
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    4 つの軸をスライダーで調整して、全体の方向性を表現してください。
                </FieldDescription>
                <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
                    {sliderDefinitions.map((definition) => (
                        <div key={definition.key} className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm font-semibold text-slate-700">{definition.label}</p>
                                <span className="text-sm font-medium text-[#1C5D99]">{values[definition.key]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={values[definition.key]}
                                onChange={(event) => updateValue(definition.key, Number(event.target.value))}
                                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1C5D99]"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{definition.left}</span>
                                <span>{definition.right}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </FieldContent>
        </Field>
    );
}