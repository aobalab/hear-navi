"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function SelfIntroductionQuestion() {
    const [value, setValue] = useHearingAnswer("self-introduction");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">
                    自己紹介
                </FieldTitle>
                <FieldDescription className="mb-3">
                    事業内容やご担当範囲、今回の相談背景が伝わるように自由に記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 株式会社○○で広報を担当しています。今回のサイト制作では採用強化を主な目的に考えています。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}
