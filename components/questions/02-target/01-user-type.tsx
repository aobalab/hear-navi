"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function UserTypeQuestion() {
    const [audienceType, setAudienceType] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["user-type"] ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["対象", "補足"]);

        setAudienceType(values["対象"] ?? "");
        setDetail(values["補足"] ?? remainder);
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
                ["補足", detail],
            ])
        );
    }, [audienceType, detail, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">法人・個人</FieldTitle>
                <FieldDescription className="mb-3">
                    主なターゲット像を選択し、必要であれば補足を追加してください。
                </FieldDescription>
                <RadioGroup value={audienceType} onValueChange={setAudienceType} className="gap-4">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="法人中心" id="user-type-business" />
                        <Label htmlFor="user-type-business">法人中心</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="個人中心" id="user-type-personal" />
                        <Label htmlFor="user-type-personal">個人中心</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="法人と個人の両方" id="user-type-both" />
                        <Label htmlFor="user-type-both">法人と個人の両方</Label>
                    </div>
                </RadioGroup>
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 主に中小企業の経営者を想定していますが、一部個人事業主も対象です。"
                    className="min-h-[140px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}