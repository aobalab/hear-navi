"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function SiteCategoryQuestion() {
    const [value, setValue] = useHearingAnswer("site-category");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">サイト種類</FieldTitle>
                <FieldDescription className="mb-3">
                    コーポレートサイト、採用サイト、LP など想定している種類を記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: コーポレートサイトを中心に、採用情報も強化したいです。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}