"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const impression2Options = [
    "ロマンティック",
    "ポップ",
    "カジュアル",
    "かわいい",
    "強い",
    "くだけている",
    "キュート",
    "クリア",
    "親しみやすい",
    "プリティ",
    "おしゃれ",
    "エレガント",
] as const;

export default function Impression2Question() {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().impression2 ?? "";
        const restoredValues = stored
            .split("\n")
            .map((item) => item.trim())
            .filter((item): item is (typeof impression2Options)[number] =>
                impression2Options.includes(item as (typeof impression2Options)[number])
            );

        setSelectedWords(restoredValues);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("impression2", selectedWords.join("\n"));
    }, [isReady, selectedWords]);

    const toggleWord = (word: string) => {
        setSelectedWords((current) => {
            if (current.includes(word)) {
                return current.filter((item) => item !== word);
            }

            if (current.length >= 4) {
                return current;
            }

            return [...current, word];
        });
    };

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">印象2</FieldTitle>
                <FieldDescription className="mb-3">
                    イメージに近い単語を 4 つまで選択してください。
                </FieldDescription>
                <div className="grid gap-4 md:grid-cols-3">
                    {impression2Options.map((word) => (
                        <button
                            key={word}
                            type="button"
                            onClick={() => toggleWord(word)}
                            className={cn(
                                "border-input hover:border-primary/40 flex min-h-28 items-center justify-center rounded-xl border p-5 text-center transition-colors",
                                selectedWords.includes(word) && "border-primary bg-primary/5"
                            )}
                        >
                            <p className="text-xl font-semibold leading-snug">{word}</p>
                        </button>
                    ))}
                </div>
                <p className="text-right text-sm text-muted-foreground">{selectedWords.length}/4 選択中</p>
            </FieldContent>
        </Field>
    );
}