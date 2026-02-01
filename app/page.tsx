import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";

export default function Page() {
    return (<>
        <header className="grid grid-cols-12 p-4">
            <div className="col-span-3"></div>
            <div className="text-white col-span-9">
                <div className="grid grid-cols-5">
                    <div className="col-span-2">
                        要件
                    </div>
                    <div className="col-span-3">
                        状況
                    </div>
                </div>
            </div>
        </header>
        <main className="main grid grid-cols-12 gap-12 p-12">
            <div className="main-side-bar p-4 col-span-2">
                <div className="main-side-bar-item text-center">要件</div>
                <div className="main-side-bar-item text-center">ターゲット</div>
                <div className="main-side-bar-item text-center">機能</div>
                <div className="main-side-bar-item text-center">イメージ</div>
                <div className="main-side-bar-item text-center">提案</div>
            </div>
            <div className="main-wrapper col-span-10">
                <div className="main-content p-8">
                    <div className="mb-8">
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
                    <div className="mb-8">
                        <h2 className="main-content-label mb-4 text-l font-bold">
                            要約
                        </h2>
                        <Textarea id="textarea-message" placeholder="ヒアリングシート内容を反映" />
                    </div>
                </div>
                <div className="main-pagination flex justify-between p-4">
                    <Button className="button">&lt; 前へ</Button>
                    <Button className="button">次へ &gt;</Button>
                </div>
            </div>
        </main>
    </>);
}