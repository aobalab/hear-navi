import { Categories } from "@/app/hearing/config";
import { StepBarWithLabel } from "./step-bar";
import nextConfig from "@/next.config";

function Header({ category, section }: { category: string; section: string }) {
    const cat = Categories[category as keyof typeof Categories];
    const categoryLabel = cat ? cat.label : "ヒアリング";
    const sections = cat.sections;
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
                    <img src={nextConfig.basePath + `/img/${categoryLabel}_黄色.png`} alt={categoryLabel} className="w-10 h-10" />
                </figure>
                <span className="flex items-center text-center text-xl text-white">{categoryLabel}</span>
            </div>
            <div className="col-span-5 text-white">
                <StepBarWithLabel
                    sections={sections}
                    currentStep={sections.findIndex(sec => sec.title === section)}
                />
            </div>
            {/* <div className="col-span-4"></div> */}
        </header>
    );
}

export default Header;