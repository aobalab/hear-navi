import { Categories } from "@/app/hearing/config";
import nextConfig from "@/next.config";
import Link from "next/link";

function SideBar({ category, section }: { category: string; section?: string }) {
    const currentCategory = Categories[category as keyof typeof Categories];
    const sections = currentCategory?.sections ?? [];
    const categoryLabel = category === "record" ? "カルテ" : currentCategory?.label ?? "ヒアリング";
    const currentCategoryIcon = category === "record"
        ? `${nextConfig.basePath}/img/カルテ_黄色.svg`
        : `${nextConfig.basePath}/img/${categoryLabel}_黄色.png`;

    return (
        <div className="main-side-bar p-4 col-span-3 flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-5 text-center shadow-sm">
                <figure className="rounded-2xl bg-[#6599FF]/10 p-3">
                    <img src={currentCategoryIcon} alt={categoryLabel} className="h-12 w-12 object-contain" />
                </figure>
                <p className="text-base font-semibold text-slate-800">{categoryLabel}</p>
            </div>
            {sections.length > 0 ? sections.map((item) => {
                const isActive = item.title === section;

                return (
                    <Link href={`/hearing/${category}/${item.title}`} key={item.title}>
                        <div className={isActive
                            ? "rounded-2xl bg-[#6599FF] px-4 py-3 text-sm font-medium text-white shadow-sm"
                            : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-[#6599FF] hover:text-[#6599FF]"
                        }>
                            {item.label}
                        </div>
                    </Link>
                );
            }) : (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
                    カルテ
                </div>
            )}
        </div >
    );
}

export default SideBar;
