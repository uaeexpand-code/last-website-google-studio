
import { ColorName } from "@/types";

export const COLORS: Record<ColorName, string> = {
  Blue: "from-blue-400 to-blue-600",
  Green: "from-green-400 to-green-600",
  Red: "from-red-400 to-red-600",
  Orange: "from-orange-400 to-orange-600",
  Purple: "from-purple-400 to-purple-600",
  Pink: "from-pink-400 to-pink-600",
  Yellow: "from-yellow-400 to-yellow-600",
  Indigo: "from-indigo-400 to-indigo-600",
  Teal: "from-teal-400 to-teal-600",
  Cyan: "from-cyan-400 to-cyan-600",
};

export const COLOR_NAMES = Object.keys(COLORS) as ColorName[];
