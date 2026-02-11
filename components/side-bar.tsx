import { Categories } from "@/app/hearing/config";
import Link from "next/link";

function SideBar({ category }: { category: string }) {
    const currentCategoryLabel = Categories[category as keyof typeof Categories].label;
    return (
        <div className="main-side-bar p-4 col-span-3 flex flex-col gap-8">
            {Object.entries(Categories).map(([key, category]) => (
                <Link href={`/hearing/${key}/${category.sections[0].title}`} key={category.label}>
                    <div key={category.label} className="main-side-bar-item text-center flex flex-col items-center gap-2 p-1">
                        <figure>
                            <img src={`/img/${category.label}_${category.label === currentCategoryLabel ? "黄色" : "青"}.png`} alt={category.label} />
                        </figure>
                        <span>
                            {category.label}
                        </span>
                    </div>
                </Link>
            ))
            }
            <div className="bg-blue-500 text-center text-white p-2 rounded">カルテ</div>
        </div >
    );
}

export default SideBar;
