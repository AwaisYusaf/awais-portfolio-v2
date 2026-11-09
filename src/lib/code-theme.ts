import type { ThemeRegistrationRaw } from "shiki";

// Grayscale code themes that match the site: keywords bold, strings and
// numbers a step lighter, comments and punctuation muted.
function notesTheme(
  type: "light" | "dark",
  c: { fg: string; soft: string; muted: string; bg: string },
): ThemeRegistrationRaw {
  return {
    name: `notes-${type}`,
    type,
    colors: { "editor.foreground": c.fg, "editor.background": c.bg },
    settings: [
      { settings: { foreground: c.fg } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: c.muted, fontStyle: "italic" },
      },
      {
        scope: ["punctuation", "meta.brace", "keyword.operator"],
        settings: { foreground: c.muted },
      },
      {
        scope: ["string", "constant.numeric", "constant.language", "constant.character"],
        settings: { foreground: c.soft },
      },
      {
        scope: [
          "keyword",
          "keyword.operator.new",
          "keyword.operator.expression",
          "storage",
          "storage.type",
          "storage.modifier",
        ],
        settings: { foreground: c.fg, fontStyle: "bold" },
      },
    ],
  };
}

export const codeThemes = {
  light: notesTheme("light", { fg: "#111111", soft: "#4a4a4a", muted: "#6b6b6b", bg: "#ffffff" }),
  dark: notesTheme("dark", { fg: "#ededed", soft: "#bdbdbd", muted: "#8e8e8e", bg: "#0b0b0b" }),
};
