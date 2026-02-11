"use client";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react';

export default function Page() {
    const [textLength, setTextLength] = useState(0);
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
        <div className="mb-24">
            <h2 className="main-content-label mb-4 text-l font-bold">
                要約
            </h2>
            <Textarea id="textarea-message" className="min-h-[240px]" placeholder="ヒアリングシート内容を反映"
                onChange={(e) => setTextLength(e.target.value.length)} />
            <div className="text-right">
                {textLength + "/400"}
            </div>
        </div>
    </>);
}