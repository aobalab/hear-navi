"use client";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function CompanyDetailQuestion() {
    const [value, setValue] = useHearingAnswer("company-detail");

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">会社詳細</FieldTitle>
                <FieldDescription className="mb-3">
                    会社概要、サービス内容、強みなどサイトに載せたい情報を記入してください。
                </FieldDescription>
                <Textarea
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="例: 法人向けの業務改善コンサルティングを提供しており、製造業支援の実績が強みです。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{value.length}/400</p>
            </FieldContent>
        </Field>
    );
}