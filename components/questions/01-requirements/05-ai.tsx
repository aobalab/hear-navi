"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { buildHearingSummary, HEARING_STORAGE_EVENT, readHearingAnswers } from "@/lib/hearing-storage";

export default function AiQuestion() {
    const [summary, setSummary] = useState("");

    useEffect(() => {
        const syncSummary = () => {
            setSummary(buildHearingSummary(readHearingAnswers()));
        };

        syncSummary();
        window.addEventListener("storage", syncSummary);
        window.addEventListener(HEARING_STORAGE_EVENT, syncSummary);

        return () => {
            window.removeEventListener("storage", syncSummary);
            window.removeEventListener(HEARING_STORAGE_EVENT, syncSummary);
        };
    }, []);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">要約</FieldTitle>
                <FieldDescription className="mb-3">
                    ここまでのヒアリング内容を確認できます。
                </FieldDescription>
                <Textarea
                    id="textarea-message"
                    className="min-h-[240px]"
                    placeholder="各質問への回答がここに反映されます"
                    value={summary}
                    readOnly
                />
                <p className="text-right text-sm text-muted-foreground">{summary.length}文字</p>
            </FieldContent>
        </Field>
    );
}