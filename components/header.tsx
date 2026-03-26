import { Categories } from "@/app/hearing/config";
import { hearingCategoryIcons } from "@/lib/hearing-category-icons";
import Link from "next/link";

function Header({ category, section: _section }: { category: string; section: string }) {
    const RecordIcon = hearingCategoryIcons.record;

    return (
        <header className="flex bg-white pt-2 pb-2 px-24">
            <div className="flex-1 flex items-center">
                <figure>
                    <img src={"/img/logo.png"} alt="Logo" className="w-48 rounded-lg" />
                </figure>
            </div>
            <div className="flex-1 flex items-start justify-end gap-6 overflow-x-auto text-slate-700">
                {Object.entries(Categories).map(([key, item]) => {
                    const isActive = key === category;
                    const Icon = hearingCategoryIcons[key];

                    return (
                        <Link
                            key={key}
                            href={`/hearing/${key}/${item.sections[0].title}`}
                            className="min-w-fit"
                        >
                            <div className="flex flex-col items-center gap-1 text-center">
                                <figure className={isActive ? "rounded-xl bg-[#6599FF]/10 p-3" : "rounded-xl p-3 transition-colors hover:bg-slate-100"}>
                                    <Icon
                                        aria-hidden="true"
                                        className={isActive ? "h-12 w-12 text-[#6599FF]" : "h-12 w-12 text-slate-700"}
                                    />
                                </figure>
                                <span className={isActive ? "text-sm font-semibold text-[#6599FF]" : "text-sm font-medium text-slate-700"}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
                <Link
                    href="/hearing/record"
                    className="min-w-fit"
                >
                    <div className="flex flex-col items-center gap-1 text-center">
                        <figure className={category === "record" ? "rounded-xl bg-[#6599FF]/10 p-3" : "rounded-xl p-3 transition-colors hover:bg-slate-100"}>
                            <RecordIcon
                                aria-hidden="true"
                                className={category === "record" ? "h-12 w-12 text-[#6599FF]" : "h-12 w-12 text-slate-700"}
                            />
                        </figure>
                        <span className={category === "record" ? "text-sm font-semibold text-[#6599FF]" : "text-sm font-medium text-slate-700"}>カルテ</span>
                    </div>
                </Link>
            </div>
        </header>
    );
}

export default Header;