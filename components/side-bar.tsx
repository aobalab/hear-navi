import { Categories } from "@/app/hearing/config";
import { hearingCategoryIcons } from "@/lib/hearing-category-icons";
import Link from "next/link";

function SideBar({ category, section }: { category: string; section?: string }) {
    const currentCategory = Categories[category as keyof typeof Categories];
    const sections = currentCategory?.sections ?? [];
    const categoryLabel = currentCategory?.label ?? "ヒアリング";
    const CategoryIcon = hearingCategoryIcons[category];

    return (
        <div className="main-side-bar flex h-fit self-start flex-col gap-8 p-4 min-w-[150px]">
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-4 py-5 text-center shadow-sm">
                <figure className="rounded-xl bg-[#6599FF]/10 p-3">
                    {CategoryIcon ? (
                        <CategoryIcon aria-hidden="true" className="h-12 w-12 text-[#6599FF]" strokeWidth={1.8} />
                    ) : null}
                </figure>
                <p className="text-base font-semibold text-slate-800">{categoryLabel}</p>
            </div>
            {sections.map((item) => {
                const isActive = item.title === section;
                return (
                    <Link href={`/hearing/${category}/${item.title}`} key={item.title}>
                        <div className={isActive
                            ? "rounded-xl bg-[#6599FF] px-4 py-3 text-sm font-medium text-white shadow-sm"
                            : "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-[#6599FF] hover:text-[#6599FF]"
                        }>
                            {item.label}
                        </div>
                    </Link>
                );
            })}
        </div >
    );
}

export default SideBar;
