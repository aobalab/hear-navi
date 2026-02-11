import { Categories } from "@/app/hearing/config"
import Link from "next/link"
import { Button } from "./ui/button";

function getNextSectionLink(category: string, section: string) {
    const currentCategoryIndex = Object.keys(Categories).indexOf(category);
    const currentSections = Categories[category as keyof typeof Categories].sections;
    const currentSectionIndex = currentSections.findIndex(sec => sec.title === section);
    if (currentSections.length == currentSectionIndex + 1) {
        const nextCategory = Object.keys(Categories)[currentCategoryIndex + 1];
        if (!nextCategory) {
            return null;
        }
        return `${nextCategory}/${Categories[nextCategory as keyof typeof Categories].sections[0].title}`;
    }
    return `${category}/${currentSections[currentSectionIndex + 1].title}`;
};

function getPreviousSectionLink(category: string, section: string) {
    const currentCategoryIndex = Object.keys(Categories).indexOf(category);
    const currentSections = Categories[category as keyof typeof Categories].sections;
    const currentSectionIndex = currentSections.findIndex(sec => sec.title === section);
    if (currentSectionIndex == 0) {
        const prevCategory = Object.keys(Categories)[currentCategoryIndex - 1];
        if (!prevCategory) {
            return null;
        }
        return `${prevCategory}/${Categories[prevCategory as keyof typeof Categories].sections.slice(-1)[0].title}`;
    }
    return `${category}/${currentSections[currentSectionIndex - 1].title}`;
};

export default function Pagination({ category, section }: { category: string, section: string }) {
    const nextLink = getNextSectionLink(category, section);
    const prevLink = getPreviousSectionLink(category, section);
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
                    </Link> : <div></div>
            }
        </div >
    )
}