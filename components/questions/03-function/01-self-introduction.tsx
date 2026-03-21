"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

export default function SelfIntroductionQuestion() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastNameKana, setLastNameKana] = useState("");
    const [firstNameKana, setFirstNameKana] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["self-introduction"] ?? "";
        const { values } = parseLabeledAnswer(stored, ["姓", "名", "セイ", "メイ", "会社名", "職業"]);

        setLastName(values["姓"] ?? "");
        setFirstName(values["名"] ?? "");
        setLastNameKana(values["セイ"] ?? "");
        setFirstNameKana(values["メイ"] ?? "");
        setCompanyName(values["会社名"] ?? "");
        setOccupation(values["職業"] ?? "");
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "self-introduction",
            formatLabeledAnswer([
                ["姓", lastName],
                ["名", firstName],
                ["セイ", lastNameKana],
                ["メイ", firstNameKana],
                ["会社名", companyName],
                ["職業", occupation],
            ])
        );
    }, [companyName, firstName, firstNameKana, isReady, lastName, lastNameKana, occupation]);

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">
                    自己紹介
                </FieldTitle>
                <FieldDescription className="mb-3">
                    お名前、フリガナ、会社名、職業を入力してください。
                </FieldDescription>
                <div className="grid items-start gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                    <Label className="pt-2 text-sm font-medium text-foreground">お名前</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input
                            type="text"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            placeholder="姓"
                        />
                        <Input
                            type="text"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="名"
                        />
                        <Input
                            type="text"
                            value={lastNameKana}
                            onChange={(event) => setLastNameKana(event.target.value)}
                            placeholder="セイ"
                        />
                        <Input
                            type="text"
                            value={firstNameKana}
                            onChange={(event) => setFirstNameKana(event.target.value)}
                            placeholder="メイ"
                        />
                    </div>
                    <Label className="pt-2 text-sm font-medium text-foreground">会社名</Label>
                    <Input
                        type="text"
                        value={companyName}
                        onChange={(event) => setCompanyName(event.target.value)}
                        placeholder="会社名"
                    />
                    <Label className="pt-2 text-sm font-medium text-foreground">職業</Label>
                    <Input
                        type="text"
                        value={occupation}
                        onChange={(event) => setOccupation(event.target.value)}
                        placeholder="職業"
                    />
                </div>
            </FieldContent>
        </Field>
    );
}
