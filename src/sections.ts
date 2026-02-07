export const SECTION_IDS = {
  hero: "section-hero",
  overview: "section-overview",
  rear: "section-rear",
  flightSystem: "section-flight-system",
  engine: "section-engine",
  gallery: "section-gallery",
  details: "section-details",
  vision: "section-vision",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
