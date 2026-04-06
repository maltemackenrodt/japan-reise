import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  CalendarDays, MapPin, Train, Wallet, CheckCircle2, Circle,
  UtensilsCrossed, Plane, Mountain, Camera, Waves, Hotel,
  Sparkles, ChevronRight, Luggage, Bookmark, Heart, Plus,
  Map, List, LayoutGrid, X, Moon, Sun, ChevronDown, ChevronUp,
  Coffee, ShoppingBag,
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

// ─── Tagesempfehlungen ────────────────────────────────────────────────────────

const dayRecs = {
  1: {
    morgens: [
      { name: "Haneda Terminal 3 Food Court", desc: "Frisches Onigiri & Soba direkt nach der Landung", q: "Haneda Airport Terminal 3 food court Tokyo" },
      { name: "7-Eleven am Flughafen", desc: "IC-Card besorgen & erstes Konbini-Erlebnis in Japan", q: "7-Eleven Haneda Airport Tokyo" },
      { name: "Daiwa Sushi Tsukiji", desc: "Legende für Morgen-Sushi – falls noch Energie (bis 13 h)", q: "Daiwa Sushi Tsukiji Tokyo" },
    ],
    mittags: [
      { name: "Gyukatsu Motomura Shibuya", desc: "Paniertes Rind auf heißem Stein – Shibuya-Ikone", q: "Gyukatsu Motomura Shibuya Tokyo" },
      { name: "Shibuya Hikarie ShinQs Dining", desc: "Großes Food-Angebot im 11./12. Stock mit Stadtblick", q: "Shibuya Hikarie ShinQs Dining Tokyo" },
      { name: "Ichiran Ramen Shibuya", desc: "Solo-Ramen-Kabine – unvergessliches erstes Ramen-Erlebnis", q: "Ichiran Ramen Shibuya Tokyo" },
    ],
    abends: [
      { name: "Shibuya Sky", desc: "Rooftop-Observation-Deck bei Nacht – Ticket vorab buchen!", q: "Shibuya Sky observation deck Tokyo" },
      { name: "Nonbei Yokocho", desc: "Enge Gässchen mit gemütlichen Izakayas, ruhiger als Golden Gai", q: "Nonbei Yokocho Shibuya Tokyo" },
      { name: "Shibuya Scramble Crossing", desc: "Entspannter erster Nachtspaziergang rund ums Epizentrum", q: "Shibuya Scramble Crossing Tokyo" },
    ],
  },
  2: {
    morgens: [
      { name: "Meiji-Schrein (6–8 h)", desc: "Vor der Masse da sein – stimmungsvoller Waldweg zum Schrein", q: "Meiji Shrine Tokyo" },
      { name: "Fuglen Tokyo", desc: "Norwegisches Specialty-Café in Tomigaya, einer der besten Kaffees Tokios", q: "Fuglen Tokyo Tomigaya" },
      { name: "Yoyogi-Park Picknick", desc: "Morgen-Spaziergang im Park, entspannte japanische Atmosphäre", q: "Yoyogi Park Tokyo" },
    ],
    mittags: [
      { name: "Harajuku Takeshita-dōri Crepes", desc: "Buntes Streetfood-Klassiker – süß, kitschig, lecker", q: "Crepes Takeshita-dori Harajuku Tokyo" },
      { name: "Maisen Tonkatsu Omotesandō", desc: "Legende für paniertes Schweinekotelett in einer alten Badeanstalt", q: "Tonkatsu Maisen Omotesando Tokyo" },
      { name: "Afuri Ramen Harajuku", desc: "Leichter Yuzu-Shio-Ramen – weniger schwer als klassischer Ramen", q: "Afuri Ramen Harajuku Tokyo" },
    ],
    abends: [
      { name: "Shinjuku Golden Gai", desc: "200+ winzige Bars in engen Gassen – legendäre Nachtatmosphäre", q: "Shinjuku Golden Gai Tokyo" },
      { name: "Omoide Yokocho (Memory Lane)", desc: "Dampfende Yakitori-Spieße in den ältesten Gassen Shinjukus", q: "Omoide Yokocho Memory Lane Shinjuku Tokyo" },
      { name: "Tokyo Metropolitan Gov. Building", desc: "Kostenloser Aussichtsturm mit Panoramablick – bis 22:30 h offen", q: "Tokyo Metropolitan Government Building observation deck" },
    ],
  },
  3: {
    morgens: [
      { name: "Sensō-ji (6–7 h)", desc: "Tokios ältester Tempel im Morgenlicht – fast menschenleer", q: "Senso-ji Temple Asakusa Tokyo" },
      { name: "Nakamise-dōri Souvenirs", desc: "Traditionelle Süßigkeiten und Souvenirs in der Tempelgasse", q: "Nakamise-dori Asakusa Tokyo" },
      { name: "Komakataya Dorayaki", desc: "Seit 1895: süßes Bohnenpfannkuchen-Gebäck zum Frühstück", q: "Komagataya Dorayaki Asakusa Tokyo" },
    ],
    mittags: [
      { name: "Ueno Ameyoko Markt", desc: "Lebhafter Außenmarkt unter der Hochbahn – Street Food & Fisch", q: "Ameyoko Market Ueno Tokyo" },
      { name: "Sometaro Okonomiyaki Asakusa", desc: "Selbst grillen am Tisch – rustikales Erlebnis", q: "Sometaro Okonomiyaki Asakusa Tokyo" },
      { name: "Ramen Ouka Ueno", desc: "Schlichter, intensiver Shoyu-Ramen nahe dem Ueno-Park", q: "Ramen Ouka Ueno Tokyo" },
    ],
    abends: [
      { name: "Akihabara Electric Town", desc: "LEDs, Arcades, Anime – einzigartiger Neon-Abend", q: "Akihabara Electric Town Tokyo" },
      { name: "Super Potato Retro Games", desc: "7-stöckiges Retro-Videospiel-Paradies – Nostalgie pur", q: "Super Potato Akihabara Tokyo" },
      { name: "Maid Café @home Café", desc: "Das typische Akihabara-Erlebnis für neugierige Besucher", q: "@home cafe Akihabara Tokyo" },
    ],
  },
  4: {
    morgens: [
      { name: "teamLab Planets (Frühticket)", desc: "Immersive Kunstinstallationen – Tickets vorab buchen, früh ruhiger", q: "teamLab Planets Toyosu Tokyo" },
      { name: "Miraikan (Wissenschaftsmuseum)", desc: "Nationalmuseum für Wissenschaft & Technologie auf Odaiba", q: "Miraikan National Museum of Emerging Science Tokyo" },
      { name: "Toyota Mega Web", desc: "Kostenlose Auto-Ausstellung mit Fahrsimulation auf Odaiba", q: "Toyota Mega Web Odaiba Tokyo" },
    ],
    mittags: [
      { name: "DiverCity Tokyo Food Court", desc: "Gutes Angebot direkt im Einkaufszentrum neben Unicorn Gundam", q: "DiverCity Tokyo Plaza food court Odaiba" },
      { name: "Aqua City Odaiba Restaurants", desc: "Direkter Blick auf Rainbow Bridge und Tokio-Skyline beim Essen", q: "Aqua City Odaiba restaurant Tokyo" },
      { name: "Odaiba Seaside Park Lunch", desc: "Konbini-Picknick mit spektakulärem Bucht-Panorama", q: "Odaiba Seaside Park Tokyo" },
    ],
    abends: [
      { name: "Rainbow Bridge bei Nacht", desc: "Illuminierter Spaziergang über die Hängebrücke – kostenlos", q: "Rainbow Bridge walking path Tokyo" },
      { name: "Yurikamome-Linie Rückfahrt", desc: "Vollautomatische Hochbahn – beste Aussicht im Führerstand vorne", q: "Yurikamome line Tokyo" },
      { name: "Diver City / Palette Town Abend", desc: "Shopping und Neon-Atmosphäre auf der Insel", q: "DiverCity Tokyo Plaza evening Odaiba" },
    ],
  },
  5: {
    morgens: [
      { name: "Shimokitazawa Vintage Shops", desc: "Tokios hippigster Stadtteil – Second-Hand, Musik, Cafés", q: "Shimokitazawa vintage Tokyo" },
      { name: "Bear Pond Espresso", desc: "Legendäres Espresso-Lab in Shimokitazawa – präziser Kaffee", q: "Bear Pond Espresso Shimokitazawa Tokyo" },
      { name: "Bonus Track Shimokitazawa", desc: "Ateliers, Buchläden und kleine Bars in neuem Komplex", q: "Bonus Track Shimokitazawa Tokyo" },
    ],
    mittags: [
      { name: "Nakameguro Meguro River Walk", desc: "Café-gesäumter Flussspaziergang – Tokios schönste Flaniermeile", q: "Nakameguro Meguro River Tokyo" },
      { name: "Log Road Daikanyama", desc: "Stylishe Food-Halle auf altem Bahngelände", q: "Log Road Daikanyama Tokyo" },
      { name: "Saturdays NYC Café Daikanyama", desc: "Surf-Café mit gutem Kaffee und Sandwiches", q: "Saturdays NYC Daikanyama Tokyo" },
    ],
    abends: [
      { name: "Daikanyama T-Site", desc: "Traumhafte Buchhandlung – Abendstunden hier verbringen", q: "Daikanyama T-Site Tokyo" },
      { name: "Anjin Bar im T-Site", desc: "Cocktails umgeben von tausenden Büchern und Schallplatten", q: "Anjin bar Daikanyama T-Site Tokyo" },
      { name: "Ebisu Garden Place", desc: "Weitläufige Anlage mit Restaurants und Yebisu-Bier-Museum", q: "Ebisu Garden Place Tokyo" },
    ],
  },
  6: {
    morgens: [
      { name: "Yanaka Ginza", desc: "Altes Shitamachi-Viertel – Tempel, Katzen und Ziegelgassen", q: "Yanaka Ginza shopping street Tokyo" },
      { name: "Nippori Textile Town", desc: "Größter Stoffmarkt Tokios – Souvenirs & Geschenke", q: "Nippori Textile Town Tokyo" },
      { name: "Nezu Shrine", desc: "Kleines Fushimi-Inari in Tokio – rote Torii-Gassen ohne Masse", q: "Nezu Shrine Tokyo" },
    ],
    mittags: [
      { name: "Koenji Cafés & Vintage", desc: "Entspannter Alternativ-Stadtteil westlich von Shinjuku", q: "Koenji vintage cafe Tokyo" },
      { name: "Kissa Neon Kissaten", desc: "Klassisches japanisches Kaffeestübchen der 60er Jahre", q: "Kissaten coffee shop Tokyo" },
      { name: "Tokyo Skytree (Top-Deck)", desc: "Falls noch nicht besucht: 634 m Aussicht über ganz Tokio", q: "Tokyo Skytree observation deck" },
    ],
    abends: [
      { name: "Lieblingsizakaya nochmal", desc: "Das Restaurant der ersten Woche wiederholen – mit Wissen jetzt besser genießen", q: "Izakaya Shibuya Tokyo" },
      { name: "Nakamise Abend-Spaziergang", desc: "Asakusa bei Nacht – Sensoji leuchtet ohne Tagestouristen", q: "Senso-ji night Asakusa Tokyo" },
      { name: "Früh schlafen vor Hakone-Transfer", desc: "Der Morgen-Express nach Odawara startet früh", q: "Hotel Sunroad Shibuya Tokyo" },
    ],
  },
  7: {
    morgens: [
      { name: "Odawara Castle Kurzbesuch", desc: "10-minütiger Fußweg vom Bahnhof – malerische Burg zum Aufwärmen", q: "Odawara Castle Japan" },
      { name: "Suzuhiro Kamaboko Museum", desc: "Fischkuchen-Handwerk zum Anschauen und Probieren in Odawara", q: "Suzuhiro Kamaboko Museum Odawara" },
      { name: "Odawara Fish Market Café", desc: "Frischer Meeresfrüchte-Morgen direkt am Hafen", q: "Odawara fish market cafe Japan" },
    ],
    mittags: [
      { name: "Hakone Ropeway & Owakudani", desc: "Schwefelquellen-Landschaft und schwarze Eier für langes Leben", q: "Owakudani Hakone ropeway Japan" },
      { name: "Soba Restaurant in Gora", desc: "Hausgemachte Buchweizennudeln nahe dem Ryokan", q: "Soba restaurant Gora Hakone Japan" },
      { name: "Gora Park Café", desc: "Europäischer Garten mit französischem Café und Fuji-Blick", q: "Gora Park Hakone Japan" },
    ],
    abends: [
      { name: "Ryokan Kaiseki-Dinner", desc: "Das mehrgängige Kaiseki-Abendessen – ruhig genießen", q: "Laforet Hakone Gora Yunosumika Japan" },
      { name: "Privat-Onsen im Hotel", desc: "Erstes Onsen-Erlebnis im eigenen Bad – nicht verpassen", q: "Laforet Hakone outdoor onsen Japan" },
      { name: "Abend-Spaziergang Gora", desc: "Stille Bergstraßen bei Nacht – Sternenhimmel über Hakone", q: "Gora Hakone night walk Japan" },
    ],
  },
  8: {
    morgens: [
      { name: "Morgen-Onsen mit Fuji-Blick", desc: "Früh aufstehen lohnt sich – Fuji im Morgenlicht unbeschreiblich", q: "Laforet Hakone Gora Yunosumika onsen Fuji view" },
      { name: "Hakone Open-Air Museum (Öffnung)", desc: "Skulpturenpark öffnet um 9 h – dann am ruhigsten", q: "Hakone Open Air Museum Japan" },
      { name: "Pola Museum of Art", desc: "Weltklasse-Impressionisten in ruhigem Waldgebäude", q: "Pola Museum of Art Hakone Japan" },
    ],
    mittags: [
      { name: "Hakone-en Aquarium & Café", desc: "Kleines Aquarium am Ashi-See mit Restaurant-Terrasse", q: "Hakone en aquarium Lake Ashi Japan" },
      { name: "Boot am Ashi-See", desc: "Fähre mit Fuji-Panorama – bei klarem Wetter atemberaubend", q: "Lake Ashi ferry Hakone Japan" },
      { name: "Moto-Hakone Dorf", desc: "Altes Zedernallee und historische Tokaido-Straße", q: "Moto-Hakone cedar avenue Japan" },
    ],
    abends: [
      { name: "Tenzan Tohji-kyo Onsen", desc: "Öffentliches Onsen außerhalb des Ryokans – milchig-schwefelig", q: "Tenzan Tohji-kyo Onsen Hakone Japan" },
      { name: "Abend-Kaiseki im Ryokan", desc: "Zweites Kaiseki – andere Komposition als am Abend davor", q: "Laforet Hakone Gora dinner Japan" },
      { name: "Sternenhimmel-Fotografie", desc: "Kaum Lichtverschmutzung – Stativ mitbringen für Nachtfotos", q: "Hakone stargazing Japan" },
    ],
  },
  9: {
    morgens: [
      { name: "Letzter Morgen-Onsen Hakone", desc: "Abschied vom Ryokan – Frühstück auf Tatami-Matten genießen", q: "Laforet Hakone Gora Yunosumika breakfast" },
      { name: "Shinkansen Odawara → Kyoto", desc: "Nozomi-Shinkansen: 80 Minuten Fahrt mit Fuji-Blick rechts", q: "Odawara station Shinkansen Japan" },
      { name: "Ekiben im Shinkansen", desc: "Regionale Lunchbox gekauft am Bahnhof – japanische Bahnhofstradition", q: "Ekiben bento box Odawara station Japan" },
    ],
    mittags: [
      { name: "Kyoto Station Ankunft & Umgebung", desc: "Beeindruckendes Bahnhofsgebäude – Dachterrasse kostenlos", q: "Kyoto Station rooftop terrace Japan" },
      { name: "Nishiki Market Streifzug", desc: "Tokios Küche ist anders hier – frische Pickles, Tofu, Fisch", q: "Nishiki Market Kyoto Japan" },
      { name: "Ramen Sen-no-Kaze Kyoto Station", desc: "Ramen direkt im Bahnhof – ideal nach langer Reise", q: "Ramen Sen no Kaze Kyoto Station Japan" },
    ],
    abends: [
      { name: "Ponto-chō Abendspaziergang", desc: "Schmale Gasse parallel zum Kamogawa – Hanamikoji-Atmosphäre", q: "Pontocho Kyoto Japan" },
      { name: "Kamogawa Flussufer", desc: "Abendliche Sitzreihen am Fluss – Kyoto bei Nacht sehr romantisch", q: "Kamogawa River Kyoto Japan evening" },
      { name: "Dinner in Gion", desc: "Traditionelles Viertel – Chance auf Geiko/Maiko-Sichtung abends", q: "Gion dinner restaurant Kyoto Japan" },
    ],
  },
  10: {
    morgens: [
      { name: "Fushimi Inari (6–7 h)", desc: "Früh aufstehen – 10.000 Torii-Tore ohne Touristenmasse", q: "Fushimi Inari Shrine Kyoto Japan" },
      { name: "Inarizushi Frühstück", desc: "Reistasche in Tofuhülle – lokales Frühstück rund um Fushimi", q: "Inarizushi Fushimi Kyoto Japan" },
      { name: "Tofukuji Tempel", desc: "Auf dem Weg nach Kiyomizudera – ruhiger Zen-Tempel", q: "Tofukuji Temple Kyoto Japan" },
    ],
    mittags: [
      { name: "Kiyomizudera & Aussichtsplattform", desc: "Ikone Kyotos – Holzkonstruktion ohne Nägel über dem Abhang", q: "Kiyomizudera Temple Kyoto Japan" },
      { name: "Sannenzaka & Ninenzaka Gassen", desc: "Kopfsteinpflastergassen mit Teehäusern und Traditionsladen", q: "Sannenzaka Ninenzaka Kyoto Japan" },
      { name: "Kasagi-ya Dessert", desc: "Ältestes Dessert-Café in Ninenzaka – süßer Matcha-Abschluss", q: "Kasagi-ya Ninenzaka Kyoto Japan" },
    ],
    abends: [
      { name: "Gion Hanamikoji-dori", desc: "Hauptstraße des Geisha-Viertels bei Einbruch der Dunkelheit", q: "Hanamikoji Street Gion Kyoto Japan" },
      { name: "Kichi Kichi Omurice", desc: "Berühmtes Omlett-Reisgericht mit Show-Cooking – Reservierung nötig!", q: "Kichi Kichi Omurice Kyoto Japan" },
      { name: "Sake-Bar in Gion", desc: "Kleine Bar mit japanischem Sake und Kyoto-Snacks", q: "Sake bar Gion Kyoto Japan" },
    ],
  },
  11: {
    morgens: [
      { name: "Bambuswald Arashiyama (6–7 h)", desc: "Magisch im Morgennebel – eine Stunde früher als alle anderen", q: "Bamboo Grove Arashiyama Kyoto Japan" },
      { name: "Tenryū-ji Garten", desc: "UNESCO-Welterbe-Zen-Garten – Eintritt lohnt sich morgens", q: "Tenryu-ji Temple Garden Arashiyama Kyoto Japan" },
      { name: "Jojakko-ji Waldtempel", desc: "Versteckter Moosgarten und Bergpfad über Arashiyama", q: "Jojakko-ji Temple Arashiyama Kyoto Japan" },
    ],
    mittags: [
      { name: "Togetsukyō-Brücke & Picknick", desc: "Malerische Bogenbrücke mit Bergpanorama – ideal für Fotos", q: "Togetsukyō Bridge Arashiyama Kyoto Japan" },
      { name: "Yudofu Restaurant Arashiyama", desc: "Kyotos Spezialität: Tofu-Kaiseki am Waldesrand", q: "Yudofu restaurant Arashiyama Kyoto Japan" },
      { name: "Sagano Romantic Train", desc: "25-minütige Panoramafahrt durch die Hozu-Schlucht", q: "Sagano Romantic Train Arashiyama Kyoto Japan" },
    ],
    abends: [
      { name: "Nishiki Market Abendgang", desc: "Nachmittags-Einkauf und Probieren in der langen Markthalle", q: "Nishiki Market Kyoto Japan" },
      { name: "Fushimi Sake-Brauerei Tour", desc: "Abends öffnen die Verkostungs-Shops im Brauerei-Viertel Fushimi", q: "Fushimi sake brewery Kyoto Japan" },
      { name: "Izakaya nahe WAYFARER Gojo", desc: "Entspannter letzter Kyoto-Abend – lokale Küche, kleine Biere", q: "Izakaya Gojo Kyoto Japan" },
    ],
  },
  12: {
    morgens: [
      { name: "Letzte Kyoto-Souvenirs Nishiki", desc: "Früh morgens, bevor die Touristen kommen", q: "Nishiki Market Kyoto Japan" },
      { name: "Kagizen Yoshifusa Süßwarenhaus", desc: "Seit 1716: ältestes Wagashi-Geschäft Kyotos", q: "Kagizen Yoshifusa Kyoto Japan" },
      { name: "Ryoanji Steingarten (kurz)", desc: "Weltberühmter Zen-Steingarten – früh fast leer", q: "Ryoanji Temple stone garden Kyoto Japan" },
    ],
    mittags: [
      { name: "Erste Takoyaki bei Wanaka Osaka", desc: "Gleich nach Ankunft: Original-Kraken-Bällchen in Namba", q: "Takoyaki Wanaka Namba Osaka Japan" },
      { name: "Dōtonbori Streetfood-Runde", desc: "Riesenplakat-Glico-Mann, Krabben-Restaurant, Fugu-Laden", q: "Dotonbori Osaka Japan" },
      { name: "Kuromon Ichiba Marktbesuch", desc: "Osakas Küchen-Markt: frische Austern, Thunfisch, Früchte", q: "Kuromon Ichiba Market Osaka Japan" },
    ],
    abends: [
      { name: "Dōtonbori Neon-Spaziergang", desc: "Leuchtende Schilder, Menschenmassen, Kanalbrücke – Osaka bei Nacht", q: "Dotonbori night Osaka Japan" },
      { name: "Ajinoya Okonomiyaki", desc: "Hausgemachtes Osaka-Okonomiyaki seit Jahrzehnten", q: "Ajinoya Okonomiyaki Osaka Japan" },
      { name: "Hozenji Yokocho Gasse", desc: "Moosbewachsener Brunnen, Laternen, Izakayas – ruhige Kontrast-Gasse", q: "Hozenji Yokocho Osaka Japan" },
    ],
  },
  13: {
    morgens: [
      { name: "Osaka Castle & Nishinomaru Garden", desc: "Burg am frühen Morgen – bester Licht für Fotos", q: "Osaka Castle Japan" },
      { name: "Osaka Museum of History", desc: "10. Stock: Direktblick auf Burg und Stadtgeschichte", q: "Osaka Museum of History Japan" },
      { name: "Ohatsu Tenjin Schrein", desc: "Kleiner Liebesschrein in der Innenstadt mit besonderer Geschichte", q: "Ohatsu Tenjin Shrine Osaka Japan" },
    ],
    mittags: [
      { name: "Shinsaibashi Shopping Arcade", desc: "Überdachte Einkaufsstraße – Modetrends und Mitbringsel", q: "Shinsaibashi shopping arcade Osaka Japan" },
      { name: "Kani Doraku Dotonbori", desc: "Das Krabben-Wahrzeichen Osakas – riesige Laufkrabbe im Eingang", q: "Kani Doraku Dotonbori Osaka Japan" },
      { name: "Amerika Mura Street Food", desc: "Osakas Vintage- und Street-Food-Viertel für jüngeres Flair", q: "America Mura Osaka Japan" },
    ],
    abends: [
      { name: "Umeda Sky Building Floating Garden", desc: "Sonnenuntergangs-Observation-Deck – nicht verpassen!", q: "Umeda Sky Building Floating Garden Observatory Osaka Japan" },
      { name: "Grand Front Osaka Restaurants", desc: "Moderner Komplex neben Umeda-Bahnhof mit Restaurantauswahl", q: "Grand Front Osaka restaurants Japan" },
      { name: "Lucua Food Hall Osaka", desc: "Unterirdische Food Hall unter dem Bahnhof – riesige Auswahl", q: "Lucua food hall Osaka station Japan" },
    ],
  },
  14: {
    morgens: [
      { name: "Housing & Living Museum Osaka", desc: "Zeitreise durch 400 Jahre Osaka – inklusive Edo-Straßenrekonstruktion", q: "Osaka Housing and Living Museum Japan" },
      { name: "Tenjibashi-suji Einkaufsstraße", desc: "Japans längste überdachte Einkaufsstraße – 2,6 km lang!", q: "Tenjibashi-suji shopping arcade Osaka Japan" },
      { name: "Nakatsu Café-Morgen", desc: "Ruhiger Stadtteil nördlich der City – lokale Cafés", q: "Nakatsu cafe Osaka Japan" },
    ],
    mittags: [
      { name: "Kuromon Ichiba frische Austern", desc: "Direkt am Stand frisch gegrillte Austern – absolutes Muss", q: "Kuromon Ichiba Market oyster Osaka Japan" },
      { name: "Namba Eks Retro Food Hall", desc: "Altes Kaufhaus-Food-Floor – ruhiger Geheimtipp", q: "Namba Osaka food court Japan" },
      { name: "Shinsekai Mittagessen", desc: "Mittagessen im Retro-Neon-Viertel mit Kishimen-Nudeln", q: "Shinsekai Osaka lunch Japan" },
    ],
    abends: [
      { name: "Tsūtenkaku Tower Lichter", desc: "Retro-Turm im Shinsekai bei Nacht – Kitsch auf bestem Niveau", q: "Tsutenkaku Tower night Osaka Japan" },
      { name: "Kushikatsu Daruma", desc: "Original Kushikatsu: frittierte Spieße in heißem Öl – keine doppelte Tauchregel!", q: "Kushikatsu Daruma Osaka Japan" },
      { name: "Jan Jan Yokocho (Janjansteg)", desc: "Enge Spielhallen-Gasse neben Shinsekai – Pachinko & Mahjong", q: "Jan Jan Yokocho Osaka Japan" },
    ],
  },
  15: {
    morgens: [
      { name: "Früh aus Osaka abreisen", desc: "Limited Express Kounotori ab Osaka – ruhige 2,5-h-Fahrt", q: "Osaka Kinosaki Onsen Limited Express Kounotori Japan" },
      { name: "Bento im Zug", desc: "Letzte Gelegenheit für Osaka-Bento am Bahnhof vor Abfahrt", q: "Osaka station bento Eki-Ben Japan" },
      { name: "Landschaft genießen", desc: "Fahrt durch Hyogo-Präfektur – Reisfelder und Berge aus dem Fenster", q: "Kinosaki Onsen train view Japan" },
    ],
    mittags: [
      { name: "Ankunft & Check-in Onishiya Suishoen", desc: "Ryokan-Empfang, Yukata anlegen, erste Ruhe genießen", q: "Onishiya Suishoen Kinosaki Onsen Japan" },
      { name: "Kinosaki Sotoyu-Hopping beginnen", desc: "7 öffentliche Außenbäder – Yuraaruki-Pass für alle inklusive", q: "Kinosaki Onsen sotoyu public baths Japan" },
      { name: "Kanalspaziergang Yuraaruki", desc: "Weidensäumter Kanal – in Yukata spazieren wie anno 1900", q: "Kinosaki Onsen canal walk Japan" },
    ],
    abends: [
      { name: "Yukata-Fotosession bei Dämmerung", desc: "Laternenlicht, Kanal und Weidenträume – beste Fotostimmung", q: "Kinosaki Onsen yukata evening Japan" },
      { name: "Onsen-Street bei Nacht", desc: "Illuminierter Hauptkanalspaziergang – romantischste Kulisse der Reise", q: "Kinosaki Onsen night lantern Japan" },
      { name: "Kaiseki-Dinner im Ryokan", desc: "Mehrgängiges Kaiseki mit saisonalem Krabben-Fokus", q: "Onishiya Suishoen Kaiseki dinner Japan" },
    ],
  },
  16: {
    morgens: [
      { name: "Ryokan-Frühstück auf Tatami", desc: "Traditionelles Frühstück mit Grillsalmon, Miso, Pickles", q: "Onishiya Suishoen breakfast Japan" },
      { name: "Morgen-Onsen bei Sonnenaufgang", desc: "Früh aufstehen für den Outdoor-Onsen im Morgengrauen", q: "Kinosaki Onsen outdoor bath morning Japan" },
      { name: "Mandaraji Tempel-Wanderung", desc: "Kurzer Aufstieg über Kinosaki – Aussicht auf Stadt und Meer", q: "Mandaraji Temple Kinosaki Onsen Japan" },
    ],
    mittags: [
      { name: "Tonosama-no-yu Außenbad", desc: "Größtes der 7 öffentlichen Bäder – elegantes Rotenburo", q: "Tonosama no yu Kinosaki Onsen Japan" },
      { name: "Kani-Miso am Kanalstand", desc: "Krabbenpaste auf Toast – typischer Snack in Kinosaki", q: "Kani miso Kinosaki Onsen Japan" },
      { name: "Kinosaki Onsen Museum", desc: "Kleines Museum zur Geschichte der Bäder und des Viertels", q: "Kinosaki Onsen history museum Japan" },
    ],
    abends: [
      { name: "Sato-no-yu Hauptbad", desc: "Das beeindruckendste der 7 Bäder – verschiedene Themenräume", q: "Sato no yu Kinosaki Onsen Japan" },
      { name: "Kaiseki-Abschluss-Dinner", desc: "Letztes Kaiseki in Kinosaki – Abschied von der Wellness-Insel", q: "Kinosaki Onsen Kaiseki dinner Japan" },
      { name: "Nacht-Fotosession am Kanal", desc: "Langzeitbelichtung der Laternen im Kanalwasser", q: "Kinosaki Onsen night photography canal Japan" },
    ],
  },
  17: {
    morgens: [
      { name: "Abreise Kinosaki → Hiroshima", desc: "Langer Transfer: Kinosaki → San'in-Linie → Shinkansen", q: "Kinosaki Onsen train station Japan" },
      { name: "Bento-Box für die Reise", desc: "Kinosaki-Bahnhof hat gute Reisboxen für die Zugstrecke", q: "Kinosaki Onsen train station bento Japan" },
      { name: "San'in-Küstenpanorama", desc: "Zug fährt entlang der japanischen Meerküste – atemberaubend", q: "San'in coast train Japan" },
    ],
    mittags: [
      { name: "Shin-Osaka Umstieg", desc: "Kurze Pause, Kaffee, bevor der Nozomi nach Hiroshima fährt", q: "Shin-Osaka station Japan" },
      { name: "Hondōri Einkaufsstraße", desc: "Überdachte Fußgängerzone direkt nach Hotel-Check-in erkunden", q: "Hondori shopping street Hiroshima Japan" },
      { name: "Nameko Guri-Guri Ramen", desc: "Lokales Hiroshima-Ramen – anders als Tokio oder Osaka", q: "Ramen Hiroshima Japan" },
    ],
    abends: [
      { name: "Okonomimura (Okonomi-Haus)", desc: "6-stöckiges Gebäude voller Okonomiyaki-Restaurants – Hiroshima-Stil!", q: "Okonomimura Hiroshima Japan" },
      { name: "Nagarekawa Nachtleben", desc: "Hiroshimas Ausgehviertel für einen entspannten ersten Abend", q: "Nagarekawa Hiroshima Japan nightlife" },
      { name: "Hiroshima Castle Außenansicht", desc: "Burg bei Nacht illuminiert – kurzer Abendspaziergang", q: "Hiroshima Castle night Japan" },
    ],
  },
  18: {
    morgens: [
      { name: "Friedensgedenkpark (früh morgens)", desc: "Am ruhigsten vor 9 h – emotionale Stille und Würde", q: "Hiroshima Peace Memorial Park Japan" },
      { name: "Genbaku Dome (Atombom-Dom)", desc: "Welterbe und eindringliches Mahnmal – direkt im Park", q: "Atomic Bomb Dome Hiroshima Japan" },
      { name: "Hiroshima Peace Memorial Museum", desc: "Tiefgehendes, wichtiges Museum – 2–3 Stunden einplanen", q: "Hiroshima Peace Memorial Museum Japan" },
    ],
    mittags: [
      { name: "Teishoku-Restaurant nahe Park", desc: "Günstiges Lunchset-Menü nach dem emotionalen Morgen", q: "Teishoku lunch Hiroshima Peace Park Japan" },
      { name: "Friedensbrücke Spaziergang", desc: "Hondōri-Einkaufsstraße entlang zum Ōta-Fluss", q: "Hiroshima Peace Bridge Hondori Japan" },
      { name: "Hiroshima Castle Museum", desc: "Wiederaufgebaute Burg – Stadtgeschichte vor und nach 1945", q: "Hiroshima Castle museum Japan" },
    ],
    abends: [
      { name: "Ujina Hafen Spaziergang", desc: "Meeresblick über den Hiroshima-Hafen zum Entspannen", q: "Ujina Port Hiroshima Japan" },
      { name: "Izakaya am Oyster-Kai", desc: "Hiroshima ist Austerhauptstadt Japans – frische Austern am Hafen", q: "Oyster izakaya Hiroshima Japan" },
      { name: "Abendblick vom Hilton", desc: "Hoteldachterrasse oder Fensterblick auf die beleuchtete Stadt", q: "Hilton Hiroshima Japan" },
    ],
  },
  19: {
    morgens: [
      { name: "Frühe Fähre nach Miyajima (7–8 h)", desc: "Flut-Zeitpunkt prüfen – schwimmendes Tori-Tor bei Flut", q: "Miyajima Ferry JR Hiroshima Japan" },
      { name: "Itsukushima-Schrein", desc: "UNESCO-Welterbe – oranger Schrein mit schwimmendem Tor im Meer", q: "Itsukushima Shrine Miyajima Japan" },
      { name: "Hiroshima Momiji-Manju", desc: "Ahornblatt-Kuchen – das Mitbringsel von Miyajima schlechthin", q: "Momiji manju Miyajima Hiroshima Japan" },
    ],
    mittags: [
      { name: "Mount Misen Seilbahn + Wanderung", desc: "Seilbahn hoch, zu Fuß runter – Panorama über die Inlandsee", q: "Mount Misen ropeway Miyajima Japan" },
      { name: "Anagoman Conger-Aal Lunch", desc: "Miyajimas Spezialität: Anagoman – Brötchen mit Meeresaal gefüllt", q: "Anagoman Miyajima Japan" },
      { name: "Tori-Tor bei Ebbe waten", desc: "Wenn Ebbe: direkt zum Tori-Tor laufen und berühren!", q: "Itsukushima torii gate walk low tide Japan" },
    ],
    abends: [
      { name: "Shinkansen Hiroshima → Tokio", desc: "Langer Heimweg – bequem schlafen im Nozomi", q: "Hiroshima Shinkansen Tokyo Japan" },
      { name: "Shinkansen-Dinner Ekiben", desc: "Letzter Ekiben der Reise – Erinnerung an 3 Wochen Japan", q: "Ekiben Shinkansen bento Japan" },
      { name: "Später Check-in Keikyu-Kamata", desc: "Tokio empfängt euch – morgen noch ein letzter freier Tag", q: "Syforme Keikyu-Kamata Residence Tokyo Japan" },
    ],
  },
  20: {
    morgens: [
      { name: "Nezu Schrein Tokio", desc: "Kleine Torii-Gassen wie Fushimi – aber in Tokio, kaum bekannt", q: "Nezu Shrine Tokyo Japan" },
      { name: "Yanaka Morgenspaziergang", desc: "Letzter Tokio-Morgen im ältesten Viertel der Stadt", q: "Yanaka Tokyo morning walk Japan" },
      { name: "Tokyo National Museum Ueno", desc: "Größtes Museum Japans – Samurai-Rüstungen, Keramik, Kalligraphie", q: "Tokyo National Museum Ueno Japan" },
    ],
    mittags: [
      { name: "Oedo Onsen Monogatari Odaiba", desc: "Thermalbad-Themenpark – letztes Onsen-Erlebnis in Edo-Atmosphäre", q: "Oedo Onsen Monogatari Odaiba Tokyo Japan" },
      { name: "Fuunji Shinjuku Ramen", desc: "Tokios bestes Tsukemen – letztes Ramen der Reise mit Wumms", q: "Fuunji Ramen Shinjuku Tokyo Japan" },
      { name: "Last-Minute Shopping Shibuya", desc: "Letzte Mitbringsel: Matcha-KitKat, Capsule Toys, Kosmetik", q: "Shibuya Don Quixote shopping Tokyo Japan" },
    ],
    abends: [
      { name: "Sushi Saito / Yoshitake", desc: "Wenn Budget es erlaubt: letztes Abendessen als Sushi-Erlebnis", q: "High end sushi restaurant Shinjuku Tokyo Japan" },
      { name: "Yakitori Birdland Ginza", desc: "Legendäre Yakitori-Bar unter Ginza – Reservierung nötig", q: "Yakitori Birdland Ginza Tokyo Japan" },
      { name: "Shibuya-Abend-Abschiedsspaziergang", desc: "Einmal mehr durch Shibuya gehen und die Energie aufsaugen", q: "Shibuya night walk Tokyo Japan" },
    ],
  },
  21: {
    morgens: [
      { name: "Früher Check-out", desc: "Koffer bereit, Taxi oder Keikyu-Linie zum Flughafen Haneda", q: "Syforme Keikyu-Kamata Residence checkout Tokyo" },
      { name: "Haneda Frühstück am Flughafen", desc: "Letzte Onigiri oder Tamago-Sando am Gate", q: "Haneda Airport breakfast Japan" },
      { name: "Haneda Duty-Free Letzte Souvenirs", desc: "Whisky, Kosmetik, Wagashi – am Gate gibt es mehr als man denkt", q: "Haneda Airport duty free shopping Japan" },
    ],
    mittags: [
      { name: "Boarding & Sicherheitskontrolle", desc: "Haneda ist entspannter als Narita – aber früh genug am Gate sein", q: "Haneda Airport international terminal Japan" },
      { name: "Gate-Lounge mit Tokio-Blick", desc: "Letzter Blick auf die Bucht von Tokio bevor es nach Hause geht", q: "Haneda Airport gate lounge view Japan" },
      { name: "Abflug 09:50 · Tokio → Frankfurt", desc: "12-Stunden-Flug – Erinnerungen sortieren, Fotos sichten", q: "Tokyo Haneda Frankfurt flight" },
    ],
    abends: [
      { name: "Über Sibirien (im Flieger)", desc: "Fensterplatz nach Norden lohnt sich – Polartag oder -nacht", q: "Flight route Tokyo Frankfurt Siberia" },
      { name: "Bordbistro Genussstunde", desc: "Zeit für Reflexion, Tagebuch und Lieblingsfotos der Reise", q: "Japan travel memories" },
      { name: "Ankunft Frankfurt", desc: "Willkommen zurück – 3 Wochen Japan im Gepäck", q: "Frankfurt Airport arrival international" },
    ],
  },
};

// ─── Budget Plan ──────────────────────────────────────────────────────────────

const budgetPlan = [
  { key: "railPass",       label: "JR Pass",             planned: 1275, icon: Train },
  { key: "lodging",        label: "Unterkünfte",          planned: 4050, icon: Hotel },
  { key: "food",           label: "Essen & Getränke",     planned: 1950, icon: UtensilsCrossed },
  { key: "activities",     label: "Eintritte & Onsen",    planned: 950,  icon: Bookmark },
  { key: "localTransport", label: "Lokaler Verkehr",      planned: 450,  icon: MapPin },
  { key: "reserve",        label: "Reserve / Shopping",   planned: 750,  icon: ShoppingBag },
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
const STORAGE_KEY  = "japan2026_checks_v2";
const CUSTOM_KEY   = "japan2026_custom_v2";
const BUDGET_KEY   = "japan2026_budget_v1";
const DARK_KEY     = "japan2026_dark";

// ─── Helper Components ───────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-800 p-5 shadow-sm shadow-black/5 dark:shadow-black/20">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">{value}</div>
      {sub && <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{sub}</div>}
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, dark = false }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${dark ? "text-red-300" : "text-red-600 dark:text-red-400"}`}>{eyebrow}</div>
      <h2 className={`text-2xl font-semibold tracking-tight ${dark ? "text-white" : "text-neutral-900 dark:text-white"}`}>{title}</h2>
      {text && <p className={`text-sm leading-6 ${dark ? "text-white/60" : "text-neutral-500 dark:text-neutral-400"}`}>{text}</p>}
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
    <div className="overflow-hidden rounded-[20px] border border-black/5 dark:border-white/10 bg-[#f0ede8] dark:bg-neutral-800">
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
        <div className="border-t border-black/5 dark:border-white/10 bg-white dark:bg-neutral-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {activeStop + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-neutral-900 dark:text-white">{stops[activeStop].city}</div>
              <div className="truncate text-sm text-neutral-500 dark:text-neutral-300">{stops[activeStop].hotel}</div>
            </div>
            <span className="rounded-full bg-red-50 dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
              {stops[activeStop].range}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[activeStop].hotel + " " + stops[activeStop].city + " Japan")}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-600 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-500"
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
    } catch { /* quota exceeded */ }
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
  { id: "budget",    label: "Budget",     icon: Wallet },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab]       = useState("overview");
  const [selectedCity, setSelectedCity] = useState("Alle");
  const [activeStop, setActiveStop]     = useState(null);
  const [newItem, setNewItem]           = useState("");
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [budgetActual, setBudgetActual] = useState(() => {
    try {
      const stored = localStorage.getItem(BUDGET_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(DARK_KEY) === "true"; } catch { return false; }
  });

  const { items, checks, toggle, addItem, removeItem, completed } = usePersistedChecklist();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try { localStorage.setItem(DARK_KEY, darkMode); } catch {}
  }, [darkMode]);

  const totalNights = useMemo(() => stops.reduce((s, st) => s + st.nights, 0), []);
  const cities      = useMemo(() => ["Alle", ...Array.from(new Set(itinerary.map(d => d.city)))], []);
  const visibleDays = useMemo(
    () => selectedCity === "Alle" ? itinerary : itinerary.filter(d => d.city === selectedCity),
    [selectedCity]
  );

  const totalPlanned = useMemo(() => budgetPlan.reduce((s, c) => s + c.planned, 0), []);
  const totalActual  = useMemo(() => budgetPlan.reduce((s, c) => s + (parseFloat(budgetActual[c.key]) || 0), 0), [budgetActual]);

  const handleAddItem = () => {
    const t = newItem.trim();
    if (t) { addItem(t); setNewItem(""); }
  };

  const toggleDay = (day) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day); else next.add(day);
      return next;
    });
  };

  const updateBudget = (key, value) => {
    setBudgetActual(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(BUDGET_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  return (
    <div className="min-h-screen bg-[#f7f3ee] dark:bg-neutral-950 text-neutral-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="overflow-hidden rounded-[32px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-xl shadow-black/5 dark:shadow-black/30">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="border-b border-black/5 dark:border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.15),_transparent_35%),linear-gradient(135deg,#fff,#faf7f3)] dark:bg-neutral-900 px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-400">
                    <Sparkles className="h-3.5 w-3.5" /> persönliche Reise-Webapp
                  </div>
                  <button
                    onClick={() => setDarkMode(d => !d)}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                    title={darkMode ? "Hellmodus" : "Dunkelmodus"}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-5xl">{trip.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 md:text-base">
                  {trip.subtitle} · {trip.dateRange}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {trip.focus.map(f => (
                    <span key={f} className="rounded-full bg-neutral-100 dark:bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200">{f}</span>
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
          <div className="sticky top-0 z-10 border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-5 md:px-8">
            <div className="flex gap-1 overflow-x-auto py-2">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${active ? "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === "checklist" && (
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${active ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" : "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"}`}>
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
              <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-800 p-5 md:p-6">
                <SectionTitle eyebrow="Überblick" title="Route & Rhythmus" text="Die Reise wechselt bewusst zwischen Stadterkundung und Onsen-/Naturphasen." />
                <div className="space-y-3">
                  {stops.map((stop, idx) => (
                    <div key={stop.id} className="flex items-start gap-4 rounded-2xl bg-white dark:bg-neutral-700 p-4 shadow-sm shadow-black/5 dark:shadow-black/10">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-500 text-sm font-semibold text-white">{idx + 1}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{stop.city}</h3>
                          <span className="rounded-full bg-red-50 dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">{stop.range}</span>
                          <span className="rounded-full bg-neutral-100 dark:bg-neutral-600 px-2.5 py-0.5 text-xs text-neutral-600 dark:text-neutral-200">{stop.nights} Nächte</span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{stop.hotel}</p>
                      </div>
                      {idx < stops.length - 1 && <ChevronRight className="mt-1 hidden h-4 w-4 text-neutral-400 dark:text-neutral-500 md:block" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Flights */}
                <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-neutral-950 p-5 text-white md:p-6">
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

                {/* Budget summary */}
                <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-800 p-5 md:p-6">
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
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-neutral-50 dark:bg-neutral-700 px-4 py-3">
                        <span className="text-neutral-600 dark:text-neutral-300">{label}</span>
                        <span className="font-medium text-neutral-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between rounded-2xl bg-red-50 dark:bg-red-950/40 px-4 py-3 font-semibold text-red-700 dark:text-red-400">
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
              <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-800 p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <SectionTitle eyebrow="Tagesplan" title="Eure Reise Tag für Tag" text="Alle Etappen mit Aufenthaltsort, Transfer, Highlights und Empfehlungen." />
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Stadt filtern</label>
                    <select
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-700 dark:text-white px-4 py-3 text-sm outline-none md:min-w-[220px]"
                    >
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {visibleDays.map(item => {
                    const Icon = item.icon;
                    const recs = dayRecs[item.day];
                    const expanded = expandedDays.has(item.day);
                    return (
                      <div key={item.day} className="rounded-[24px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-700 p-5 shadow-sm shadow-black/5 dark:shadow-black/10">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Tag {item.day} · {item.date}</div>
                            <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">{item.title}</h3>
                            <div className="mt-2 inline-flex rounded-full bg-neutral-100 dark:bg-neutral-600 px-3 py-1 text-xs text-neutral-700 dark:text-neutral-200">{item.vibe}</div>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="grid gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                          {[
                            [MapPin, "Ort",       item.city],
                            [Train,  "Transport", item.transport],
                            [Hotel,  "Hotel",     item.hotel],
                          ].map(([Ic, label, val]) => (
                            <div key={label} className="flex items-start gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-600 p-3">
                              <Ic className="mt-0.5 h-4 w-4 text-neutral-400 dark:text-neutral-400 shrink-0" />
                              <div>
                                <div className="font-medium text-neutral-900 dark:text-white">{label}</div>
                                <div>{val}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <div className="mb-2 text-sm font-medium text-neutral-900 dark:text-white">Highlights</div>
                          <div className="flex flex-wrap gap-2">
                            {item.highlights.map(h => (
                              <span key={h} className="rounded-full border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-600 px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-200">{h}</span>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations toggle */}
                        {recs && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleDay(item.day)}
                              className="flex w-full items-center justify-between rounded-2xl bg-neutral-50 dark:bg-neutral-600 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-500 transition"
                            >
                              <span>Empfehlungen für diesen Tag</span>
                              {expanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                            </button>

                            {expanded && (
                              <div className="mt-3 space-y-3">
                                {[
                                  { key: "morgens", label: "Morgens",  Icon: Coffee },
                                  { key: "mittags", label: "Mittags",  Icon: UtensilsCrossed },
                                  { key: "abends",  label: "Abends",   Icon: Moon },
                                ].map(({ key, label, Icon: SlotIcon }) => (
                                  <div key={key} className="rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-600 p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                                      <SlotIcon className="h-3.5 w-3.5" /> {label}
                                    </div>
                                    <div className="space-y-2">
                                      {recs[key].map((rec, i) => (
                                        <div key={i} className="flex items-start justify-between gap-3 rounded-xl bg-white dark:bg-neutral-700 px-3 py-2.5">
                                          <div className="min-w-0">
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white leading-tight">{rec.name}</div>
                                            <div className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 leading-snug">{rec.desc}</div>
                                          </div>
                                          <a
                                            href={mapsUrl(rec.q)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 rounded-full bg-red-50 dark:bg-red-950/50 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                          >
                                            Maps ↗
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
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
              <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-800 p-5 md:p-6">
                <SectionTitle eyebrow="Karte" title="Interaktive Reiseroute" text="Klicke auf einen Stopp für Details. Alle Hotels verbunden durch eure Route." />
                <SvgMap activeStop={activeStop} onSelect={i => setActiveStop(prev => prev === i ? null : i)} />

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {stops.map((stop, i) => (
                    <button
                      key={stop.id}
                      onClick={() => setActiveStop(prev => prev === i ? null : i)}
                      className={`rounded-[20px] border p-4 text-left transition ${activeStop === i ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30" : "border-black/5 dark:border-white/10 bg-white dark:bg-neutral-700 hover:border-red-100 dark:hover:border-red-900 hover:bg-red-50/50 dark:hover:bg-red-950/20"}`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">Stop {i + 1}</div>
                      <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{stop.city}</div>
                      <div className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300 leading-snug">{stop.hotel}</div>
                      <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{stop.range} · {stop.nights} Nächte</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Food spots */}
              <div className="mt-6 rounded-[28px] border border-black/5 dark:border-white/10 bg-neutral-950 p-5 text-white md:p-6">
                <SectionTitle eyebrow="Food" title="Merkliste für Genuss" text="Im Reiseplan genannte Spots als schneller Merkzettel." dark />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-white/80">
                  {foodSpots.map(group => (
                    <div key={group.city} className="rounded-2xl bg-white/5 p-4">
                      <div className="mb-2 text-sm font-semibold text-white">{group.city}</div>
                      <div className="flex flex-wrap gap-2">
                        {group.spots.map(spot => (
                          <a
                            key={spot}
                            href={mapsUrl(spot + " " + group.city + " Japan")}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs text-white/85 transition"
                          >
                            {spot} ↗
                          </a>
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
                <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-800 p-5 md:p-6">
                  <SectionTitle eyebrow="Planung" title="Checkliste vor Abflug" text="Interaktiv abhaken – wird im Browser gespeichert." />
                  <div className="mb-4 rounded-2xl bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {completed} von {items.length} Punkten erledigt
                  </div>

                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                    <div
                      className="h-2 rounded-full bg-red-500 transition-all duration-500"
                      style={{ width: `${items.length ? (completed / items.length) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="space-y-1">
                    {items.map((item, index) => {
                      const done = !!checks[index];
                      return (
                        <div key={`${item}-${index}`} className="group flex items-center gap-2 rounded-2xl px-3 py-2.5 transition hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <button onClick={() => toggle(index)} className="flex flex-1 items-center gap-3 text-left">
                            {done
                              ? <CheckCircle2 className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                              : <Circle className="h-5 w-5 shrink-0 text-neutral-300 dark:text-neutral-500" />}
                            <span className={done ? "text-sm text-neutral-400 dark:text-neutral-500 line-through" : "text-sm text-neutral-700 dark:text-neutral-200"}>{item}</span>
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="shrink-0 rounded-full p-1 text-neutral-300 dark:text-neutral-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
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
                      className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-700 dark:text-white px-4 py-2.5 text-sm outline-none focus:border-red-300 dark:focus:border-red-700 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/50"
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
                <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-800 p-5 md:p-6">
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
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200">
                        <Luggage className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Helper cards */}
              <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-800 p-5 md:p-6">
                <SectionTitle eyebrow="Praktisch" title="Japan-Helfer für unterwegs" text="Kleine Erinnerungen, die euch während der Reise helfen." />
                <div className="grid gap-4 md:grid-cols-2">
                  {helperCards.map(({ title, text, icon: Icon }) => (
                    <div key={title} className="rounded-[24px] bg-white dark:bg-neutral-700 p-5 shadow-sm shadow-black/5 dark:shadow-black/10">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-base font-semibold text-neutral-900 dark:text-white">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Budget ─────────────────────────────────────────────── */}
          {activeTab === "budget" && (
            <div className="px-5 py-6 md:px-8 md:py-8">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Category tracker */}
                <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-[#fcfbf8] dark:bg-neutral-800 p-5 md:p-6">
                  <SectionTitle eyebrow="Budget-Tracker" title="Ist vs. Geplant" text="Trage deine tatsächlichen Ausgaben ein und behalte den Überblick." />
                  <div className="space-y-4">
                    {budgetPlan.map(({ key, label, planned, icon: Icon }) => {
                      const actual = parseFloat(budgetActual[key]) || 0;
                      const pct = Math.min((actual / planned) * 100, 100);
                      const over = actual > planned;
                      return (
                        <div key={key} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-700 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">Geplant: {planned.toLocaleString("de-DE")} €</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                step="10"
                                value={budgetActual[key] ?? ""}
                                onChange={e => updateBudget(key, e.target.value)}
                                placeholder="0"
                                className="w-24 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-600 px-3 py-1.5 text-right text-sm font-medium text-neutral-900 dark:text-white outline-none focus:border-red-300 dark:focus:border-red-700"
                              />
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">€</span>
                            </div>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-600">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${over ? "bg-red-500" : "bg-emerald-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {actual > 0 && (
                            <div className={`mt-1.5 text-right text-xs font-medium ${over ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {over
                                ? `+${(actual - planned).toLocaleString("de-DE")} € über Budget`
                                : `${(planned - actual).toLocaleString("de-DE")} € noch verfügbar`}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-neutral-950 p-5 md:p-6 text-white">
                    <SectionTitle eyebrow="Gesamtübersicht" title="Dein Budgetstatus" dark />
                    <div className="space-y-4">
                      {[
                        { label: "Geplant gesamt", value: totalPlanned, color: "text-white/70" },
                        { label: "Ausgegeben bisher", value: totalActual, color: totalActual > totalPlanned ? "text-red-400" : "text-emerald-400" },
                        { label: "Verbleibend", value: totalPlanned - totalActual, color: totalActual > totalPlanned ? "text-red-400" : "text-emerald-400" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                          <span className="text-sm text-white/60">{label}</span>
                          <span className={`text-lg font-semibold ${color}`}>
                            {value < 0 ? "-" : ""}{Math.abs(value).toLocaleString("de-DE")} €
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs text-white/50">
                        <span>Fortschritt</span>
                        <span>{Math.round((totalActual / totalPlanned) * 100)} %</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${totalActual > totalPlanned ? "bg-red-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min((totalActual / totalPlanned) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget tips */}
                  <div className="rounded-[28px] border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-800 p-5 md:p-6">
                    <SectionTitle eyebrow="Tipps" title="Budget-Hinweise" />
                    <div className="space-y-3 text-sm">
                      {[
                        ["Ryokan-Essen", "Hakone und Kinosaki: Kaiseki ist im Preis inkl. – kein Extra-Budget nötig."],
                        ["Cash Reserve", "200–300 € als Bargeld immer dabei, besonders in Kinosaki und Hakone."],
                        ["JR Pass", "Bereits vor Reiseantritt online kaufen – in Japan teurer oder nicht erhältlich."],
                        ["Konbini spart", "Frühstück und Snacks im Konbini: ~10–15 € pro Tag statt 30 € im Café."],
                      ].map(([t, desc]) => (
                        <div key={t} className="rounded-2xl bg-neutral-50 dark:bg-neutral-700 px-4 py-3">
                          <div className="font-medium text-neutral-900 dark:text-white">{t}</div>
                          <div className="mt-0.5 text-neutral-600 dark:text-neutral-300">{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
