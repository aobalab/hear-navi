import { Categories } from "@/app/hearing/config";
import { StepBarWithLabel } from "./step-bar";
import nextConfig from "@/next.config";

function Header({ category, section }: { category: string; section: string }) {
    const cat = Categories[category as keyof typeof Categories];
    const categoryLabel = category === "record" ? "カルテ" : cat ? cat.label : "ヒアリング";
    const sections = cat?.sections ?? [];
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
                    {cat ? <img src={nextConfig.basePath + `/img/${categoryLabel}_黄色.png`} alt={categoryLabel} className="w-10 h-10" /> : <div className="flex h-10 w-10 items-center justify-center rounded bg-[#1C5D99] text-sm font-bold text-white">記</div>}
                </figure>
                <span className="flex items-center text-center text-xl text-white">{categoryLabel}</span>
            </div>
            <div className="col-span-5 text-white">
                {sections.length > 0 ? <StepBarWithLabel
                    sections={sections}
                    currentStep={sections.findIndex(sec => sec.title === section)}
                /> : null}
            </div>
            {/* <div className="col-span-4"></div> */}
        </header>
    );
}

export default Header;