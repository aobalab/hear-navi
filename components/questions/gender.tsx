"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function GenderQuestion() {
    const [genderType, setGenderType] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().gender ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["傾向", "補足"]);

        setGenderType(values["傾向"] ?? "");
        setDetail(values["補足"] ?? remainder);
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
                ["補足", detail],
            ])
        );
    }, [detail, genderType, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">個人 性別</FieldTitle>
                <FieldDescription className="mb-3">
                    性別傾向がある場合は選択し、詳細があれば補足してください。
                </FieldDescription>
                <RadioGroup value={genderType} onValueChange={setGenderType} className="gap-4">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="指定なし" id="gender-none" />
                        <Label htmlFor="gender-none">指定なし</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="男性中心" id="gender-male" />
                        <Label htmlFor="gender-male">男性中心</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="女性中心" id="gender-female" />
                        <Label htmlFor="gender-female">女性中心</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="その他" id="gender-other" />
                        <Label htmlFor="gender-other">その他</Label>
                    </div>
                </RadioGroup>
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 男女問わず想定していますが、現状は女性ユーザーがやや多いです。"
                    className="min-h-[140px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}