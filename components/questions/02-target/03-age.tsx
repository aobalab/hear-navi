"use client";

import { useEffect, useState } from "react";
import { IconCane } from "@tabler/icons-react";
import { Baby, Briefcase } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatLabeledAnswer, parseLabeledAnswer } from "@/lib/hearing-answer-format";
import { readHearingAnswers, writeHearingAnswer } from "@/lib/hearing-storage";

const ageOptions = {
    child: ["乳幼児", "小学生", "中学生", "高校生"],
    adult: ["20代", "30代", "40代", "50代"],
    senior: ["60代", "70代", "80代以上"],
} as const;

function inferAgeCategory(detail: string) {
    if (ageOptions.child.includes(detail as (typeof ageOptions.child)[number])) {
        return "child";
    }

    if (ageOptions.adult.includes(detail as (typeof ageOptions.adult)[number])) {
        return "adult";
    }

    if (ageOptions.senior.includes(detail as (typeof ageOptions.senior)[number])) {
        return "senior";
    }

    if (detail === "10代以下") {
        return "child";
    }

    if (["20代", "30代", "40代", "50代", "幅広い年齢層"].includes(detail)) {
        return "adult";
    }

    if (detail === "60代以上") {
        return "senior";
    }

    return "";
}

export default function AgeQuestion() {
    const [ageCategory, setAgeCategory] = useState("");
    const [ageDetail, setAgeDetail] = useState("");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readHearingAnswers().age ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["区分", "年代", "中心年齢層"]);
        const detail = values["年代"] ?? values["中心年齢層"] ?? remainder;
        const category = values["区分"] ?? inferAgeCategory(detail);

        setAgeCategory(category);
        setAgeDetail(detail);
        setIsReady(true);
    }, []);

    useEffect(() => {
        const options = ageOptions[ageCategory as keyof typeof ageOptions];

        if (!options) {
            setAgeDetail("");
            return;
        }

        if (ageDetail && options.includes(ageDetail as never)) {
            return;
        }

        setAgeDetail("");
    }, [ageCategory]);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        writeHearingAnswer(
            "age",
            formatLabeledAnswer([
                ["区分", ageCategory],
                ["年代", ageDetail],
            ])
        );
    }, [ageCategory, ageDetail, isReady]);

    const currentOptions = ageOptions[ageCategory as keyof typeof ageOptions] ?? [];

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    まず大まかな区分を選び、そのあと具体的な年代を選択してください。
                </FieldDescription>
                <RadioGroup value={ageCategory} onValueChange={setAgeCategory} className="grid gap-4 md:grid-cols-3">
                    <label
                        htmlFor="age-child"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-6 text-center transition-colors",
                            ageCategory === "child" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="child" id="age-child" className="sr-only" />
                        <Baby className="size-12" aria-hidden="true" />
                        <p className="text-lg font-semibold">子供</p>
                    </label>
                    <label
                        htmlFor="age-adult"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-6 text-center transition-colors",
                            ageCategory === "adult" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="adult" id="age-adult" className="sr-only" />
                        <Briefcase className="size-12" aria-hidden="true" />
                        <p className="text-lg font-semibold">大人</p>
                    </label>
                    <label
                        htmlFor="age-senior"
                        className={cn(
                            "border-input hover:border-primary/40 flex cursor-pointer flex-col items-center gap-4 rounded-xl border p-6 text-center transition-colors",
                            ageCategory === "senior" && "border-primary bg-primary/5"
                        )}
                    >
                        <RadioGroupItem value="senior" id="age-senior" className="sr-only" />
                        <IconCane className="size-12" stroke={2} aria-hidden="true" />
                        <p className="text-lg font-semibold">シニア</p>
                    </label>
                </RadioGroup>
                <div className="space-y-2">
                    <p className="text-sm font-medium">具体的な年代</p>
                    <Select value={ageDetail} onValueChange={setAgeDetail} disabled={!ageCategory}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={ageCategory ? "年代を選択" : "先に区分を選択"} />
                        </SelectTrigger>
                        <SelectContent>
                            {currentOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </FieldContent>
        </Field>
    );
}