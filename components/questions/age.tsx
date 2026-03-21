"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function AgeQuestion() {
    const [ageRange, setAgeRange] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().age ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["中心年齢層", "補足"]);

        setAgeRange(values["中心年齢層"] ?? "");
        setDetail(values["補足"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "age",
            formatLabeledAnswer([
                ["中心年齢層", ageRange],
                ["補足", detail],
            ])
        );
    }, [ageRange, detail, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">個人 年齢</FieldTitle>
                <FieldDescription className="mb-3">
                    想定している中心年齢層を選択し、必要なら補足を記入してください。
                </FieldDescription>
                <Select value={ageRange} onValueChange={setAgeRange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="中心となる年齢層を選択" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10代以下">10代以下</SelectItem>
                        <SelectItem value="20代">20代</SelectItem>
                        <SelectItem value="30代">30代</SelectItem>
                        <SelectItem value="40代">40代</SelectItem>
                        <SelectItem value="50代">50代</SelectItem>
                        <SelectItem value="60代以上">60代以上</SelectItem>
                        <SelectItem value="幅広い年齢層">幅広い年齢層</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 30代前半から50代前半の働く世代を中心に想定しています。"
                    className="min-h-[140px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}