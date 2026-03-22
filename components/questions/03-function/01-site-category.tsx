"use client";

import { useEffect, useState } from "react";
import { BadgeCent, BriefcaseBusiness, CalendarRange, Newspaper, Search, ShoppingCart } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const siteCategoryOptions = [
    {
        name: "corporate",
        value: "コーポレートサイト",
        catchcopy: "会社を知って欲しい",
        description: "企業情報や事業内容を伝える標準的な企業サイト",
        icon: BriefcaseBusiness,
    },
    {
        name: "ec",

        value: "ECサイト",
        catchcopy: "商品を売りたい",
        description: "商品販売や決済を目的にしたオンラインショップ",
        icon: ShoppingCart,
    },
    {
        name: "media",
        value: "メディアサイト",
        catchcopy: "記事を読んで欲しい",
        description: "記事や読み物を継続的に発信する情報サイト",
        icon: Newspaper,
    },
    {
        name: "brand",
        value: "ブランドサイト",
        catchcopy: "魅力を伝えたい",
        description: "ブランドの世界観や魅力を印象的に伝えるサイト",
        icon: BadgeCent,
    },
    {
        name: "lp-event",
        value: "LP・イベントサイト",
        catchcopy: "キャンペーンを伝えたい",
        description: "単一訴求やイベント告知に特化した縦長ページ中心のサイト",
        icon: CalendarRange,
    },
    {
        name: "recruit",
        value: "採用サイト",
        catchcopy: "新しく人を雇いたい",
        description: "採用情報や働く魅力を発信するリクルート向けサイト",
        icon: Search,
    },
] as const;

export default function SiteCategoryQuestion() {
    const [siteCategory, setSiteCategory] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers()["site-category"] ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["種類"]);

        setSiteCategory(values["種類"] ?? remainder);
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "site-category",
            formatLabeledAnswer([
                ["種類", siteCategory],
            ])
        );
    }, [isReady, siteCategory]);

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    想定しているサイト種類を 1 つ選択してください。
                </FieldDescription>
                <RadioGroup value={siteCategory} onValueChange={setSiteCategory} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {siteCategoryOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                            <label
                                key={option.value}
                                htmlFor={`site-category-${option.value}`}
                                className={cn(
                                    "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-6 text-center transition-colors",
                                    siteCategory === option.value && "border-primary bg-primary/5"
                                )}
                            >
                                <RadioGroupItem value={option.value} id={`site-category-${option.value}`} className="sr-only" />
                                <p className="text-xl font-semibold leading-snug">{option.catchcopy}</p>
                                <Icon className="size-12" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{option.value}</p>
                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                            </label>
                        );
                    })}
                </RadioGroup>
            </FieldContent>
        </Field>
    );
}