import { Categories } from "@/app/hearing/config";
import Link from "next/link";

function SideBar({ category, section }: { category: string; section?: string }) {
    const currentCategory = Categories[category as keyof typeof Categories];
    const sections = currentCategory?.sections ?? [];

    return (
        <div className="main-side-bar p-4 col-span-3 flex flex-col gap-8">
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
