import { notFound } from "next/navigation";

import { questionComponents } from "@/components/questions";
import { Categories } from '../../config';

export function generateStaticParams() {
    const params: { category: string; section: string }[] = [];

    Object.keys(Categories).forEach(category => {
        Categories[category].sections.forEach(section => {
            params.push({
                category,
                section: section.title
            });
        });
    });

    return params;
}

interface PageProps {
    params: Promise<{ category: string; section: string }>;
}

export default async function Page({ params }: PageProps) {
    const { category, section } = await params;
    const currentCategory = Categories[category];

    if (!currentCategory) {
        notFound();
    }

    const currentSection = currentCategory.sections.find((item) => item.title === section);
    const QuestionComponent = questionComponents[category]?.[section];

    if (!currentSection || !QuestionComponent) {
        notFound();
    }

    return (<>
        <div className="absolute main-header -top-4 left-8 pl-4 pr-4 pt-2 pb-2">
            <p className="main-header-subtitle text-md">
                {currentCategory.label}
            </p>
        </div>
        <div className="main-content p-8">
            <div className="mt-8 mb-12">
                <QuestionComponent />
            </div>
        </div>
    </>);
}