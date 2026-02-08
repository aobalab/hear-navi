"use client";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { useState } from 'react';

type Step = {
    label: string
}

type StepBarProps = {
    steps: Step[]
    currentStep: number // 0-based
}

export function StepBarWithLabel({
    steps,
    currentStep,
}: StepBarProps) {
    return (
        <div className="flex w-full justify-between">
            {steps.map((step, index) => {
                const isActive = index <= currentStep

                return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="flex items-center w-full">
                            {index !== 0 && (
                                <div className="h-px flex-1 bg-white border-1" />
                            )}
                            {index === 0 && (
                                <div className="flex-1 bg-white " />
                            )}

                            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2">
                                <span className={
                                    "w-3 h-3 rounded-full font-medium " + (index === currentStep ? "bg-yellow-500" : isActive ? "bg-blue-800" : "bg-white")
                                }></span>
                            </div>

                            {index !== steps.length - 1 && (
                                <div className="h-px flex-1 bg-white border-1" />
                            )}
                            {index === steps.length - 1 && (
                                <div className="flex-1 bg-white " />
                            )}
                        </div>

                        <span className="mt-2">
                            {step.label}
                        </span>
                    </div>
                )
            })}
        </div >
    )
}

export default function Page() {
    const [textLength, setTextLength] = useState(0);
    return (<>
        <header className="grid grid-cols-12 p-4">
            <div className="col-span-2"></div>
            <div className="col-span-3 grid grid-cols-5">
                <div className="flex justify-center items-center">
                    <figure className="bg-white rounded-lg p-2">
                        <img src="./img/要件_黄色.png" alt="要件" className="w-10 h-10" />
                    </figure>
                </div>
                <span className="flex items-center text-center text-xl text-white">要件</span>
            </div>
            <div className="col-span-5 text-white">
                <StepBarWithLabel
                    steps={[
                        { label: "自己紹介" },
                        { label: "会社詳細" },
                        { label: "経緯" },
                        { label: "目的" },
                        { label: "AI分析" },
                    ]}
                    currentStep={1}
                />
            </div>
            <div className="col-span-2"></div>
        </header>
        <main className="main grid grid-cols-24 gap-12 pt-12 w-8/10 mx-auto">
            <div className="main-side-bar p-4 col-span-3 flex flex-col gap-6">
                {["要件", "ターゲット", "機能", "イメージ", "提案"].map((label) => (
                    <div key={label} className="main-side-bar-item text-center flex flex-col items-center gap-2 p-2">
                        <figure>
                            <img src={`./img/${label}_${label === "要件" ? "黄色" : "青"}.png`} alt={label} />
                        </figure>
                        <span>
                            {label}
                        </span>
                    </div>
                ))}
                <div className="bg-blue-500 text-center text-white p-2 rounded">カルテ</div>
            </div>
            <div className="main-wrapper col-span-21 relative">
                <div className="absolute main-header -top-4 left-8 pl-4 pr-4 pt-2 pb-2">
                    <p className="main-header-subtitle text-md">
                        サイトが欲しくなった経緯を教えてください
                    </p>
                </div>
                <div className="main-content p-8">
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
                </div>
                <div className="main-pagination flex justify-between p-4">
                    <Button className="button">&lt; 前へ</Button>
                    <Button className="button">次へ &gt;</Button>
                </div>
            </div>
        </main>
    </>);
}