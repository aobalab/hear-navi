"use client";
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react';

function Summary() {
    const [textLength, setTextLength] = useState(0);
    return (
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
    );
}

export default Summary;