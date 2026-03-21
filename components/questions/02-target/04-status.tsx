"use client";

import { useEffect, useState } from "react";
import { Baby, Briefcase, CircleOff, Mars, Users, Venus } from "lucide-react";

import { Field, FieldContent, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { HEARING_STORAGE_EVENT, readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const genderSummaryMap = {
    "男性": {
        icon: Mars,
        label: "男性",
        description: "男性ユーザーを主に想定しています。",
    },
    "女性": {
        icon: Venus,
        label: "女性",
        description: "女性ユーザーを主に想定しています。",
    },
    "指定なし": {
        icon: CircleOff,
        label: "特に指定なし",
        description: "性別を限定しない想定です。",
    },
} as const;

const ageCategorySummaryMap = {
    child: {
        icon: Baby,
        label: "子供",
        description: "子供向けのイメージで整理しています。",
    },
    adult: {
        icon: Briefcase,
        label: "大人",
        description: "大人向けのイメージで整理しています。",
    },
    senior: {
        icon: Users,
        label: "シニア",
        description: "シニア向けのイメージで整理しています。",
    },
} as const;

export default function StatusQuestion() {
    const [genderType, setGenderType] = useState("");
    const [ageCategory, setAgeCategory] = useState("");
    const [ageDetail, setAgeDetail] = useState("");
    const [memo, setMemo] = useState("");

    useEffect(() => {
        const syncAnswers = () => {
            const answers = readHearingAnswers();
            const gender = parseLabeledAnswer(answers.gender ?? "", ["傾向"]);
            const age = parseLabeledAnswer(answers.age ?? "", ["区分", "年代", "中心年齢層"]);

            setGenderType(gender.values["傾向"] ?? gender.remainder);
            setAgeCategory(age.values["区分"] ?? "");
            setAgeDetail(age.values["年代"] ?? age.values["中心年齢層"] ?? age.remainder);
            setMemo(answers.status ?? "");
        };

        syncAnswers();
        window.addEventListener("storage", syncAnswers);
        window.addEventListener(HEARING_STORAGE_EVENT, syncAnswers);

        return () => {
            window.removeEventListener("storage", syncAnswers);
            window.removeEventListener(HEARING_STORAGE_EVENT, syncAnswers);
        };
    }, []);

    const handleMemoChange = (nextMemo: string) => {
        setMemo(nextMemo);
        writeHearingAnswer("status", nextMemo);
    };

    const genderSummary = genderSummaryMap[genderType as keyof typeof genderSummaryMap];
    const ageCategorySummary = ageCategorySummaryMap[ageCategory as keyof typeof ageCategorySummaryMap];
    const GenderIcon = genderSummary?.icon;
    const AgeCategoryIcon = ageCategorySummary?.icon;

    return (
        <Field>
            <FieldContent>
                <FieldTitle className="main-content-label mb-1 text-l font-bold">個人 属性</FieldTitle>
                <FieldDescription className="mb-3">
                    性別と年齢の選択結果を確認しながら、補足メモを残してください。
                </FieldDescription>
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
                        <h3 className="text-base font-semibold">イメージ情報</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-border bg-background p-5">
                                <p className="mb-4 text-sm font-medium text-muted-foreground">性別</p>
                                {GenderIcon ? (
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <GenderIcon className="size-12" aria-hidden="true" />
                                        <p className="text-lg font-semibold">{genderSummary.label}</p>
                                        <p className="text-sm text-muted-foreground">{genderSummary.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">まだ選択されていません。</p>
                                )}
                            </div>
                            <div className="rounded-xl border border-border bg-background p-5">
                                <p className="mb-4 text-sm font-medium text-muted-foreground">年齢イメージ</p>
                                {AgeCategoryIcon ? (
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <AgeCategoryIcon className="size-12" aria-hidden="true" />
                                        <p className="text-lg font-semibold">{ageCategorySummary.label}</p>
                                        <p className="text-sm text-muted-foreground">{ageCategorySummary.description}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">まだ選択されていません。</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 rounded-xl border border-border bg-background p-5">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">選択した年齢</p>
                            <p className="mt-2 text-2xl font-semibold">
                                {ageDetail || "未選択"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">メモ</p>
                            <Textarea
                                value={memo}
                                onChange={(event) => handleMemoChange(event.target.value)}
                                placeholder="例: 忙しい共働き世帯で、スマホ中心に情報収集する層を想定しています。"
                                className="min-h-[220px]"
                                maxLength={400}
                            />
                            <p className="mt-2 text-right text-sm text-muted-foreground">{memo.length}/400</p>
                        </div>
                    </div>
                </div>
            </FieldContent>
        </Field>
    );
}