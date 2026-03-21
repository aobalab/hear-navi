"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function ScheduleQuestion() {
    const [value, setValue] = useHearingAnswer("schedule");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">スケジュール</FieldTitle>
                <FieldDescription className="mb-3">
                    公開希望時期や社内の確認スケジュールがあれば記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 7 月末公開を希望しており、4 月中に要件を固めたいです。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}