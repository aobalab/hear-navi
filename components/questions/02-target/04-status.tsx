"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { HEARING_STORAGE_EVENT, readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function StatusQuestion() {
    const [memo, setMemo] = useState("");

    useEffect(() => {
        const syncAnswers = () => {
            const answers = readHearingAnswers();
            setMemo(answers.status ?? "");
        };

        syncAnswers();
        window.addEventListener("storage", syncAnswers);
        window.addEventListener(HEARING_STORAGE_EVENT, syncAnswers);

        return () => {
            window.removeEventListener("storage", syncAnswers);
            window.removeEventListener(HEARING_STORAGE_EVENT, syncAnswers);
        };
    }, []);

    const handleMemoChange = (nextMemo: string) => {
        setMemo(nextMemo);
        writeHearingAnswer("status", nextMemo);
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    ターゲット像について、必要な補足メモを残してください。
                </FieldDescription>
                <div className="space-y-4">
                    <div>
                        <p className="mb-2 text-sm font-medium text-muted-foreground">補足メモ</p>
                        <Textarea
                            value={memo}
                            onChange={(event) => handleMemoChange(event.target.value)}
                            placeholder="例: 忙しい共働き世帯で、スマホ中心に情報収集する層を想定しています。"
                            className="min-h-[220px]"
                            maxLength={400}
                        />
                        <p className="mt-2 text-right text-sm text-muted-foreground">{memo.length}/400</p>
                    </div>
                </div>
            </FieldContent>
        </Field>
    );
}