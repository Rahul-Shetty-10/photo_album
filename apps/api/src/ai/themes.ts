export type WeddingTheme = {
  albumContext: string;
  bride: string;
  groom: string;
  background: string;
  lighting: string;
  shotVariety: string[];
  style: string;
};

export const defaultTheme = "South Indian";

export const weddingThemes: Record<string, WeddingTheme> = {
  "South Indian": {
    albumContext: "premium South Indian temple wedding photography album",
    bride: "an elegant red and gold Kanjeevaram bridal saree with premium temple jewellery, jasmine flowers, layered gold necklaces, bangles, and traditional bridal styling",
    groom: "a luxurious ivory silk veshti with an embroidered silk angavastram, refined gold details, and traditional South Indian groom styling",
    background: "a grand South Indian temple wedding setting with carved stone pillars, mandapam details, brass lamps, fresh jasmine and marigold flowers, sacred decor, warm golden light, and luxury wedding styling",
    lighting: "soft golden-hour cinematic lighting with natural skin tones, warm highlights, fine-art contrast, and shallow depth of field",
    shotVariety: [
      "full-length bridal portrait showing saree drape and jewellery",
      "full-length groom portrait with traditional veshti styling",
      "couple standing together near carved temple pillars",
      "romantic eye contact during a traditional wedding pose",
      "walking together around the temple corridor",
      "holding hands beside brass lamps and floral decor",
      "looking away candid with natural smiles",
      "bride close-up with jewellery, jasmine flowers, and expressive eyes",
      "groom close-up with natural expression and elegant styling",
      "couple close-up framed by temple architecture",
      "bride adjusting saree pallu or jewellery",
      "groom adjusting angavastram",
      "sitting on temple steps",
      "standing under floral mandap decorations",
      "symmetrical architectural composition with stone pillars",
      "luxury magazine cover shot with South Indian wedding styling",
    ],
    style: "award-winning South Indian wedding photography with luxury editorial composition",
  },
  "Royal Palace": {
    albumContext: "premium royal Indian palace wedding photography album",
    bride: "an elegant red and gold bridal lehenga with extremely detailed embroidery, premium heritage jewellery, layered necklaces, earrings, bangles, and a graceful dupatta",
    groom: "a luxurious ivory or maroon embroidered sherwani with refined royal detailing, stole, brooch, and polished wedding styling",
    background: "a grand royal Indian palace with Mughal architecture, marble corridors, carved arches, royal doors, fountains, chandeliers, flowers, warm golden lighting, and luxury wedding decor",
    lighting: "soft cinematic palace lighting with warm golden highlights, natural skin tones, luxury color grading, and shallow depth of field",
    shotVariety: [
      "full-length bridal portrait showing lehenga embroidery and jewellery",
      "full-length groom portrait showing sherwani details",
      "couple standing together in a palace courtyard",
      "romantic eye contact under carved arches",
      "walking together through marble corridors",
      "holding hands beside fountains and floral decor",
      "looking away candid with natural smiles",
      "bride close-up with dupatta and premium jewellery",
      "groom close-up with royal sherwani styling",
      "couple close-up framed like a luxury magazine cover",
      "bride adjusting dupatta",
      "groom adjusting sherwani",
      "sitting on palace steps",
      "standing in royal corridors",
      "under floral decorations and chandeliers",
      "traditional wedding poses and modern editorial poses",
      "symmetrical architectural composition with Mughal arches",
    ],
    style: "award-winning Indian wedding photography with luxury editorial and fine-art magazine composition",
  },
  "Beach Wedding": {
    albumContext: "premium Indian destination beach wedding photography album",
    bride: "an elegant pastel or coral bridal saree or lehenga with delicate embroidery, premium floral jewellery, refined gold accents, and breezy destination wedding styling",
    groom: "a luxurious cream, ivory, or pastel embroidered kurta or sherwani with light festive detailing and polished beach wedding styling",
    background: "a serene luxury beach wedding venue with ocean waves, a floral mandap, tropical flowers, ivory drapes, lanterns, soft sand, sunset sky, and elegant destination wedding decor",
    lighting: "warm sunset cinematic lighting with natural skin tones, soft rim light, luxury color grading, and shallow depth of field",
    shotVariety: [
      "full-length bridal portrait with flowing fabric and beach wind",
      "full-length groom portrait in elegant destination wedding attire",
      "couple standing together near the ocean mandap",
      "romantic eye contact at sunset",
      "walking together along the shoreline",
      "holding hands beside tropical flowers and ivory drapes",
      "looking away candid with natural smiles",
      "bride close-up with floral jewellery and soft sunset light",
      "groom close-up with relaxed luxury styling",
      "couple close-up with ocean bokeh",
      "bride adjusting dupatta or flowing veil",
      "groom adjusting kurta or sherwani cuffs",
      "sitting on elegant beach lounge steps",
      "standing under floral beach decorations",
      "traditional wedding poses with modern destination editorial poses",
      "symmetrical composition under the beach mandap",
      "luxury magazine cover shot with ocean and sunset backdrop",
    ],
    style: "award-winning Indian destination wedding photography with natural luxury editorial composition",
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
    "Use the uploaded bride and groom photos as identity references.",
    `Create a ${theme.albumContext} in luxury editorial style.`,
    "Preserve both people's facial identity exactly across every generated image, including facial structure, skin tone, age, expression, and natural likeness.",
    "Generate one cinematic wedding portrait from this album collection with natural posing, professional composition, and consistent styling.",
    `Dress the bride in ${theme.bride}.`,
    `Dress the groom in ${theme.groom}.`,
    `Use ${theme.background}.`,
    `Photography style: ${theme.style}.`,
    "Shot on Canon EOS R5 with 85mm and 50mm prime lenses.",
    `Lighting and color: ${theme.lighting}.`,
    "Ultra photorealistic, high dynamic range, extremely detailed fabric embroidery and jewellery, perfect facial features, natural expressions, professional posing, and fine-art wedding photography quality.",
    `Select a varied shot concept appropriate for the requested image from options such as: ${theme.shotVariety.join("; ")}.`,
    "Every generated image should look like it belongs to the same premium 12x36 inch Indian wedding album with consistent lighting, outfits, location, color grading, and luxury styling.",
    "Avoid distortion, duplicated people, extra limbs, unnatural hands, face changes, text, logos, and watermarks.",
  ];

  if (customPrompt && customPrompt.trim().length > 0) {
    prompt.push(customPrompt.trim());
  }

  return prompt.join(" ");
};
