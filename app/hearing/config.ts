import { parseLabeledAnswer } from "@/lib/hearing-answer-format";

export type TargetAudienceType = "法人" | "個人";

export interface Section {
    title: string;
    label: string;
    audienceTypes?: TargetAudienceType[];
}

export const Categories: Record<string, {
    label: string;
    sections: Section[];
}> = {
    requirements: {
        label: "要件",
        sections: [
            { title: "self-introduction", label: "自己紹介" },
            { title: "company-detail", label: "会社詳細" },
            { title: "background", label: "背景" },
        ]
    },
    target: {
        label: "ターゲット",
        sections: [
            { title: "user-type", label: "法人・個人" },
            { title: "industry", label: "法人 業種", audienceTypes: ["法人"] },
            { title: "gender", label: "個人 性別", audienceTypes: ["個人"] },
            { title: "age", label: "個人 年齢", audienceTypes: ["個人"] },
            { title: "status", label: "個人 属性", audienceTypes: ["個人"] },
        ]
    },
    function: {
        label: "機能",
        sections: [
            { title: "site-category", label: "サイト種類" },
            { title: "site-page", label: "サイトページ" },
            { title: "site-function", label: "サイト機能" },

        ]
    },
    image: {
        label: "イメージ",
        sections: [
            { title: "abstract", label: "抽象的" },
            { title: "impression1", label: "印象" },
        ]
    },
    proposal: {
        label: "提案",
        sections: [
            { title: "schedule", label: "スケジュール" },
            { title: "budget", label: "予算" },
        ]
    },
};

export function getTargetAudienceType(answers: Record<string, string> = {}) {
    const stored = answers["user-type"] ?? "";
    const { values, remainder } = parseLabeledAnswer(stored, ["対象"]);
    const audienceType = values["対象"] ?? remainder;

    if (audienceType === "法人" || audienceType === "個人") {
        return audienceType;
    }

    return null;
}

export function getCategorySections(category: string, answers: Record<string, string> = {}) {
    const currentCategory = Categories[category];

    if (!currentCategory) {
        return [];
    }

    if (category !== "target") {
        return currentCategory.sections;
    }

    const audienceType = getTargetAudienceType(answers);

    return currentCategory.sections.filter((section) => {
        if (!section.audienceTypes || section.audienceTypes.length === 0) {
            return true;
        }

        return audienceType ? section.audienceTypes.includes(audienceType) : false;
    });
}

export function getFirstSectionTitle(category: string, answers: Record<string, string> = {}) {
    const currentCategory = Categories[category];

    if (!currentCategory) {
        return null;
    }

    return getCategorySections(category, answers)[0]?.title ?? currentCategory.sections[0]?.title ?? null;
}
