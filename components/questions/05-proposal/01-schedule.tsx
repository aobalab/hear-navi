"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
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

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

function formatDisplayDate(dateValue: string) {
    if (!dateValue) {
        return "未選択";
    }

    const [year, month, day] = dateValue.split("-");
    return `${year}年${Number(month)}月${Number(day)}日`;
}

function formatDisplayRange(startDate: string, endDate: string) {
    if (!startDate && !endDate) {
        return "未選択";
    }

    if (startDate && !endDate) {
        return `${formatDisplayDate(startDate)} から`;
    }

    if (!startDate && endDate) {
        return formatDisplayDate(endDate);
    }

    return `${formatDisplayDate(startDate)} 〜 ${formatDisplayDate(endDate)}`;
}

function normalizeRange(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
        return { startDate, endDate };
    }

    return startDate <= endDate
        ? { startDate, endDate }
        : { startDate: endDate, endDate: startDate };
}

function getTodayDateValue() {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getRangeDayCount(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
        return null;
    }

    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
    const startTime = Date.UTC(startYear, startMonth - 1, startDay);
    const endTime = Date.UTC(endYear, endMonth - 1, endDay);

    return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
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

export default function ScheduleQuestion() {
    const [timeline, setTimeline] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [detail, setDetail] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
    const todayDateValue = getTodayDateValue();

    useEffect(() => {
        const stored = readHearingAnswers().schedule ?? "";
        const { values, remainder } = parseLabeledAnswer(stored, ["希望時期", "開始日", "終了日", "希望日", "公開希望月", "補足"]);
        const restoredSingleDate = values["希望日"] ?? values["公開希望月"] ?? "";
        const restoredStartDate = values["開始日"] ?? restoredSingleDate;
        const restoredEndDate = values["終了日"] ?? restoredSingleDate;

        setTimeline(values["希望時期"] ?? "");
        setStartDate(restoredStartDate);
        setEndDate(restoredEndDate);
        setDetail(values["補足"] ?? remainder);

        if (restoredStartDate) {
            const parsedDate = new Date(restoredStartDate);

            if (!Number.isNaN(parsedDate.getTime())) {
                setDisplayYear(parsedDate.getFullYear());
                setDisplayMonth(parsedDate.getMonth());
            }
        }

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
                ["開始日", startDate],
                ["終了日", endDate],
                ["補足", detail],
            ])
        );
    }, [detail, endDate, isReady, startDate, timeline]);

    const calendarDays = buildCalendarDays(displayYear, displayMonth);

    const showPreviousMonth = () => {
        setDisplayMonth((currentMonth) => {
            if (currentMonth === 0) {
                setDisplayYear((currentYear) => currentYear - 1);
                return 11;
            }

            return currentMonth - 1;
        });
    };

    const showNextMonth = () => {
        setDisplayMonth((currentMonth) => {
            if (currentMonth === 11) {
                setDisplayYear((currentYear) => currentYear + 1);
                return 0;
            }

            return currentMonth + 1;
        });
    };

    const handleDateClick = (dateValue: string) => {
        if (dateValue < todayDateValue) {
            return;
        }

        if (!startDate || (startDate && endDate)) {
            setStartDate(dateValue);
            setEndDate("");
            return;
        }

        if (startDate === dateValue) {
            setEndDate(dateValue);
            return;
        }

        const normalizedRange = normalizeRange(startDate, dateValue);
        setStartDate(normalizedRange.startDate);
        setEndDate(normalizedRange.endDate);
    };

    const isInSelectedRange = (dateValue: string) => {
        if (!startDate) {
            return false;
        }

        if (!endDate) {
            return startDate === dateValue;
        }

        return dateValue >= startDate && dateValue <= endDate;
    };

    const isRangeEdge = (dateValue: string) => dateValue === startDate || dateValue === endDate;
    const selectedRangeDayCount = getRangeDayCount(startDate, endDate);

    return (
        <Field>
            <FieldContent>
                <FieldDescription className="mb-3">
                    左側で希望時期と期間を選択し、右側に補足メモを記入してください。
                </FieldDescription>
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-4 rounded-xl border border-border bg-background p-5">
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">希望時期</p>
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
                        </div>
                        <div className="rounded-xl border border-border bg-white p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={showPreviousMonth}
                                    className="rounded-md border border-border p-2 transition-colors hover:bg-muted"
                                    aria-label="前の月を表示"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <p className="text-base font-semibold">{displayYear}年 {displayMonth + 1}月</p>
                                <button
                                    type="button"
                                    onClick={showNextMonth}
                                    className="rounded-md border border-border p-2 transition-colors hover:bg-muted"
                                    aria-label="次の月を表示"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-sm text-muted-foreground">
                                {weekLabels.map((label, index) => (
                                    <div
                                        key={label}
                                        className={cn(
                                            "py-1",
                                            index === 0 && "text-red-500",
                                            index === 6 && "text-blue-500"
                                        )}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 grid grid-cols-7 gap-2">
                                {calendarDays.map((entry, index) => {
                                    if (!entry) {
                                        return <div key={`empty-${index}`} className="h-10" />;
                                    }

                                    const isPastDate = entry.dateValue < todayDateValue;
                                    const isSelected = isInSelectedRange(entry.dateValue);
                                    const isEdge = isRangeEdge(entry.dateValue);
                                    const isSunday = entry.weekday === 0;
                                    const isSaturday = entry.weekday === 6;

                                    return (
                                        <button
                                            key={entry.dateValue}
                                            type="button"
                                            disabled={isPastDate}
                                            onClick={() => handleDateClick(entry.dateValue)}
                                            className={cn(
                                                "flex h-10 items-center justify-center rounded-md border border-transparent bg-white text-sm transition-colors",
                                                !isPastDate && "hover:border-border hover:bg-muted",
                                                isPastDate && "cursor-not-allowed text-muted-foreground/40",
                                                !isSelected && !isPastDate && isSunday && "text-red-500",
                                                !isSelected && !isPastDate && isSaturday && "text-blue-500",
                                                isSelected && "border-primary/30 bg-primary/10 text-primary",
                                                isEdge && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                            )}
                                        >
                                            {entry.day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p>選択期間: {formatDisplayRange(startDate, endDate)}</p>
                            {selectedRangeDayCount ? <p>{selectedRangeDayCount}日間</p> : null}
                            <p>開始日を選んだ後に終了日を選択してください。</p>
                            <p>本日より前の日付は選択できません。</p>
                        </div>
                    </div>
                    <div className="space-y-3 rounded-xl border border-border bg-background p-5">
                        <p className="text-sm font-medium text-muted-foreground">メモ</p>
                        <Textarea
                            value={detail}
                            onChange={(event) => setDetail(event.target.value)}
                            placeholder="例: 7 月末公開を希望しており、4 月中に要件を固めたいです。"
                            className="min-h-[320px]"
                            maxLength={400}
                        />
                        <p className="text-right text-sm text-muted-foreground">{detail.length}/400</p>
                    </div>
                </div>
            </FieldContent>
        </Field>
    );
}