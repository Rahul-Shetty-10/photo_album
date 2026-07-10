export type WeddingTheme = {
  bride: string;
  groom: string;
  background: string;
  lighting: string;
  style: string;
};

export const defaultTheme = "South Indian";

export const weddingThemes: Record<string, WeddingTheme> = {
  "South Indian": {
    bride: "Red Kanjeevaram saree with traditional gold jewelry",
    groom: "Ivory silk veshti with an elegant silk angavastram",
    background: "Traditional temple wedding setting",
    lighting: "Golden hour",
    style: "Luxury wedding photography",
  },
  "Royal Palace": {
    bride: "Regal embroidered bridal lehenga with heritage jewelry",
    groom: "Ivory sherwani with refined royal detailing",
    background: "Grand palace courtyard with carved arches",
    lighting: "Soft cinematic evening light",
    style: "Editorial luxury wedding photography",
  },
  "Beach Wedding": {
    bride: "Elegant pastel bridal saree with delicate floral jewelry",
    groom: "Cream linen wedding kurta with minimal festive styling",
    background: "Serene beach mandap by the ocean",
    lighting: "Warm sunset light",
    style: "Natural destination wedding photography",
  },
};

export const getWeddingTheme = (theme?: string) => {
  const normalizedTheme = typeof theme === "string" && theme.trim().length > 0 ? theme.trim() : defaultTheme;
  const aliasedTheme = themeAliases[normalizedTheme] ?? normalizedTheme;

  return {
    name: weddingThemes[aliasedTheme] ? aliasedTheme : defaultTheme,
    theme: weddingThemes[aliasedTheme] ?? weddingThemes[defaultTheme],
  };
};

const themeAliases: Record<string, string> = {
  Beach: "Beach Wedding",
  Palace: "Royal Palace",
  Reception: "Royal Palace",
  Royal: "Royal Palace",
  Temple: "South Indian",
  Traditional: "South Indian",
};

export const buildWeddingPrompt = (themeName: string, customPrompt?: string) => {
  const { theme } = getWeddingTheme(themeName);
  const prompt = [
    "Create a photorealistic wedding portrait of the same bride and groom from the two reference images.",
    "Preserve both identities, facial features, skin tone, age, expression, and natural likeness.",
    `Dress the bride in ${theme.bride}.`,
    `Dress the groom in ${theme.groom}.`,
    `Set the couple in ${theme.background}.`,
    `Use ${theme.lighting} with ${theme.style}.`,
    "Keep anatomy realistic, hands natural, and avoid changing either person's face.",
  ];

  if (customPrompt && customPrompt.trim().length > 0) {
    prompt.push(customPrompt.trim());
  }

  return prompt.join(" ");
};
