import React, { useMemo, useState, useCallback } from "react";
import {
  CalendarDays, MapPin, Train, Wallet, CheckCircle2, Circle,
  UtensilsCrossed, Plane, Mountain, Camera, Waves, Hotel,
  Sparkles, ChevronRight, Luggage, Bookmark, Heart, Plus,
  Map, List, LayoutGrid, X,
} from "lucide-react";

// ─── Daten ────────────────────────────────────────────────────────────────────

const stops = [
  { id: "tok1", city: "Tokio",          nights: 6, range: "01.05–07.05", hotel: "Hotel Sunroad Shibuya",              position: [35.6595, 139.7005] },
  { id: "hak",  city: "Hakone",         nights: 2, range: "07.05–09.05", hotel: "Laforet Hakone Gora Yunosumika",     position: [35.2456, 139.0497] },
  { id: "kyo",  city: "Kyōto",          nights: 3, range: "09.05–12.05", hotel: "WAYFARER Gojo",                      position: [34.9955, 135.7608] },
  { id: "osa",  city: "Ōsaka",          nights: 3, range: "12.05–15.05", hotel: "Hotel Abitare Namba West",           position: [34.6623, 135.4903] },
  { id: "kin",  city: "Kinosaki Onsen", nights: 2, range: "15.05–17.05", hotel: "Onishiya Suishoen",                  position: [35.6256, 134.8125] },
  { id: "hir",  city: "Hiroshima",      nights: 2, range: "17.05–19.05", hotel: "Hilton Hiroshima",                   position: [34.3887, 132.4667] },
  { id: "tok2", city: "Tokio",          nights: 2, range: "19.05–21.05", hotel: "Syforme Keikyu-Kamata Residence",    position: [35.5605, 139.7161] },
];

const trip = {
  title: "Japan 2026",
  subtitle: "21 Tage Rundreise für zwei",
  travelers: "Ehepaar, Anfang 40",
  focus: ["Großstadtkultur", "Kulinarik", "Onsen/Ryokan", "Natur", "Fotografie"],
  dateRange: "01.05.2026 – 21.05.2026",
  flight: {
    outbound: "01.05.2026 · Frankfurt → Tokio-Haneda · Ankunft 09:50",
    inbound:  "21.05.2026 · Tokio-Haneda → Frankfurt · Abflug 09:50",
  },
  budget: {
    target:         "ca. 7.500 € variabel",
    railPass:       "1.250–1.300 €",
    lodging:        "3.800–4.300 €",
    food:           "1.800–2.100 €",
    activities:     "800–1.100 €",
    localTransport: "350–550 €",
    reserve:        "600–900 €",
    total:          "ca. 7.600–8.300 €",
  },
};

const itinerary = [
  { day: 1,  date: "Fr, 01.05.2026", city: "Tokio",            title: "Ankunft in Haneda & Shibuya",        transport: "Flugankunft · Transfer",           hotel: "Hotel Sunroad Shibuya",           highlights: ["Immigration & Gepäck","eSIM / IC-Card organisieren","Shibuya Scramble","Hachikō","erste Izakaya"],       vibe: "sanfter Start",          icon: Plane },
  { day: 2,  date: "Sa, 02.05.2026", city: "Tokio",            title: "Shibuya, Harajuku & Shinjuku",       transport: "Metro / zu Fuß",                   hotel: "Hotel Sunroad Shibuya",           highlights: ["Meiji-Schrein","Yoyogi-Park","Takeshita-dōri","Omotesandō","Shinjuku bei Nacht"],                          vibe: "urban & ikonisch",       icon: Camera },
  { day: 3,  date: "So, 03.05.2026", city: "Tokio",            title: "Asakusa, Ueno & Akihabara",          transport: "Metro / zu Fuß",                   hotel: "Hotel Sunroad Shibuya",           highlights: ["Sensō-ji","Altstadtgassen","Sumida-Fluss","Ueno-Park","Akihabara"],                                          vibe: "klassisch & nerdy",      icon: Sparkles },
  { day: 4,  date: "Mo, 04.05.2026", city: "Tokio",            title: "Odaiba, Technik & Kunst",            transport: "Metro / Bahn",                     hotel: "Hotel Sunroad Shibuya",           highlights: ["teamLab Planets","Miraikan","Buchtspaziergang","Rainbow-Bridge-Fotos"],                                      vibe: "immersiv",               icon: Bookmark },
  { day: 5,  date: "Di, 05.05.2026", city: "Tokio",            title: "Szenige Viertel & Shopping",         transport: "Metro / zu Fuß",                   hotel: "Hotel Sunroad Shibuya",           highlights: ["Shimokitazawa","Nakameguro","Daikanyama","Cafés & Boutiquen"],                                                vibe: "entspannt & fotogen",    icon: Heart },
  { day: 6,  date: "Mi, 06.05.2026", city: "Tokio",            title: "Reservetag & Lieblingsorte",         transport: "Flexibel",                         hotel: "Hotel Sunroad Shibuya",           highlights: ["Lieblingsviertel erneut","optionales Museum","ruhiger Abend"],                                                vibe: "frei & flexibel",        icon: CalendarDays },
  { day: 7,  date: "Do, 07.05.2026", city: "Hakone",           title: "Tokio → Hakone",                     transport: "JR bis Odawara · Hakone-Transfer", hotel: "Laforet Hakone Gora Yunosumika",  highlights: ["Check-out","Anreise","erstes Onsen","entspannter Abend"],                                                      vibe: "runterkommen",           icon: Train },
  { day: 8,  date: "Fr, 08.05.2026", city: "Hakone",           title: "Fuji-Region, Museum & Ashi-See",     transport: "Hakone Free Pass / lokal",         hotel: "Laforet Hakone Gora Yunosumika",  highlights: ["Open-Air Museum","Owakudani","Boot am Ashi-See","Fuji-Blicke","Onsen"],                                       vibe: "Natur & Kunst",          icon: Mountain },
  { day: 9,  date: "Sa, 09.05.2026", city: "Kyōto",            title: "Hakone → Kyōto",                     transport: "Odawara → Kyōto per Shinkansen",   hotel: "WAYFARER Gojo",                   highlights: ["letzter Onsen","Anreise","Kamogawa","Ponto-chō","Abendessen in Gion"],                                        vibe: "sanfter Kulturwechsel",  icon: Train },
  { day: 10, date: "So, 10.05.2026", city: "Kyōto",            title: "Kyōto Ost: Klassiker & Altstadt",    transport: "Bahn / Bus / zu Fuß",              hotel: "WAYFARER Gojo",                   highlights: ["Fushimi Inari","Kiyomizu-dera","Sannenzaka","Ninenzaka","Gion"],                                               vibe: "ikonisch & traditionell",icon: Camera },
  { day: 11, date: "Mo, 11.05.2026", city: "Kyōto",            title: "Arashiyama & leichte Wanderung",     transport: "Bahn / zu Fuß",                    hotel: "WAYFARER Gojo",                   highlights: ["Bambuswald","Tenryū-ji","Togetsukyō","leichte Wanderung","Dinner nahe Nishiki"],                               vibe: "grün & ruhig",           icon: Mountain },
  { day: 12, date: "Di, 12.05.2026", city: "Ōsaka",            title: "Kyōto → Ōsaka",                      transport: "JR nach Ōsaka",                    hotel: "Hotel Abitare Namba West",        highlights: ["Souvenirs","Check-in","Dōtonbori","Streetfood-Tour"],                                                          vibe: "laut & lecker",          icon: UtensilsCrossed },
  { day: 13, date: "Mi, 13.05.2026", city: "Ōsaka",            title: "Burg, Skyline & Umeda",              transport: "Metro / zu Fuß",                   hotel: "Hotel Abitare Namba West",        highlights: ["Ōsaka Castle","Park","Cafés","Umeda","Sky Building bei Sunset"],                                               vibe: "Urban Panorama",         icon: Camera },
  { day: 14, date: "Do, 14.05.2026", city: "Ōsaka",            title: "Museum, Alltagskultur & Retro-Neon", transport: "Metro / zu Fuß",                   hotel: "Hotel Abitare Namba West",        highlights: ["Housing and Living Museum","Tenjibashi-suji","Shinsekai","Tsūtenkaku","Kushikatsu"],                          vibe: "retro & lebendig",       icon: Sparkles },
  { day: 15, date: "Fr, 15.05.2026", city: "Kinosaki Onsen",   title: "Ōsaka → Kinosaki Onsen",             transport: "Limited Express",                  hotel: "Onishiya Suishoen",               highlights: ["Anreise","Onsen-Hopping","Kanalspaziergang","Yukata-Fotos"],                                                    vibe: "romantisch",             icon: Waves },
  { day: 16, date: "Sa, 16.05.2026", city: "Kinosaki Onsen",   title: "Wellness & leichte Wanderung",       transport: "zu Fuß / lokal",                   hotel: "Onishiya Suishoen",               highlights: ["weitere Bäder","leichte Wanderung","Kaiseki-Dinner","Nachtfotos"],                                             vibe: "wellness",               icon: Waves },
  { day: 17, date: "So, 17.05.2026", city: "Hiroshima",        title: "Kinosaki → Hiroshima",               transport: "JR / Shinkansen",                  hotel: "Hilton Hiroshima",                highlights: ["lange Transferetappe","Hondōri","Hiroshima-Style Okonomiyaki"],                                                vibe: "ankommen & eintauchen",  icon: Train },
  { day: 18, date: "Mo, 18.05.2026", city: "Hiroshima",        title: "Geschichte & Gedenken",              transport: "Straßenbahn / zu Fuß",             hotel: "Hilton Hiroshima",                highlights: ["Friedenspark","Atombomben-Dom","Friedensmuseum","optionales Schloss"],                                         vibe: "ruhig & nachdenklich",   icon: Bookmark },
  { day: 19, date: "Di, 19.05.2026", city: "Miyajima / Tokio", title: "Miyajima & zurück nach Tokio",       transport: "JR + Fähre · abends Shinkansen",   hotel: "Syforme Keikyu-Kamata Residence", highlights: ["Itsukushima-Schrein","Mount Misen","Lunch auf Miyajima","später Check-in"],                                    vibe: "großer Schlusspunkt",    icon: Train },
  { day: 20, date: "Mi, 20.05.2026", city: "Tokio",            title: "Final Touch in Tokio",               transport: "Metro / zu Fuß",                   hotel: "Syforme Keikyu-Kamata Residence", highlights: ["letzte Museen","Spa / Onsen","Shopping","Abschieds-Dinner"],                                                   vibe: "genießen",               icon: Heart },
  { day: 21, date: "Do, 21.05.2026", city: "Tokio-Haneda",     title: "Rückflug",                           transport: "Hotel → Haneda",                   hotel: "—",                               highlights: ["früher Check-out","Transfer zum Flughafen","Abflug 09:50"],                                                    vibe: "Heimreise",              icon: Plane },
];

const foodSpots = [
  { city: "Tokio",          spots: ["Kinka Sushi Bar Izakaya Shibuya","Kumamoto Izakaya Shinshigai","Izakaya Vin","Ichiran Ramen","Depachika im Isetan"] },
  { city: "Hakone",         spots: ["Ryokan Kaiseki-Dinner","Soba nahe Gora"] },
  { city: "Kyōto",          spots: ["Nishiki Market","Ponto-chō Abendessen","Tofu-Kaiseki in Gion"] },
  { city: "Ōsaka",          spots: ["Ajinoya","Hakatarou Houzenji","Streetfood in Dōtonbori","Takoyaki Wanaka"] },
  { city: "Kinosaki",       spots: ["Kaiseki im Ryokan","Kani-Miso am Kanal"] },
  { city: "Hiroshima",      spots: ["Okonomimura","Izakaya am Oyster-Kai","Onomichi Ramen"] },
];

const helperCards = [
  { title: "Rail Pass",    text: "21 Tage Nationwide ab 02.05. eingeplant. Lange Etappen gut abgedeckt.",                               icon: Train },
  { title: "Ankunft",      text: "Am ersten Tag direkt eSIM/SIM und IC-Card organisieren – spart später viel Zeit.",                     icon: Plane },
  { title: "Paar-Momente", text: "Hakone und Kinosaki sind bewusste Ruheinseln für Onsen, Ryokan und langsamere Tage.",                  icon: Heart },
  { title: "Fotospots",    text: "Shibuya, Gion, Arashiyama, Kinosaki bei Nacht, Miyajima und Odaiba: starke Motive.",                  icon: Camera },
  { title: "Mai in Japan", text: "Goldene Woche 03.–05.05.: Sehenswürdigkeiten gut besucht. Frühes Aufstehen lohnt sich.",              icon: CalendarDays },
  { title: "Bargeld",      text: "Japan ist noch immer teilweise Cash-only. 7-Eleven-ATMs akzeptieren ausländische Karten zuverlässig.", icon: Wallet },
];

const DEFAULT_CHECKLIST = [
  "Reisepässe prüfen (mind. 6 Monate gültig)",
  "eSIM auswählen & einrichten",
  "IC-Card / Suica-Plan klären",
  "Rail Pass kaufen & Aktivierung vorbereiten",
  "teamLab Planets Tickets buchen",
  "Abschieds-Dinner reservieren",
  "Ryokan-Onsen-Gepäck ergänzen",
  "Adapter & Powerbank einpacken",
  "Offline-Karten (Google Maps) speichern",
  "Auslandskrankenversicherung griffbereit",
];

// ─── Storage Keys ────────────────────────────────────────────────────────────
const STORAGE_KEY = "japan2026_checks_v2";
const CUSTOM_KEY  = "japan2026_custom_v2";

// ─── Helper Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">{value}</div>
      {sub && <div className="mt-1 text-sm text-neutral-500">{sub}</div>}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, dark = false }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${dark ? "text-red-300" : "text-red-600"}`}>{eyebrow}</div>
      <h2 className={`text-2xl font-semibold tracking-tight ${dark ? "text-white" : "text-neutral-900"}`}>{title}</h2>
      {text && <p className={`text-sm leading-6 ${dark ? "text-white/60" : "text-neutral-500"}`}>{text}</p>}
    </div>
  );
}

// ─── SVG Map ─────────────────────────────────────────────────────────────────

const MAP_BOUNDS = { minLat: 33.5, maxLat: 36.3, minLng: 130.5, maxLng: 141.5 };
const W = 700, H = 380;

function project([lat, lng]) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * W;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * H;
  return [x, y];
}

function SvgMap({ activeStop, onSelect }) {
  const pts = stops.map(s => project(s.position));
  const polyline = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

  return (
    <div className="overflow-hidden rounded-[20px] border border-black/5 bg-[#f0ede8]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: "block" }}>
        <rect x="0" y="0" width={W} height={H} fill="#e8e3db" />
        <text x="12" y="20" fontSize="10" fill="#b0a89a" fontFamily="sans-serif">Japan · Mai 2026</text>
        <path d={polyline} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        {stops.map((stop, i) => {
          const [x, y] = pts[i];
          const isActive = activeStop === i;
          return (
            <g key={stop.id} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
              <circle cx={x} cy={y} r={isActive ? 14 : 10} fill={isActive ? "#ef4444" : "#fff"} stroke={isActive ? "#fff" : "#ef4444"} strokeWidth="2.5" filter={isActive ? "drop-shadow(0 4px 8px rgba(239,68,68,.4))" : "none"} />
              <text x={x} y={y + 4.5} textAnchor="middle" fontSize="9" fontWeight="700" fill={isActive ? "#fff" : "#ef4444"} fontFamily="sans-serif">{i + 1}</text>
              <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fill="#4a4036" fontFamily="sans-serif" fontWeight="500">{stop.city}</text>
            </g>
          );
        })}
      </svg>

      {activeStop !== null && (
        <div className="border-t border-black/5 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {activeStop + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-neutral-900">{stops[activeStop].city}</div>
              <div className="truncate text-sm text-neutral-500">{stops[activeStop].hotel}</div>
            </div>
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
              {stops[activeStop].range}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[activeStop].hotel + " " + stops[activeStop].city + " Japan")}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
            >
              Maps ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Checklist Hook ───────────────────────────────────────────────────────────

function usePersistedChecklist() {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CHECKLIST;
    } catch {
      return DEFAULT_CHECKLIST;
    }
  });

  const [checks, setChecks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const persist = useCallback((newChecks, newItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChecks));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(newItems));
    } catch {
      // Quota exceeded or private browsing — silently ignore
    }
  }, []);

  const toggle = useCallback((index) => {
    setChecks(prev => {
      const next = { ...prev, [index]: !prev[index] };
      persist(next, items);
      return next;
    });
  }, [items, persist]);

  const addItem = useCallback((text) => {
    setItems(prev => {
      const next = [...prev, text];
      persist(checks, next);
      return next;
    });
  }, [checks, persist]);

  const removeItem = useCallback((index) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      const newChecks = {};
      Object.entries(checks).forEach(([k, v]) => {
        const ki = parseInt(k);
        if (ki < index) newChecks[ki] = v;
        else if (ki > index) newChecks[ki - 1] = v;
      });
      setChecks(newChecks);
      persist(newChecks, next);
      return next;
    });
  }, [checks, persist]);

  const completed = useMemo(() => Object.values(checks).filter(Boolean).length, [checks]);

  return { items, checks, toggle, addItem, removeItem, completed };
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "Überblick",  icon: LayoutGrid },
  { id: "itinerary", label: "Tagesplan",  icon: List },
  { id: "map",       label: "Karte",      icon: Map },
  { id: "checklist", label: "Checkliste", icon: CheckCircle2 },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab]       = useState("overview");
  const [selectedCity, setSelectedCity] = useState("Alle");
  const [activeStop, setActiveStop]     = useState(null);
  const [newItem, setNewItem]           = useState("");
  const { items, checks, toggle, addItem, removeItem, completed } = usePersistedChecklist();

  const totalNights  = useMemo(() => stops.reduce((s, st) => s + st.nights, 0), []);
  const cities       = useMemo(() => ["Alle", ...Array.from(new Set(itinerary.map(d => d.city)))], []);
  const visibleDays  = useMemo(
    () => selectedCity === "Alle" ? itinerary : itinerary.filter(d => d.city === selectedCity),
    [selectedCity]
  );

  const handleAddItem = () => {
    const t = newItem.trim();
    if (t) { addItem(t); setNewItem(""); }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-xl shadow-black/5">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="border-b border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.15),_transparent_35%),linear-gradient(135deg,#fff,#faf7f3)] px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  <Sparkles className="h-3.5 w-3.5" /> persönliche Reise-Webapp
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-5xl">{trip.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 md:text-base">
                  {trip.subtitle} · {trip.dateRange}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {trip.focus.map(f => (
                    <span key={f} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">{f}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[560px]">
                <StatCard icon={CalendarDays} label="Zeitraum"    value={`${totalNights} Tage`}    sub={trip.dateRange} />
                <StatCard icon={MapPin}       label="Stops"       value={`${stops.length}`}        sub="Tokio bis Miyajima" />
                <StatCard icon={Hotel}        label="Unterkünfte" value={`${stops.length} Hotels`} sub="alle fix gebucht" />
                <StatCard icon={Wallet}       label="Budget"      value={trip.budget.target}       sub="ohne Flüge" />
              </div>
            </div>
          </div>

          {/* ── Tab Bar ─────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 border-b border-black/5 bg-white/95 backdrop-blur px-5 md:px-8">
            <div className="flex gap-1 overflow-x-auto py-2">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${active ? "bg-red-50 text-red-700" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === "checklist" && (
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-500"}`}>
                        {completed}/{items.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab: Überblick ──────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="grid gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.2fr_0.8fr]">

              {/* Route */}
              <div className="rounded-[28px] border border-black/5 bg-[#fcfbf8] p-5 md:p-6">
                <SectionTitle eyebrow="Überblick" title="Route & Rhythmus" text="Die Reise wechselt bewusst zwischen Stadterkundung und Onsen-/Naturphasen." />
                <div className="space-y-3">
                  {stops.map((stop, idx) => (
                    <div key={stop.id} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">{idx + 1}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-neutral-900">{stop.city}</h3>
                          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">{stop.range}</span>
                          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600">{stop.nights} Nächte</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">{stop.hotel}</p>
                      </div>
                      {idx < stops.length - 1 && <ChevronRight className="mt-1 hidden h-4 w-4 text-neutral-400 md:block" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Flights */}
                <div className="rounded-[28px] border border-black/5 bg-neutral-950 p-5 text-white md:p-6">
                  <SectionTitle eyebrow="Flüge" title="Eure Eckdaten" text="Alles Wichtige auf einen Blick." dark />
                  <div className="space-y-4 text-sm text-white/80">
                    {[
                      ["Hinflug",  trip.flight.outbound],
                      ["Rückflug", trip.flight.inbound],
                      ["Profil",   `${trip.travelers} · ${trip.focus.join(", ")}`],
                    ].map(([label, val]) => (
                      <div key={label} className="rounded-2xl bg-white/5 p-4">
                        <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">{label}</div>
                        <div>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="rounded-[28px] border border-black/5 bg-white p-5 md:p-6">
                  <SectionTitle eyebrow="Budget" title="Kostenrahmen" text="Zahlen als Reisekompass für den variablen Teil." />
                  <div className="space-y-3 text-sm">
                    {[
                      ["JR Pass",           trip.budget.railPass],
                      ["Unterkünfte",       trip.budget.lodging],
                      ["Essen & Getränke",  trip.budget.food],
                      ["Eintritte & Onsen", trip.budget.activities],
                      ["Lokaler Verkehr",   trip.budget.localTransport],
                      ["Reserve / Shopping",trip.budget.reserve],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3">
                        <span className="text-neutral-600">{label}</span>
                        <span className="font-medium text-neutral-900">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 font-semibold text-red-700">
                      <span>Gesamtrahmen</span>
                      <span>{trip.budget.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Tagesplan ──────────────────────────────────────────── */}
          {activeTab === "itinerary" && (
            <div className="px-5 py-6 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/5 bg-[#fcfbf8] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <SectionTitle eyebrow="Tagesplan" title="Eure Reise Tag für Tag" text="Alle Etappen mit Aufenthaltsort, Transfer und Highlights." />
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Stadt filtern</label>
                    <select
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none md:min-w-[220px]"
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {visibleDays.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.day} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm shadow-black/5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Tag {item.day} · {item.date}</div>
                            <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900">{item.title}</h3>
                            <div className="mt-2 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">{item.vibe}</div>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="grid gap-3 text-sm text-neutral-600">
                          {[
                            [MapPin, "Ort",       item.city],
                            [Train,  "Transport", item.transport],
                            [Hotel,  "Hotel",     item.hotel],
                          ].map(([Ic, label, val]) => (
                            <div key={label} className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-3">
                              <Ic className="mt-0.5 h-4 w-4 text-neutral-400" />
                              <div>
                                <div className="font-medium text-neutral-900">{label}</div>
                                <div>{val}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 text-sm font-medium text-neutral-900">Highlights</div>
                          <div className="flex flex-wrap gap-2">
                            {item.highlights.map(h => (
                              <span key={h} className="rounded-full border border-black/5 bg-[#fcfbf8] px-3 py-1.5 text-xs text-neutral-700">{h}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Karte ──────────────────────────────────────────────── */}
          {activeTab === "map" && (
            <div className="px-5 py-6 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/5 bg-[#fcfbf8] p-5 md:p-6">
                <SectionTitle eyebrow="Karte" title="Interaktive Reiseroute" text="Klicke auf einen Stopp für Details. Alle Hotels verbunden durch eure Route." />
                <SvgMap activeStop={activeStop} onSelect={i => setActiveStop(prev => prev === i ? null : i)} />

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {stops.map((stop, i) => (
                    <button
                      key={stop.id}
                      onClick={() => setActiveStop(prev => prev === i ? null : i)}
                      className={`rounded-[20px] border p-4 text-left transition ${activeStop === i ? "border-red-200 bg-red-50" : "border-black/5 bg-white hover:border-red-100 hover:bg-red-50/50"}`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Stop {i + 1}</div>
                      <div className="mt-1 text-sm font-semibold text-neutral-900">{stop.city}</div>
                      <div className="mt-0.5 text-sm text-neutral-600 leading-snug">{stop.hotel}</div>
                      <div className="mt-1 text-xs text-neutral-500">{stop.range} · {stop.nights} Nächte</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Food spots */}
              <div className="mt-6 rounded-[28px] border border-black/5 bg-neutral-950 p-5 text-white md:p-6">
                <SectionTitle eyebrow="Food" title="Merkliste für Genuss" text="Im Reiseplan genannte Spots als schneller Merkzettel." dark />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-white/80">
                  {foodSpots.map(group => (
                    <div key={group.city} className="rounded-2xl bg-white/5 p-4">
                      <div className="mb-2 text-sm font-semibold text-white">{group.city}</div>
                      <div className="flex flex-wrap gap-2">
                        {group.spots.map(spot => (
                          <span key={spot} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85">{spot}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Checkliste ─────────────────────────────────────────── */}
          {activeTab === "checklist" && (
            <div className="grid gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">

                {/* Checklist */}
                <div className="rounded-[28px] border border-black/5 bg-white p-5 md:p-6">
                  <SectionTitle eyebrow="Planung" title="Checkliste vor Abflug" text="Interaktiv abhaken – wird im Browser gespeichert." />
                  <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {completed} von {items.length} Punkten erledigt
                  </div>

                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${items.length ? (completed / items.length) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="space-y-1">
                    {items.map((item, index) => {
                      const done = !!checks[index];
                      return (
                        <div key={`${item}-${index}`} className="group flex items-center gap-2 rounded-2xl px-3 py-2.5 transition hover:bg-neutral-50">
                          <button onClick={() => toggle(index)} className="flex flex-1 items-center gap-3 text-left">
                            {done
                              ? <CheckCircle2 className="h-5 w-5 shrink-0 text-red-600" />
                              : <Circle className="h-5 w-5 shrink-0 text-neutral-300" />}
                            <span className={done ? "text-sm text-neutral-400 line-through" : "text-sm text-neutral-700"}>{item}</span>
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="shrink-0 rounded-full p-1 text-neutral-300 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      value={newItem}
                      onChange={e => setNewItem(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddItem()}
                      placeholder="Eigenen Punkt hinzufügen …"
                      className="flex-1 rounded-2xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
                    />
                    <button
                      onClick={handleAddItem}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white transition hover:bg-red-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Packlist */}
                <div className="rounded-[28px] border border-black/5 bg-white p-5 md:p-6">
                  <SectionTitle eyebrow="Packen" title="Mini-Packliste für diese Route" text="Besonders sinnvoll für Städte, Onsen und längere Zugfahrten." />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "leichte Sneaker für Stadttage",
                      "kleine Daybag für Fotozeug",
                      "kompakte Regenjacke (Mai!)",
                      "Powerbank & Ladekabel",
                      "Adapter (Typ A, kein Erd.)",
                      "Onsen-taugliche Basics",
                      "Schichtlook für Küste & Berge",
                      "Medikamente im Handgepäck",
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                        <Luggage className="h-4 w-4 shrink-0 text-neutral-400" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Helper cards */}
              <div className="rounded-[28px] border border-black/5 bg-[#fcfbf8] p-5 md:p-6">
                <SectionTitle eyebrow="Praktisch" title="Japan-Helfer für unterwegs" text="Kleine Erinnerungen, die euch während der Reise helfen." />
                <div className="grid gap-4 md:grid-cols-2">
                  {helperCards.map(({ title, text, icon: Icon }) => (
                    <div key={title} className="rounded-[24px] bg-white p-5 shadow-sm shadow-black/5">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-base font-semibold text-neutral-900">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
