"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Baby, Briefcase, Building2, CircleOff, Mars, UserRound, Users, Venus } from "lucide-react";

import { Categories } from "@/app/hearing/config";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { HEARING_STORAGE_EVENT, readHearingAnswers, type HearingAnswers } from "@/lib/hearing-storage";
import nextConfig from "@/next.config";

type RecordItem = {
    key: string;
    label: string;
    value: string;
    rawValue: string;
    href: string;
    isFilled: boolean;
};

function normalizeAnswer(value: string) {
    return value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(" / ");
}

function getTargetCardIcon(itemKey: string, answers: HearingAnswers) {
    if (itemKey === "user-type") {
        const userType = parseLabeledAnswer(answers["user-type"] ?? "", ["対象"]);
        const audienceType = userType.values["対象"] ?? userType.remainder;

        if (audienceType === "法人") {
            return <Building2 className="size-5 text-[#1C5D99]" aria-hidden="true" />;
        }

        if (audienceType === "個人") {
            return <UserRound className="size-5 text-[#1C5D99]" aria-hidden="true" />;
        }
    }

    if (itemKey === "gender") {
        const gender = parseLabeledAnswer(answers.gender ?? "", ["傾向"]);
        const genderType = gender.values["傾向"] ?? gender.remainder;

        if (genderType === "男性") {
            return <Mars className="size-5 text-sky-600" aria-hidden="true" />;
        }

        if (genderType === "女性") {
            return <Venus className="size-5 text-rose-500" aria-hidden="true" />;
        }

        if (genderType === "指定なし") {
            return <CircleOff className="size-5 text-slate-500" aria-hidden="true" />;
        }
    }

    if (itemKey === "age") {
        const age = parseLabeledAnswer(answers.age ?? "", ["区分", "年代", "中心年齢層"]);
        const ageCategory = age.values["区分"] ?? "";

        if (ageCategory === "child") {
            return <Baby className="size-5 text-amber-500" aria-hidden="true" />;
        }

        if (ageCategory === "adult") {
            return <Briefcase className="size-5 text-emerald-600" aria-hidden="true" />;
        }

        if (ageCategory === "senior") {
            return <Users className="size-5 text-violet-600" aria-hidden="true" />;
        }
    }

    if (itemKey === "status") {
        const gender = parseLabeledAnswer(answers.gender ?? "", ["傾向"]);
        const age = parseLabeledAnswer(answers.age ?? "", ["区分", "年代", "中心年齢層"]);
        const genderType = gender.values["傾向"] ?? gender.remainder;
        const ageCategory = age.values["区分"] ?? "";

        return (
            <div className="flex items-center gap-1.5" aria-hidden="true">
                {genderType === "男性" ? <Mars className="size-4 text-sky-600" /> : null}
                {genderType === "女性" ? <Venus className="size-4 text-rose-500" /> : null}
                {genderType === "指定なし" ? <CircleOff className="size-4 text-slate-500" /> : null}
                {ageCategory === "child" ? <Baby className="size-4 text-amber-500" /> : null}
                {ageCategory === "adult" ? <Briefcase className="size-4 text-emerald-600" /> : null}
                {ageCategory === "senior" ? <Users className="size-4 text-violet-600" /> : null}
            </div>
        );
    }

    return null;
}

function getTargetCardSummary(itemKey: string, answers: HearingAnswers) {
    if (itemKey !== "status") {
        return "";
    }

    const gender = parseLabeledAnswer(answers.gender ?? "", ["傾向"]);
    const age = parseLabeledAnswer(answers.age ?? "", ["区分", "年代", "中心年齢層"]);
    const genderType = gender.values["傾向"] ?? gender.remainder;
    const ageDetail = age.values["年代"] ?? age.values["中心年齢層"] ?? age.remainder;

    return [genderType, ageDetail].filter((value) => value.length > 0).join(" / ");
}

export default function RecordPage() {
    const [items, setItems] = useState<Record<string, RecordItem[]>>({});
    const [answers, setAnswers] = useState<HearingAnswers>({});

    useEffect(() => {
        const updateItems = () => {
            const answers = readHearingAnswers();
            setAnswers(answers);

            const nextItems = Object.entries(Categories).reduce<Record<string, RecordItem[]>>((accumulator, [categoryKey, category]) => {
                const categoryItems = category.sections
                    .map((section) => ({
                        key: section.title,
                        label: section.label,
                        value: normalizeAnswer(answers[section.title] ?? ""),
                        rawValue: answers[section.title] ?? "",
                        href: `/hearing/${categoryKey}/${section.title}`,
                        isFilled: normalizeAnswer(answers[section.title] ?? "").length > 0,
                    }));

                accumulator[categoryKey] = categoryItems;
                return accumulator;
            }, {});

            setItems(nextItems);
        };

        updateItems();
        window.addEventListener(HEARING_STORAGE_EVENT, updateItems);
        window.addEventListener("storage", updateItems);

        return () => {
            window.removeEventListener(HEARING_STORAGE_EVENT, updateItems);
            window.removeEventListener("storage", updateItems);
        };
    }, []);

    const hasAnyAnswer = Object.values(items).some((categoryItems) => categoryItems.length > 0);

    return (
        <>
            <div className="absolute main-header -top-4 left-8 pl-4 pr-4 pt-2 pb-2">
                <p className="main-header-subtitle text-md">カルテ</p>
            </div>
            <div className="main-content p-8">
                <div className="mt-8 mb-12 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">ヒアリングカルテ</h1>
                        <p className="mt-2 text-sm text-muted-foreground">回答済み・未回答を含めて、カテゴリごとの進捗を一覧表示しています。</p>
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                        {Object.entries(Categories).map(([categoryKey, category]) => {
                            const categoryItems = items[categoryKey] ?? [];
                            const filledCount = categoryItems.filter((item) => item.isFilled).length;
                            const isTargetCategory = categoryKey === "target";

                            return (
                                <section key={categoryKey} className={isTargetCategory ? "rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 shadow-sm" : "rounded-2xl border border-border bg-white p-6 shadow-sm"}>
                                    <div className={isTargetCategory ? "mb-4 flex items-center justify-between gap-4 rounded-2xl bg-[#1C5D99] px-4 py-3 text-white" : "mb-4 flex items-center justify-between gap-4 border-b border-border pb-3"}>
                                        <div className="flex items-center gap-3">
                                            <figure className={isTargetCategory ? "flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 p-2 backdrop-blur-sm" : "flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 p-2"}>
                                                <img
                                                    src={nextConfig.basePath + `/img/${category.label}_青.png`}
                                                    alt={category.label}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </figure>
                                            <div>
                                                <h2 className={isTargetCategory ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>{category.label}</h2>
                                                {isTargetCategory ? <p className="text-xs text-white/75">選択内容に応じたアイコン付きで確認できます</p> : null}
                                            </div>
                                        </div>
                                        <span className={isTargetCategory ? "rounded-full bg-white/15 px-3 py-1 text-xs text-white" : "text-xs text-muted-foreground"}>{filledCount}/{categoryItems.length}件</span>
                                    </div>
                                    <div className="space-y-4">
                                        {categoryItems.map((item) => (
                                            <div key={item.key} className={isTargetCategory
                                                ? item.isFilled
                                                    ? "rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_10px_30px_rgba(28,93,153,0.08)]"
                                                    : "rounded-2xl border border-dashed border-sky-200 bg-white/80 p-4"
                                                : item.isFilled
                                                    ? "rounded-xl bg-slate-50 p-4"
                                                    : "rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4"
                                            }>
                                                <div className="mb-2 flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2">
                                                        {categoryKey === "target" ? getTargetCardIcon(item.key, answers) : null}
                                                        <div>
                                                            <p className={isTargetCategory ? "text-sm font-semibold text-slate-700" : "text-sm font-medium text-slate-500"}>{item.label}</p>
                                                            {categoryKey === "target" && item.key === "status" && item.isFilled && getTargetCardSummary(item.key, answers) ? (
                                                                <p className="text-xs font-medium text-sky-700/70">
                                                                    {getTargetCardSummary(item.key, answers)}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={item.href}
                                                        className={item.isFilled
                                                            ? "inline-flex items-center rounded-full bg-[#1C5D99] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
                                                            : "inline-flex items-center rounded-full border border-[#1C5D99] px-4 py-1.5 text-sm font-medium text-[#1C5D99] transition-colors hover:bg-[#1C5D99]/5"
                                                        }
                                                    >
                                                        {item.isFilled ? "編集する" : "入力する"}
                                                    </Link>
                                                </div>
                                                <p className={item.isFilled ? "whitespace-pre-wrap text-sm leading-7 text-slate-900" : "text-sm leading-7 text-muted-foreground"}>
                                                    {item.isFilled ? item.value : "まだ入力されていません。"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                    {!hasAnyAnswer ? (
                        <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-center text-sm text-muted-foreground">
                            まだ回答が保存されていません。各項目の「入力する」から開始できます。
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}