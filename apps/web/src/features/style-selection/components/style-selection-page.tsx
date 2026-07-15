"use client";

import { ArrowLeft, X } from "lucide-react";
import { useMemo, useState } from "react";

import { photoTemplates, type PhotoTemplate } from "@/features/templates/template-library";

const maxGroupPeople = 12;

export const personalThemes = [
  {
    name: "Individual Portraits",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Couple Photoshoots",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Traditional Indian Events with Rituals",
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Formal Family Events",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Parties",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85",
  },
];

export const professionalThemes = [
  {
    name: "Conferences",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Seminars",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Expert Visit for Official Audit",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Cultural Events",
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Sports Events",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Official Parties",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
  },
];

export const themesByStyle: Record<string, string[]> = {
  "Individual Portraits": [
    "Studio Portrait",
    "Outdoor Natural",
    "Urban City",
    "Nature & Forest",
    "Beach",
    "Mountain",
    "Sunset",
    "Golden Hour",
    "Traditional Indian",
    "Ethnic Wear",
    "Royal Heritage",
    "Black & White",
    "Luxury Lifestyle",
    "Casual Lifestyle",
    "Festival Portrait",
  ],
  Personal: ["Editorial", "Studio", "Lifestyle", "Outdoor", "Black & White", "Fine Art"],
  Wedding: [
    "Royal Palace",
    "North Indian",
    "South Indian",
    "Christian",
    "Muslim",
    "Temple",
    "Reception",
    "Beach Wedding",
    "Haldi",
    "Mehendi",
    "Garden",
    "Heritage Palace",
  ],
  Portrait: ["Editorial", "Studio", "Lifestyle", "Outdoor", "Black & White", "Fine Art"],
  Couple: ["Editorial", "Studio", "Lifestyle", "Outdoor", "Royal Palace", "Garden"],
  "Couple Photoshoots": [
    "Beach Romance",
    "Mountain Escape",
    "Sunset Love",
    "Garden Romance",
    "Lake Side",
    "Rain Romance",
    "Traditional Indian",
    "Royal Palace",
    "Temple",
    "Pre-Wedding",
    "Engagement",
    "Anniversary",
    "Café Date",
    "Urban Streets",
    "Luxury Resort",
  ],
  "Traditional Indian Events with Rituals": [
    "Indian Wedding",
    "Haldi Ceremony",
    "Mehendi Ceremony",
    "Sangeet Night",
    "Reception",
    "Engagement Ceremony",
    "Wedding Rituals",
    "Temple Ceremony",
    "Housewarming (Griha Pravesh)",
    "Naming Ceremony",
    "Baby Shower",
    "Seemantham",
    "Thread Ceremony",
    "Festival Celebration",
    "Pooja Ceremony",
  ],
  "Formal Family Events": [
    "Family Portrait",
    "Family Reunion",
    "Anniversary Celebration",
    "Birthday Celebration",
    "Graduation",
    "Farewell Gathering",
    "Housewarming Celebration",
    "Holiday Celebration",
    "Family Dinner",
    "Outdoor Picnic",
    "Luxury Banquet",
    "Garden Gathering",
  ],
  Family: [
    "Family Portrait",
    "Family Reunion",
    "Anniversary Celebration",
    "Birthday Celebration",
    "Graduation",
    "Farewell Gathering",
    "Housewarming Celebration",
    "Holiday Celebration",
    "Family Dinner",
    "Outdoor Picnic",
    "Luxury Banquet",
    "Garden Gathering",
  ],
  Parties: [
    "Birthday Party",
    "Anniversary Party",
    "Graduation Party",
    "Baby Shower Party",
    "Retirement Party",
    "Farewell Party",
    "Celebration Night",
    "Rooftop Party",
    "Pool Party",
    "House Party",
    "DJ Night",
    "Theme Party",
  ],
  Conferences: [
    "Keynote Session",
    "Business Conference",
    "Technology Conference",
    "Leadership Summit",
    "Corporate Meet",
    "Panel Discussion",
    "Networking Event",
    "Product Launch",
  ],
  Seminars: [
    "Educational Seminar",
    "Corporate Seminar",
    "Technical Workshop",
    "Guest Lecture",
    "Knowledge Session",
    "Training Program",
    "Interactive Session",
    "Industry Talk",
  ],
  Professional: ["Office", "Studio", "Keynote", "Award Ceremony"],
  Corporate: ["Conference Hall", "Office", "Keynote", "Award Ceremony"],
  "Movie Shoot": ["Action", "Neo Noir", "Golden Hour", "Vintage Film", "Cinematic"],
  Sports: ["Stadium", "Indoor Arena", "Training Ground", "Award Ceremony"],
  Fashion: ["Editorial", "Studio", "Runway", "Lifestyle"],
  Product: ["Studio Product", "Lifestyle Product", "Luxury Detail", "Catalog Clean"],
  "Corporate Events": ["Leadership Summit", "Annual Meet", "Product Launch", "Town Hall", "Networking Evening"],
  "Award Ceremonies": ["Gala Awards", "Stage Honors", "Red Carpet", "Trophy Moment", "Leadership Recognition"],
  "Product Shoots": ["Studio Product", "Lifestyle Product", "Luxury Detail", "Catalog Clean", "Launch Campaign"],
  "Movie Shoots": ["Action", "Romantic", "Noir", "Fantasy", "Vintage"],
  "Expert Visit for Official Audit": [
    "Office Inspection",
    "Site Audit",
    "Factory Visit",
    "Compliance Review",
    "Certification Audit",
    "Management Review",
    "Quality Inspection",
    "Official Delegation Visit",
  ],
  "Cultural Events": [
    "Dance Performance",
    "Music Performance",
    "College Fest",
    "Annual Day",
    "Traditional Cultural Show",
    "Award Ceremony",
    "Talent Showcase",
    "Stage Performance",
  ],
  "Sports Events": [
    "Cricket Tournament",
    "Football Match",
    "Volleyball Tournament",
    "Athletics Meet",
    "Indoor Sports",
    "Outdoor Championship",
    "Prize Distribution",
    "Team Celebration",
  ],
  "Official Parties": [
    "Corporate Annual Party",
    "Team Celebration",
    "Success Celebration",
    "Farewell Party",
    "Welcome Party",
    "Office Get Together",
    "Gala Dinner",
    "Networking Evening",
  ],
};

export type ThemeCard = {
  image: string;
  name: string;
};

type GroupPerson = {
  priority: string;
  relationship: string;
};

export type ParticipantDetails = {
  coupleRelationship?: string;
  groupPeople?: GroupPerson[];
  peopleCount?: number;
  personName?: string;
};

function BackControl({
  href,
  label = "Back",
  onClick,
}: {
  href?: string;
  label?: string;
  onClick?: () => void;
}) {
  const className =
    "inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card/80 px-4 text-sm text-muted-foreground shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45";

  if (href) {
    return (
      <a className={className} href={href}>
        <ArrowLeft className="size-4" />
        {label}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick} type="button">
      <ArrowLeft className="size-4" />
      {label}
    </button>
  );
}

const getThemeFlow = (themeName: string) => {
  if (themeName === "Individual Portraits") {
    return "individual";
  }

  if (themeName === "Couple Photoshoots") {
    return "couple";
  }

  return "group";
};

export function ThemeCarousel({
  direction,
  onSelectTheme,
  themes,
  title,
}: {
  direction: "left" | "right";
  onSelectTheme: (theme: ThemeCard) => void;
  themes: ThemeCard[];
  title: string;
}) {
  const repeatedThemes = [...themes, ...themes];

  return (
    <section className="space-y-5">
      <h2 className="px-6 font-sans text-2xl leading-none text-foreground sm:px-8 sm:text-3xl lg:px-12">
        {title}
      </h2>
      <div className="group overflow-hidden">
        <div
          className={`flex w-max gap-3 px-6 sm:gap-4 sm:px-8 lg:px-12 ${
            direction === "right" ? "animate-style-scroll-right" : "animate-style-scroll-left"
          } group-hover:[animation-play-state:paused]`}
        >
          {repeatedThemes.map((theme, index) => (
            <button
              className="group/card relative h-[150px] w-[160px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#15110e] text-left shadow-xl shadow-black/25 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 sm:h-[180px] sm:w-[200px] lg:h-[210px] lg:w-[230px]"
              key={`${theme.name}-${index}`}
              onClick={() => onSelectTheme(theme)}
              type="button"
            >
              <img
                alt={theme.name}
                className="h-full w-full object-cover transition duration-700 group-hover/card:scale-105"
                draggable={false}
                src={theme.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-sans text-2xl leading-[0.95] text-[#f8fafc] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] sm:text-3xl">
                  {theme.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleModal({
  onClose,
  onContinue,
  selectedTheme,
}: {
  onClose: () => void;
  onContinue: (details: ParticipantDetails) => void;
  selectedTheme: ThemeCard;
}) {
  const flow = getThemeFlow(selectedTheme.name);
  const [personName, setPersonName] = useState("");
  const [coupleRelationship, setCoupleRelationship] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [groupPeople, setGroupPeople] = useState<GroupPerson[]>([]);

  const normalizedPeopleCount = Number(peopleCount);
  const isValidPeopleCount =
    Number.isInteger(normalizedPeopleCount) && normalizedPeopleCount >= 2 && normalizedPeopleCount <= maxGroupPeople;

  const canContinue = useMemo(() => {
    if (flow === "individual") {
      return true;
    }

    if (flow === "couple") {
      return coupleRelationship.trim().length > 0;
    }

    return (
      isValidPeopleCount &&
      groupPeople.length === normalizedPeopleCount &&
      groupPeople.every((person) => person.relationship.trim().length > 0 && person.priority)
    );
  }, [coupleRelationship, flow, groupPeople, isValidPeopleCount, normalizedPeopleCount]);

  const handlePeopleCountChange = (value: string) => {
    setPeopleCount(value);

    const nextCount = Number(value);
    if (!Number.isInteger(nextCount) || nextCount < 2 || nextCount > maxGroupPeople) {
      setGroupPeople([]);
      return;
    }

    setGroupPeople((currentPeople) =>
      Array.from({ length: nextCount }, (_, index) => currentPeople[index] ?? { priority: "", relationship: "" }),
    );
  };

  const updateGroupPerson = (index: number, field: keyof GroupPerson, value: string) => {
    setGroupPeople((currentPeople) =>
      currentPeople.map((person, personIndex) =>
        personIndex === index
          ? {
              ...person,
              [field]: value,
            }
          : person,
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <div className="animate-modal-in relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-border bg-popover/95 text-popover-foreground shadow-2xl shadow-black/25">
        <div className="flex items-start justify-between gap-5 border-b border-border px-6 py-5 sm:px-8">
          <h2 className="font-sans text-3xl leading-none text-foreground sm:text-4xl">{selectedTheme.name}</h2>
          <button
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {flow === "individual" && (
            <div className="animate-form-section space-y-5">
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Person Name</span>
                <input
                  className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                  onChange={(event) => setPersonName(event.target.value)}
                  placeholder="Optional"
                  value={personName}
                />
              </label>
            </div>
          )}

          {flow === "couple" && (
            <div className="animate-form-section space-y-5">
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Relationship between the two people</span>
                <input
                  className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                  onChange={(event) => setCoupleRelationship(event.target.value)}
                  placeholder="Husband & Wife, Fiance & Fiancee, Boyfriend & Girlfriend"
                  value={coupleRelationship}
                />
              </label>
            </div>
          )}

          {flow === "group" && (
            <div className="animate-form-section space-y-7">
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Number of People</span>
                <input
                  className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                  max={maxGroupPeople}
                  min={2}
                  onChange={(event) => handlePeopleCountChange(event.target.value)}
                  type="number"
                  value={peopleCount}
                />
              </label>

              {isValidPeopleCount && (
                <div className="animate-form-section space-y-4">
                  {groupPeople.map((person, index) => (
                    <div
                      className="grid gap-4 rounded-2xl border border-border bg-muted/45 p-4 sm:grid-cols-[1fr_140px] sm:items-end"
                      key={index}
                    >
                      <label className="block space-y-2">
                        <span className="text-sm text-muted-foreground">Person {index + 1}</span>
                        <input
                          className="h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-foreground outline-none transition placeholder:text-muted-foreground/55 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                          onChange={(event) => updateGroupPerson(index, "relationship", event.target.value)}
                          placeholder="Relationship to the group"
                          value={person.relationship}
                        />
                      </label>
                      <fieldset className="space-y-2">
                        <legend className="text-sm text-muted-foreground">Priority</legend>
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: normalizedPeopleCount }, (_, priorityIndex) => {
                            const priority = String(priorityIndex + 1);
                            const isSelected = person.priority === priority;

                            return (
                              <button
                                className={`grid size-10 place-items-center rounded-full border text-sm transition ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background/60 text-foreground hover:border-primary/50"
                                }`}
                                key={priority}
                                onClick={() => updateGroupPerson(index, "priority", priority)}
                                type="button"
                              >
                                {priority}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-5 sm:px-8">
          <button
            className="h-12 w-full rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground/55"
            disabled={!canContinue}
            onClick={() =>
              onContinue({
                coupleRelationship: coupleRelationship.trim() || undefined,
                groupPeople: groupPeople.map((person) => ({
                  priority: person.priority,
                  relationship: person.relationship.trim(),
                })),
                peopleCount: isValidPeopleCount ? normalizedPeopleCount : undefined,
                personName: personName.trim() || undefined,
              })
            }
            type="button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

const hashThemeName = (value: string) =>
  [...value].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7);

const getThemeScene = (themeName: string) => {
  const theme = themeName.toLowerCase();

  if (theme.includes("beach")) return "beach";
  if (theme.includes("mountain")) return "mountain";
  if (theme.includes("sunset") || theme.includes("golden")) return "sunset";
  if (theme.includes("garden") || theme.includes("mehendi") || theme.includes("picnic") || theme.includes("outdoor")) return "garden";
  if (theme.includes("lake")) return "lake";
  if (theme.includes("rain")) return "rain";
  if (theme.includes("forest") || theme.includes("nature")) return "forest";
  if (theme.includes("royal") || theme.includes("palace") || theme.includes("heritage")) return "palace";
  if (theme.includes("temple") || theme.includes("ritual")) return "temple";
  if (theme.includes("black & white") || theme.includes("black and white")) return "blackWhite";
  if (theme.includes("ethnic") || theme.includes("wear")) return "ethnicWear";
  if (theme.includes("traditional") || theme.includes("indian")) return "traditional";
  if (theme.includes("engagement")) return "engagement";
  if (theme.includes("anniversary")) return "anniversary";
  if (theme.includes("wedding") || theme.includes("haldi") || theme.includes("sangeet")) return "wedding";
  if (theme.includes("cafe") || theme.includes("cafã©")) return "cafe";
  if (theme.includes("city") || theme.includes("urban") || theme.includes("street")) return "city";
  if (theme.includes("luxury") || theme.includes("resort") || theme.includes("banquet")) return "resort";
  if (theme.includes("casual") || theme.includes("lifestyle")) return "casualLifestyle";
  if (theme.includes("family") || theme.includes("reunion") || theme.includes("dinner")) return "family";
  if (theme.includes("baby") || theme.includes("naming")) return "baby";
  if (theme.includes("housewarming")) return "home";
  if (theme.includes("festival")) return "festivalPortrait";
  if (theme.includes("party") || theme.includes("birthday") || theme.includes("celebration") || theme.includes("farewell")) return "party";
  if (theme.includes("sports") || theme.includes("cricket") || theme.includes("football")) return "sports";
  if (theme.includes("conference") || theme.includes("seminar") || theme.includes("workshop") || theme.includes("keynote")) return "conference";
  if (theme.includes("audit") || theme.includes("inspection") || theme.includes("office") || theme.includes("corporate")) return "office";
  if (theme.includes("cultural") || theme.includes("dance") || theme.includes("music")) return "stage";
  return "portrait";
};

const realThemeImages: Record<string, string[]> = {
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=88",
  ],
  mountain: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=88",
  ],
  sunset: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=88",
  ],
  garden: [
    "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=88",
  ],
  forest: [
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=88",
  ],
  lake: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=88",
  ],
  rain: ["https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=900&q=88"],
  palace: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=88"],
  temple: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=88"],
  traditional: [
    "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=88",
  ],
  ethnicWear: [
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=88",
  ],
  blackWhite: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=88&sat=-100",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=88&sat=-100",
  ],
  casualLifestyle: [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=88",
  ],
  festivalPortrait: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=88",
  ],
  engagement: ["https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=88"],
  anniversary: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=88"],
  wedding: [
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=88",
  ],
  cafe: ["https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=88"],
  city: ["https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=88"],
  resort: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=88"],
  family: ["https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=88"],
  baby: ["https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=88"],
  home: ["https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=88"],
  party: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=88",
  ],
  sports: ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=88"],
  conference: [
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=88",
  ],
  office: [
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=88",
  ],
  stage: ["https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=88"],
  portrait: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=88",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=88",
  ],
};

const getRealSceneImage = (scene: string, seed: number) => {
  const images = realThemeImages[scene] ?? realThemeImages.portrait;
  return images[seed % images.length];
};

export function SceneArtwork({ scene }: { scene: string }) {
  switch (scene) {
    case "beach":
      return <>
        <circle cx="302" cy="92" r="48" fill="#ffe597" />
        <path d="M0 210 Q70 170 145 205 T300 198 T400 180 V350 H0Z" fill="#58c2cf" />
        <path d="M0 248 Q80 220 160 250 T320 244 T400 230 V365 H0Z" fill="#237f9c" />
        <path d="M0 315 Q120 270 245 314 T400 298 V420 H0Z" fill="#efc37e" />
        <path d="M68 305 Q58 190 92 118 M89 126 Q45 102 27 142 M88 127 Q125 91 151 127 M88 132 Q57 146 43 183" fill="none" stroke="#234e47" strokeWidth="16" strokeLinecap="round" />
        <path d="M214 294 q24-52 48 0 M238 294 q24-52 48 0" fill="none" stroke="#fff7e4" strokeWidth="8" strokeLinecap="round" />
      </>;
    case "mountain":
      return <>
        <circle cx="85" cy="92" r="39" fill="#ffe49b" />
        <path d="M-20 330 105 128 213 330Z" fill="#6f8fa1" />
        <path d="m105 128 38 61-31-14-25 23-23-5Z" fill="#eef4f3" />
        <path d="M105 340 258 95 430 340Z" fill="#405f72" />
        <path d="m258 95 51 82-42-19-32 28-31-9Z" fill="#f7f5eb" />
        <path d="M0 320 Q95 270 183 322 T400 300 V430 H0Z" fill="#294c45" />
        <path d="M195 430 Q215 350 262 286" fill="none" stroke="#d9b276" strokeWidth="14" />
      </>;
    case "sunset":
      return <>
        <circle cx="200" cy="182" r="75" fill="#ffe18b" />
        <path d="M0 280 Q95 215 188 277 T400 260 V430 H0Z" fill="#803f57" />
        <path d="M0 330 Q90 270 205 330 T400 305 V430 H0Z" fill="#3d2944" />
        <path d="M162 323 q38-70 76 0" fill="none" stroke="#231c2d" strokeWidth="13" strokeLinecap="round" />
        <circle cx="178" cy="290" r="16" fill="#231c2d" /><circle cx="223" cy="290" r="16" fill="#231c2d" />
        <path d="M172 306 148 374 M228 306 253 374" stroke="#231c2d" strokeWidth="15" strokeLinecap="round" />
      </>;
    case "garden":
    case "forest":
      return <>
        <circle cx="320" cy="82" r="38" fill="#ffe7a8" />
        <path d="M0 250 Q95 195 190 248 T400 225 V430 H0Z" fill="#6cae63" />
        <path d="M0 315 Q88 260 190 315 T400 285 V430 H0Z" fill="#306b4d" />
        {[66, 137, 218, 302, 357].map((x, index) => <g key={x} transform={`translate(${x} ${245 + (index % 2) * 28})`}>
          <path d="M0 82V22" stroke="#d8f0b5" strokeWidth="7" strokeLinecap="round" />
          <circle cy="15" r="22" fill={index % 2 ? "#f6adc3" : "#ffd16f"} />
          <circle cy="15" r="8" fill="#fff3c7" />
          <path d="M-4 54q-27-22-32 5M4 65q27-23 34 3" fill="none" stroke="#8dcc72" strokeWidth="10" strokeLinecap="round" />
        </g>)}
      </>;
    case "lake":
      return <>
        <circle cx="300" cy="95" r="43" fill="#ffe7a0" />
        <path d="M0 246 92 150 160 238 242 122 400 250V330H0Z" fill="#537b77" />
        <path d="M0 255 Q110 225 210 258 T400 248 V430 H0Z" fill="#4e9ead" />
        <path d="M0 310 Q90 278 205 310 T400 295" fill="none" stroke="#aee3df" strokeWidth="10" opacity=".7" />
        <path d="M120 279q80 60 160 0" fill="none" stroke="#f3e3bd" strokeWidth="7" />
        <path d="M180 281 200 249 220 281Z" fill="#f5e9d0" />
      </>;
    case "rain":
      return <>
        <path d="M55 100q22-54 74-29 38-50 89 1 60-21 77 37 47 3 52 48H54q-26-32 1-57Z" fill="#c8d8e6" />
        {[78, 133, 189, 245, 302].map((x) => <path key={x} d={`M${x} 180l-18 40`} stroke="#9ad5ea" strokeWidth="9" strokeLinecap="round" />)}
        <path d="M78 307 Q200 195 322 307Z" fill="#e86786" />
        <path d="M200 307v84q0 28 27 22" fill="none" stroke="#f8e9dc" strokeWidth="11" strokeLinecap="round" />
        <circle cx="166" cy="321" r="14" fill="#f7d1b5" /><circle cx="229" cy="321" r="14" fill="#f7d1b5" />
        <path d="M164 337v57M231 337v57" stroke="#293b55" strokeWidth="17" strokeLinecap="round" />
      </>;
    case "palace":
    case "temple":
      return <>
        <circle cx="320" cy="88" r="38" fill="#ffe6a3" />
        <path d="M34 382V218h72v164M294 382V218h72v164M108 382V164h184v218" fill="#dfaa66" />
        <path d="M95 218q-25-55-50 0ZM355 218q-25-55-50 0ZM108 164l92-82 92 82Z" fill="#7d4054" />
        <path d="M138 382V245q62-94 124 0v137" fill="#6e3c48" />
        <path d="M58 268h34M308 268h34M130 200h140" stroke="#fff0c9" strokeWidth="8" />
        <circle cx="200" cy="93" r="10" fill="#ffe8a0" />
      </>;
    case "traditional":
      return <>
        <path d="M0 355 Q105 290 210 350 T400 330V430H0Z" fill="#6f293e" />
        <path d="M95 330V188q0-74 58-74t58 74v142Z" fill="#f2a95f" />
        <circle cx="153" cy="111" r="36" fill="#f2cfb2" />
        <path d="M110 209q44 34 88 0M109 246q45 34 90 0M111 283q43 30 86 0" fill="none" stroke="#fff0bc" strokeWidth="12" />
        <path d="M245 330V196q0-63 48-63t48 63v134Z" fill="#4f8b87" />
        <circle cx="293" cy="128" r="33" fill="#eec9aa" />
        <path d="M252 218h82M253 258h80" stroke="#ffe6a7" strokeWidth="11" />
      </>;
    case "engagement":
      return <>
        <circle cx="152" cy="217" r="75" fill="none" stroke="#ffe5a5" strokeWidth="18" />
        <circle cx="246" cy="217" r="75" fill="none" stroke="#fff3d8" strokeWidth="18" />
        <path d="m199 93 29-42 29 42-29 25Z" fill="#bde7f0" stroke="#fff" strokeWidth="8" />
        <path d="M0 348Q100 304 203 347T400 330V430H0Z" fill="#593348" />
      </>;
    case "wedding":
    case "anniversary":
      return <>
        <path d="M82 360V220q118-169 236 0v140" fill="none" stroke="#f6dfb5" strokeWidth="17" />
        {[92, 135, 268, 309].map((x) => <circle key={x} cx={x} cy={x < 200 ? 201 - x / 3 : 105 + x / 3} r="20" fill={x % 2 ? "#f3a8bd" : "#ffd471"} />)}
        <circle cx="171" cy="245" r="29" fill="#f1c9aa" /><circle cx="229" cy="245" r="29" fill="#e8ba99" />
        <path d="M143 360q8-89 28-89t29 89M200 360q9-89 29-89t29 89" fill="#fff3df" stroke="#8d4861" strokeWidth="8" />
        <path d="M188 292q12 18 24 0" fill="none" stroke="#d55c75" strokeWidth="7" />
        <path d="M0 365Q102 320 205 367T400 347V430H0Z" fill="#543047" />
      </>;
    case "cafe":
      return <>
        <path d="M55 150h290v228H55Z" fill="#c47b55" />
        <path d="M34 150 70 84h260l36 66Z" fill="#f0d29b" />
        <path d="M85 180h92v93H85ZM223 180h92v93h-92Z" fill="#85bbc1" />
        <path d="M115 353h170" stroke="#5f3540" strokeWidth="18" strokeLinecap="round" />
        <path d="M150 302h42v31h-42q-13-16 0-31ZM220 302h42v31h-42q-13-16 0-31Z" fill="#fff1d5" />
        <path d="M165 291q-12-22 1-39M237 291q-12-22 1-39" fill="none" stroke="#fff" strokeWidth="6" opacity=".7" />
      </>;
    case "city":
    case "office":
    case "conference":
      return <>
        <path d="M22 390V175h100v215M115 390V95h125v295M232 390V145h146v245" fill="#3f5c73" />
        {[55, 88, 148, 184, 271, 310, 346].map((x, index) => <g key={x}>{[0, 1, 2, 3].map((row) => <rect key={row} x={x} y={185 + row * 42 - (index % 3) * 35} width="20" height="20" rx="4" fill="#ffd982" />)}</g>)}
        <path d="M0 386h400v44H0Z" fill="#26394c" />
        <path d="M55 410h290" stroke="#f5d28a" strokeWidth="7" strokeDasharray="25 18" />
      </>;
    case "resort":
      return <>
        <circle cx="314" cy="80" r="43" fill="#ffe08b" />
        <path d="M70 330V155h245v175" fill="#f3e5c6" />
        <path d="M51 155 193 80l142 75Z" fill="#bd684f" />
        {[103, 159, 224, 279].map((x) => <rect key={x} x={x} y="190" width="38" height="64" rx="6" fill="#6db2bd" />)}
        <path d="M0 326q100-33 200 0t200 0v104H0Z" fill="#4db6c1" />
        <path d="M355 330q-8-116 20-181M374 158q-35-26-60 2M373 158q35-27 58 1" fill="none" stroke="#2e6650" strokeWidth="13" strokeLinecap="round" />
      </>;
    case "family":
    case "baby":
    case "home":
      return <>
        <path d="M42 366V196L200 86l158 110v170Z" fill="#f0d2a5" />
        <path d="M20 200 200 66l180 134" fill="none" stroke="#8f4f56" strokeWidth="25" strokeLinejoin="round" />
        <rect x="166" y="246" width="68" height="120" rx="34" fill="#9b6171" />
        <circle cx="126" cy="247" r="25" fill="#efc5a6" /><circle cx="200" cy="222" r="29" fill="#f0c9aa" /><circle cx="274" cy="247" r="25" fill="#e8b897" />
        <path d="M89 342q8-70 37-70t38 70M158 342q10-89 42-89t42 89M236 342q8-70 38-70t38 70" fill="#5c7890" />
      </>;
    case "sports":
      return <>
        <path d="M0 315q100-55 200 0t200 0v115H0Z" fill="#4f8b58" />
        <circle cx="200" cy="188" r="78" fill="#f5f0df" />
        <path d="m200 110 35 25-13 42h-44l-13-42ZM122 190l42-12 25 35-22 37-43-4ZM278 190l-42-12-25 35 22 37 43-4ZM162 257l30-34h38l14 42-35 24ZM238 257l-30-34h-38l-14 42 35 24Z" fill="#30445a" />
        <path d="M50 346h300M77 382h246" stroke="#d6edbd" strokeWidth="7" />
      </>;
    case "stage":
    case "party":
      return <>
        <path d="M0 330h400v100H0Z" fill="#34233f" />
        <path d="m60 50 72 245M340 50l-72 245M200 32v264" stroke="#ffe08c" strokeWidth="24" opacity=".38" />
        {[68, 125, 201, 278, 335].map((x, index) => <g key={x} transform={`translate(${x} ${220 + (index % 2) * 36})`}><circle r="19" fill="#f4c7a8" /><path d="M-25 105q3-75 25-75t25 75" fill={index % 2 ? "#e06c84" : "#687fc4"} /></g>)}
        <path d="m44 92 14 25 28 5-20 20 5 28-27-13-25 13 5-28-21-20 29-5ZM328 82l12 22 25 4-18 18 4 25-23-12-23 12 4-25-18-18 25-4Z" fill="#ffd872" />
      </>;
    default:
      return <>
        <circle cx="200" cy="168" r="77" fill="#f1c8aa" />
        <path d="M121 171q8-108 79-108t79 108q-38-35-79-84-40 48-79 84Z" fill="#4b3543" />
        <path d="M84 410q17-166 116-166t116 166Z" fill="#8f5269" />
        <circle cx="172" cy="170" r="7" fill="#51394a" /><circle cx="228" cy="170" r="7" fill="#51394a" />
        <path d="M177 205q23 20 46 0" fill="none" stroke="#b96068" strokeWidth="7" strokeLinecap="round" />
        <path d="M41 82h88M271 82h88M41 108h54M305 108h54" stroke="#fff0cf" strokeWidth="8" strokeLinecap="round" opacity=".65" />
      </>;
  }
}

function ThemeIllustration({ styleName, themeName }: { styleName: string; themeName: string }) {
  const hash = hashThemeName(`${styleName}-${themeName}`);
  const scene = getThemeScene(themeName);

  return (
    <img
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      draggable={false}
      src={getRealSceneImage(scene, hash)}
    />
  );
}

export function ThemeSelectionScreen({
  onBack,
  onSelectTheme,
  selectedStyle,
  selectedThemeName,
  showBack = true,
}: {
  onBack: () => void;
  onSelectTheme: (themeName: string) => void;
  selectedStyle: ThemeCard;
  selectedThemeName?: string;
  showBack?: boolean;
}) {
  const themeNames = themesByStyle[selectedStyle.name] ?? [];

  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
      {showBack ? (
        <div className="mb-8">
          <BackControl onClick={onBack} />
        </div>
      ) : null}
      <h1 className="pb-12 text-center font-sans text-6xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
        Choose a Theme
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {themeNames.map((themeName) => {
          const isSelected = selectedThemeName === themeName;

          return (
            <button
              className={`group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border bg-[#15110e] text-left shadow-2xl shadow-black/30 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 ${
                isSelected ? "border-primary/70" : "border-border"
              }`}
              key={themeName}
              onClick={() => onSelectTheme(themeName)}
              type="button"
            >
              <ThemeIllustration styleName={selectedStyle.name} themeName={themeName} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-sans text-3xl leading-[0.95] text-[#f8fafc] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
                  {themeName}
                </h2>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: PhotoTemplate }) {
  const templateHash = hashThemeName(template.id);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1.35rem] bg-[#0c0907] p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(229,199,137,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(145deg,rgba(255,248,232,0.04),transparent_45%)]" />
      <div className="relative h-full w-full">
        {template.slots.map((slot, index) => {
          const accent = (templateHash + index * 17) % 4;
          const skeletonTone =
            accent === 0
              ? "rgba(229,199,137,0.34)"
              : accent === 1
                ? "rgba(196,151,82,0.31)"
                : accent === 2
                  ? "rgba(245,232,202,0.25)"
                  : "rgba(151,113,64,0.35)";

          return (
            <div
              className="absolute overflow-hidden rounded-lg border border-white/15 bg-[#1b1510] shadow-lg shadow-black/30"
              key={`${template.id}-${index}`}
              style={{
                height: `${(slot.h / 12) * 100}%`,
                left: `${(slot.x / 12) * 100}%`,
                top: `${(slot.y / 12) * 100}%`,
                width: `${(slot.w / 12) * 100}%`,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 transition duration-500 group-hover:scale-105"
                style={{
                  background: `radial-gradient(circle at 35% 22%, ${skeletonTone}, transparent 36%), linear-gradient(135deg, rgba(255,248,232,0.12), rgba(12,9,7,0.94))`,
                }}
              />
              <div className="absolute left-[13%] top-[16%] h-[18%] w-[38%] rounded-full bg-white/18" />
              <div className="absolute bottom-[15%] left-[13%] h-[8%] w-[58%] rounded-full bg-white/12" />
              <div className="absolute bottom-[28%] left-[13%] h-[7%] w-[36%] rounded-full bg-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplateSelectionScreen({
  onOpenPrompt,
  onBack,
  onSelectTemplate,
  selectedTemplateId,
}: {
  onBack: () => void;
  onOpenPrompt: (template: PhotoTemplate) => void;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="mb-8">
        <BackControl onClick={onBack} />
      </div>
      <h1 className="pb-12 text-center font-sans text-6xl leading-[0.9] text-foreground sm:text-7xl lg:text-8xl">
        Choose a Template
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photoTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <button
              className={`group overflow-hidden rounded-[1.5rem] border bg-card text-left shadow-2xl shadow-black/10 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 ${
                isSelected ? "border-primary/70" : "border-border"
              }`}
              key={template.id}
              onClick={() => {
                onSelectTemplate(template.id);
                onOpenPrompt(template);
              }}
              type="button"
            >
              <TemplatePreview template={template} />
              <div className="px-5 py-4">
                <h2 className="font-sans text-2xl leading-tight text-foreground">{template.name}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-primary/80">
                  {template.imageCount} image{template.imageCount === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const stylePromptContext: Record<string, string> = {
  "Individual Portraits":
    "a premium individual portrait collection focused on one person's facial identity, confidence, natural expression, personality, posture, wardrobe texture, and elegant solo presence",
  "Couple Photoshoots":
    "a premium couple photoshoot collection focused on emotional connection, believable chemistry, coordinated styling, shared body language, natural closeness, and cinematic romantic storytelling",
  "Traditional Indian Events with Rituals":
    "a premium Indian event album focused on rituals, family warmth, traditional attire, sacred decor, cultural details, ceremonial gestures, festive emotion, and timeless album storytelling",
  "Formal Family Events":
    "a premium family event album focused on graceful group posing, generational connection, polished outfits, natural smiles, formal celebration details, and refined family portrait composition",
  Parties:
    "a premium party album focused on celebration energy, vibrant ambience, candid laughter, elegant social moments, stylish decor, movement, and polished nightlife or gathering photography",
  Conferences:
    "a premium conference photo story focused on speakers, audience engagement, stage presence, professional lighting, corporate branding atmosphere, networking moments, and event highlights",
  Seminars:
    "a premium seminar and knowledge-session photo story focused on learning, expert presentation, attentive participants, clean corporate interiors, workshop interaction, and professional documentation",
  "Expert Visit for Official Audit":
    "a premium official audit visit documentation album focused on expert inspection, formal interaction, site review, process credibility, leadership presence, operational details, and institutional professionalism",
  "Cultural Events":
    "a premium cultural event album focused on stage performance, expressive movement, traditional costumes, audience atmosphere, dramatic lighting, ceremony, awards, and celebration of talent",
  "Sports Events":
    "a premium sports event album focused on action, teamwork, competitive energy, athletic movement, celebration, awards, spectators, and clean sports-documentary storytelling",
  "Official Parties":
    "a premium official party album focused on corporate celebration, leadership moments, team bonding, formal hospitality, gala atmosphere, networking, and elegant event photography",
};

const templateCategoryContext: Record<string, string> = {
  "asymmetrical": "use an organic asymmetrical composition with intentional imbalance, varied image sizes, offset rhythm, and editorial negative space",
  "equal-grid": "use a clean equal-grid composition with precise alignment, consistent gutters, balanced cropping, and a calm professional structure",
  "event-story": "use a narrative event-story composition that reads from opening scene to main highlight, supporting moments, and closing memory",
  "hero": "use a hero-image composition where the largest frame carries the main emotional or visual highlight and smaller frames support the story",
  "magazine": "use a premium magazine-style editorial composition with cover-like hierarchy, refined cropping, strong visual pacing, and luxury spacing",
  "modern-creative": "use a contemporary creative composition with rounded cards, layered visual rhythm, floating-gallery energy, and polished social-media elegance",
  "mosaic": "use a dynamic mosaic composition with mixed portrait and landscape crops, uneven sizes, handcrafted balance, and Pinterest-style visual flow",
  "professional-event": "use a professional event composition with speaker or subject hierarchy, supporting audience/team moments, and clean documentary polish",
  "symmetrical": "use a symmetrical layout with mirrored balance, centered alignment, clean geometry, equal spacing, and formal visual harmony",
  "wedding-album": "use a premium album-spread composition with emotional highlights, supporting details, romantic pacing, and luxury keepsake presentation",
};

const getThemeVisualDirection = (themeName?: string) => {
  const theme = (themeName ?? "selected theme").toLowerCase();

  if (theme.includes("beach")) {
    return "a serene beach setting with soft sand, ocean waves, warm sunset reflections, breezy fabric movement, natural skin tones, and airy coastal luxury";
  }
  if (theme.includes("mountain")) {
    return "a cinematic mountain setting with layered peaks, open sky, cool natural atmosphere, wind-swept styling, deep perspective, and adventurous premium portrait energy";
  }
  if (theme.includes("sunset") || theme.includes("golden hour")) {
    return "golden-hour light with warm highlights, soft rim light, glowing atmosphere, long shadows, rich skin tones, and romantic cinematic color grading";
  }
  if (theme.includes("garden")) {
    return "an elegant garden setting with lush greenery, florals, soft daylight, refined natural textures, balanced color harmony, and graceful outdoor composition";
  }
  if (theme.includes("lake")) {
    return "a calm lakeside setting with reflective water, soft sky, quiet natural atmosphere, elegant posing, and polished editorial serenity";
  }
  if (theme.includes("rain")) {
    return "a romantic rain atmosphere with glossy reflections, soft umbrellas or wet surfaces, cinematic backlight, emotional closeness, and dramatic mood";
  }
  if (theme.includes("traditional") || theme.includes("ethnic") || theme.includes("indian")) {
    return "rich Indian traditional styling with detailed fabrics, jewellery, warm festive colors, cultural decor, graceful posing, and premium ceremonial atmosphere";
  }
  if (theme.includes("royal") || theme.includes("palace") || theme.includes("heritage")) {
    return "a royal heritage setting with carved architecture, arches, marble or stone textures, chandeliers or warm lamps, luxury wardrobe styling, and regal editorial composition";
  }
  if (theme.includes("temple") || theme.includes("pooja") || theme.includes("ritual")) {
    return "a sacred temple or ritual setting with brass lamps, floral decor, carved pillars, warm devotional light, traditional gestures, and respectful ceremonial elegance";
  }
  if (theme.includes("conference") || theme.includes("keynote") || theme.includes("panel")) {
    return "a polished conference environment with stage lighting, podium or panel setup, engaged audience, professional decor, clear sightlines, and corporate event credibility";
  }
  if (theme.includes("seminar") || theme.includes("workshop") || theme.includes("lecture") || theme.includes("training")) {
    return "a clean seminar environment with expert-led presentation, attentive participants, modern seating, knowledge-sharing moments, and crisp professional documentation";
  }
  if (theme.includes("audit") || theme.includes("inspection") || theme.includes("compliance") || theme.includes("factory")) {
    return "a formal inspection environment with official review moments, leadership discussion, site details, documentation gestures, and polished institutional seriousness";
  }
  if (theme.includes("dance") || theme.includes("music") || theme.includes("stage") || theme.includes("cultural")) {
    return "a dramatic stage-event setting with expressive performers, cultural costumes, theatrical lighting, audience atmosphere, and polished performance photography";
  }
  if (theme.includes("sports") || theme.includes("cricket") || theme.includes("football") || theme.includes("volleyball")) {
    return "an energetic sports setting with motion, team spirit, athletic action, spectators, trophy or celebration moments, and crisp high-shutter event photography";
  }
  if (theme.includes("party") || theme.includes("celebration") || theme.includes("gala") || theme.includes("networking")) {
    return "an elegant celebration setting with warm ambient light, stylish decor, candid social moments, polished outfits, sparkle, and premium event atmosphere";
  }
  if (theme.includes("family")) {
    return "a refined family gathering setting with warm connection, balanced group posing, gentle smiles, elegant outfits, and timeless portrait-album composition";
  }

  return "a premium cinematic setting tailored to the selected theme with refined styling, expressive moments, balanced composition, natural skin tones, and luxury editorial polish";
};

const getParticipantPrompt = (details: ParticipantDetails) => {
  if (details.groupPeople && details.groupPeople.length > 0) {
    const people = details.groupPeople
      .map(
        (person, index) =>
          `Person ${index + 1} should be represented as ${person.relationship}; priority ${person.priority}, where lower numbers have higher visual importance`,
      )
      .join(". ");

    return `There are ${details.peopleCount ?? details.groupPeople.length} people in the scene. ${people}. People sharing the same priority may receive similar visual importance, while priority 1 subjects should receive the strongest framing, clarity, face visibility, and central or hero placement.`;
  }

  if (details.coupleRelationship) {
    return `There are exactly two people. Their relationship is ${details.coupleRelationship}. Preserve both faces equally, show believable emotional connection, coordinated posing, natural chemistry, and balanced importance between both people.`;
  }

  if (details.personName) {
    return `There is exactly one person named ${details.personName}. Preserve the person's facial identity, age, skin tone, expression, posture, and natural likeness with the strongest possible solo portrait focus.`;
  }

  return "There is exactly one person. Preserve the person's facial identity, age, skin tone, expression, posture, and natural likeness with the strongest possible solo portrait focus.";
};

const getTemplateSlotPrompt = (template: PhotoTemplate) =>
  template.slots
    .map(
      (slotItem, index) =>
        `Frame ${index + 1}: position x${slotItem.x}, y${slotItem.y}, width ${slotItem.w}, height ${slotItem.h} on a 12 by 12 layout canvas`,
    )
    .join(". ");

const getShotVarietyPrompt = (styleName?: string, themeName?: string) => {
  const style = styleName ?? "Selected style";
  const theme = themeName ?? "Selected theme";

  return [
    `main hero image that clearly expresses ${theme}`,
    `close-up portrait or detail moment suitable for ${style}`,
    "wide establishing scene with environment and atmosphere",
    "candid emotional moment with natural expressions",
    "formal composed frame with clean posture and premium styling",
    "supporting detail image showing clothing, decor, props, venue, or event ambience",
  ].join("; ");
};

export const buildTemplatePrompt = ({
  participantDetails,
  selectedStyle,
  selectedThemeName,
  template,
}: {
  participantDetails?: ParticipantDetails;
  selectedStyle?: ThemeCard | null;
  selectedThemeName?: string;
  template: PhotoTemplate;
}) => {
  const styleName = selectedStyle?.name ?? "selected style";
  const themeName = selectedThemeName ?? "selected theme";
  const details = participantDetails ?? {};
  const styleContext = stylePromptContext[styleName] ?? "a premium photo album collection with refined storytelling";
  const templateContext = templateCategoryContext[template.category] ?? "use a polished professional composition";

  return [
    `Create a highly detailed premium ALANKAAR photo album design for ${styleName}.`,
    `Album context: ${styleContext}.`,
    `Selected theme: ${themeName}.`,
    `Theme visual direction: ${getThemeVisualDirection(themeName)}.`,
    `Participant direction: ${getParticipantPrompt(details)}`,
    `Template direction: use the "${template.name}" template with ${template.imageCount} images. The layout category is ${template.category}; ${templateContext}. Orientation behavior should support ${template.orientation} while keeping every crop intentional and visually balanced.`,
    `Template slot map: ${getTemplateSlotPrompt(template)}.`,
    `Shot variety to include across the ${template.imageCount} image frames: ${getShotVarietyPrompt(styleName, themeName)}.`,
    "Composition rules: place the highest-priority person or main event moment in the largest or most central frame. Use supporting frames for secondary people, candid reactions, environmental details, decor, audience, family, team, rituals, or atmosphere depending on the chosen style. Maintain clear visual hierarchy, consistent spacing, premium album margins, and refined crop balance.",
    "Lighting and color: use cinematic natural light or polished event lighting appropriate to the theme, realistic skin tones, soft highlights, controlled contrast, tasteful shadows, luxury color grading, high dynamic range, and cohesive color harmony across every image.",
    "Quality requirements: ultra photorealistic, professional DSLR or mirrorless camera quality, sharp eyes and faces, detailed clothing texture, realistic hands, clean edges, natural expressions, elegant posing, balanced depth of field, premium editorial finish, print-ready album clarity.",
    "Strict negative instructions: avoid distorted faces, changed identity, duplicate people, missing people, extra limbs, unnatural hands, warped bodies, crossed eyes, bad anatomy, blurry faces, over-smoothed skin, harsh artifacts, random text, logos, watermarks, messy borders, cluttered layout, inconsistent lighting, low-resolution crops, and accidental empty frames.",
  ].join("\n\n");
};

function PromptModal({
  onClose,
  prompt,
  templateName,
}: {
  onClose: () => void;
  prompt: string;
  templateName: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      <div className="animate-modal-in relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-border bg-popover/95 text-popover-foreground shadow-2xl shadow-black/25">
        <div className="flex items-start justify-between gap-5 border-b border-border px-6 py-5 sm:px-8">
          <h2 className="font-sans text-3xl leading-none text-foreground sm:text-4xl">{templateName}</h2>
          <button
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-background/60 p-5 text-sm leading-7 text-foreground">
            {prompt}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function StyleSelectionPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeCard | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ThemeCard | null>(null);
  const [selectedThemeName, setSelectedThemeName] = useState<string>();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [participantDetails, setParticipantDetails] = useState<ParticipantDetails>();
  const [promptPreview, setPromptPreview] = useState<{ prompt: string; templateName: string }>();

  const handleParticipantDetailsContinue = (details: ParticipantDetails) => {
    if (!selectedTheme) {
      return;
    }

    setParticipantDetails(details);
    setSelectedStyle(selectedTheme);
    setSelectedThemeName(undefined);
    setSelectedTemplateId(undefined);
    setSelectedTheme(null);
  };

  const handleBackToStyles = () => {
    setSelectedStyle(null);
    setSelectedThemeName(undefined);
    setSelectedTemplateId(undefined);
    setParticipantDetails(undefined);
    setPromptPreview(undefined);
  };

  const handleBackToThemes = () => {
    setSelectedThemeName(undefined);
    setSelectedTemplateId(undefined);
    setPromptPreview(undefined);
  };

  const handleOpenPrompt = (template: PhotoTemplate) => {
    setPromptPreview({
      prompt: buildTemplatePrompt({
        participantDetails,
        selectedStyle,
        selectedThemeName,
        template,
      }),
      templateName: template.name,
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background py-24 text-foreground sm:py-28">
      <div className="studio-ambient pointer-events-none fixed inset-0" />
      {selectedStyle ? (
        selectedThemeName ? (
          <TemplateSelectionScreen
            onBack={handleBackToThemes}
            onOpenPrompt={handleOpenPrompt}
            onSelectTemplate={setSelectedTemplateId}
            selectedTemplateId={selectedTemplateId}
          />
        ) : (
          <ThemeSelectionScreen
            onBack={handleBackToStyles}
            onSelectTheme={setSelectedThemeName}
            selectedStyle={selectedStyle}
            selectedThemeName={selectedThemeName}
          />
        )
      ) : (
        <div className="relative">
          <div className="mx-auto mb-8 w-full max-w-7xl px-6 sm:px-8">
            <BackControl href="/" />
          </div>
          <h1 className="px-6 pb-16 text-center font-sans text-6xl leading-[0.9] text-foreground sm:px-8 sm:text-7xl lg:text-8xl">
            Choose your Style
          </h1>
          <div className="space-y-16 sm:space-y-20">
            <ThemeCarousel direction="left" onSelectTheme={setSelectedTheme} themes={personalThemes} title="Personal" />
            <ThemeCarousel
              direction="right"
              onSelectTheme={setSelectedTheme}
              themes={professionalThemes}
              title="Professional"
            />
          </div>
        </div>
      )}

      {selectedTheme && (
        <StyleModal
          onClose={() => setSelectedTheme(null)}
          onContinue={handleParticipantDetailsContinue}
          selectedTheme={selectedTheme}
        />
      )}
      {promptPreview && (
        <PromptModal
          onClose={() => setPromptPreview(undefined)}
          prompt={promptPreview.prompt}
          templateName={promptPreview.templateName}
        />
      )}
    </main>
  );
}
