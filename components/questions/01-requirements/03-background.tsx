"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function BackgroundQuestion() {
    const [backgroundType, setBackgroundType] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().background ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["状況", "補足"]);

        setBackgroundType(values["状況"] ?? "");
        setDetail(values["補足"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "background",
            formatLabeledAnswer([
                ["状況", backgroundType],
                ["補足", detail],
            ])
        );
    }, [backgroundType, detail, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    現在の状況を選択し、背景や課題感があれば補足してください。
                </FieldDescription>
                <RadioGroup value={backgroundType} onValueChange={setBackgroundType} className="gap-4">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="新しくWebサイトを作りたい" id="background-new-site" />
                        <Label htmlFor="background-new-site">新しくWebサイトを作りたい</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="今あるWebサイトをリニューアルしたい" id="background-renewal" />
                        <Label htmlFor="background-renewal">今あるWebサイトをリニューアルしたい</Label>
                    </div>
                </RadioGroup>
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 既存サイトからの問い合わせが少なく、情報も古くなってきたため刷新を考えています。"
                    className="min-h-[200px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}