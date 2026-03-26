import {
    ClipboardList,
    FileText,
    Lightbulb,
    Palette,
    type LucideIcon,
    Users,
    Wrench,
} from "lucide-react";

export const hearingCategoryIcons: Record<string, LucideIcon> = {
    requirements: FileText,
    target: Users,
    function: Wrench,
    image: Palette,
    proposal: Lightbulb,
    record: ClipboardList,
};