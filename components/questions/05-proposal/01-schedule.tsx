"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

export default function ScheduleQuestion() {
    const [timeline, setTimeline] = useState("");
    const [publishMonth, setPublishMonth] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().schedule ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["希望時期", "公開希望月", "補足"]);

        setTimeline(values["希望時期"] ?? "");
        setPublishMonth(values["公開希望月"] ?? "");
        setDetail(values["補足"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "schedule",
            formatLabeledAnswer([
                ["希望時期", timeline],
                ["公開希望月", publishMonth],
                ["補足", detail],
            ])
        );
    }, [detail, isReady, publishMonth, timeline]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">スケジュール</FieldTitle>
                <FieldDescription className="mb-3">
                    希望時期と公開目安を入力し、必要なら社内事情などを補足してください。
                </FieldDescription>
                <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="希望時期を選択" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="できるだけ早く">できるだけ早く</SelectItem>
                        <SelectItem value="1か月以内">1か月以内</SelectItem>
                        <SelectItem value="3か月以内">3か月以内</SelectItem>
                        <SelectItem value="半年以内">半年以内</SelectItem>
                        <SelectItem value="時期未定">時期未定</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="month"
                    value={publishMonth}
                    onChange={(event) => setPublishMonth(event.target.value)}
                />
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 7 月末公開を希望しており、4 月中に要件を固めたいです。"
                    className="min-h-[140px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}