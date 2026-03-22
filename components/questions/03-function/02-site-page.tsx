"use client";

import { useEffect, useState } from "react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

type SiteCategoryName = "corporate" | "ec" | "media" | "brand" | "lp-event" | "recruit";

interface SitePageOption {
    label: string;
    recommendType: readonly SiteCategoryName[];
}

const siteCategoryValueToName: Record<string, SiteCategoryName> = {
    "コーポレートサイト": "corporate",
    "ECサイト": "ec",
    "メディアサイト": "media",
    "ブランドサイト": "brand",
    "LP・イベントサイト": "lp-event",
    "採用サイト": "recruit",
};

const sitePageOptions: readonly SitePageOption[] = [
    { label: "会社概要を見て欲しい", recommendType: ["corporate", "ec", "media", "brand", "lp-event", "recruit"] },
    { label: "お知らせを見て欲しい", recommendType: ["corporate", "ec", "brand"] },
    { label: "お問い合わせを見て欲しい", recommendType: ["corporate", "brand", "lp-event"] },
    { label: "メディアを見て欲しい", recommendType: ["corporate", "media"] },
    { label: "商品を見て欲しい", recommendType: ["ec", "lp-event"] },
    { label: "求人を見て欲しい", recommendType: ["recruit"] },
];

function parseStoredSelections(value: string, label: string) {
    const { values, remainder } = parseLabeledAnswer(value, [label]);
    const labeledValue = values[label];

    if (labeledValue) {
        return [labeledValue];
    }

    return remainder
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}

export default function SitePageQuestion() {
    const [sitePages, setSitePages] = useState<string[]>([]);
    const [siteCategory, setSiteCategory] = useState<SiteCategoryName | "">("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const answers = readHearingAnswers();
        const stored = answers["site-page"] ?? "";
        const { values, remainder } = parseLabeledAnswer(answers["site-category"] ?? "", ["種類"]);
        const selectedCategory = values["種類"] ?? remainder;

        setSitePages(parseStoredSelections(stored, "ページ"));
        setSiteCategory(siteCategoryValueToName[selectedCategory] ?? "");
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer("site-page", sitePages.join("\n"));
    }, [isReady, sitePages]);

    const toggleSitePage = (option: string) => {
        setSitePages((current) =>
            current.includes(option)
                ? current.filter((item) => item !== option)
                : [...current, option]
        );
    };

    const recommendedOptions = siteCategory
        ? sitePageOptions.filter((option) => option.recommendType.includes(siteCategory))
        : [];
    const otherOptions = siteCategory
        ? sitePageOptions.filter((option) => !option.recommendType.includes(siteCategory))
        : sitePageOptions;

    const renderOptionGroup = (title: string, options: readonly SitePageOption[], isRecommended = false) => {
        if (options.length === 0) {
            return null;
        }

        return (
            <section
                className={cn(
                    "space-y-3",
                    isRecommended && "rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5"
                )}
            >
                <div className="flex items-center gap-2">
                    <h3
                        className={cn(
                            "text-sm font-semibold tracking-wide text-muted-foreground",
                            isRecommended && "text-primary"
                        )}
                    >
                        {title}
                    </h3>
                    {isRecommended && (
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground">
                            サイト種類から提案
                        </span>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {options.map((option) => (
                        <button
                            key={option.label}
                            type="button"
                            onClick={() => toggleSitePage(option.label)}
                            className={cn(
                                "border-input hover:border-primary/40 flex min-h-32 cursor-pointer items-center justify-center rounded-xl border p-6 text-center transition-colors",
                                isRecommended && "border-primary/30 bg-background shadow-sm",
                                sitePages.includes(option.label) &&
                                (isRecommended
                                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                                    : "border-primary bg-primary/5")
                            )}
                        >
                            <p className="text-xl font-semibold leading-snug">{option.label}</p>
                        </button>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    特に見てほしいページの方向性を複数選択してください。
                </FieldDescription>
                <div className="space-y-6">
                    {renderOptionGroup("おすすめ", recommendedOptions, true)}
                    {renderOptionGroup("その他", otherOptions)}
                </div>
            </FieldContent>
        </Field>
    );
}