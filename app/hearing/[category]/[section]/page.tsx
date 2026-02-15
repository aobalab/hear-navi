import { Categories } from '../../config';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Summary from "@/components/summary";

export function generateStaticParams() {
    const params: { category: string; section: string }[] = [];

    Object.keys(Categories).forEach(category => {
        Categories[category].sections.forEach(section => {
            params.push({
                category,
                section: section.title
            });
        });
    });

    return params;
}

export default function Page() {
    return (<>
        <div className="mt-8 mb-12">
            <h2 className="main-content-label mb-4 text-l font-bold">
                状況
            </h2>
            <RadioGroup defaultValue="comfortable" className="w-fit">
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">新しくWebサイトを作りたい</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">今あるWebサイトをリニューアルしたい</Label>
                </div>
            </RadioGroup>
        </div>
        <Summary />
    </>);
}