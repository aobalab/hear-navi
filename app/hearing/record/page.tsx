"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCent, Baby, Briefcase, BriefcaseBusiness, Building2, CalendarRange, CircleOff, Mars, Newspaper, Search, ShoppingCart, UserRound, Users, Venus } from "lucide-react";

import { Categories } from "@/app/hearing/config";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { buildHearingSummary, HEARING_STORAGE_EVENT, readHearingAnswers, type HearingAnswers } from "@/lib/hearing-storage";
import nextConfig from "@/next.config";

type RecordItem = {
    key: string;
    label: string;
    value: string;
    rawValue: string;
    isFilled: boolean;
};

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

function normalizeAnswer(value: string) {
    return value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(" / ");
}

function parseListAnswer(value: string) {
    return value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}

function formatDisplayDate(dateValue: string) {
    if (!dateValue) {
        return "";
    }

    const [year, month, day] = dateValue.split("-");
    return `${year}年${Number(month)}月${Number(day)}日`;
}

function buildCalendarDays(displayYear: number, displayMonth: number) {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const days: Array<{ day: number; dateValue: string; weekday: number } | null> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
        days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        days.push({
            day,
            dateValue: `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
            weekday: new Date(displayYear, displayMonth, day).getDay(),
        });
    }

    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
}

function getScheduleRecordData(rawValue: string) {
    const parsed = parseLabeledAnswer(rawValue, ["希望時期", "開始日", "終了日", "希望日", "公開希望月", "補足"]);
    const legacyDate = parsed.values["希望日"] ?? parsed.values["公開希望月"] ?? "";
    const startDate = parsed.values["開始日"] ?? legacyDate;
    const endDate = parsed.values["終了日"] ?? legacyDate;
    const memo = parsed.values["補足"] ?? parsed.remainder;
    const timeline = parsed.values["希望時期"] ?? "";

    return { startDate, endDate, memo, timeline };
}

function getMonthsInRange(startDate: string, endDate: string) {
    if (!startDate) {
        return [] as Array<{ year: number; month: number }>;
    }

    const [startYear, startMonth] = startDate.split("-").map(Number);
    const [endYear, endMonth] = (endDate || startDate).split("-").map(Number);
    const months: Array<{ year: number; month: number }> = [];
    let currentYear = startYear;
    let currentMonth = startMonth - 1;
    const targetKey = endYear * 12 + (endMonth - 1);

    while (currentYear * 12 + currentMonth <= targetKey) {
        months.push({ year: currentYear, month: currentMonth });
        currentMonth += 1;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
    }

    return months;
}

function isDateInRange(dateValue: string, startDate: string, endDate: string) {
    if (!startDate) {
        return false;
    }

    if (!endDate) {
        return dateValue === startDate;
    }

    return dateValue >= startDate && dateValue <= endDate;
}

function isRangeEdge(dateValue: string, startDate: string, endDate: string) {
    return dateValue === startDate || dateValue === endDate;
}

function ScheduleCalendarCard({ rawValue }: { rawValue: string }) {
    const { startDate, endDate, memo, timeline } = getScheduleRecordData(rawValue);
    const months = getMonthsInRange(startDate, endDate);

    if (!startDate) {
        return <p className="text-sm leading-7 text-muted-foreground">{memo || "まだ入力されていません。"}</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
                {timeline ? <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">{timeline}</span> : null}
                <span className="text-slate-700">
                    {formatDisplayDate(startDate)}{endDate ? ` 〜 ${formatDisplayDate(endDate)}` : ""}
                </span>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
                {months.map(({ year, month }) => {
                    const calendarDays = buildCalendarDays(year, month);

                    return (
                        <div key={`${year}-${month}`} className="rounded-xl border border-slate-200 bg-white p-3">
                            <p className="mb-3 text-center text-sm font-semibold text-slate-800">{year}年 {month + 1}月</p>
                            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
                                {weekLabels.map((label, index) => (
                                    <div
                                        key={`${year}-${month}-${label}`}
                                        className={index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 grid grid-cols-7 gap-1">
                                {calendarDays.map((entry, index) => {
                                    if (!entry) {
                                        return <div key={`${year}-${month}-empty-${index}`} className="h-8" />;
                                    }

                                    const inRange = isDateInRange(entry.dateValue, startDate, endDate);
                                    const edge = isRangeEdge(entry.dateValue, startDate, endDate);

                                    return (
                                        <div
                                            key={entry.dateValue}
                                            className={[
                                                "flex h-8 items-center justify-center rounded-md text-xs",
                                                entry.weekday === 0 && !inRange ? "text-red-500" : "",
                                                entry.weekday === 6 && !inRange ? "text-blue-500" : "",
                                                inRange ? "bg-sky-100 text-sky-800" : "",
                                                edge ? "border border-[#1C5D99] bg-amber-300 font-bold text-slate-900 shadow-sm" : "",
                                            ].filter(Boolean).join(" ")}
                                        >
                                            {entry.day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {memo ? <p className="text-sm leading-7 text-slate-900">{memo}</p> : null}
        </div>
    );
}

function FunctionListCard({ rawValue, isFilled }: { rawValue: string; isFilled: boolean }) {
    const items = parseListAnswer(rawValue);

    if (!isFilled || items.length === 0) {
        return <p className="text-sm leading-7 text-muted-foreground">まだ入力されていません。</p>;
    }

    return (
        <ul className="grid gap-x-6 gap-y-2 md:grid-cols-2">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-900">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#1C5D99]" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function AbstractBarChartCard({ rawValue, isFilled }: { rawValue: string; isFilled: boolean }) {
    const parsed = parseLabeledAnswer(rawValue, [
        "柔らかい/硬い",
        "あたたかい/つめたい",
        "軽い/重い",
        "なめらか/尖っている",
    ]);

    const chartItems = [
        { label: "柔らかい/硬い", left: "柔らかい", right: "硬い", value: Number(parsed.values["柔らかい/硬い"] ?? "") },
        { label: "あたたかい/つめたい", left: "あたたかい", right: "つめたい", value: Number(parsed.values["あたたかい/つめたい"] ?? "") },
        { label: "軽い/重い", left: "軽い", right: "重い", value: Number(parsed.values["軽い/重い"] ?? "") },
        { label: "なめらか/尖っている", left: "なめらか", right: "尖っている", value: Number(parsed.values["なめらか/尖っている"] ?? "") },
    ].filter((item) => !Number.isNaN(item.value));

    if (!isFilled || chartItems.length === 0) {
        return <p className="text-sm leading-7 text-muted-foreground">まだ入力されていません。</p>;
    }

    return (
        <div className="space-y-4">
            {chartItems.map((item) => (
                <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-slate-700">{item.left}</span>
                        <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                        <span className="font-medium text-slate-700">{item.right}</span>
                    </div>
                    <div className="relative h-4 rounded-full bg-slate-200">
                        <div className="absolute left-1/2 top-1/2 h-6 w-px -translate-y-1/2 bg-slate-400" />
                        <div
                            className="h-4 rounded-full bg-gradient-to-r from-sky-300 via-[#1C5D99] to-slate-700"
                            style={{ width: `${item.value}%` }}
                        />
                        <div
                            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1C5D99] shadow-sm"
                            style={{ left: `${item.value}%` }}
                        />
                    </div>
                    <div className="text-right text-xs font-medium text-[#1C5D99]">{item.value}</div>
                </div>
            ))}
        </div>
    );
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

function getFunctionCardIcon(itemKey: string, answers: HearingAnswers) {
    if (itemKey !== "site-category") {
        return null;
    }

    const siteCategory = parseLabeledAnswer(answers["site-category"] ?? "", ["種類"]);
    const siteCategoryValue = siteCategory.values["種類"] ?? siteCategory.remainder;

    if (siteCategoryValue === "コーポレートサイト") {
        return <BriefcaseBusiness className="size-5 text-[#1C5D99]" aria-hidden="true" />;
    }

    if (siteCategoryValue === "ECサイト") {
        return <ShoppingCart className="size-5 text-emerald-600" aria-hidden="true" />;
    }

    if (siteCategoryValue === "メディアサイト") {
        return <Newspaper className="size-5 text-orange-500" aria-hidden="true" />;
    }

    if (siteCategoryValue === "ブランドサイト") {
        return <BadgeCent className="size-5 text-rose-500" aria-hidden="true" />;
    }

    if (siteCategoryValue === "LP・イベントサイト") {
        return <CalendarRange className="size-5 text-violet-600" aria-hidden="true" />;
    }

    if (siteCategoryValue === "採用サイト") {
        return <Search className="size-5 text-sky-600" aria-hidden="true" />;
    }

    return null;
}

function getFunctionCardSummary(itemKey: string, answers: HearingAnswers) {
    if (itemKey !== "site-category") {
        return "";
    }

    const siteCategory = parseLabeledAnswer(answers["site-category"] ?? "", ["種類"]);
    const siteCategoryValue = siteCategory.values["種類"] ?? siteCategory.remainder;

    if (siteCategoryValue === "コーポレートサイト") {
        return "会社を知って欲しい";
    }

    if (siteCategoryValue === "ECサイト") {
        return "商品を売りたい";
    }

    if (siteCategoryValue === "メディアサイト") {
        return "記事を読んで欲しい";
    }

    if (siteCategoryValue === "ブランドサイト") {
        return "魅力を伝えたい";
    }

    if (siteCategoryValue === "LP・イベントサイト") {
        return "キャンペーンを伝えたい";
    }

    if (siteCategoryValue === "採用サイト") {
        return "新しく人を雇いたい";
    }

    return "";
}

export default function RecordPage() {
    const [items, setItems] = useState<Record<string, RecordItem[]>>({});
    const [answers, setAnswers] = useState<HearingAnswers>({});

    useEffect(() => {
        const updateItems = () => {
            const answers = readHearingAnswers();
            const aiSummary = buildHearingSummary(answers);
            setAnswers(answers);

            const nextItems = Object.entries(Categories).reduce<Record<string, RecordItem[]>>((accumulator, [categoryKey, category]) => {
                const categoryItems = category.sections
                    .map((section) => {
                        const sectionValue = section.title === "ai"
                            ? aiSummary
                            : answers[section.title] ?? "";
                        const normalizedValue = normalizeAnswer(sectionValue);

                        return {
                            key: section.title,
                            label: section.label,
                            value: normalizedValue,
                            rawValue: sectionValue,
                            isFilled: normalizedValue.length > 0,
                        };
                    });

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
                            const categoryHref = `/hearing/${categoryKey}/${category.sections[0].title}`;

                            return (
                                <section key={categoryKey} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between gap-4 border-b border-border pb-3">
                                        <div className="flex items-center gap-3">
                                            <figure className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 p-2">
                                                <img
                                                    src={nextConfig.basePath + `/img/${category.label}_青.png`}
                                                    alt={category.label}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </figure>
                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900">{category.label}</h2>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">{filledCount}/{categoryItems.length}件</span>
                                            <Link
                                                href={categoryHref}
                                                className={filledCount > 0
                                                    ? "inline-flex items-center rounded-full bg-[#6599FF] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85"
                                                    : "inline-flex items-center rounded-full border border-[#6599FF] px-4 py-1.5 text-sm font-medium text-[#6599FF] transition-colors hover:bg-[#6599FF]/5"
                                                }
                                            >
                                                {filledCount > 0 ? "編集する" : "入力する"}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {categoryItems.map((item) => (
                                            <div key={item.key} className={item.isFilled ? "rounded-xl bg-slate-50 p-4" : "rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4"}>
                                                <div className="mb-2 flex items-center gap-4">
                                                    <div className={categoryKey === "function" && item.key === "site-category" ? "flex items-center gap-4" : "flex items-center gap-2"}>
                                                        {categoryKey === "target" ? getTargetCardIcon(item.key, answers) : null}
                                                        {categoryKey === "function" && item.key === "site-category" ? (
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                                                {getFunctionCardIcon(item.key, answers) ? <div className="[&_svg]:size-7">{getFunctionCardIcon(item.key, answers)}</div> : null}
                                                            </div>
                                                        ) : categoryKey === "function" ? getFunctionCardIcon(item.key, answers) : null}
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                                            {categoryKey === "target" && item.key === "status" && item.isFilled && getTargetCardSummary(item.key, answers) ? (
                                                                <p className="text-xs font-medium text-slate-400">
                                                                    {getTargetCardSummary(item.key, answers)}
                                                                </p>
                                                            ) : null}
                                                            {categoryKey === "function" && item.key === "site-category" && item.isFilled && getFunctionCardSummary(item.key, answers) ? (
                                                                <p className="text-sm font-semibold text-slate-700">
                                                                    {getFunctionCardSummary(item.key, answers)}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                {categoryKey === "proposal" && item.key === "schedule" ? (
                                                    <ScheduleCalendarCard rawValue={item.rawValue} />
                                                ) : categoryKey === "image" && item.key === "abstract" ? (
                                                    <AbstractBarChartCard rawValue={item.rawValue} isFilled={item.isFilled} />
                                                ) : categoryKey === "function" && (item.key === "site-page" || item.key === "site-function") ? (
                                                    <FunctionListCard rawValue={item.rawValue} isFilled={item.isFilled} />
                                                ) : (
                                                    <p className={item.isFilled ? "whitespace-pre-wrap text-sm leading-7 text-slate-900" : "text-sm leading-7 text-muted-foreground"}>
                                                        {item.isFilled ? item.value : "まだ入力されていません。"}
                                                    </p>
                                                )}
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