export const SUPPORTED_LOCALES = ["es", "en"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "es";

export interface LocaleCopy {
  searchLabel: string;
  searchPlaceholder: string;
  description: string;
  updated: string;
  updating: string;
  recentResultsText: string;
  resultsForText: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  footerPrefix: string;
  footerSuffix: string;
}

const ES_COPY: LocaleCopy = {
  searchLabel: "Buscar composiciones de TFT",
  searchPlaceholder: "Ej: sona, reroll, bruiser",
  description:
    "Busca composiciones de TFT de multiples fuentes a traves de tags generados automaticamente",
  updated: "Actualizado",
  updating: "Actualizando...",
  recentResultsText: "composiciones recientes",
  resultsForText: "resultados para",
  themeLabel: "Cambiar tema",
  themeLight: "Claro",
  themeDark: "Oscuro",
  footerPrefix: "Hecho por",
  footerSuffix: "para la comunidad de TFT",
};

const EN_COPY: LocaleCopy = {
  searchLabel: "Search TFT compositions",
  searchPlaceholder: "Ex: sona, reroll, bruiser",
  description:
    "Search TFT compositions from multiple sources through automatically generated tags",
  updated: "Updated",
  updating: "Updating...",
  recentResultsText: "recent compositions",
  resultsForText: "results for",
  themeLabel: "Toggle theme",
  themeLight: "Light",
  themeDark: "Dark",
  footerPrefix: "Made by",
  footerSuffix: "for the TFT community",
};

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function getLocaleCopy(locale: AppLocale): LocaleCopy {
  return locale === "en" ? EN_COPY : ES_COPY;
}
