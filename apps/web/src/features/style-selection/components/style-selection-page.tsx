"use client";

import { ArrowLeft, X } from "lucide-react";
import { useMemo, useState } from "react";

import { photoTemplates, type PhotoTemplate } from "@/features/templates/template-library";

const maxGroupPeople = 12;

const personalThemes = [
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

const professionalThemes = [
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

const themesByStyle: Record<string, string[]> = {
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

type ThemeCard = {
  image: string;
  name: string;
};

type GroupPerson = {
  priority: string;
  relationship: string;
};

type ParticipantDetails = {
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
    "inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 text-sm text-[#eee3cf]/80 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45";

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

function ThemeCarousel({
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
      <h2 className="px-6 font-serif text-3xl leading-none text-[#fff8e8] sm:px-8 sm:text-4xl lg:px-12">
        {title}
      </h2>
      <div className="group overflow-hidden">
        <div
          className={`flex w-max gap-5 px-6 sm:gap-6 sm:px-8 lg:px-12 ${
            direction === "right" ? "animate-style-scroll-right" : "animate-style-scroll-left"
          } group-hover:[animation-play-state:paused]`}
        >
          {repeatedThemes.map((theme, index) => (
            <button
              className="group/card relative h-[240px] w-[250px] shrink-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#15110e] text-left shadow-2xl shadow-black/30 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 sm:h-[300px] sm:w-[320px] lg:h-[340px] lg:w-[380px]"
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
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <h3 className="font-serif text-3xl leading-[0.95] text-[#fff8e8] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)] sm:text-4xl">
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
      <div className="animate-modal-in relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15110e]/95 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
          <h2 className="font-serif text-3xl leading-none text-[#fff8e8] sm:text-4xl">{selectedTheme.name}</h2>
          <button
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#fff8e8] transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
                <span className="text-sm text-[#d6cbb5]/80">Person Name</span>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-[#fff8e8] outline-none transition placeholder:text-[#d6cbb5]/35 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
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
                <span className="text-sm text-[#d6cbb5]/80">Relationship between the two people</span>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-[#fff8e8] outline-none transition placeholder:text-[#d6cbb5]/35 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
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
                <span className="text-sm text-[#d6cbb5]/80">Number of People</span>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-[#fff8e8] outline-none transition placeholder:text-[#d6cbb5]/35 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
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
                      className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[1fr_140px] sm:items-end"
                      key={index}
                    >
                      <label className="block space-y-2">
                        <span className="text-sm text-[#d6cbb5]/80">Person {index + 1}</span>
                        <input
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-[#fff8e8] outline-none transition placeholder:text-[#d6cbb5]/35 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                          onChange={(event) => updateGroupPerson(index, "relationship", event.target.value)}
                          placeholder="Relationship to the group"
                          value={person.relationship}
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm text-[#d6cbb5]/80">Priority</span>
                        <select
                          className="h-12 w-full rounded-xl border border-white/10 bg-black/70 px-4 text-[#fff8e8] outline-none transition focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                          onChange={(event) => updateGroupPerson(index, "priority", event.target.value)}
                          value={person.priority}
                        >
                          <option value="">Select</option>
                          {Array.from({ length: normalizedPeopleCount }, (_, priorityIndex) => {
                            const priority = String(priorityIndex + 1);

                            return (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-5 sm:px-8">
          <button
            className="h-12 w-full rounded-full bg-primary px-6 text-sm font-medium text-black transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#d6cbb5]/35"
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

const themeImagePool = {
  audit: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
  blackWhite: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85&sat=-100",
  celebration: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
  city: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=85",
  conference: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  couple: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85",
  cultural: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=85",
  family: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85",
  festival: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85",
  garden: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=85",
  lake: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85",
  lifestyle: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  mountain: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85",
  office: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85",
  party: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85",
  portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=900&q=85",
  resort: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
  seminar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
  temple: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=85",
};

const getThemeImage = (styleName: string, themeName: string) => {
  const text = `${styleName} ${themeName}`.toLowerCase();

  if (text.includes("beach")) return themeImagePool.beach;
  if (text.includes("mountain")) return themeImagePool.mountain;
  if (text.includes("lake")) return themeImagePool.lake;
  if (text.includes("rain")) return themeImagePool.rain;
  if (text.includes("garden") || text.includes("picnic")) return themeImagePool.garden;
  if (text.includes("forest") || text.includes("nature")) return themeImagePool.forest;
  if (text.includes("city") || text.includes("urban") || text.includes("street") || text.includes("cafe")) {
    return themeImagePool.city;
  }
  if (text.includes("sunset") || text.includes("golden hour") || text.includes("resort") || text.includes("luxury")) {
    return themeImagePool.resort;
  }
  if (text.includes("black & white")) return themeImagePool.blackWhite;
  if (text.includes("portrait") || text.includes("casual") || text.includes("lifestyle")) return themeImagePool.portrait;
  if (text.includes("traditional") || text.includes("ethnic") || text.includes("festival") || text.includes("pooja")) {
    return themeImagePool.festival;
  }
  if (text.includes("royal") || text.includes("palace") || text.includes("heritage") || text.includes("temple")) {
    return themeImagePool.temple;
  }
  if (text.includes("wedding") || text.includes("haldi") || text.includes("mehendi") || text.includes("sangeet")) {
    return themeImagePool.festival;
  }
  if (text.includes("family") || text.includes("baby") || text.includes("naming") || text.includes("housewarming")) {
    return themeImagePool.family;
  }
  if (text.includes("party") || text.includes("celebration") || text.includes("farewell") || text.includes("birthday")) {
    return themeImagePool.party;
  }
  if (text.includes("conference") || text.includes("summit") || text.includes("keynote") || text.includes("panel")) {
    return themeImagePool.conference;
  }
  if (text.includes("seminar") || text.includes("workshop") || text.includes("lecture") || text.includes("training")) {
    return themeImagePool.seminar;
  }
  if (text.includes("audit") || text.includes("inspection") || text.includes("compliance") || text.includes("factory")) {
    return themeImagePool.audit;
  }
  if (text.includes("cultural") || text.includes("dance") || text.includes("music") || text.includes("stage")) {
    return themeImagePool.cultural;
  }
  if (text.includes("sports") || text.includes("cricket") || text.includes("football") || text.includes("volleyball")) {
    return themeImagePool.sports;
  }
  if (text.includes("office") || text.includes("corporate") || text.includes("networking") || text.includes("gala")) {
    return themeImagePool.office;
  }

  return themeImagePool.couple;
};

function ThemeSelectionScreen({
  onBack,
  onSelectTheme,
  selectedStyle,
  selectedThemeName,
}: {
  onBack: () => void;
  onSelectTheme: (themeName: string) => void;
  selectedStyle: ThemeCard;
  selectedThemeName?: string;
}) {
  const themeNames = themesByStyle[selectedStyle.name] ?? [];

  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="mb-8">
        <BackControl onClick={onBack} />
      </div>
      <h1 className="pb-12 text-center font-serif text-6xl leading-[0.9] text-[#fff8e8] sm:text-7xl lg:text-8xl">
        Choose a Theme
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {themeNames.map((themeName) => {
          const isSelected = selectedThemeName === themeName;

          return (
            <button
              className={`group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border bg-[#15110e] text-left shadow-2xl shadow-black/30 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 ${
                isSelected ? "border-primary/70" : "border-white/10"
              }`}
              key={themeName}
              onClick={() => onSelectTheme(themeName)}
              type="button"
            >
              <img
                alt={themeName}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                draggable={false}
                src={getThemeImage(selectedStyle.name, themeName)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-serif text-3xl leading-[0.95] text-[#fff8e8] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">
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
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1.35rem] bg-[#0c0907] p-3">
      <div className="relative h-full w-full">
        {template.slots.map((slot, index) => (
          <div
            className="absolute overflow-hidden rounded-lg border border-white/15 bg-gradient-to-br from-primary/35 via-[#5c3e22]/50 to-black shadow-lg shadow-black/25"
            key={`${template.id}-${index}`}
            style={{
              height: `${(slot.h / 12) * 100}%`,
              left: `${(slot.x / 12) * 100}%`,
              top: `${(slot.y / 12) * 100}%`,
              width: `${(slot.w / 12) * 100}%`,
            }}
          >
            <div className="h-full w-full bg-[radial-gradient(circle_at_35%_20%,rgba(255,248,232,0.38),transparent_35%),linear-gradient(135deg,rgba(214,174,97,0.32),rgba(12,9,7,0.92))]" />
          </div>
        ))}
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
      <h1 className="pb-12 text-center font-serif text-6xl leading-[0.9] text-[#fff8e8] sm:text-7xl lg:text-8xl">
        Choose a Template
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photoTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <button
              className={`group overflow-hidden rounded-[1.5rem] border bg-[#15110e] text-left shadow-2xl shadow-black/30 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45 ${
                isSelected ? "border-primary/70" : "border-white/10"
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
                <h2 className="font-serif text-2xl leading-tight text-[#fff8e8]">{template.name}</h2>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-primary/80">
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

const buildTemplatePrompt = ({
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
    `Create a highly detailed premium ALANKAR photo album design for ${styleName}.`,
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
      <div className="animate-modal-in relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15110e]/95 shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-5 border-b border-white/10 px-6 py-5 sm:px-8">
          <h2 className="font-serif text-3xl leading-none text-[#fff8e8] sm:text-4xl">{templateName}</h2>
          <button
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#fff8e8] transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/25 p-5 text-sm leading-7 text-[#eee3cf]">
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
    <main className="min-h-screen overflow-hidden bg-[#0b0908] py-24 text-[#fff8e8] sm:py-28">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(213,171,93,0.18),transparent_30rem),radial-gradient(circle_at_86%_16%,rgba(122,84,45,0.22),transparent_28rem),linear-gradient(180deg,rgba(11,9,8,0),#0b0908_90%)]" />
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
          <h1 className="px-6 pb-16 text-center font-serif text-6xl leading-[0.9] text-[#fff8e8] sm:px-8 sm:text-7xl lg:text-8xl">
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
