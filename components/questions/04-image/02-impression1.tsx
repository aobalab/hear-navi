"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const impressionOptions = [
    "ポップ",
    "カジュアル",
    "かわいい",
    "強い",
    "くだけている",
    "キュート",
    "親しみやすい",
    "プリティ",
    "お洒落",
    "エレガント",
    "シック",
    "上品",
    "クール",
    "ダイナミック",
    "ゴージャス",
    "高級",
    "ワイルド",
    "クラシック",
    "フォーマル",
    "モダン",
    "ハード",
    "活発",
    "若々しい",
    "真面目",
    "しっかりしている",
    "知的",
    "男っぽい",
    "楽しい",
    "誠実",
    "信頼感",
    "かっこいい"
] as const;

function restoreSelections(value: string) {
    return value
        .split("\n")
        .map((item) => item.trim())
        .filter((item): item is (typeof impressionOptions)[number] =>
            impressionOptions.includes(item as (typeof impressionOptions)[number])
        );
}

export default function Impression1Question() {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const answers = readHearingAnswers();

        setSelectedWords(restoreSelections(answers.impression1 ?? ""));
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("impression1", selectedWords.join("\n"));
        writeHearingAnswer("impression2", "");
        writeHearingAnswer("impression3", "");
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
                    {impressionOptions.map((word) => (
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