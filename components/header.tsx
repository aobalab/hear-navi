import { Categories } from "@/app/hearing/config";
import nextConfig from "@/next.config";
import Link from "next/link";

function Header({ category, section }: { category: string; section: string }) {
    const cat = Categories[category as keyof typeof Categories];
    const categoryLabel = category === "record" ? "カルテ" : cat ? cat.label : "ヒアリング";
    const currentCategoryIcon = category === "record"
        ? `${nextConfig.basePath}/img/カルテ_黄色.svg`
        : `${nextConfig.basePath}/img/${categoryLabel}_黄色.png`;

    return (
        <header className="grid grid-cols-12 p-4">
            <div className="col-span-1"></div>
            <div className="col-span-1 flex items-center">
                <figure>
                    <img src={nextConfig.basePath + "/img/logo.png"} alt="Logo" className="w-16 h-16 rounded-lg" />
                </figure>
            </div>
            <div className="col-span-3 flex items-center gap-4">
                <figure className="bg-white rounded-lg p-2">
                    <img src={currentCategoryIcon} alt={categoryLabel} className="w-10 h-10" />
                </figure>
                <span className="flex items-center text-center text-xl text-white">{categoryLabel}</span>
            </div>
            <div className="col-span-6 flex items-start justify-end gap-6 overflow-x-auto text-white">
                {Object.entries(Categories).map(([key, item]) => {
                    const isActive = key === category;

                    return (
                        <Link
                            key={key}
                            href={`/hearing/${key}/${item.sections[0].title}`}
                            className="min-w-fit"
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                <figure className={isActive ? "rounded-2xl bg-white/15 p-2" : "rounded-2xl p-2 transition-colors hover:bg-white/10"}>
                                    <img
                                        src={nextConfig.basePath + `/img/${item.label}_${isActive ? "黄色" : "青"}.png`}
                                        alt={item.label}
                                        className="h-10 w-10 object-contain"
                                    />
                                </figure>
                                <span className={isActive ? "text-sm font-semibold text-white" : "text-sm font-medium text-white/90"}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
                <Link
                    href="/hearing/record"
                    className="min-w-fit"
                >
                    <div className="flex flex-col items-center gap-2 text-center">
                        <figure className={category === "record" ? "rounded-2xl bg-white/15 p-2" : "rounded-2xl p-2 transition-colors hover:bg-white/10"}>
                            <img
                                src={category === "record"
                                    ? `${nextConfig.basePath}/img/カルテ_黄色.svg`
                                    : `${nextConfig.basePath}/img/カルテ_青.svg`
                                }
                                alt="カルテ"
                                className="h-10 w-10 object-contain"
                            />
                        </figure>
                        <span className={category === "record" ? "text-sm font-semibold text-white" : "text-sm font-medium text-white/90"}>カルテ</span>
                    </div>
                </Link>
            </div>
            {/* <div className="col-span-4"></div> */}
        </header>
    );
}

export default Header;