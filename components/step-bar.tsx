import { Section } from "@/app/hearing/config"
import Link from "next/link"


type StepBarProps = {
    sections: Section[]
    currentStep: number // 0-based
}

export function StepBarWithLabel({
    sections,
    currentStep,
}: StepBarProps) {
    return (
        <div className="flex w-full justify-between">
            {sections.map((section, index) => {
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
                            <Link href={`./${section.title}`}>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2">
                                    <span className={
                                        "w-3 h-3 rounded-full font-medium " + (index === currentStep ? "bg-yellow-500" : isActive ? "bg-blue-800" : "bg-white")
                                    }></span>
                                </div>
                            </Link>

                            {index !== sections.length - 1 && (
                                <div className="h-px flex-1 bg-white border-1" />
                            )}
                            {index === sections.length - 1 && (
                                <div className="flex-1 bg-white " />
                            )}
                        </div>

                        <span className="mt-2">
                            {section.label}
                        </span>
                    </div>
                )
            })}
        </div >
    )
}