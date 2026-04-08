"use client";

import { Building2 } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

export default function IndustryQuestion() {
    const [value, setValue] = useHearingAnswer("industry");

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    対象となる法人の業種を入力してください。
                </FieldDescription>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="size-4 text-[#1C5D99]" aria-hidden="true" />
                        <span>例: 製造業、医療法人、建設業、SaaS など</span>
                    </div>
                    <Input
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="例: BtoB SaaS"
                        maxLength={100}
                    />
                    <p className="mt-2 text-right text-sm text-muted-foreground">{value.length}/100</p>
                </div>
            </FieldContent>
        </Field>
    );
}