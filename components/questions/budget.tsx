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

export default function BudgetQuestion() {
    const [budgetRange, setBudgetRange] = useState("");
    const [amount, setAmount] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().budget ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["予算帯", "想定金額", "補足"]);

        setBudgetRange(values["予算帯"] ?? "");
        setAmount(values["想定金額"] ?? "");
        setDetail(values["補足"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "budget",
            formatLabeledAnswer([
                ["予算帯", budgetRange],
                ["想定金額", amount],
                ["補足", detail],
            ])
        );
    }, [amount, budgetRange, detail, isReady]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">予算</FieldTitle>
                <FieldDescription className="mb-3">
                    予算帯を選択し、決まっている金額や条件があれば補足してください。
                </FieldDescription>
                <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="予算帯を選択" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="50万円未満">50万円未満</SelectItem>
                        <SelectItem value="50万円〜100万円">50万円〜100万円</SelectItem>
                        <SelectItem value="100万円〜300万円">100万円〜300万円</SelectItem>
                        <SelectItem value="300万円〜500万円">300万円〜500万円</SelectItem>
                        <SelectItem value="500万円以上">500万円以上</SelectItem>
                        <SelectItem value="未定">未定</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="例: 初期費用 150 万円、運用費 月 5 万円程度"
                />
                <Textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="例: 補助金の活用も視野に入れているため、段階的な提案があると助かります。"
                    className="min-h-[140px]"
                    maxLength={400}
                />
                <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
            </FieldContent>
        </Field>
    );
}