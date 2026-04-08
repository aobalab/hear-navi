"use client";

import { Categories, getCategorySections, getFirstSectionTitle, getTargetAudienceType } from "@/app/hearing/config"
import { FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button";
import { type HearingAnswers } from "@/lib/hearing-storage";
import { useHearingAnswers } from "@/lib/use-hearing-answers";

function getNextSectionLink(category: string, section: string, answers: HearingAnswers) {
    const currentCategoryIndex = Object.keys(Categories).indexOf(category);
    const currentSections = getCategorySections(category, answers);
    const currentSectionIndex = currentSections.findIndex(sec => sec.title === section);

    if (currentCategoryIndex === -1 || currentSectionIndex === -1) {
        return null;
    }

    if (currentSections.length == currentSectionIndex + 1) {
        const nextCategory = Object.keys(Categories)[currentCategoryIndex + 1];
        if (!nextCategory) {
            return null;
        }

        const nextSectionTitle = getFirstSectionTitle(nextCategory, answers);

        return nextSectionTitle ? `${nextCategory}/${nextSectionTitle}` : null;
    }

    return `${category}/${currentSections[currentSectionIndex + 1].title}`;
};

function getPreviousSectionLink(category: string, section: string, answers: HearingAnswers) {
    const currentCategoryIndex = Object.keys(Categories).indexOf(category);
    const currentSections = getCategorySections(category, answers);
    const currentSectionIndex = currentSections.findIndex(sec => sec.title === section);

    if (currentCategoryIndex === -1 || currentSectionIndex === -1) {
        return null;
    }

    if (currentSectionIndex == 0) {
        const prevCategory = Object.keys(Categories)[currentCategoryIndex - 1];
        if (!prevCategory) {
            return null;
        }

        const prevSections = getCategorySections(prevCategory, answers);
        const prevSectionTitle = prevSections[prevSections.length - 1]?.title;

        return prevSectionTitle ? `${prevCategory}/${prevSectionTitle}` : null;
    }

    return `${category}/${currentSections[currentSectionIndex - 1].title}`;
};

export default function Pagination({ category, section }: { category: string, section: string }) {
    const answers = useHearingAnswers();
    const nextLink = getNextSectionLink(category, section, answers);
    const prevLink = getPreviousSectionLink(category, section, answers);
    const needsAudienceTypeSelection = category === "target" && section === "user-type" && !getTargetAudienceType(answers);
    const isLastSection = nextLink === null && !needsAudienceTypeSelection;

    return (
        <div className="main-pagination flex justify-between p-4">
            {
                prevLink ?
                    <Link href={`/hearing/${prevLink}`}>
                        <Button className="button">&lt; 前へ</Button>
                    </Link> : <div></div>
            }
            {
                nextLink ?
                    <Link href={`/hearing/${nextLink}`}>
                        <Button className="button">次へ &gt;</Button>
                    </Link> : needsAudienceTypeSelection ?
                        <Button className="button" disabled>次へ &gt;</Button> : isLastSection ?
                            <Link href="/hearing/record">
                                <Button className="button bg-[#1C5D99] shadow-md hover:bg-[#174C7D]">
                                    <FileText aria-hidden="true" />
                                    カルテへ &gt;
                                </Button>
                            </Link> : <div></div>
            }
        </div >
    )
}