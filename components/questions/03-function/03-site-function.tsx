"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const siteFunctionOptions = [
    "予約をして欲しい",
    "商品を買って欲しい",
    "記事を読んで欲しい",
    "場所を知って欲しい",
    "検索からすぐ見つけて欲しい",
    "会社の活動をもっと知って欲しい",
] as const;

function parseStoredSelections(value: string, label: string) {
    const { values, remainder } = parseLabeledAnswer(value, [label]);
    const labeledValue = values[label];

    if (labeledValue) {
        return [labeledValue];
    }

    return remainder
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

export default function SiteFunctionQuestion() {
    const [siteFunctions, setSiteFunctions] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["site-function"] ?? "";

        setSiteFunctions(parseStoredSelections(stored, "機能"));
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("site-function", siteFunctions.join("\n"));
    }, [isReady, siteFunctions]);

    const toggleSiteFunction = (option: string) => {
        setSiteFunctions((current) =>
            current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
        );
    };

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">サイト機能</FieldTitle>
                <FieldDescription className="mb-3">
                    特に期待する機能や役割を複数選択してください。
                </FieldDescription>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {siteFunctionOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => toggleSiteFunction(option)}
                            className={cn(
                                "border-input hover:border-primary/40 flex min-h-32 cursor-pointer items-center justify-center rounded-xl border p-6 text-center transition-colors",
                                siteFunctions.includes(option) && "border-primary bg-primary/5"
                            )}
                        >
                            <p className="text-xl font-semibold leading-snug">{option}</p>
                        </button>
                    ))}
                </div>
            </FieldContent>
        </Field>
    );
}