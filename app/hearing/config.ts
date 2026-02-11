export interface Section {
    title: string;
    label: string;
}

export const Categories: Record<string, {
    label: string;
    sections: Section[];
}> = {
    requirements: {
        label: "要件",
        sections: [
            { title: "self-introduction", label: "自己紹介" },
            { title: "background", label: "背景" },
            { title: "company-detail", label: "会社詳細" },
            { title: "purpose", label: "目的" },
            { title: "ai", label: "AI活用" },
        ]
    },
    target: {
        label: "ターゲット",
        sections: [
            { title: "user-type", label: "法人・個人" },
            { title: "gender", label: "個人 性別" },
            { title: "age", label: "個人 年齢" },
            { title: "status", label: "個人 属性" },
        ]
    },
    function: {
        label: "機能",
        sections: [
            { title: "self-introduction", label: "自己紹介" },
            { title: "site-category", label: "サイト種類" },
            { title: "site-page", label: "サイトページ" },
            { title: "site-function", label: "サイト機能" },

        ]
    },
    image: {
        label: "イメージ",
        sections: [
            { title: "abstract", label: "抽象的" },
            { title: "impression1", label: "印象1" },
            { title: "impression2", label: "印象2" },
            { title: "impression3", label: "印象3" },
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
