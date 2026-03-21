"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function GenderQuestion() {
    const [value, setValue] = useHearingAnswer("gender");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">個人 性別</FieldTitle>
                <FieldDescription className="mb-3">
                    ターゲット像に性別傾向がある場合のみ記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 男女問わず想定していますが、現状は女性ユーザーがやや多いです。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}