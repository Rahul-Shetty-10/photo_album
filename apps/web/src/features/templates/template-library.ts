export type TemplateCategory =
  | "equal-grid"
  | "hero"
  | "asymmetrical"
  | "magazine"
  | "wedding-album"
  | "event-story"
  | "mosaic"
  | "symmetrical"
  | "modern-creative"
  | "professional-event";

export type TemplateOrientation =
  | "portrait-only"
  | "landscape-only"
  | "square-only"
  | "mixed"
  | "vertical-emphasis"
  | "horizontal-emphasis";

export type TemplateSlot = {
  h: number;
  w: number;
  x: number;
  y: number;
};

export type PhotoTemplate = {
  category: TemplateCategory;
  id: string;
  imageCount: number;
  name: string;
  orientation: TemplateOrientation;
  slots: TemplateSlot[];
};

const slot = (x: number, y: number, w: number, h: number): TemplateSlot => ({ h, w, x, y });

const equalGrid = (count: number): TemplateSlot[] => {
  if (count === 1) return [slot(0, 0, 12, 12)];
  if (count === 2) return [slot(0, 0, 6, 12), slot(6, 0, 6, 12)];
  if (count === 3) return [slot(0, 0, 4, 12), slot(4, 0, 4, 12), slot(8, 0, 4, 12)];
  if (count === 4) return [slot(0, 0, 6, 6), slot(6, 0, 6, 6), slot(0, 6, 6, 6), slot(6, 6, 6, 6)];
  if (count <= 6) return Array.from({ length: count }, (_, index) => slot((index % 3) * 4, Math.floor(index / 3) * 6, 4, 6));
  if (count <= 9) return Array.from({ length: count }, (_, index) => slot((index % 3) * 4, Math.floor(index / 3) * 4, 4, 4));

  return Array.from({ length: count }, (_, index) => slot((index % 4) * 3, Math.floor(index / 4) * 4, 3, 4));
};

const makeTemplate = (
  imageCount: number,
  variant: string,
  category: TemplateCategory,
  orientation: TemplateOrientation,
  slots: TemplateSlot[],
): PhotoTemplate => ({
  category,
  id: `${imageCount}-${variant.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  imageCount,
  name: variant,
  orientation,
  slots: slots.slice(0, imageCount),
});

const variantsByCount: Record<number, Array<Omit<PhotoTemplate, "id" | "imageCount">>> = {
  1: [
    { category: "equal-grid", name: "Single Full Frame", orientation: "mixed", slots: [slot(0, 0, 12, 12)] },
    { category: "magazine", name: "Cover Portrait", orientation: "portrait-only", slots: [slot(2, 0, 8, 12)] },
    { category: "wedding-album", name: "Album Hero Spread", orientation: "landscape-only", slots: [slot(0, 1, 12, 10)] },
    { category: "modern-creative", name: "Floating Gallery Card", orientation: "mixed", slots: [slot(1, 1, 10, 10)] },
  ],
  2: [
    { category: "equal-grid", name: "Two Equal", orientation: "mixed", slots: equalGrid(2) },
    { category: "hero", name: "Large Left Duo", orientation: "horizontal-emphasis", slots: [slot(0, 0, 8, 12), slot(8, 0, 4, 12)] },
    { category: "symmetrical", name: "Mirror Portraits", orientation: "portrait-only", slots: [slot(1, 0, 5, 12), slot(6, 0, 5, 12)] },
    { category: "modern-creative", name: "Overlapping Pair", orientation: "mixed", slots: [slot(0, 1, 7, 10), slot(5, 0, 7, 10)] },
  ],
  3: [
    { category: "equal-grid", name: "Three Equal", orientation: "mixed", slots: equalGrid(3) },
    { category: "hero", name: "Hero Left Two Stack", orientation: "mixed", slots: [slot(0, 0, 8, 12), slot(8, 0, 4, 6), slot(8, 6, 4, 6)] },
    { category: "asymmetrical", name: "Tall Portrait Story", orientation: "vertical-emphasis", slots: [slot(0, 0, 5, 12), slot(5, 0, 7, 6), slot(5, 6, 7, 6)] },
    { category: "magazine", name: "Editorial Triptych", orientation: "mixed", slots: [slot(0, 0, 6, 8), slot(6, 0, 6, 5), slot(6, 5, 6, 7)] },
  ],
  4: [
    { category: "equal-grid", name: "Four Equal Squares", orientation: "square-only", slots: equalGrid(4) },
    { category: "hero", name: "One Large Three Small", orientation: "mixed", slots: [slot(0, 0, 8, 12), slot(8, 0, 4, 4), slot(8, 4, 4, 4), slot(8, 8, 4, 4)] },
    { category: "asymmetrical", name: "Tall Image Three Stack", orientation: "vertical-emphasis", slots: [slot(0, 0, 5, 12), slot(5, 0, 7, 4), slot(5, 4, 7, 4), slot(5, 8, 7, 4)] },
    { category: "magazine", name: "Premium Album Spread", orientation: "mixed", slots: [slot(0, 0, 7, 7), slot(7, 0, 5, 5), slot(7, 5, 5, 7), slot(0, 7, 7, 5)] },
    { category: "mosaic", name: "Dynamic Four Mosaic", orientation: "mixed", slots: [slot(0, 0, 4, 7), slot(4, 0, 8, 5), slot(0, 7, 6, 5), slot(6, 5, 6, 7)] },
  ],
  5: [
    { category: "hero", name: "Center Highlight Five", orientation: "mixed", slots: [slot(3, 2, 6, 8), slot(0, 0, 3, 5), slot(9, 0, 3, 5), slot(0, 5, 3, 7), slot(9, 5, 3, 7)] },
    { category: "event-story", name: "Opening Story Sequence", orientation: "horizontal-emphasis", slots: [slot(0, 0, 12, 5), slot(0, 5, 3, 7), slot(3, 5, 3, 7), slot(6, 5, 3, 7), slot(9, 5, 3, 7)] },
    { category: "wedding-album", name: "Couple And Moments", orientation: "mixed", slots: [slot(0, 0, 7, 8), slot(7, 0, 5, 4), slot(7, 4, 5, 4), slot(0, 8, 6, 4), slot(6, 8, 6, 4)] },
    { category: "mosaic", name: "Balanced Five Mosaic", orientation: "mixed", slots: [slot(0, 0, 5, 6), slot(5, 0, 4, 4), slot(9, 0, 3, 8), slot(0, 6, 6, 6), slot(6, 4, 3, 8)] },
  ],
  6: [
    { category: "equal-grid", name: "Six Equal", orientation: "mixed", slots: equalGrid(6) },
    { category: "professional-event", name: "Speaker And Audience", orientation: "mixed", slots: [slot(0, 0, 8, 7), slot(8, 0, 4, 4), slot(8, 4, 4, 3), slot(0, 7, 3, 5), slot(3, 7, 3, 5), slot(6, 7, 6, 5)] },
    { category: "modern-creative", name: "White Border Gallery", orientation: "mixed", slots: [slot(0, 0, 4, 5), slot(4, 0, 4, 5), slot(8, 0, 4, 5), slot(0, 5, 4, 7), slot(4, 5, 4, 7), slot(8, 5, 4, 7)] },
    { category: "asymmetrical", name: "Portrait With Landscapes", orientation: "vertical-emphasis", slots: [slot(0, 0, 4, 12), slot(4, 0, 8, 3), slot(4, 3, 4, 5), slot(8, 3, 4, 5), slot(4, 8, 4, 4), slot(8, 8, 4, 4)] },
  ],
  7: [
    { category: "event-story", name: "Timeline Seven", orientation: "mixed", slots: [slot(0, 0, 6, 6), slot(6, 0, 3, 3), slot(9, 0, 3, 3), slot(6, 3, 6, 3), slot(0, 6, 3, 6), slot(3, 6, 3, 6), slot(6, 6, 6, 6)] },
    { category: "mosaic", name: "Pinterest Seven", orientation: "mixed", slots: [slot(0, 0, 3, 7), slot(3, 0, 5, 4), slot(8, 0, 4, 6), slot(3, 4, 3, 8), slot(6, 4, 2, 4), slot(8, 6, 4, 6), slot(0, 7, 3, 5)] },
    { category: "wedding-album", name: "Ceremony Timeline", orientation: "mixed", slots: [slot(0, 0, 7, 7), slot(7, 0, 5, 3), slot(7, 3, 5, 4), slot(0, 7, 3, 5), slot(3, 7, 3, 5), slot(6, 7, 3, 5), slot(9, 7, 3, 5)] },
  ],
  8: [
    { category: "magazine", name: "Editorial Eight Spread", orientation: "mixed", slots: [slot(0, 0, 7, 6), slot(7, 0, 5, 3), slot(7, 3, 5, 3), slot(0, 6, 3, 6), slot(3, 6, 3, 3), slot(6, 6, 3, 3), slot(3, 9, 3, 3), slot(6, 9, 6, 3)] },
    { category: "professional-event", name: "Conference Highlights", orientation: "mixed", slots: [slot(0, 0, 6, 5), slot(6, 0, 6, 5), slot(0, 5, 3, 4), slot(3, 5, 3, 4), slot(6, 5, 3, 4), slot(9, 5, 3, 4), slot(0, 9, 6, 3), slot(6, 9, 6, 3)] },
    { category: "mosaic", name: "Floating Blocks Eight", orientation: "mixed", slots: [slot(0, 1, 3, 5), slot(3, 0, 4, 4), slot(7, 1, 5, 5), slot(0, 6, 5, 5), slot(5, 4, 3, 4), slot(8, 6, 4, 3), slot(5, 8, 3, 4), slot(8, 9, 4, 3)] },
  ],
  9: [
    { category: "equal-grid", name: "Nine Equal", orientation: "square-only", slots: equalGrid(9) },
    { category: "symmetrical", name: "Center Aligned Nine", orientation: "mixed", slots: [slot(4, 4, 4, 4), slot(0, 0, 4, 4), slot(4, 0, 4, 4), slot(8, 0, 4, 4), slot(0, 4, 4, 4), slot(8, 4, 4, 4), slot(0, 8, 4, 4), slot(4, 8, 4, 4), slot(8, 8, 4, 4)] },
    { category: "event-story", name: "Story Grid Nine", orientation: "mixed", slots: [slot(0, 0, 8, 5), slot(8, 0, 4, 5), slot(0, 5, 3, 3), slot(3, 5, 3, 3), slot(6, 5, 3, 3), slot(9, 5, 3, 3), slot(0, 8, 4, 4), slot(4, 8, 4, 4), slot(8, 8, 4, 4)] },
  ],
  10: [
    { category: "mosaic", name: "Dynamic Ten Collage", orientation: "mixed", slots: [slot(0, 0, 5, 5), slot(5, 0, 4, 3), slot(9, 0, 3, 6), slot(5, 3, 4, 3), slot(0, 5, 3, 4), slot(3, 5, 3, 4), slot(6, 6, 3, 3), slot(9, 6, 3, 3), slot(0, 9, 6, 3), slot(6, 9, 6, 3)] },
    { category: "wedding-album", name: "Reception Story Ten", orientation: "mixed", slots: [slot(0, 0, 6, 6), slot(6, 0, 6, 6), slot(0, 6, 2, 3), slot(2, 6, 2, 3), slot(4, 6, 2, 3), slot(6, 6, 2, 3), slot(8, 6, 2, 3), slot(10, 6, 2, 3), slot(0, 9, 6, 3), slot(6, 9, 6, 3)] },
    { category: "professional-event", name: "Event Summary Ten", orientation: "mixed", slots: [slot(0, 0, 8, 4), slot(8, 0, 4, 4), slot(0, 4, 3, 4), slot(3, 4, 3, 4), slot(6, 4, 3, 4), slot(9, 4, 3, 4), slot(0, 8, 3, 4), slot(3, 8, 3, 4), slot(6, 8, 3, 4), slot(9, 8, 3, 4)] },
  ],
  11: [
    { category: "mosaic", name: "Masonry Eleven", orientation: "mixed", slots: [slot(0, 0, 3, 6), slot(3, 0, 3, 4), slot(6, 0, 6, 5), slot(3, 4, 3, 4), slot(0, 6, 3, 6), slot(6, 5, 3, 3), slot(9, 5, 3, 3), slot(3, 8, 3, 4), slot(6, 8, 2, 4), slot(8, 8, 2, 4), slot(10, 8, 2, 4)] },
    { category: "magazine", name: "Editorial Sequence Eleven", orientation: "mixed", slots: [slot(0, 0, 7, 5), slot(7, 0, 5, 5), slot(0, 5, 2, 3), slot(2, 5, 2, 3), slot(4, 5, 2, 3), slot(6, 5, 2, 3), slot(8, 5, 2, 3), slot(10, 5, 2, 3), slot(0, 8, 4, 4), slot(4, 8, 4, 4), slot(8, 8, 4, 4)] },
  ],
  12: [
    { category: "equal-grid", name: "Twelve Equal", orientation: "mixed", slots: equalGrid(12) },
    { category: "event-story", name: "Full Event Timeline", orientation: "mixed", slots: [slot(0, 0, 6, 4), slot(6, 0, 6, 4), slot(0, 4, 3, 4), slot(3, 4, 3, 4), slot(6, 4, 3, 4), slot(9, 4, 3, 4), slot(0, 8, 2, 4), slot(2, 8, 2, 4), slot(4, 8, 2, 4), slot(6, 8, 2, 4), slot(8, 8, 2, 4), slot(10, 8, 2, 4)] },
    { category: "modern-creative", name: "Luxury Twelve Gallery", orientation: "mixed", slots: [slot(0, 0, 4, 5), slot(4, 0, 4, 3), slot(8, 0, 4, 5), slot(4, 3, 2, 4), slot(6, 3, 2, 4), slot(0, 5, 2, 4), slot(2, 5, 2, 4), slot(8, 5, 2, 4), slot(10, 5, 2, 4), slot(0, 9, 4, 3), slot(4, 7, 4, 5), slot(8, 9, 4, 3)] },
  ],
};

export const photoTemplates: PhotoTemplate[] = Object.entries(variantsByCount).flatMap(([count, templates]) =>
  templates.map((template) =>
    makeTemplate(Number(count), template.name, template.category, template.orientation, template.slots),
  ),
);

export const getTemplatesByImageCount = (imageCount: number) =>
  photoTemplates.filter((template) => template.imageCount === imageCount);

export const getTemplatesByCategory = (category: TemplateCategory) =>
  photoTemplates.filter((template) => template.category === category);
