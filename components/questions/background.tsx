"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function BackgroundQuestion() {
    const [value, setValue] = useHearingAnswer("background");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">背景</FieldTitle>
                <FieldDescription className="mb-3">
                    サイト制作や改善を検討し始めた背景や課題感を記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 既存サイトからの問い合わせが少なく、情報も古くなってきたため刷新を考えています。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}