"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function Impression2Question() {
    const [value, setValue] = useHearingAnswer("impression2");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">印象2</FieldTitle>
                <FieldDescription className="mb-3">
                    与えたい印象の 2 つ目を記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 先進的で、取り組みが早い会社だと伝わる印象。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}