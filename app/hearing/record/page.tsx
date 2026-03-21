"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Categories } from "@/app/hearing/config";
import { HEARING_STORAGE_EVENT, readHearingAnswers } from "@/lib/hearing-storage";
import nextConfig from "@/next.config";

type RecordItem = {
    key: string;
    label: string;
    value: string;
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

export default function RecordPage() {
    const [items, setItems] = useState<Record<string, RecordItem[]>>({});

    useEffect(() => {
        const updateItems = () => {
            const answers = readHearingAnswers();

            const nextItems = Object.entries(Categories).reduce<Record<string, RecordItem[]>>((accumulator, [categoryKey, category]) => {
                const categoryItems = category.sections
                    .map((section) => ({
                        key: section.title,
                        label: section.label,
                        value: normalizeAnswer(answers[section.title] ?? ""),
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
                                            <h2 className="text-lg font-semibold text-slate-900">{category.label}</h2>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{filledCount}/{categoryItems.length}件</span>
                                    </div>
                                    <div className="space-y-4">
                                        {categoryItems.map((item) => (
                                            <div key={item.key} className={item.isFilled ? "rounded-xl bg-slate-50 p-4" : "rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4"}>
                                                <div className="mb-2 flex items-center justify-between gap-4">
                                                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
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