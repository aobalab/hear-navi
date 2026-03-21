"use client";

import { useEffect, useState } from "react";
import { CircleOff, Mars, Venus } from "lucide-react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function GenderQuestion() {
    const [genderType, setGenderType] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().gender ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["傾向"]);

        setGenderType(values["傾向"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "gender",
            formatLabeledAnswer([
                ["傾向", genderType],
            ])
        );
    }, [genderType, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">個人 性別</FieldTitle>
                <FieldDescription className="mb-3">
                    ターゲットの性別傾向を選択してください。
                </FieldDescription>
                <RadioGroup value={genderType} onValueChange={setGenderType} className="grid gap-4 md:grid-cols-2">
                    <label
                        htmlFor="gender-male"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-8 text-center transition-colors",
                            genderType === "男性" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="男性" id="gender-male" className="sr-only" />
                        <Mars className="size-14" aria-hidden="true" />
                        <div>
                            <p className="text-lg font-semibold">男性</p>
                            <p className="text-sm text-muted-foreground">男性ユーザーを主に想定する場合</p>
                        </div>
                    </label>
                    <label
                        htmlFor="gender-female"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-8 text-center transition-colors",
                            genderType === "女性" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="女性" id="gender-female" className="sr-only" />
                        <Venus className="size-14" aria-hidden="true" />
                        <div>
                            <p className="text-lg font-semibold">女性</p>
                            <p className="text-sm text-muted-foreground">女性ユーザーを主に想定する場合</p>
                        </div>
                    </label>
                </RadioGroup>
                <RadioGroup value={genderType} onValueChange={setGenderType} className="gap-2">
                    <label
                        htmlFor="gender-none"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors",
                            genderType === "指定なし" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="指定なし" id="gender-none" className="sr-only" />
                        <CircleOff className="size-5" aria-hidden="true" />
                        <div>
                            <p className="font-medium">特に指定しない</p>
                        </div>
                    </label>
                </RadioGroup>
            </FieldContent>
        </Field>
    );
}