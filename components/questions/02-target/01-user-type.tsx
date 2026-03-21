"use client";

import { useEffect, useState } from "react";
import { Building2, UserRound } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function UserTypeQuestion() {
    const [audienceType, setAudienceType] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["user-type"] ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["対象"]);

        setAudienceType(values["対象"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "user-type",
            formatLabeledAnswer([
                ["対象", audienceType],
            ])
        );
    }, [audienceType, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    主なターゲット像を選択してください。
                </FieldDescription>
                <RadioGroup value={audienceType} onValueChange={setAudienceType} className="grid gap-4 md:grid-cols-2">
                    <label
                        htmlFor="user-type-business"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-8 text-center transition-colors",
                            audienceType === "法人" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="法人" id="user-type-business" className="sr-only" />
                        <Building2 className="size-14" aria-hidden="true" />
                        <div>
                            <p className="text-lg font-semibold">法人</p>
                            <p className="text-sm text-muted-foreground">企業や組織を主な対象にする場合</p>
                        </div>
                    </label>
                    <label
                        htmlFor="user-type-personal"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-8 text-center transition-colors",
                            audienceType === "個人" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="個人" id="user-type-personal" className="sr-only" />
                        <UserRound className="size-14" aria-hidden="true" />
                        <div>
                            <p className="text-lg font-semibold">個人</p>
                            <p className="text-sm text-muted-foreground">一般ユーザーや生活者を主な対象にする場合</p>
                        </div>
                    </label>
                </RadioGroup>
            </FieldContent>
        </Field>
    );
}