"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const impression1Options = [
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

export default function Impression1Question() {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().impression1 ?? "";
        const restoredValues = stored
            .split("\n")
            .map((item) => item.trim())
            .filter((item): item is (typeof impression1Options)[number] =>
                impression1Options.includes(item as (typeof impression1Options)[number])
            );

        setSelectedWords(restoredValues);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("impression1", selectedWords.join("\n"));
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
                <FieldDescription className="mb-3">
                    イメージに近い単語を 4 つまで選択してください。
                </FieldDescription>
                <div className="grid gap-4 md:grid-cols-3">
                    {impression1Options.map((word) => (
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