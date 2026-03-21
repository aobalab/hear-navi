export function parseLabeledAnswer(answer: string, labels: string[]) {
    const values: Record<string, string> = {};
    const remainingLines: string[] = [];

    answer.split("\n").forEach((line) => {
        const matchedLabel = labels.find((label) => line.startsWith(`${label}: `));

        if (!matchedLabel) {
            if (line.trim().length > 0) {
                remainingLines.push(line);
            }
            return;
        }

        values[matchedLabel] = line.slice(matchedLabel.length + 2);
    });

    return {
        values,
        remainder: remainingLines.join("\n"),
    };
}

export function formatLabeledAnswer(entries: Array<[string, string]>) {
    return entries
        .map(([label, value]) => [label, value.trim()] as const)
        .filter(([, value]) => value.length > 0)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n");
}