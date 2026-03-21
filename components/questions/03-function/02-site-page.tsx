"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const sitePageOptions = [
    "会社概要を見て欲しい",
    "お知らせを見て欲しい",
    "お問い合わせを見て欲しい",
    "メディアを見て欲しい",
    "商品を見て欲しい",
    "求人を見て欲しい",
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

export default function SitePageQuestion() {
    const [sitePages, setSitePages] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["site-page"] ?? "";

        setSitePages(parseStoredSelections(stored, "ページ"));
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("site-page", sitePages.join("\n"));
    }, [isReady, sitePages]);

    const toggleSitePage = (option: string) => {
        setSitePages((current) =>
            current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
        );
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    特に見てほしいページの方向性を複数選択してください。
                </FieldDescription>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sitePageOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => toggleSitePage(option)}
                            className={cn(
                                "border-input hover:border-primary/40 flex min-h-32 cursor-pointer items-center justify-center rounded-xl border p-6 text-center transition-colors",
                                sitePages.includes(option) && "border-primary bg-primary/5"
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