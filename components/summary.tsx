"use client";
import { useEffect, useState } from 'react';

import { Textarea } from "@/components/ui/textarea"
import { buildHearingSummary, HEARING_STORAGE_EVENT, readHearingAnswers } from "@/lib/hearing-storage";

function Summary() {
    const [summary, setSummary] = useState("");

    useEffect(() => {
        const syncSummary = () => {
            setSummary(buildHearingSummary(readHearingAnswers()));
        };

        syncSummary();
        window.addEventListener("storage", syncSummary);
        window.addEventListener(HEARING_STORAGE_EVENT, syncSummary);

        return () => {
            window.removeEventListener("storage", syncSummary);
            window.removeEventListener(HEARING_STORAGE_EVENT, syncSummary);
        };
    }, []);

    return (
        <div className="mb-24">
            <h2 className="main-content-label mb-4 text-l font-bold">
                要約
            </h2>
            <Textarea
                id="textarea-message"
                className="min-h-[240px]"
                placeholder="各質問への回答がここに反映されます"
                value={summary}
                readOnly
            />
            <div className="text-right">
                {summary.length + "文字"}
            </div>
        </div>
    );
}

export default Summary;