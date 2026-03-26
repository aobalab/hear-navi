import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import GroupsIcon from "@mui/icons-material/Groups";
import PaletteIcon from "@mui/icons-material/Palette";
import type { SvgIconComponent } from "@mui/icons-material";

export const hearingCategoryIcons: Record<string, SvgIconComponent> = {
    requirements: DescriptionIcon,
    target: GroupsIcon,
    function: BuildIcon,
    image: PaletteIcon,
    proposal: EmojiObjectsIcon,
    record: AssignmentIcon,
};