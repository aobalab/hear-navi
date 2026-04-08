"use client";

import { Building2, UserRound } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { writeHearingAnswer } from "@/lib/hearing-storage";
import { useHearingAnswer } from "@/lib/use-hearing-answer";

const personalBranchSections = ["gender", "age", "status"] as const;

export default function UserTypeQuestion() {
    const [storedValue, setStoredValue] = useHearingAnswer("user-type");
    const { values, remainder } = parseLabeledAnswer(storedValue, ["対象"]);
    const audienceType = values["対象"] ?? remainder;

    const handleAudienceTypeChange = (nextAudienceType: string) => {
        setStoredValue(
            formatLabeledAnswer([
                ["対象", nextAudienceType],
            ])
        );

        if (!nextAudienceType) {
            return;
        }

        if (nextAudienceType === "法人") {
            personalBranchSections.forEach((section) => {
                writeHearingAnswer(section, "");
            });
            return;
        }

        if (nextAudienceType === "個人") {
            writeHearingAnswer("industry", "");
        }
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    主なターゲット像を選択してください。
                </FieldDescription>
                <RadioGroup value={audienceType} onValueChange={handleAudienceTypeChange} className="grid gap-4 md:grid-cols-2">
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