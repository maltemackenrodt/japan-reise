import React, { useMemo, useState } from "react";
import {
  CalendarDays, MapPin, Train, Wallet,
  UtensilsCrossed, Plane, Mountain, Camera, Waves, Hotel,
  Sparkles, Bookmark, Heart, Plus,
  List, X, ChevronDown, ChevronUp,
  ShoppingBag, Star, Landmark, BookOpen, Phone,
} from "lucide-react";

// ─── Daten ────────────────────────────────────────────────────────────────────

const stops = [
  { id: "tok1", city: "Tokio",          nights: 6, range: "01.05–07.05", hotel: "Hotel Sunroad Shibuya",              checkin: "18:00", checkout: "12:00" },
  { id: "hak",  city: "Hakone",         nights: 2, range: "07.05–09.05", hotel: "Laforet Hakone Gora Yunosumika",     checkin: "15:00", checkout: "11:00" },
  { id: "kyo",  city: "Kyōto",          nights: 3, range: "09.05–12.05", hotel: "WAYFARER Gojo",                      checkin: "15:00", checkout: "11:00" },
  { id: "osa",  city: "Ōsaka",          nights: 3, range: "12.05–15.05", hotel: "Hotel Abitare Namba West",           checkin: "16:00", checkout: "10:00" },
  { id: "kin",  city: "Kinosaki Onsen", nights: 2, range: "15.05–17.05", hotel: "Onishiya Suishoen",                  checkin: "14:00", checkout: "10:00" },
  { id: "hir",  city: "Hiroshima",      nights: 2, range: "17.05–19.05", hotel: "Hilton Hiroshima",                   checkin: "15:00", checkout: "12:00" },
  { id: "tok2", city: "Tokio",          nights: 2, range: "19.05–21.05", hotel: "Syforme Keikyu-Kamata Residence",    checkin: "15:00", checkout: "10:00" },
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
    sightseeing: [
      { name: "Shibuya Scramble Crossing", desc: "Weltweit berühmteste Kreuzung – zu Fuß überqueren und die Energie spüren", q: "Shibuya Scramble Crossing Tokyo", time: "mittags" },
      { name: "Shibuya Sky Rooftop", desc: "Höchstes Rooftop-Deck Shibuyas bei Nacht – Ticket vorab buchen!", q: "Shibuya Sky observation deck Tokyo", time: "abends" },
      { name: "Hachikō-Statue & Platz", desc: "Treue-Symbol Tokios – der perfekte erste Orientierungspunkt", q: "Hachiko statue Shibuya Tokyo", time: "mittags" },
    ],
    kultur: [
      { name: "Meiji-Jingū Abendstimmung", desc: "Großer Shinto-Schrein im Wald – falls noch Energie für den kurzen Besuch", q: "Meiji Shrine Tokyo", time: "mittags" },
      { name: "Konbini-Erlebnis 7-Eleven", desc: "IC-Card besorgen, Onigiri probieren – die japanische Kultur im Kleinen", q: "7-Eleven Haneda Airport Tokyo", time: "morgens" },
    ],
    essen: [
      { name: "Haneda Terminal 3 Food Court", desc: "Frisches Onigiri & Soba direkt nach der Landung, bevor der Hunger kommt", q: "Haneda Airport Terminal 3 food court Tokyo", time: "morgens" },
      { name: "Ichiran Ramen Shibuya", desc: "Legendäre Solo-Ramen-Kabine – unvergessliches erstes Ramen-Erlebnis", q: "Ichiran Ramen Shibuya Tokyo", time: "mittags" },
      { name: "Nonbei Yokocho Izakaya", desc: "Gemütliche Izakaya-Gässchen, ruhiger als Golden Gai – ideal für den ersten Abend", q: "Nonbei Yokocho Shibuya Tokyo", time: "abends" },
    ],
    shopping: [
      { name: "Tokyu Hands Shibuya", desc: "7 Stockwerke japanischer Design- & Alltagskultur – unverzichtbar", q: "Tokyu Hands Shibuya Tokyo", time: "mittags" },
      { name: "Don Quijote Shibuya", desc: "Buntes Kaufhaus für Souvenirs, Snacks und japanische Kosmetik", q: "Don Quijote Shibuya Tokyo", time: "abends" },
    ],
  },
  2: {
    sightseeing: [
      { name: "Yoyogi-Park Morgenspaziergang", desc: "Tokios grüne Lunge – früh morgens mit Joggern, Picknick-Gruppen und Ruhe", q: "Yoyogi Park Tokyo", time: "morgens" },
      { name: "Shinjuku Gyoen Nationalpark", desc: "Formalgarten mitten in der Metropole – Teehäuschen und Blütenpanorama", q: "Shinjuku Gyoen National Garden Tokyo", time: "mittags" },
      { name: "Tokyo Metropolitan Gov. Building", desc: "Kostenloser Aussichtsturm – Panoramablick über ganz Tokio, offen bis 22:30 h", q: "Tokyo Metropolitan Government Building observation deck", time: "abends" },
    ],
    kultur: [
      { name: "Meiji-Schrein (6–8 Uhr)", desc: "Vor der Touristenmasse – Waldweg und Torii im Morgenlicht unvergesslich", q: "Meiji Shrine Tokyo", time: "morgens" },
      { name: "Design Festa Gallery Harajuku", desc: "Indie-Kunstgalerie mit wechselnden experimentellen Ausstellungen", q: "Design Festa Gallery Harajuku Tokyo", time: "mittags" },
    ],
    essen: [
      { name: "Fuglen Tokyo (Kaffee)", desc: "Norwegisches Specialty-Café in Tomigaya – einer der besten Kaffees der Stadt", q: "Fuglen Tokyo Tomigaya", time: "morgens" },
      { name: "Maisen Tonkatsu Omotesandō", desc: "Legende für Schweinekotelett – in einer umgebauten alten Badeanstalt", q: "Tonkatsu Maisen Omotesando Tokyo", time: "mittags" },
      { name: "Shinjuku Golden Gai Yakitori", desc: "200+ winzige Bars & Restaurants – legendäre Nacht-Atmosphäre in Shinjuku", q: "Shinjuku Golden Gai Tokyo", time: "abends" },
    ],
    shopping: [
      { name: "Takeshita-dōri Harajuku", desc: "Bunter Streetstyle-Boulevard – Crepes, Vintage und japanische Jugendkultur", q: "Takeshita-dori Harajuku Tokyo", time: "mittags" },
      { name: "Omotesandō Flagship Stores", desc: "Tokios schönste Einkaufsstraße – internationale und japanische Designermarken", q: "Omotesando shopping Tokyo", time: "mittags" },
      { name: "Isetan Shinjuku Depachika", desc: "Untergeschoss-Lebensmittelparadies mit Wagashi, Bento und Feinkost", q: "Isetan Shinjuku food basement Tokyo", time: "abends" },
    ],
  },
  3: {
    sightseeing: [
      { name: "Sumida-Fluss-Spaziergang", desc: "Uferweg zwischen Asakusa und Skytree – tolle Skyline-Perspektive", q: "Sumida River walk Asakusa Tokyo", time: "morgens" },
      { name: "Tokyo Skytree (634 m)", desc: "Höchstes Bauwerk Japans – Aussicht auf die gesamte Kantō-Ebene", q: "Tokyo Skytree observation deck", time: "mittags" },
      { name: "Akihabara Electric Town Nacht", desc: "LED-Leuchtreklamen, Arcades, Anime – einzigartiger Neon-Abend", q: "Akihabara Electric Town Tokyo", time: "abends" },
    ],
    kultur: [
      { name: "Sensō-ji früh morgens (6–7 h)", desc: "Tokios ältester Tempel im Morgennebel – fast menschenleer und magisch", q: "Senso-ji Temple Asakusa Tokyo", time: "morgens" },
      { name: "Tokyo National Museum Ueno", desc: "Größtes Museum Japans mit Samurai-Rüstungen, Keramik und buddhistischer Kunst", q: "Tokyo National Museum Ueno Japan", time: "mittags" },
      { name: "Edo-Tokyo Museum", desc: "Beeindruckende Zeitreise durch 400 Jahre Stadtgeschichte im Maßstab 1:1", q: "Edo Tokyo Museum Japan", time: "mittags" },
    ],
    essen: [
      { name: "Komagataya Dorayaki (seit 1895)", desc: "Süße Bohnenpfannkuchen – Tokios ältestes Dorayaki-Erlebnis in Asakusa", q: "Komagataya Dorayaki Asakusa Tokyo", time: "morgens" },
      { name: "Ameyoko Markt Street Food", desc: "Lebhafter Außenmarkt unter der Hochbahn – Takoyaki, Fisch und Grillspieße", q: "Ameyoko Market Ueno Tokyo", time: "mittags" },
      { name: "Sometaro Okonomiyaki (selbst grillen)", desc: "Rustikales Erlebnis: japanischen Pfannkuchen am Tisch selbst zubereiten", q: "Sometaro Okonomiyaki Asakusa Tokyo", time: "abends" },
    ],
    shopping: [
      { name: "Nakamise-dōri Souvenirs", desc: "Traditionelle Süßigkeiten, Fächer und Omamori in der Tempelgasse", q: "Nakamise-dori Asakusa Tokyo", time: "morgens" },
      { name: "Super Potato Retro Games", desc: "7-stöckiges Retro-Videospiel-Paradies – SNES, Famicom, Sega-Nostalgie pur", q: "Super Potato Akihabara Tokyo", time: "abends" },
      { name: "Akihabara Yodobashi Camera", desc: "Größtes Elektronikeinkaufszentrum der Welt – 9 Stockwerke Technik", q: "Yodobashi Camera Akihabara Tokyo", time: "mittags" },
    ],
  },
  4: {
    sightseeing: [
      { name: "Odaiba Seaside Park", desc: "Strandpromenade mit freiem Blick auf Rainbow Bridge und Tokio-Skyline", q: "Odaiba Seaside Park Tokyo", time: "mittags" },
      { name: "Rainbow Bridge Fußweg", desc: "Illuminierter Spaziergang über die Hängebrücke bei Nacht – kostenlos", q: "Rainbow Bridge walking path Tokyo", time: "abends" },
      { name: "Unicorn Gundam Statue DiverCity", desc: "18 m großer Gundam transformiert stündlich – Fotomoment garantiert", q: "Unicorn Gundam DiverCity Odaiba Tokyo", time: "mittags" },
    ],
    kultur: [
      { name: "teamLab Planets (Frühticket)", desc: "Immersive Wasserkunstinstallationen – unbedingt vorab buchen, früh ruhiger", q: "teamLab Planets Toyosu Tokyo", time: "morgens" },
      { name: "Miraikan Wissenschaftsmuseum", desc: "Nationalmuseum für Technologie: Roboter, VR und interaktive Zukunftsexponate", q: "Miraikan National Museum of Emerging Science Tokyo", time: "mittags" },
    ],
    essen: [
      { name: "Aqua City Odaiba Restaurants", desc: "Direkter Blick auf Rainbow Bridge und Skyline beim Mittag- oder Abendessen", q: "Aqua City Odaiba restaurant Tokyo", time: "mittags" },
      { name: "Yurikamome-Linie Konbini-Picknick", desc: "Konbini-Bento kaufen und auf der vollautomatischen Hochbahn genießen", q: "Yurikamome line Tokyo", time: "morgens" },
      { name: "DiverCity Tokyo Food Court", desc: "Großes Angebot direkt neben dem Gundam – praktisch und vielfältig", q: "DiverCity Tokyo Plaza food court Odaiba", time: "mittags" },
    ],
    shopping: [
      { name: "Venus Fort Outlet Odaiba", desc: "Europäisch gestaltetes Einkaufszentrum mit Outlet-Bereich auf Odaiba", q: "Venus Fort Odaiba shopping Tokyo", time: "mittags" },
      { name: "Palette Town Stores", desc: "Großflächige Mall mit japanischen Modeketten und Souvenir-Shops", q: "Palette Town Odaiba Tokyo", time: "abends" },
    ],
  },
  5: {
    sightseeing: [
      { name: "Nakameguro Meguro River Walk", desc: "Café-gesäumter Flussspaziergang – Tokios schönste und fotogenste Flaniermeile", q: "Nakameguro Meguro River Tokyo", time: "mittags" },
      { name: "Shimokitazawa Straßenszene", desc: "Tokios hippigster Stadtteil – Theaterplakate, Straßenmusiker, Café-Terrassen", q: "Shimokitazawa Tokyo", time: "morgens" },
      { name: "Ebisu Garden Place", desc: "Weitläufige Anlage mit Biergarten-Atmosphäre und schönem Abendlicht", q: "Ebisu Garden Place Tokyo", time: "abends" },
    ],
    kultur: [
      { name: "Daikanyama T-Site Buchhandlung", desc: "Traumhafte drei Buchpavillons – japanische Designbücher, Fotografie, Architektur", q: "Daikanyama T-Site Tokyo", time: "mittags" },
      { name: "Toguri Museum of Art", desc: "Ruhiges Museum für japanische und chinesische Keramik in Shibuya", q: "Toguri Museum of Art Shibuya Tokyo", time: "mittags" },
    ],
    essen: [
      { name: "Bear Pond Espresso", desc: "Legendäres Espresso-Lab in Shimokitazawa – präzisester Kaffee Tokios", q: "Bear Pond Espresso Shimokitazawa Tokyo", time: "morgens" },
      { name: "Saturdays NYC Café Daikanyama", desc: "Surf-Café mit exzellentem Kaffee, Sandwiches und entspannter Terrace", q: "Saturdays NYC Daikanyama Tokyo", time: "morgens" },
      { name: "Anjin Bar im T-Site", desc: "Cocktails umgeben von tausenden Büchern und Schallplatten – einzigartig", q: "Anjin bar Daikanyama T-Site Tokyo", time: "abends" },
    ],
    shopping: [
      { name: "Shimokitazawa Vintage Läden", desc: "Japans beste Second-Hand-Szene – Vinylplatten, Retro-Klamotten, Kuriositäten", q: "Shimokitazawa vintage shops Tokyo", time: "morgens" },
      { name: "Bonus Track Shimokitazawa", desc: "Neue Mini-Mall mit Ateliers, Buchläden und Craftbier-Bar auf altem Bahngelände", q: "Bonus Track Shimokitazawa Tokyo", time: "mittags" },
      { name: "Log Road Daikanyama", desc: "Stylishe Food- und Lifestyle-Halle auf einem ehemaligen Bahngleis", q: "Log Road Daikanyama Tokyo", time: "mittags" },
    ],
  },
  6: {
    sightseeing: [
      { name: "Yanaka Ginza Shitamachi-Viertel", desc: "Altes Tokio mit Katzen, Tempelgassen und Ziegelhäusern – einzigartiger Charme", q: "Yanaka Ginza shopping street Tokyo", time: "morgens" },
      { name: "Nezu Shrine Torii-Tunnel", desc: "Rote Torii-Gassen wie Mini-Fushimi Inari – ohne die Massen, kaum bekannt", q: "Nezu Shrine Tokyo", time: "morgens" },
      { name: "Tokyo Skytree Solamachi", desc: "Eindrucksvollen Turm noch einmal aus der Nähe sehen und Abschluss-Fotos", q: "Tokyo Skytree Solamachi", time: "mittags" },
    ],
    kultur: [
      { name: "Sensō-ji Nacht-Spaziergang", desc: "Asakusa bei Nacht – der Tempel leuchtet ohne Tagestouristen besonders schön", q: "Senso-ji night Asakusa Tokyo", time: "abends" },
      { name: "Kissa Neon – Kissaten-Erlebnis", desc: "Klassisches japanisches Kaffeestübchen der 60er Jahre – Zeit wie eingefroren", q: "Kissaten coffee shop Tokyo", time: "mittags" },
    ],
    essen: [
      { name: "Yanaka Ginza Street Food", desc: "Süßkartoffelchips, Menchi-Katsu und Mochi aus den kleinen Läden der Gasse", q: "Yanaka Ginza food Tokyo", time: "morgens" },
      { name: "Lieblingsizakaya nochmal", desc: "Das Restaurant der ersten Woche wiederholen – mit dem Wissen von 6 Tagen besser genießen", q: "Izakaya Shibuya Tokyo", time: "abends" },
      { name: "Omoide Yokocho Yakitori", desc: "Dampfende Spieße in den ältesten Gassen Shinjukus – letzte Nacht in Tokio 1", q: "Omoide Yokocho Memory Lane Shinjuku Tokyo", time: "abends" },
    ],
    shopping: [
      { name: "Nippori Textile Town", desc: "Größter Stoffmarkt Tokios – Kimono-Stoffe, Handwerksmaterialien, Souvenirs", q: "Nippori Textile Town Tokyo", time: "morgens" },
      { name: "Yanaka craft shops", desc: "Handgemachte Keramik, Tauschuhsohlen, Washi-Papier – echte Kunsthandwerker", q: "Yanaka craft shops Tokyo", time: "morgens" },
    ],
  },
  7: {
    sightseeing: [
      { name: "Odawara Castle", desc: "10 Minuten Fußweg vom Bahnhof – malerische Burg als Aufwärmprogramm", q: "Odawara Castle Japan", time: "morgens" },
      { name: "Hakone Ropeway Überblick", desc: "Erste Seilbahnfahrt über dampfende Vulkanlandschaft – atemberaubende Kulisse", q: "Hakone ropeway Japan", time: "mittags" },
      { name: "Abend-Spaziergang Gora", desc: "Stille Bergstraßen bei Nacht – kaum Licht, atemberaubender Sternenhimmel", q: "Gora Hakone night walk Japan", time: "abends" },
    ],
    kultur: [
      { name: "Suzuhiro Kamaboko Museum", desc: "Fischkuchen-Handwerk hautnah erleben und probieren in Odawara", q: "Suzuhiro Kamaboko Museum Odawara", time: "morgens" },
      { name: "Erstes Onsen-Erlebnis im Ryokan", desc: "Privat-Onsen im Laforet nutzen – das Ritual des Einwaschens kennenlernen", q: "Laforet Hakone outdoor onsen Japan", time: "abends" },
    ],
    essen: [
      { name: "Odawara Fish Market Café", desc: "Frische Meeresfrüchte direkt am Hafen – perfekter Start in die Hakone-Tage", q: "Odawara fish market cafe Japan", time: "morgens" },
      { name: "Soba Restaurant in Gora", desc: "Hausgemachte Buchweizennudeln nahe dem Ryokan – leichte Ankunftsmahlzeit", q: "Soba restaurant Gora Hakone Japan", time: "mittags" },
      { name: "Ryokan Kaiseki-Dinner", desc: "Das erste mehrgängige Kaiseki-Abendessen – ruhig genießen, kein Hetzen", q: "Laforet Hakone Gora Yunosumika Japan", time: "abends" },
    ],
    shopping: [
      { name: "Odawara Kanbutsu-dori", desc: "Traditionelle Ladenzeile mit Fischprodukten, Umeboshi und regionalen Spezialitäten", q: "Odawara traditional shopping Japan", time: "morgens" },
      { name: "Hakone Souvenirladen Gora", desc: "Lokale Töpferwaren, Yosegi-Mosaik-Holzarbeiten und Hakone-spezifische Mitbringsel", q: "Hakone souvenirs Gora Japan", time: "mittags" },
    ],
  },
  8: {
    sightseeing: [
      { name: "Ashi-See Fähre mit Fuji-Panorama", desc: "Fähre auf dem Vulkankratersee – bei klarem Wetter mit Fuji-Spiegelung", q: "Lake Ashi ferry Hakone Japan", time: "mittags" },
      { name: "Owakudani Schwefelquellen", desc: "Zischende Fumarolen-Landschaft und schwarze Eier kochen seit Jahrhunderten", q: "Owakudani Hakone ropeway Japan", time: "morgens" },
      { name: "Moto-Hakone Zedernallee", desc: "Historische Tokaido-Straße unter jahrhundertealten Kryptomerien – magisches Licht", q: "Moto-Hakone cedar avenue Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Hakone Open-Air Museum", desc: "Skulpturenpark mit Picasso-Galerie – am frühen Morgen fast leer", q: "Hakone Open Air Museum Japan", time: "morgens" },
      { name: "Pola Museum of Art", desc: "Weltklasse-Impressionisten (Monet, Renoir) in einem ruhigen Waldgebäude", q: "Pola Museum of Art Hakone Japan", time: "mittags" },
      { name: "Sternenhimmel-Fotografie Hakone", desc: "Kaum Lichtverschmutzung – Stativ mitbringen, Nachtfotos von Japan auf Bucketlist", q: "Hakone stargazing Japan", time: "abends" },
    ],
    essen: [
      { name: "Gora Park Café", desc: "Europäischer Garten mit französischem Café und ruhigem Fuji-Blick", q: "Gora Park Hakone Japan", time: "morgens" },
      { name: "Hakone-en Aquarium Terrasse", desc: "Kleines Aquarium am Ashi-See mit Restaurant-Terrasse direkt am Wasser", q: "Hakone en aquarium Lake Ashi Japan", time: "mittags" },
      { name: "Kaiseki-Dinner im Ryokan (Abend 2)", desc: "Zweites Kaiseki – andere saisonale Komposition, genauso beeindruckend", q: "Laforet Hakone Gora dinner Japan", time: "abends" },
    ],
    shopping: [
      { name: "Yosegi-Zaiku Holzmosaik Workshop", desc: "Hakones berühmtestes Handwerk – traditionelle Holzintarsienmuster als Souvenir", q: "Yosegi zaiku Hakone woodcraft Japan", time: "mittags" },
      { name: "Hakone Craft House", desc: "Töpfereiworkshop oder fertige Keramik aus der vulkanischen Region", q: "Hakone craft pottery Japan", time: "mittags" },
    ],
  },
  9: {
    sightseeing: [
      { name: "Kyoto Station Dachterrasse", desc: "Beeindruckendes Bahnhofsgebäude – kostenlose Dachterrasse mit Stadtpanorama", q: "Kyoto Station rooftop terrace Japan", time: "mittags" },
      { name: "Kamogawa Flussufer Abend", desc: "Abendliche Sitzreihen am Fluss – Kyoto bei Nacht ist romantisch und leise", q: "Kamogawa River Kyoto Japan evening", time: "abends" },
      { name: "Gion Hanamikoji bei Dämmerung", desc: "Traditionelle Gasse des Geisha-Viertels – beste Stimmung bei Einbruch der Dunkelheit", q: "Hanamikoji Street Gion Kyoto Japan", time: "abends" },
    ],
    kultur: [
      { name: "Ponto-chō Gasse erkunden", desc: "Schmale Gasse parallel zum Kamogawa – alte Gaststätten, Laternen, Jahrhunderttradition", q: "Pontocho Kyoto Japan", time: "abends" },
      { name: "Fushimi Inari Abend-Kurzvariante", desc: "Untere Torii-Gassen ohne Tagesmasse – abends fast mystisch leer", q: "Fushimi Inari Shrine Kyoto Japan", time: "abends" },
    ],
    essen: [
      { name: "Ekiben im Shinkansen (Odawara)", desc: "Regionale Lunchbox am Bahnhof – japanische Bahnhofstradition erster Klasse", q: "Ekiben bento box Odawara station Japan", time: "morgens" },
      { name: "Nishiki Market Streifzug", desc: "Kyotos Küchengasse: frische Pickles, Yudofu, Tamago und Fischspieße probieren", q: "Nishiki Market Kyoto Japan", time: "mittags" },
      { name: "Dinner in Gion", desc: "Traditionelle Restaurants im Geisha-Viertel – Chance auf Maiko-Sichtung abends", q: "Gion dinner restaurant Kyoto Japan", time: "abends" },
    ],
    shopping: [
      { name: "Nishiki Market Souvenirs", desc: "Kyoto-Pickles, Yuzu-Produkte und Matcha-Spezialitäten direkt auf dem Markt", q: "Nishiki Market Kyoto souvenirs Japan", time: "mittags" },
      { name: "Kyoto Station Isetan Depachika", desc: "Untergeschoss-Feinkost im Bahnhof – ideale Ankunftssnacks und Kyoto-Süßigkeiten", q: "Kyoto Station Isetan food Japan", time: "mittags" },
    ],
  },
  10: {
    sightseeing: [
      { name: "Fushimi Inari früh morgens (6 Uhr)", desc: "10.000 Torii-Tore ohne Touristenmasse – im Morgenlicht schlicht unvergesslich", q: "Fushimi Inari Shrine Kyoto Japan", time: "morgens" },
      { name: "Kiyomizudera Aussichtsplattform", desc: "Ikone Kyotos – Holzkonstruktion ohne Nägel schwebt über dem Abteigrund", q: "Kiyomizudera Temple Kyoto Japan", time: "mittags" },
      { name: "Sannenzaka & Ninenzaka", desc: "Kopfsteinpflastergassen mit Teehäusern – der schönste Spaziergang in Kyoto", q: "Sannenzaka Ninenzaka Kyoto Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Tofukuji Zen-Tempel & Garten", desc: "Ruhiger Zen-Tempel auf dem Weg – kaiserlicher Garten, kaum Besucher morgens", q: "Tofukuji Temple Kyoto Japan", time: "morgens" },
      { name: "Gion Geisha-Viertel-Tour", desc: "Abends durch Hanamikoji schlendern – echte Geiko/Maiko sind erkennbar", q: "Gion Geisha district Kyoto Japan", time: "abends" },
    ],
    essen: [
      { name: "Inarizushi Frühstück (Fushimi)", desc: "Reistasche in Tofuhülle – authentisches lokales Frühstück rund um den Schrein", q: "Inarizushi Fushimi Kyoto Japan", time: "morgens" },
      { name: "Kasagi-ya Dessert-Café Ninenzaka", desc: "Ältestes Dessert-Café der Gegend – süßer Matcha-Abschluss des Nachmittags", q: "Kasagi-ya Ninenzaka Kyoto Japan", time: "mittags" },
      { name: "Kichi Kichi Omurice", desc: "Legendäres Omlett-Reisgericht mit Show-Cooking – unbedingt reservieren!", q: "Kichi Kichi Omurice Kyoto Japan", time: "abends" },
    ],
    shopping: [
      { name: "Kiyomizuyaki Keramik-Shops", desc: "Lokale Töpfer verkaufen direkt – charakteristische Kyoto-Keramik als Souvenir", q: "Kiyomizuyaki pottery Kyoto Japan", time: "mittags" },
      { name: "Sannenzaka Traditionsladen", desc: "Handgemachte Holzkamm, Wagasa-Papierschirme, Washi – echtes Handwerk", q: "Sannenzaka traditional crafts Kyoto Japan", time: "mittags" },
      { name: "Gion Boutiquen", desc: "Exklusive kleine Läden für Kimono-Accessoires, Noren-Vorhänge und Seide", q: "Gion boutique shopping Kyoto Japan", time: "abends" },
    ],
  },
  11: {
    sightseeing: [
      { name: "Bambuswald Arashiyama (6–7 Uhr)", desc: "Morgenmagie: Bambusstämme rauschen im Wind, kaum Menschen, bestes Licht", q: "Bamboo Grove Arashiyama Kyoto Japan", time: "morgens" },
      { name: "Togetsukyō-Brücke Panorama", desc: "Malerische Bogenbrücke mit Arashiyama-Bergen im Hintergrund – Postkartenblick", q: "Togetsukyō Bridge Arashiyama Kyoto Japan", time: "morgens" },
      { name: "Sagano Romantic Train", desc: "25 Minuten Panoramafahrt durch die Hozu-Schlucht am Fluss entlang", q: "Sagano Romantic Train Arashiyama Kyoto Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Tenryū-ji Zen-Garten (UNESCO)", desc: "Weltklasse-Karesansui-Garten im ältesten Zen-Tempel Arashiyamas", q: "Tenryu-ji Temple Garden Arashiyama Kyoto Japan", time: "morgens" },
      { name: "Jojakko-ji Moos-Waldtempel", desc: "Versteckter Tempel mit Moosstufen und Bergpfad – kaum bekannt, wunderschön", q: "Jojakko-ji Temple Arashiyama Kyoto Japan", time: "morgens" },
      { name: "Fushimi Sake-Brauerei Tour", desc: "Nishino Sake Brewery öffnet für Verkostungen – Fushimi ist Japans Sake-Hauptstadt", q: "Fushimi sake brewery Kyoto Japan", time: "mittags" },
    ],
    essen: [
      { name: "Yudofu Restaurant Arashiyama", desc: "Kyotos Spezialität: seidenweiches Tofu-Kaiseki am Waldrand der Bergtempel", q: "Yudofu restaurant Arashiyama Kyoto Japan", time: "mittags" },
      { name: "Nishiki Market Abend-Tour", desc: "Letzter Abend-Einkauf und Probieren in Kyotos langer Küchengasse", q: "Nishiki Market Kyoto Japan", time: "abends" },
      { name: "Izakaya nahe WAYFARER Gojo", desc: "Entspannter letzter Kyoto-Abend – kleine Gerichte, lokales Sake, keine Eile", q: "Izakaya Gojo Kyoto Japan", time: "abends" },
    ],
    shopping: [
      { name: "Arashiyama Bambus-Souvenirs", desc: "Lokale Läden verkaufen handgefertigte Bambus-Produkte direkt aus dem Wald", q: "Arashiyama bamboo crafts souvenirs Japan", time: "mittags" },
      { name: "Kagizen Yoshifusa Wagashi", desc: "Seit 1716 – ältestes Süßwarenhaus Kyotos, berühmt für elegante Mochi-Kreationen", q: "Kagizen Yoshifusa Kyoto Japan", time: "morgens" },
    ],
  },
  12: {
    sightseeing: [
      { name: "Dōtonbori Neon-Spaziergang", desc: "Leuchtende Schilder, Glico-Mann, Kanalbrücke – Osaka bei Nacht unübertroffen", q: "Dotonbori night Osaka Japan", time: "abends" },
      { name: "Hozenji Yokocho Gasse", desc: "Moosbewachsener Brunnen, Laternen, Izakayas – ruhiger Kontrast zu Dōtonbori", q: "Hozenji Yokocho Osaka Japan", time: "abends" },
      { name: "Shinsaibashi Abend-Flanieren", desc: "Überdachte Einkaufsstraße bei Nacht – Menschenmassen und Neon-Schaufenster", q: "Shinsaibashi Osaka Japan", time: "abends" },
    ],
    kultur: [
      { name: "Ryoanji Steingarten Kyoto (kurz)", desc: "Weltberühmter Zen-Steingarten früh morgens vor der Abfahrt – fast leer", q: "Ryoanji Temple stone garden Kyoto Japan", time: "morgens" },
      { name: "Sumiyoshi Taisha Großschrein", desc: "Ältester Schrein Osakas mit einzigartigem Bogenbau-Stil – sehr ruhig", q: "Sumiyoshi Taisha Shrine Osaka Japan", time: "mittags" },
    ],
    essen: [
      { name: "Takoyaki Wanaka Sennichimae", desc: "Gleich nach Ankunft: knusprige Original-Kraken-Bällchen mit schmelzendem Kern", q: "Takoyaki Wanaka Namba Osaka Japan", time: "mittags" },
      { name: "Kuromon Ichiba Marktbesuch", desc: "Osakas Küchen-Markt: frische Austern am Stand, Thunfisch, Frühfrüchte", q: "Kuromon Ichiba Market Osaka Japan", time: "mittags" },
      { name: "Ajinoya Okonomiyaki", desc: "Hausgemachtes Osaka-Okonomiyaki aus dem alten Haus seit Jahrzehnten", q: "Ajinoya Okonomiyaki Osaka Japan", time: "abends" },
    ],
    shopping: [
      { name: "Shinsaibashi Einkaufsmeile", desc: "Überdachte 600 m Fußgängerzone – japanische und internationale Modeketten", q: "Shinsaibashi shopping arcade Osaka Japan", time: "mittags" },
      { name: "Amerika Mura Vintage-Viertel", desc: "Osakas Vintage-Szene mit Second-Hand-Klamotten und Street-Art-Flair", q: "America Mura Osaka Japan", time: "mittags" },
    ],
  },
  13: {
    sightseeing: [
      { name: "Osaka Castle Morgenrunde", desc: "Burg im Morgenlicht – beste Fotos ohne Touristenwellen, Park dazu kostenlos", q: "Osaka Castle Japan", time: "morgens" },
      { name: "Umeda Sky Building Sunset", desc: "Floating Garden Observatory – spektakulärer Sonnenuntergang über der Stadt", q: "Umeda Sky Building Floating Garden Observatory Osaka Japan", time: "abends" },
      { name: "Nakanoshima Park am Wasser", desc: "Grüne Halbinsel zwischen zwei Flüssen – beliebter Spazierweg Osakas", q: "Nakanoshima Park Osaka Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Osaka Museum of History", desc: "10. Stock mit Direktblick auf die Burg und 1400 Jahre Stadtgeschichte", q: "Osaka Museum of History Japan", time: "morgens" },
      { name: "Ohatsu Tenjin Liebesschrein", desc: "Kleiner Schrein mit bewegender Geschichte – bekannt für Wunschzettel-Bäume", q: "Ohatsu Tenjin Shrine Osaka Japan", time: "mittags" },
    ],
    essen: [
      { name: "Kani Doraku Dotonbori", desc: "Das Krabben-Wahrzeichen Osakas – riesige animierte Laufkrabbe, frische Krabbengerichte", q: "Kani Doraku Dotonbori Osaka Japan", time: "mittags" },
      { name: "Grand Front Osaka Restaurants", desc: "Moderner Komplex neben Umeda mit breitem Angebot von japanisch bis international", q: "Grand Front Osaka restaurants Japan", time: "abends" },
      { name: "Lucua Food Hall Osaka Station", desc: "Unterirdische Food Hall direkt im Bahnhof – über 50 Restaurants unter einem Dach", q: "Lucua food hall Osaka station Japan", time: "abends" },
    ],
    shopping: [
      { name: "Grand Front Osaka", desc: "Hochwertige Mall neben dem Bahnhof mit japanischen Designermarken und Tech", q: "Grand Front Osaka shopping Japan", time: "mittags" },
      { name: "Osaka Loft Shinsaibashi", desc: "Japans größte Lifestyle-Kaufhauskette – Design, Kosmetik, Geschenke auf 6 Etagen", q: "Loft Shinsaibashi Osaka Japan", time: "mittags" },
    ],
  },
  14: {
    sightseeing: [
      { name: "Shinsekai Retro-Neon-Viertel", desc: "Nachbau von Paris und New York aus den 1920ern – nostalgisches Osaka-Flair", q: "Shinsekai Osaka Japan", time: "mittags" },
      { name: "Tsūtenkaku Tower bei Nacht", desc: "Retro-Turm mit bunter Illumination – der Kitsch-König Osakas in voller Pracht", q: "Tsutenkaku Tower night Osaka Japan", time: "abends" },
      { name: "Jan Jan Yokocho Spielhallen-Gasse", desc: "Enge Gasse neben Shinsekai – Pachinko, Mahjong und echte Osaka-Alltagskultur", q: "Jan Jan Yokocho Osaka Japan", time: "abends" },
    ],
    kultur: [
      { name: "Housing & Living Museum Osaka", desc: "Zeitreise durch 400 Jahre Osaka – originalgetreue Edo-Straßenrekonstruktion im 10. OG", q: "Osaka Housing and Living Museum Japan", time: "morgens" },
      { name: "Tenjibashi-suji Shoppingallee", desc: "Japans längste überdachte Einkaufsstraße – 2,6 km Alltag und Tradition", q: "Tenjibashi-suji shopping arcade Osaka Japan", time: "morgens" },
    ],
    essen: [
      { name: "Kuromon Ichiba frische Austern", desc: "Gegrillte Austern direkt am Stand des Markts – das Meeresfrüchte-Erlebnis schlechthin", q: "Kuromon Ichiba Market oyster Osaka Japan", time: "morgens" },
      { name: "Shinsekai Mittagessen Teishoku", desc: "Einfache Tagesmenüs im Retro-Ambiente – günstig, sättigend, authentisch", q: "Shinsekai Osaka lunch Japan", time: "mittags" },
      { name: "Kushikatsu Daruma Shinsekai", desc: "Original Frittier-Spieße im heißen Öl – die No-Double-Dip-Regel unbedingt beachten!", q: "Kushikatsu Daruma Osaka Japan", time: "abends" },
    ],
    shopping: [
      { name: "Den Den Town Elektronik-Viertel", desc: "Osakas Antwort auf Akihabara – Anime, Manga, Elektronik und Retrogames", q: "Den Den Town Osaka Japan", time: "mittags" },
      { name: "Tenjibashi-suji Souvenirläden", desc: "Lokale Alltagsläden, Küchen-Accessoires und günstige Mitbringsel in der Gasse", q: "Tenjibashi-suji Osaka souvenirs Japan", time: "morgens" },
    ],
  },
  15: {
    sightseeing: [
      { name: "San'in-Küstenpanorama (Zugfenster)", desc: "Zug fährt entlang der japanischen Meerküste durch Hyogo – atemberaubende Aussicht", q: "San'in coast train Japan", time: "morgens" },
      { name: "Kanalspaziergang Yuraaruki in Yukata", desc: "Weidensäumter Kanal – in Yukata spazieren wie im Japan des 19. Jahrhunderts", q: "Kinosaki Onsen canal walk Japan", time: "mittags" },
      { name: "Onsen-Street bei Nacht", desc: "Illuminierter Hauptkanal – romantischste Atmosphäre der gesamten Reise", q: "Kinosaki Onsen night lantern Japan", time: "abends" },
    ],
    kultur: [
      { name: "Kinosaki Sotoyu-Hopping beginnen", desc: "7 öffentliche Bäder mit dem Yuraaruki-Pass – Onsen-Kultur in Reinform erleben", q: "Kinosaki Onsen sotoyu public baths Japan", time: "mittags" },
      { name: "Yukata anlegen & Ritual lernen", desc: "Ryokan-Mitarbeiter zeigen die korrekte Yukata-Anlegetechnik – Teil der Kultur", q: "Kinosaki Onsen yukata Japan", time: "mittags" },
    ],
    essen: [
      { name: "Osaka-Bento im Zug", desc: "Letzter Osaka-Bento am Bahnhof – Wehmut und Vorfreude beim Kauen", q: "Osaka station bento Eki-Ben Japan", time: "morgens" },
      { name: "Kani-Miso am Kanalstand", desc: "Krabbenpaste auf Toast – der typische Snack in Kinosaki, frisch und intensiv", q: "Kani miso Kinosaki Onsen Japan", time: "mittags" },
      { name: "Kaiseki-Dinner Onishiya Suishoen", desc: "Mehrgängiges Kaiseki mit saisonalem Matsuba-Krabben-Fokus – Abendmenü royale", q: "Onishiya Suishoen Kaiseki dinner Japan", time: "abends" },
    ],
    shopping: [
      { name: "Kinosaki Souvenirladen Hauptgasse", desc: "Yukatageschäfte, Onsen-Badeartikel, lokale Meeresfrüchte-Konserven als Mitbringsel", q: "Kinosaki Onsen souvenir shopping Japan", time: "mittags" },
    ],
  },
  16: {
    sightseeing: [
      { name: "Morgen-Onsen bei Sonnenaufgang", desc: "Früh aufstehen für den Outdoor-Rotenburo im Morgengrauen – unvergesslich", q: "Kinosaki Onsen outdoor bath morning Japan", time: "morgens" },
      { name: "Mandaraji Tempel-Wanderung", desc: "Kurzer Aufstieg über Kinosaki – Weitsicht auf die Stadt, den Kanal und das Meer", q: "Mandaraji Temple Kinosaki Onsen Japan", time: "morgens" },
      { name: "Nacht-Fotosession am Kanal", desc: "Langzeitbelichtung der Laternen im stillen Kanalwasser – traumhaftes Ergebnis", q: "Kinosaki Onsen night photography canal Japan", time: "abends" },
    ],
    kultur: [
      { name: "Kinosaki Onsen Museum", desc: "Kleine Ausstellung zur Geschichte der Bäder, des Heilwassers und des Viertels", q: "Kinosaki Onsen history museum Japan", time: "mittags" },
      { name: "Sato-no-yu Hauptbad besuchen", desc: "Das beeindruckendste der 7 Bäder mit verschiedenen Themenräumen und Rotenburo", q: "Sato no yu Kinosaki Onsen Japan", time: "abends" },
    ],
    essen: [
      { name: "Ryokan-Frühstück auf Tatami", desc: "Traditionelles Frühstück mit gegrilltem Lachs, Miso, eingelegtem Gemüse und Tofu", q: "Onishiya Suishoen breakfast Japan", time: "morgens" },
      { name: "Tonosama-no-yu & Café danach", desc: "Elegantes öffentliches Bad, danach Kaffee im kleinen Café am Kanal", q: "Tonosama no yu Kinosaki Onsen Japan", time: "mittags" },
      { name: "Kaiseki-Abschluss-Dinner", desc: "Letztes Kaiseki in Kinosaki – Abschied von der ruhigsten Etappe der Reise", q: "Kinosaki Onsen Kaiseki dinner Japan", time: "abends" },
    ],
    shopping: [
      { name: "Lokale Meeresfrüchte-Konserven", desc: "Matsuba-Krabbe getrocknet und eingelegt – das Kinosaki-Souvenir schlechthin", q: "Kinosaki Onsen seafood souvenirs Japan", time: "mittags" },
      { name: "Regionalkeramik & Onsen-Accessoires", desc: "Kleine Töpfereien und Badeartikel aus der Region – handgefertigt und einzigartig", q: "Kinosaki Onsen craft shops Japan", time: "mittags" },
    ],
  },
  17: {
    sightseeing: [
      { name: "Hondōri Einkaufsstraße Abend", desc: "Überdachte Fußgängerzone nach Check-in – erste Orientierung in Hiroshima", q: "Hondori shopping street Hiroshima Japan", time: "mittags" },
      { name: "Hiroshima Castle Außenansicht bei Nacht", desc: "Burg nach Einbruch der Dunkelheit illuminiert – kurzer und eindrucksvoller Spaziergang", q: "Hiroshima Castle night Japan", time: "abends" },
      { name: "Nagarekawa Nachtspaziergang", desc: "Hiroshimas belebtes Ausgehviertel zum Ankommen und ersten Entspannen", q: "Nagarekawa Hiroshima Japan", time: "abends" },
    ],
    kultur: [
      { name: "Shukkeien Garten (optional)", desc: "300 Jahre alter Strollingarten im Edo-Stil – Stille nach der langen Reise", q: "Shukkeien Garden Hiroshima Japan", time: "mittags" },
      { name: "Okonomimura – Hiroshima Kulinarik", desc: "6-stöckiges Gebäude voller Okonomiyaki-Restaurants – Hiroshima-Stil mit Nudeln", q: "Okonomimura Hiroshima Japan", time: "abends" },
    ],
    essen: [
      { name: "Kinosaki-Bento im Zug", desc: "Bento vom Kinosaki-Bahnhof für die lange Strecke – letztes Erinnerungs-Bento", q: "Kinosaki Onsen train station bento Japan", time: "morgens" },
      { name: "Hiroshima-Ramen lokal", desc: "Lokaler Ramen-Stil: dicke Udon-Nudeln mit Soja-Brühe – anders als Tokio", q: "Ramen Hiroshima Japan", time: "mittags" },
      { name: "Okonomiyaki Hiroshima-Stil", desc: "Schichtweise aufgebaut mit Nudeln statt verrührt – der Hauptunterschied zu Osaka", q: "Okonomiyaki Hiroshima style Japan", time: "abends" },
    ],
    shopping: [
      { name: "Hondōri Shopping Arcade", desc: "Überdachte Einkaufsmeile Hiroshimas – Mode, Süßigkeiten und regionale Spezialitäten", q: "Hondori Hiroshima shopping Japan", time: "mittags" },
      { name: "Momiji-Manju Vorbestellung", desc: "Ahornblatt-Kuchen-Bäckerei – morgen auf Miyajima als Mitbringsel kaufen", q: "Momiji manju Hiroshima Japan", time: "mittags" },
    ],
  },
  18: {
    sightseeing: [
      { name: "Friedensgedenkpark (vor 9 Uhr)", desc: "Am ruhigsten früh morgens – emotionale Stille, würdige Atmosphäre und kaum Besucher", q: "Hiroshima Peace Memorial Park Japan", time: "morgens" },
      { name: "Genbaku Dome UNESCO-Mahnmal", desc: "Das Welterbemonument schlechthin – einziges Gebäude der Innenstadt das standhielt", q: "Atomic Bomb Dome Hiroshima Japan", time: "morgens" },
      { name: "Ōta-Fluss Ufer Spaziergang", desc: "Mehrere Flussarme durchziehen die Stadt – ruhiger Gegenpol zum dichten Stadtzentrum", q: "Ota River Hiroshima Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Hiroshima Peace Memorial Museum", desc: "Tiefgehendes, wichtiges Museum – 2–3 Stunden einplanen, emotional und erhellend", q: "Hiroshima Peace Memorial Museum Japan", time: "morgens" },
      { name: "Hiroshima Castle & Stadtgeschichte", desc: "Wiederaufgebaute Burg mit Museum zu Hiroshima vor und nach 1945", q: "Hiroshima Castle museum Japan", time: "mittags" },
    ],
    essen: [
      { name: "Teishoku-Restaurant nahe Friedenspark", desc: "Günstiges Lunchset nach dem emotionalen Museumsbesuch – Kraft tanken", q: "Teishoku lunch Hiroshima Peace Park Japan", time: "mittags" },
      { name: "Izakaya Oyster Hiroshima Kai", desc: "Hiroshima ist Japans Austernhauptstadt – frische Austern beim Fischer gegrillt", q: "Oyster izakaya Hiroshima Japan", time: "abends" },
      { name: "Abendessen Hilton Umgebung", desc: "Restaurants rund um das Hilton – entspannter Abschluss eines intensiven Tages", q: "Hilton Hiroshima restaurant Japan", time: "abends" },
    ],
    shopping: [
      { name: "Friedenspark Museumsshop", desc: "Geschmackvolle Erinnerungsstücke und Bücher – niveauvolles Souvenir zum Thema", q: "Hiroshima Peace Museum shop Japan", time: "morgens" },
      { name: "Hondōri letzte Einkäufe", desc: "Hiroshima-spezifische Produkte: Momiji-Manju, Oyster-Saucen, Regionale Keramik", q: "Hondori Hiroshima souvenirs Japan", time: "mittags" },
    ],
  },
  19: {
    sightseeing: [
      { name: "JR-Fähre nach Miyajima (früh)", desc: "Gezeitenzeit prüfen – schwimmendes Torii-Tor bei Flut aus dem Wasser ragend", q: "Miyajima Ferry JR Hiroshima Japan", time: "morgens" },
      { name: "Tori-Tor bei Ebbe zu Fuß", desc: "Bei Ebbe direkt durch Watt zum Tori-Tor laufen und berühren – einmaliges Erlebnis", q: "Itsukushima torii gate walk low tide Japan", time: "morgens" },
      { name: "Mount Misen Seilbahn + Wanderung", desc: "Seilbahn hoch, zu Fuß runter – Ausblick über die Seto-Inlandsee bleibt im Gedächtnis", q: "Mount Misen ropeway Miyajima Japan", time: "mittags" },
    ],
    kultur: [
      { name: "Itsukushima-Schrein UNESCO", desc: "Oranger Schrein auf Stelzen über dem Meer – eines der bekanntesten Bilder Japans", q: "Itsukushima Shrine Miyajima Japan", time: "morgens" },
      { name: "Daishoin Tempel Miyajima", desc: "Ruhiger Tempel mit 500 Steinlaternen und Moosgarten am Fuß des Misen", q: "Daishoin Temple Miyajima Japan", time: "morgens" },
    ],
    essen: [
      { name: "Anagoman Conger-Aal Brötchen", desc: "Miyajimas Spezialität: weiches Brötchen mit gegrillt-süßem Meeresaal gefüllt", q: "Anagoman Miyajima Japan", time: "morgens" },
      { name: "Momiji-Manju frisch gebacken", desc: "Ahornblatt-Kuchen direkt an der Backstube probieren – warm am besten", q: "Momiji manju Miyajima Hiroshima Japan", time: "mittags" },
      { name: "Ekiben im Shinkansen Hiroshima–Tokio", desc: "Letzter Ekiben der Reise im Nozomi – drei Wochen Japan im Rückblick", q: "Ekiben Shinkansen bento Japan", time: "abends" },
    ],
    shopping: [
      { name: "Miyajima Holzlöffel (Shamoji)", desc: "Traditionelles Miyajima-Souvenir: handgefertigte Holzlöffel in allen Größen", q: "Miyajima shamoji wooden spatula Japan", time: "morgens" },
      { name: "Momiji-Manju Kartons für Zuhause", desc: "Ahornkuchen-Kartons als Heimatmitbringsel – verschiedene Füllungen", q: "Momiji manju souvenir Miyajima Japan", time: "mittags" },
    ],
  },
  20: {
    sightseeing: [
      { name: "Yanaka Viertel Morgenspaziergang", desc: "Letzter Tokio-Morgen im ältesten erhaltenen Stadtteil – Katzen, Tempel, Stille", q: "Yanaka Tokyo morning walk Japan", time: "morgens" },
      { name: "Nezu Shrine Torii-Tunnel", desc: "Rote Torii-Gassen wie mini Fushimi Inari – in Tokio, kaum touristisch", q: "Nezu Shrine Tokyo Japan", time: "morgens" },
      { name: "Shibuya-Abend-Abschied", desc: "Letzte Nacht durch Shibuya – die Energie aufsaugen, ein letztes Mal die Kreuzung", q: "Shibuya night walk Tokyo Japan", time: "abends" },
    ],
    kultur: [
      { name: "Tokyo National Museum Ueno", desc: "Größtes Museum Japans: Samurai-Rüstungen, Nō-Theater, Kalligraphie und Skulpturen", q: "Tokyo National Museum Ueno Japan", time: "mittags" },
      { name: "Oedo Onsen Monogatari Odaiba", desc: "Thermalbad-Themenpark im Edo-Stil – letztes großes Onsen-Erlebnis der Reise", q: "Oedo Onsen Monogatari Odaiba Tokyo Japan", time: "mittags" },
    ],
    essen: [
      { name: "Matcha-Latte Café Harajuku", desc: "Ein letzter Matcha in Tokios coolstem Viertel – ruhiges Abschieds-Ritual", q: "Matcha cafe Harajuku Tokyo Japan", time: "morgens" },
      { name: "Fuunji Shinjuku Tsukemen", desc: "Tokios bestes Tsukemen (Dippramen) – letztes Ramen der Reise mit maximalem Impact", q: "Fuunji Ramen Shinjuku Tokyo Japan", time: "mittags" },
      { name: "Abschieds-Dinner Ginza / Shibuya", desc: "Erinnerungswürdiges letztes Abendessen – gerne etwas Besonderes gönnen", q: "Yakitori Birdland Ginza Tokyo Japan", time: "abends" },
    ],
    shopping: [
      { name: "Don Quixote Last-Minute Einkauf", desc: "Letzte Mitbringsel: Matcha-KitKat, Wasabi-Snacks, Capsule Toys, japanische Kosmetik", q: "Shibuya Don Quixote shopping Tokyo Japan", time: "mittags" },
      { name: "Ginza Six Luxus-Souvenirs", desc: "Hochwertige japanische Produkte: Kyo-Keramik, Lacklack-Dosen, edle Tees", q: "Ginza Six shopping Tokyo Japan", time: "mittags" },
      { name: "Matcha-KitKat & Omiyage Final", desc: "Narita/Haneda hat auch Auswahl – aber hier in der Stadt ist sie größer und günstiger", q: "Matcha KitKat omiyage Tokyo Japan", time: "abends" },
    ],
  },
  21: {
    sightseeing: [
      { name: "Letzter Blick auf Tokio-Bucht (Haneda)", desc: "Vom großen Panoramafenster im Terminal – Skyline, Bucht und der Abflug kommt näher", q: "Haneda Airport view Tokyo Bay Japan", time: "morgens" },
    ],
    kultur: [
      { name: "Haneda Edo-Markt Terminal 2", desc: "Japanische Kunsthandwerker-Einkaufszone im Flughafen – Keramik, Textilien, Lackwaren", q: "Haneda Airport Edo Market shopping Japan", time: "morgens" },
    ],
    essen: [
      { name: "Letzte Onigiri oder Tamago-Sando", desc: "Konbini im Terminal – das perfekte kleine Abschiedsfrühstück vor dem Gate", q: "Haneda Airport breakfast Japan", time: "morgens" },
      { name: "Sushi-Restaurant im Terminal", desc: "Haneda hat ausgezeichnete Sushi-Restaurants – für einen letzten Genussmoment", q: "Haneda Airport sushi restaurant Japan", time: "morgens" },
    ],
    shopping: [
      { name: "Haneda Duty-Free Whisky & Sake", desc: "Japanische Whiskys (Nikka, Suntory) und Sake-Flaschen als Heimatmitbringsel", q: "Haneda Airport duty free whisky Japan", time: "morgens" },
      { name: "Haneda Wagashi & japanische Süßigkeiten", desc: "Letzte Chance für Yatsuhashi, Dorayaki-Kartons und Matcha-Desserts für Zuhause", q: "Haneda Airport duty free shopping Japan", time: "morgens" },
    ],
  },
};

// ─── Budget Plan ──────────────────────────────────────────────────────────────

const budgetPlan = [
  { key: "food",           label: "Essen & Getränke",     planned: 1950, icon: UtensilsCrossed },
  { key: "activities",     label: "Eintritte & Onsen",    planned: 950,  icon: Bookmark },
  { key: "localTransport", label: "Lokaler Verkehr",      planned: 450,  icon: MapPin },
  { key: "reserve",        label: "Reserve / Shopping",   planned: 750,  icon: ShoppingBag },
];


// ─── Wunschziele ─────────────────────────────────────────────────────────────

const wunschziele = [
  {
    city: "Ōsaka",
    places: [
      { name: "Kinryu Ramen Nambasennichimae", cat: "Ramen",           rating: 3.7, reviews: "1.456",  q: "Kinryu Ramen Namba-Sennichimae Osaka Japan" },
      { name: "Shinsekai Kushikatsu Ittoku",   cat: "Kushikatsu",      rating: 4.4, reviews: "1.081",  q: "Shinsekai Kushikatsu Ittoku Osaka Japan" },
      { name: "551 HORAI in SOTOE",            cat: "Chinesisch",      rating: 4.1, reviews: "756",    q: "551 HORAI SOTOE Osaka Japan" },
      { name: "Kyabetsu-yaki Namba",           cat: "Okonomiyaki",     rating: 4.1, reviews: "414",    q: "Kyabetsu-yaki Namba Osaka Japan" },
      { name: "Takoyaki Wanaka Sennichimae",   cat: "Takoyaki",        rating: 4.3, reviews: "4.183",  q: "Takoyaki Wanaka Sennichimae Osaka Japan" },
      { name: "Chuka-soba Fujii Namba",        cat: "Ramen",           rating: 3.9, reviews: "1.041",  q: "Chuka-soba Fujii Namba Osaka Japan" },
      { name: "Temmasa",                       cat: "Udon",            rating: 4.2, reviews: "1.545",  q: "Temmasa Udon Osaka Japan" },
      { name: "Harukoma (Branch Shop)",        cat: "Sushi",           rating: 4.1, reviews: "2.106",  q: "Harukoma Branch Shop Osaka Japan" },
      { name: "Iseya Honten",                  cat: "Japan-Laden",     rating: 4.4, reviews: "41",     q: "Iseya Honten Osaka Japan" },
      { name: "Minami Fish Store",             cat: "Meeresfrüchte",   rating: 4.5, reviews: "123",    q: "Minami Fish Store Osaka Japan" },
      { name: "Kuromon Market",                cat: "Markt",           rating: 4.1, reviews: "20.078", q: "Kuromon Ichiba Market Osaka Japan" },
    ],
  },
  {
    city: "Kyōto",
    places: [
      { name: "Kyoto Ramen Kinzan",            cat: "Ramen",           rating: 3.8, reviews: "250",    q: "Kyoto Ramen Kinzan Kyoto Japan" },
      { name: "Jiki Miyazawa",                 cat: "Kaiseki",         rating: 4.6, reviews: "310",    q: "Jiki Miyazawa Kyoto Japan" },
      { name: "365 Sakaba Kyoto Kawaramachi",  cat: "Izakaya",         rating: 4.2, reviews: "163",    q: "365 Sakaba Kyoto Kawaramachi Japan" },
      { name: "Nishiki-Markt",                 cat: "Markt",           rating: 4.3, reviews: "50.636", q: "Nishiki Market Kyoto Japan" },
      { name: "をにわ 河原町店",               cat: "Izakaya",         rating: 4.6, reviews: "3.859",  q: "Oniwa Kawaramachi Kyoto Japan" },
    ],
  },
];

// ─── Storage Keys ────────────────────────────────────────────────────────────
const BUDGET_KEY = "japan2026_budget_v3";

// ─── Helper Components ───────────────────────────────────────────────────────

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-600">{eyebrow}</div>
      <h2 className="text-2xl font-semibold tracking-tight text-black">{title}</h2>
      {text && <p className="text-sm leading-6 text-black/50">{text}</p>}
    </div>
  );
}


// ─── Recommendation Categories ───────────────────────────────────────────────

const REC_CATEGORIES = [
  { key: "sightseeing", label: "Sightseeing", Icon: Camera },
  { key: "kultur",      label: "Kultur",      Icon: Landmark },
  { key: "essen",       label: "Essen",       Icon: UtensilsCrossed },
  { key: "shopping",    label: "Shopping",    Icon: ShoppingBag },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ_DOS_CATEGORIES = [
  {
    label: "Öffentliche Verkehrsmittel",
    dos:   ["Handy lautlos schalten, Telefonate vermeiden", "Leise sprechen – Stille in Zügen wird erwartet", "Rechts stehen auf Rolltreppen (Ausnahme Osaka: links)", "An markierten Stellen in der Schlange anstellen", "Rucksack absetzen oder nach vorne tragen"],
    donts: ["Nicht telefonieren in der Bahn", "Keine laute Musik ohne Kopfhörer", "Nicht essen (außer auf Shinkansen-Langstrecken)"],
  },
  {
    label: "Restaurant & Essen",
    dos:   ['Vor dem Essen "Itadakimasu" sagen (Dankbarkeit)', 'Nach dem Essen "Gochisōsama deshita" sagen', "Suppe schlürfen ist erwünscht – Zeichen des Genusses", "Geld in die Zahlschale legen, nicht direkt in die Hand"],
    donts: ["Kein Trinkgeld – gilt als unhöflich und wird teils zurückgegeben", "Nicht beim Gehen essen (außer Streetfood-Stände)", "Stäbchen nie senkrecht in Reis stecken (Trauerbrauch)", "Essen nie von Stäbchen zu Stäbchen weitergeben (Trauerbrauch)"],
  },
  {
    label: "Tempel & Schreine",
    dos:   ["Am Eingang Hände am Temizuya waschen", "Shinto-Ritual: 2× verneigen, 2× klatschen, 1× verneigen", "Leise und respektvoll verhalten", "Spende in den Kasten werfen, nicht hineinlegen"],
    donts: ["Keine lauten Gespräche in Gebetsbereichen", "Nicht fotografieren wo Schilder es verbieten", "Gebetsbereiche nicht betreten wenn abgesperrt"],
  },
  {
    label: "Ryokan & Tatami",
    dos:   ["Straßenschuhe immer im Eingangsbereich ausziehen", "Yukata: linke Seite über rechte legen", "Hausschuhe beim Verlassen des Tatami-Raums ausziehen", "Yukata auch für Abendessen und Onsen-Gang tragen"],
    donts: ["Keine Straßen- oder Hausschuhe auf Tatami", "Yukata nicht rechts über links legen (gilt als Trauerkleidung)", "Nicht mit dem Handtuch ins Onsen gehen – vorher duschen"],
  },
  {
    label: "Allgemeines Verhalten",
    dos:   ["Müll mitnehmen – öffentliche Mülleimer sind selten", "Dinge mit beiden Händen übergeben und entgegennehmen", "Visitenkarten mit beiden Händen nehmen und kurz betrachten", "Geduld und Freundlichkeit zahlen sich immer aus", "Masken tragen bei Erkältung – weitgehend übliche Praxis"],
    donts: ["Nicht laut in der Öffentlichkeit – Zurückhaltung wird geschätzt", "Kein direkter, langer Augenkontakt mit Fremden", "Nicht auf indirekte Ablehnung bestehen – 'Nein' wird selten direkt gesagt", "Keine körperliche Nähe / spontane Umarmungen"],
  },
  {
    label: "Onsen",
    dos:   ["Vor dem Einstieg gründlich duschen und den Körper waschen", "Langes Haar hochbinden oder mit Handtuch befestigen", "Kleines Handtuch mitbringen – zum Abdecken auf dem Kopf ablegen", "Ruhig und entspannt verhalten – Onsen ist ein Ruheplatz", "Verschiedene Becken ausprobieren – oft unterschiedliche Temperaturen", "Nach dem Bad sanft abtrocknen, Yukata anziehen und Wasser trinken"],
    donts: ["Kein Handtuch ins Wasser tauchen", "Nicht mit Badebekleidung ins Onsen – traditionell nackt", "Sichtbare Tätowierungen sind in vielen Onsen verboten – vorab prüfen", "Nicht untertauchen oder plantschen", "Kein Shampoo oder Seife im Becken benutzen", "Nicht zu lange im heißen Wasser bleiben – Kreislauf beachten", "Fotografieren im Badebereich ist streng verboten"],
  },
];

const EMERGENCY_CONTACTS = [
  { label: "Polizei",                  number: "110",             note: "Notruf – kostenlos, landesweit",                                href: null },
  { label: "Feuerwehr & Krankenwagen", number: "119",             note: "Notruf – kostenlos, landesweit",                                href: null },
  { label: "Japan Tourist Helpline",   number: "050-3816-2787",   note: "24 h, mehrsprachig (auch Deutsch) – JNTO",                     href: "https://www.jnto.go.jp/eng/basic-info/emergency-info/" },
  { label: "Deutsche Botschaft Tokyo", number: "+81-3-5791-7700", note: "4-5-10 Minami-Azabu, Minato-ku, Tokyo · Mo–Fr 9–12 & 14–17 Uhr", href: "https://japan.diplo.de" },
  { label: "Botschaft Notfalltelefon", number: "+81-3-5791-7700", note: "Außerhalb der Bürozeiten: Ansage mit Weiterschaltung",          href: null },
  { label: "Konsulat Osaka",           number: "+81-6-6440-5070", note: "Japanbankstr. 15F, Umeda Sky Building Tower West, Osaka",       href: null },
  { label: "Europäischer Notruf-SOS",  number: "112",             note: "Funktioniert auf manchen Mobilnetzen als Notfall-Fallback",     href: null },
  { label: "Kreditkartensperrung",     number: "→ Banknummer",    note: "Internationale Sperrnummer der eigenen Bank bereithalten",     href: null },
];

// ─── Module-level derived constants ──────────────────────────────────────────

const cities       = ["Alle", ...Array.from(new Set(itinerary.map(d => d.city)))];
const totalPlanned = budgetPlan.reduce((s, c) => s + c.planned, 0);
const mapsUrl      = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

// ─── Toggle factory ───────────────────────────────────────────────────────────

const makeToggle = (setter) => (key) =>
  setter(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

// ─── Zugverbindungen ──────────────────────────────────────────────────────────

const trainOverview = {
  hinweis: "Fahrplanstand April 2026. Bei einigen Fernverkehrsabschnitten können Zugnummern oder Minutenlagen bis zum Reisetag geringfügig angepasst werden.",
  sitzlogik: "Fuji-Blick ostwärts meistens auf der rechten Seite zwischen Odawara und Shizuoka; west- bzw. nordostwärts Richtung Tokyo meist links kurz vor Shin-Yokohama/Tokyo. Romancecar nach Hakone möglichst Fenster rechts.",
  buchungslinks: [
    { label: "SmartEX",            href: "https://smart-ex.jp/en/index.php" },
    { label: "JR West / e5489",    href: "https://www.westjr.co.jp/travel-information/en/tickets-passes/route-search/" },
    { label: "Odakyu e-Romancecar",href: "https://www.web-odakyu.com/e-romancecar/?language=en" },
    { label: "Keikyu",             href: "https://norikae.keikyu.co.jp/" },
  ],
};

const trainSegments = [
  {
    id: 0,
    route: "Haneda → Tokio (Shibuya)",
    date: "01.05.2026",
    hotel: "Hotel Sunroad Shibuya",
    mapsHref: "https://www.google.com/maps/dir/Haneda+Airport+Terminal+3+Station/Shibuya+Station/",
    booking: { label: "Keikyu Fahrplansuche (JP)", href: "https://norikae.keikyu.co.jp/hnd-tokyo/norikae/N1?MODE=1&OUTPUT=1&SR=D&USR=PC" },
    note: null,
    legs: [
      { line: "Keikyu Airport Line · Rapid Express", from: "Haneda Airport Terminal 3", to: "Shinagawa",  dep: "11:25", arr: "11:38", train: "—", tip: "Keine Reservierung; am besten vorne im Wagen für kurzen Umstieg." },
      { line: "JR Yamanote Line",                    from: "Shinagawa",                 to: "Shibuya",    dep: "11:45", arr: "11:58", train: "—", tip: "Beliebig; für Ausstieg in Shibuya nahe der Türen stehen." },
    ],
    zwischenstops: [
      { label: "Haneda T3 → Shinagawa", stops: "Haneda T1/2 → Tenkubashi → Anamori-Inari → Otorii → Kojiya → Keikyu Kamata → Zoshiki → Rokugodote → Keikyu Kawasaki → Hatchonawate → Keikyu Tsurumi → Kagetsu-Sojiji → Namamugi → Keikyu Shinkoyasu → Koyasu → Kanagawa-Shimmachi → Keikyu Higashi-Kanagawa → Kanagawa → Shinagawa" },
      { label: "Shinagawa → Shibuya",   stops: "Osaki → Gotanda → Meguro → Ebisu → Shibuya" },
    ],
  },
  {
    id: 1,
    route: "Tokio (Shibuya) → Hakone (Gora)",
    date: "07.05.2026",
    hotel: "Laforet Hakone Gora Yunosumika",
    mapsHref: "https://www.google.com/maps/dir/Shibuya+Station/Gora+Station/",
    booking: { label: "Odakyu e-Romancecar", href: "https://www.web-odakyu.com/e-romancecar/?language=en" },
    note: "Alle Sitze im Romancecar sind reservierungspflichtig.",
    legs: [
      { line: "JR Yamanote Line",          from: "Shibuya",        to: "Shinjuku",       dep: "09:31", arr: "09:38", train: "—",        tip: "Beliebig; nahe Tür für schnellen Bahnsteigwechsel." },
      { line: "Odakyu Romancecar",         from: "Shinjuku Odakyu",to: "Hakone-Yumoto",  dep: "10:00", arr: "11:13", train: "Hakone 3", tip: "Fenster rechts in Fahrtrichtung; gute Chance auf Fuji-Blicke bei klarem Wetter. GSE/Observation-Deck sehr attraktiv, falls verfügbar." },
      { line: "Hakone Tozan Railway",      from: "Hakone-Yumoto",  to: "Gora",           dep: "11:25", arr: "12:03", train: "—",        tip: "Fenster frei wählen; bergseitige Kurven auf beiden Seiten schön." },
    ],
    zwischenstops: [
      { label: "Shibuya → Shinjuku",         stops: "Harajuku → Yoyogi → Shinjuku" },
      { label: "Shinjuku → Hakone-Yumoto",   stops: "Machida → Hon-Atsugi → Isehara → Hadano → Odawara → Hakone-Yumoto" },
      { label: "Hakone-Yumoto → Gora",       stops: "Tonosawa → Deyama → Ohiradai → Miyanoshita → Kowakidani → Chokoku-no-Mori → Gora" },
    ],
  },
  {
    id: 2,
    route: "Hakone (Gora) → Kyōto",
    date: "09.05.2026",
    hotel: "WAYFARER Gojo",
    mapsHref: "https://www.google.com/maps/dir/Gora+Station/Kyoto+Station/",
    booking: { label: "SmartEX (Shinkansen)", href: "https://smart-ex.jp/en/index.php" },
    note: "Die genaue Hikari-Zugnummer kann bis zum Reisetag geringfügig angepasst werden; hier ist das aktuelle Frühjahrsfenster hinterlegt.",
    legs: [
      { line: "Hakone Tozan Railway",               from: "Gora",          to: "Hakone-Yumoto", dep: "09:08",     arr: "09:45",     train: "—",                                   tip: "Beliebig." },
      { line: "Hakone Tozan · Odawara bound local", from: "Hakone-Yumoto", to: "Odawara",       dep: "09:52",     arr: "10:05",     train: "—",                                   tip: "Beliebig." },
      { line: "Tokaido Shinkansen · Hikari",        from: "Odawara",       to: "Kyōto",         dep: "ca. 10:11", arr: "ca. 12:05", train: "Hikari (Frühjahrsfahrplan, ~10-Uhr-Fenster)", tip: "Unbedingt Fenster rechts (E-Sitz) in Fahrtrichtung – beste Fuji-Chance kurz hinter Odawara." },
    ],
    zwischenstops: [
      { label: "Gora → Hakone-Yumoto",         stops: "Chokoku-no-Mori → Kowakidani → Miyanoshita → Ohiradai → Deyama → Tonosawa → Hakone-Yumoto" },
      { label: "Hakone-Yumoto → Odawara",      stops: "Iriuda → Kazamatsuri → Hakone-Itabashi → Odawara" },
      { label: "Odawara → Kyōto (Shinkansen)", stops: "Atami → Mishima → Shizuoka → Hamamatsu → Nagoya → Maibara → Kyōto" },
    ],
  },
  {
    id: 3,
    route: "Kyōto → Ōsaka (Namba)",
    date: "12.05.2026",
    hotel: "Hotel Abitare Namba West",
    mapsHref: "https://www.google.com/maps/dir/Kyoto+Station/Namba+Station/",
    booking: { label: "NAVITIME Japan", href: "https://www.navitime.co.jp/" },
    note: null,
    legs: [
      { line: "JR Kyoto Line · Special Rapid",  from: "Kyōto",       to: "Osaka",  dep: "09:30", arr: "09:58", train: "—", tip: "Keine Reservierung nötig." },
      { line: "Osaka Metro Midosuji Line",       from: "Umeda / Osaka",to: "Namba",  dep: "10:05", arr: "10:13", train: "—", tip: "Beliebig; nahe Tür für schnellen Ausstieg." },
    ],
    zwischenstops: [
      { label: "Kyōto → Osaka",      stops: "Takatsuki → Shin-Osaka → Osaka" },
      { label: "Umeda → Namba",      stops: "Yodoyabashi → Hommachi → Shinsaibashi → Namba" },
    ],
  },
  {
    id: 4,
    route: "Ōsaka → Kinosaki Onsen",
    date: "15.05.2026",
    hotel: "Onishiya Suishoen",
    mapsHref: "https://www.google.com/maps/dir/Shin-Osaka+Station/Kinosaki-Onsen+Station/",
    booking: { label: "JR West / e5489", href: "https://www.westjr.co.jp/travel-information/en/tickets-passes/route-search/" },
    note: "Reservierung empfehlenswert – der Kounotori ist beliebt.",
    legs: [
      { line: "JR Limited Express", from: "Shin-Osaka", to: "Kinosaki Onsen", dep: "10:05", arr: "12:51", train: "Kounotori 5", tip: "Fenster links in Fahrtrichtung für die ruhigeren Landschaftsbilder im späteren Streckenverlauf." },
    ],
    zwischenstops: [
      { label: "Shin-Osaka → Kinosaki Onsen", stops: "Osaka → Amagasaki → Takarazuka → Sanda → Sasayamaguchi → Fukuchiyama → Wadayama → Yabu → Ebara → Toyooka → Kinosaki Onsen" },
    ],
  },
  {
    id: 5,
    route: "Kinosaki Onsen → Hiroshima",
    date: "17.05.2026",
    hotel: "Hilton Hiroshima",
    mapsHref: "https://www.google.com/maps/dir/Kinosaki-Onsen+Station/Hiroshima+Station/",
    booking: { label: "JR West / e5489", href: "https://www.westjr.co.jp/travel-information/en/tickets-passes/route-search/" },
    note: "Schnellste Tagesverbindung mit Kounotori und anschließendem Shinkansen. Reservierung für beide Abschnitte empfohlen.",
    legs: [
      { line: "JR Limited Express",      from: "Kinosaki Onsen", to: "Shin-Osaka", dep: "09:33",     arr: "12:29", train: "Kounotori 12",              tip: "Fenster rechts oder links beide gut; wichtiger ist ein Platz ohne Umstiegsstress nahe Tür." },
      { line: "Sanyo Shinkansen · Sakura",from: "Shin-Osaka",    to: "Hiroshima",  dep: "ca. 12:39", arr: "14:02", train: "Sakura (ca. 12:39-Abfahrt)", tip: "Fenster links in Fahrtrichtung für Meerseiten-/Stadtblicke; Green Car nur bei Komfortwunsch." },
    ],
    zwischenstops: [
      { label: "Kinosaki Onsen → Shin-Osaka",        stops: "Toyooka → Ebara → Yabu → Wadayama → Fukuchiyama → Sasayamaguchi → Sanda → Takarazuka → Amagasaki → Shin-Osaka" },
      { label: "Shin-Osaka → Hiroshima (Shinkansen)", stops: "Shin-Kobe → Okayama → Fukuyama → Hiroshima" },
    ],
  },
  {
    id: 6,
    route: "Hiroshima → Tokio (Keikyu-Kamata)",
    date: "19.05.2026",
    hotel: "Syforme Keikyu-Kamata Residence",
    mapsHref: "https://www.google.com/maps/dir/Hiroshima+Station/Keikyu-Kamata+Station/",
    booking: { label: "SmartEX (Shinkansen)", href: "https://smart-ex.jp/en/index.php" },
    note: null,
    legs: [
      { line: "Sanyo/Tokaido Shinkansen · Nozomi", from: "Hiroshima",  to: "Tokyo",         dep: "11:43", arr: "15:36", train: "Nozomi 22", tip: "Fenster links in Fahrtrichtung für die spätere Fuji-Chance vor Tokyo." },
      { line: "JR Yamanote Line",                  from: "Tokyo",       to: "Shinagawa",     dep: "15:44", arr: "15:54", train: "—",         tip: "Beliebig." },
      { line: "Keikyu Main Line",                  from: "Shinagawa",   to: "Keikyu Kamata", dep: "16:03", arr: "16:12", train: "—",         tip: "Keine Reservierung nötig." },
    ],
    zwischenstops: [
      { label: "Hiroshima → Tokyo (Nozomi)",   stops: "Okayama → Shin-Kobe → Shin-Osaka → Kyōto → Nagoya → Shin-Yokohama → Tokyo" },
      { label: "Tokyo → Shinagawa",            stops: "Yurakucho → Shimbashi → Hamamatsucho → Tamachi → Takanawa Gateway → Shinagawa" },
      { label: "Shinagawa → Keikyu Kamata",    stops: "Aomono-Yokocho → Heiwajima → Keikyu Kamata" },
    ],
  },
  {
    id: 7,
    route: "Tokio (Keikyu-Kamata) → Haneda",
    date: "21.05.2026",
    hotel: null,
    mapsHref: "https://www.google.com/maps/dir/Keikyu-Kamata+Station/Haneda+Airport+Terminal+3+Station/",
    booking: { label: "Keikyu Fahrplansuche (JP)", href: "https://norikae.keikyu.co.jp/" },
    note: "Sehr frühe, direkte Airport-Verbindung ab 06:30 wie gewünscht.",
    legs: [
      { line: "Keikyu Airport Line", from: "Keikyu Kamata", to: "Haneda Airport Terminal 3", dep: "06:30", arr: "06:39", train: "—", tip: "Keine Reservierung nötig." },
    ],
    zwischenstops: [
      { label: "Keikyu Kamata → Haneda T3", stops: "Otorii → Anamori-Inari → Tenkubashi → Haneda Airport Terminal 3" },
    ],
  },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "map",       label: "Hotels",      icon: Hotel },
  { id: "itinerary", label: "Reiseplan",   icon: List },
  { id: "trains",    label: "Züge",        icon: Train },
  { id: "wishlist",  label: "Wunschziele", icon: Star },
  { id: "faq",       label: "FAQ",         icon: BookOpen },
  { id: "budget",    label: "Budget",      icon: Wallet },
];

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab]       = useState("map");
  const [selectedCity, setSelectedCity] = useState("Alle");
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [expandedCities, setExpandedCities]   = useState(new Set());
  const [expandedTrains, setExpandedTrains]   = useState(new Set());
  const [expandedFaqs,   setExpandedFaqs]     = useState(new Set());
  const toggleCity  = makeToggle(setExpandedCities);
  const toggleTrain = makeToggle(setExpandedTrains);
  const toggleFaq   = makeToggle(setExpandedFaqs);
  const [budgetEntries, setBudgetEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(BUDGET_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const [newBudgetInputs, setNewBudgetInputs] = useState({});

  const visibleDays = useMemo(
    () => selectedCity === "Alle" ? itinerary : itinerary.filter(d => d.city === selectedCity),
    [selectedCity]
  );

  const totalActual = useMemo(() =>
    budgetPlan.reduce((s, c) =>
      s + (budgetEntries[c.key] || []).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0), 0),
  [budgetEntries]);

  const toggleDay = makeToggle(setExpandedDays);

  const addBudgetEntry = (key) => {
    const input = newBudgetInputs[key] || {};
    const amount = parseFloat(input.amount);
    if (!amount || amount <= 0) return;
    setBudgetEntries(prev => {
      const next = { ...prev, [key]: [...(prev[key] || []), { id: Date.now() + Math.random(), amount, label: (input.label || "").trim() }] };
      try { localStorage.setItem(BUDGET_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setNewBudgetInputs(prev => ({ ...prev, [key]: { amount: "", label: "" } }));
  };

  const removeBudgetEntry = (key, id) => {
    setBudgetEntries(prev => {
      const next = { ...prev, [key]: (prev[key] || []).filter(e => e.id !== id) };
      try { localStorage.setItem(BUDGET_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="md:mx-auto md:max-w-7xl md:px-6 md:py-8">
        <div className="overflow-hidden bg-white md:rounded-[32px] md:border md:border-black/25 md:shadow-xl md:shadow-black/25">

          {/* ── Sticky Header + Tab Bar ─────────────────────────────────── */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur">
            {/* Header */}
            <div className="relative flex items-center border-b border-black/25 px-5 py-4 md:px-8 md:py-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-red-600 pointer-events-none md:h-14 md:w-14" />
              <h1 className="text-2xl font-bold tracking-tight text-red-600 md:text-3xl">{trip.title}</h1>
            </div>
            {/* Tab Bar */}
            <div className="border-b border-black/25 px-2 md:px-8">
              <div className="grid grid-cols-3 gap-1 p-2 md:flex md:gap-0.5 md:py-2 md:px-0">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-medium transition min-h-[44px] w-full md:w-auto md:shrink-0 md:px-4 md:text-sm md:justify-start ${active ? "bg-red-600/[0.08] text-red-600" : "text-black/50 hover:bg-black/5 hover:text-black/75"}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* ── Tab: Tagesplan ──────────────────────────────────────────── */}
          {activeTab === "itinerary" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <SectionTitle eyebrow="Tagesplan" title="Eure Reise Tag für Tag" />
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Stadt filtern</label>
                    <select
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full rounded-2xl border border-black/25 bg-white px-4 py-3 text-sm outline-none md:min-w-[220px]"
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
                      <div key={item.day} className="rounded-[24px] border border-black/25 bg-white p-5 shadow-sm shadow-black/25">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">{item.date}</div>
                            <h3 className="mt-1 text-xl font-semibold tracking-tight text-black">{item.title}</h3>
                            <div className="mt-2 inline-flex rounded-full bg-black/[0.07] px-3 py-1 text-xs text-black/75">{item.vibe}</div>
                          </div>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                            {item.day}
                          </div>
                        </div>

                        <div className="grid gap-3 text-sm text-black/75">
                          {[
                            [MapPin, "Ort",       item.city],
                            [Train,  "Transport", item.transport],
                            [Hotel,  "Hotel",     item.hotel],
                          ].map(([Ic, label, val]) => (
                            <div key={label} className="flex items-start gap-3 rounded-2xl bg-black/5 p-3">
                              <Ic className="mt-0.5 h-4 w-4 text-black/50 shrink-0" />
                              <div>
                                <div className="font-medium text-black">{label}</div>
                                <div>{val}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recommendations toggle */}
                        {recs && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleDay(item.day)}
                              className="flex w-full items-center justify-between rounded-2xl bg-red-600 hover:bg-red-600 px-4 py-3 text-sm font-medium text-white transition"
                            >
                              <span>Empfehlungen für diesen Tag</span>
                              {expanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                            </button>

                            {expanded && (
                              <div className="mt-3 space-y-3">
                                {REC_CATEGORIES.filter(cat => recs[cat.key] && recs[cat.key].length > 0).map(({ key, label, Icon: CatIcon }) => (
                                  <div key={key} className="rounded-2xl border border-black/25 bg-black/5 p-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/75">
                                      <CatIcon className="h-3.5 w-3.5" /> {label}
                                    </div>
                                    <div className="space-y-2">
                                      {recs[key].map((rec, i) => (
                                        <div key={i} className="flex items-start justify-between gap-3 rounded-xl bg-white px-3 py-2.5">
                                          <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <div className="text-sm font-medium text-black leading-tight">{rec.name}</div>
                                              {rec.time && (
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                                  rec.time === "morgens" ? "bg-black/[0.07] text-black/75" :
                                                  rec.time === "mittags" ? "bg-black/[0.07] text-black/75" :
                                                  "bg-black/[0.07] text-black/75"
                                                }`}>{rec.time}</span>
                                              )}
                                            </div>
                                            <div className="mt-0.5 text-xs text-black/50 leading-snug">{rec.desc}</div>
                                          </div>
                                          <a
                                            href={mapsUrl(rec.q)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 rounded-full bg-red-600/[0.08] px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-600/25 transition"
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

          {/* ── Tab: Hotels ─────────────────────────────────────────────── */}
          {activeTab === "map" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                <SectionTitle eyebrow="Hotels" title="Unterkünfte der Reise" text="Alle Hotels mit Check-in und Check-out Zeiten auf einen Blick." />
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {stops.map((stop, i) => (
                    <div
                      key={stop.id}
                      className="rounded-[20px] border border-black/25 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Hotel {i + 1}</div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.hotel + " " + stop.city + " Japan")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-red-600/[0.08] text-red-600 hover:bg-red-600/25 transition"
                          title="Auf Google Maps öffnen"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div className="mt-1 text-sm font-semibold text-black">{stop.city}</div>
                      <div className="mt-0.5 text-sm text-black/75 leading-snug">{stop.hotel}</div>
                      <div className="mt-1 text-xs text-black/50">{stop.range} · {stop.nights} Nächte</div>
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <span className="text-black/50">Check-in</span> {stop.checkin} Uhr
                        </span>
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <span className="text-black/50">Check-out</span> {stop.checkout} Uhr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* ── Tab: Züge ───────────────────────────────────────────────── */}
          {activeTab === "trains" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="space-y-5">

                {/* Übersicht / Hinweise */}
                <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                  <SectionTitle eyebrow="Zugverbindungen" title="Premium Zugbooklet" text="Alle 8 Fahrtabschnitte der Reise – strukturiert mit Zeiten, Zugnummern und Sitzplatz-Tipps." />

                  {/* Buchungslinks */}
                  <div className="mb-4">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/50">Buchungslinks</div>
                    <div className="flex flex-wrap gap-2">
                      {trainOverview.buchungslinks.map(l => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                           className="inline-flex items-center gap-1.5 rounded-full border border-black/25 bg-white px-3 py-1.5 text-xs font-medium text-black/75 hover:border-red-600/50 hover:text-red-600 transition">
                          <Train className="h-3 w-3 shrink-0" />
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Sitzplatz-Logik */}
                  <div className="mb-4 rounded-2xl border border-black/25 bg-white p-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-600">Sitzplatz-Kurzlogik</div>
                    <p className="text-sm leading-relaxed text-black/75">{trainOverview.sitzlogik}</p>
                  </div>

                  {/* Hinweis */}
                  <div className="rounded-2xl bg-red-600/[0.06] border border-red-600/25 px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600 mb-1">Hinweis</div>
                    <p className="text-sm text-black/75">{trainOverview.hinweis}</p>
                  </div>
                </div>

                {/* Accordion: Fahrtabschnitte 0–7 */}
                <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                  <div className="mb-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-600 mb-1">Fahrtabschnitte</div>
                    <h2 className="text-2xl font-semibold tracking-tight text-black">Abschnitte 0 – 7</h2>
                  </div>
                  <div className="space-y-3">
                    {trainSegments.map(seg => {
                      const open = expandedTrains.has(seg.id);
                      return (
                        <div key={seg.id} className="overflow-hidden rounded-[20px] border border-black/25 bg-white">

                          {/* Header row */}
                          <button
                            onClick={() => toggleTrain(seg.id)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-black/5 min-h-[60px]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                {seg.id}
                              </div>
                              <div className="min-w-0">
                                <div className="text-base font-semibold text-black leading-snug truncate">{seg.route}</div>
                                <div className="text-xs text-black/50 mt-0.5">{seg.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={seg.mapsHref}
                                target="_blank"
                                rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center justify-center h-7 w-7 rounded-full bg-red-600/[0.08] text-red-600 hover:bg-red-600/25 transition"
                                title="Google Maps"
                              >
                                <MapPin className="h-3.5 w-3.5" />
                              </a>
                              {open ? <ChevronUp className="h-4 w-4 text-black/50" /> : <ChevronDown className="h-4 w-4 text-black/50" />}
                            </div>
                          </button>

                          {/* Expanded content */}
                          {open && (
                            <div className="border-t border-black/25 p-4 space-y-4">

                              {/* Meta: Hotel + Booking */}
                              <div className="flex flex-wrap gap-2 items-center">
                                {seg.hotel && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.06] px-3 py-1 text-xs text-black/75">
                                    <Hotel className="h-3 w-3 shrink-0 text-black/50" /> {seg.hotel}
                                  </span>
                                )}
                                <a
                                  href={seg.booking.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full border border-black/25 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:border-red-600/50 hover:bg-red-600/[0.06] transition"
                                >
                                  <Train className="h-3 w-3 shrink-0" /> {seg.booking.label} ↗
                                </a>
                              </div>

                              {/* Hinweis / Note */}
                              {seg.note && (
                                <div className="rounded-xl bg-red-600/[0.06] border border-red-600/25 px-3 py-2.5">
                                  <p className="text-xs text-black/75 leading-snug">{seg.note}</p>
                                </div>
                              )}

                              {/* Legs table */}
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">Verbindung im Detail</div>
                                <div className="space-y-2">
                                  {seg.legs.map((leg, i) => (
                                    <div key={i} className="rounded-2xl border border-black/25 bg-black/[0.03] p-3">
                                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/[0.12] text-red-600">
                                            <Train className="h-2.5 w-2.5" />
                                          </div>
                                          <span className="text-xs font-semibold text-black leading-tight">{leg.line}</span>
                                        </div>
                                        {leg.train !== "—" && (
                                          <span className="shrink-0 rounded-full bg-red-600/[0.08] px-2.5 py-0.5 text-[10px] font-semibold text-red-600">{leg.train}</span>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-[auto_1fr_auto_1fr] items-center gap-x-2 gap-y-1 text-sm mb-2">
                                        <span className="font-semibold text-red-600 tabular-nums">{leg.dep}</span>
                                        <span className="text-black/75 text-xs leading-tight">{leg.from}</span>
                                        <span className="font-semibold text-black/50 tabular-nums text-right">{leg.arr}</span>
                                        <span className="text-black/75 text-xs leading-tight">{leg.to}</span>
                                      </div>
                                      <div className="flex items-start gap-1.5 rounded-xl bg-white px-3 py-2">
                                        <span className="mt-0.5 text-red-600 text-[10px] font-bold shrink-0">💺</span>
                                        <span className="text-xs text-black/75 leading-snug">{leg.tip}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Intermediate stops */}
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">Zwischenstationen</div>
                                <div className="space-y-2">
                                  {seg.zwischenstops.map((z, i) => (
                                    <div key={i} className="rounded-xl border border-black/25 bg-black/[0.03] px-3 py-2.5">
                                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50 mb-1">{z.label}</div>
                                      <p className="text-xs text-black/75 leading-relaxed">{z.stops}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Tab: Budget ─────────────────────────────────────────────── */}
          {activeTab === "budget" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Category tracker */}
                <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                  <SectionTitle eyebrow="Budget-Tracker" title="Ausgaben erfassen" text="Füge beliebig viele Einträge pro Kategorie hinzu – alles wird dauerhaft gespeichert." />
                  <div className="space-y-4">
                    {budgetPlan.map(({ key, label, planned, icon: Icon }) => {
                      const entries = budgetEntries[key] || [];
                      const actual = entries.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
                      const pct = Math.min((actual / planned) * 100, 100);
                      const over = actual > planned;
                      const inp = newBudgetInputs[key] || {};
                      return (
                        <div key={key} className="rounded-2xl border border-black/25 bg-white p-4">
                          {/* Header */}
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600/[0.08] text-red-600">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-black">{label}</div>
                                <div className="text-xs text-black/50">Geplant: {planned.toLocaleString("de-DE")} € · Gesamt: <span className={`font-semibold ${over ? "text-red-600" : "text-red-600"}`}>{actual.toLocaleString("de-DE")} €</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${over ? "bg-red-600/[0.08]0" : "bg-black/50"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* Entry list */}
                          {entries.length > 0 && (
                            <div className="mb-3 space-y-1.5">
                              {entries.map(e => (
                                <div key={e.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/5 px-3 py-2">
                                  <span className="text-sm text-black/75">{e.label || "Ausgabe"}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-black">{parseFloat(e.amount).toLocaleString("de-DE")} €</span>
                                    <button onClick={() => removeBudgetEntry(key, e.id)} className="rounded-full p-0.5 text-white/75 hover:text-red-600 transition">
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add entry */}
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              type="text"
                              value={inp.label || ""}
                              onChange={e => setNewBudgetInputs(prev => ({ ...prev, [key]: { ...inp, label: e.target.value } }))}
                              placeholder="Bezeichnung …"
                              className="min-w-0 flex-1 rounded-xl border border-black/25 bg-black/5 px-3 py-2.5 text-sm text-black outline-none focus:border-red-600/50"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={inp.amount || ""}
                                onChange={e => setNewBudgetInputs(prev => ({ ...prev, [key]: { ...inp, amount: e.target.value } }))}
                                onKeyDown={e => e.key === "Enter" && addBudgetEntry(key)}
                                placeholder="€"
                                className="min-w-0 flex-1 sm:w-24 sm:flex-none rounded-xl border border-black/25 bg-black/5 px-3 py-2.5 text-right text-sm font-medium text-black outline-none focus:border-red-600/50"
                              />
                              <button
                                onClick={() => addBudgetEntry(key)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-600 transition"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {actual > 0 && (
                            <div className={`mt-2 text-right text-xs font-medium ${over ? "text-red-600" : "text-red-600"}`}>
                              {over ? `+${(actual - planned).toLocaleString("de-DE")} € über Budget` : `${(planned - actual).toLocaleString("de-DE")} € noch verfügbar`}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                  <div className="rounded-[28px] border border-black/25 bg-black p-5 md:p-6 text-white">
                    <SectionTitle eyebrow="Gesamtübersicht" title="Dein Budgetstatus" />
                    <div className="space-y-4">
                      {[
                        { label: "Geplant gesamt", value: totalPlanned, color: "text-white/75" },
                        { label: "Ausgegeben bisher", value: totalActual, color: totalActual > totalPlanned ? "text-red-600" : "text-red-600" },
                        { label: "Verbleibend", value: totalPlanned - totalActual, color: totalActual > totalPlanned ? "text-red-600" : "text-red-600" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                          <span className="text-sm text-white/50">{label}</span>
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
                          className={`h-3 rounded-full transition-all duration-700 ${totalActual > totalPlanned ? "bg-red-600/[0.08]0" : "bg-black/50"}`}
                          style={{ width: `${Math.min((totalActual / totalPlanned) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Budget tips */}
                  <div className="rounded-[28px] border border-black/25 bg-white p-5 md:p-6">
                    <SectionTitle eyebrow="Tipps" title="Budget-Hinweise" />
                    <div className="space-y-3 text-sm">
                      {[
                        ["Ryokan-Essen", "Hakone und Kinosaki: Kaiseki ist im Preis inkl. – kein Extra-Budget nötig."],
                        ["Cash Reserve", "200–300 € als Bargeld immer dabei, besonders in Kinosaki und Hakone."],
                        ["JR Pass", "Bereits vor Reiseantritt online kaufen – in Japan teurer oder nicht erhältlich."],
                        ["Konbini spart", "Frühstück und Snacks im Konbini: ~10–15 € pro Tag statt 30 € im Café."],
                      ].map(([t, desc]) => (
                        <div key={t} className="rounded-2xl bg-black/5 px-4 py-3">
                          <div className="font-medium text-black">{t}</div>
                          <div className="mt-0.5 text-black/75">{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Tab: Wunschziele ────────────────────────────────────────── */}
          {activeTab === "wishlist" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                <SectionTitle
                  eyebrow="Wunschziele"
                  title="Orte auf eurer Merkliste"
                  text="Alle gespeicherten Spots aus eurer Google-Maps-Liste – nach Stadt gruppiert."
                />
                <div className="mt-4 space-y-3">
                  {wunschziele.map(group => {
                    const open = expandedCities.has(group.city);
                    return (
                      <div key={group.city} className="overflow-hidden rounded-[20px] border border-black/25 bg-white">
                        <button
                          onClick={() => toggleCity(group.city)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-black/5 min-h-[56px]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                              <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-base font-semibold text-black">{group.city}</span>
                            <span className="rounded-full bg-black/[0.07] px-2.5 py-0.5 text-xs text-black/50">{group.places.length} Orte</span>
                          </div>
                          {open ? <ChevronUp className="h-4 w-4 shrink-0 text-black/50" /> : <ChevronDown className="h-4 w-4 shrink-0 text-black/50" />}
                        </button>

                        {open && (
                          <div className="border-t border-black/25 p-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {group.places.map(place => (
                                <a
                                  key={place.name}
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.q)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group flex flex-col gap-2 rounded-[16px] border border-black/25 bg-black/5 p-4 hover:border-red-600/50 hover:shadow-md transition-all"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="text-sm font-semibold text-black leading-snug group-hover:text-red-600 transition-colors">
                                        {place.name}
                                      </div>
                                      <span className="mt-1 inline-flex rounded-full bg-red-600/[0.08] px-2.5 py-0.5 text-xs font-medium text-red-600">
                                        {place.cat}
                                      </span>
                                    </div>
                                    <div className="shrink-0 rounded-xl bg-white p-1.5 text-black/50 group-hover:bg-red-600/[0.08] group-hover:text-red-600 transition-colors">
                                      <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-black/50">
                                    <Star className="h-3 w-3 fill-red-600 text-red-600" />
                                    <span className="font-medium text-black/75">{place.rating}</span>
                                    <span>({place.reviews})</span>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: FAQ ────────────────────────────────────────────────── */}
          {activeTab === "faq" && (
            <div className="px-4 py-5 md:px-8 md:py-8">
              <div className="rounded-[28px] border border-black/25 bg-black/5 p-5 md:p-6">
                <SectionTitle eyebrow="FAQ" title="Wichtige Infos zur Reise" text="Verhaltenstipps, kulturelle Besonderheiten und Notfallkontakte auf einen Blick." />

                <div className="space-y-3">

                  {/* ── Dos & Don'ts ── */}
                  {[{ id: "dos" }, { id: "notfall" }].map(({ id }) => {
                    const open = expandedFaqs.has(id);
                    const isDos = id === "dos";
                    return (
                      <div key={id} className="overflow-hidden rounded-[20px] border border-black/25 bg-white">
                        <button
                          onClick={() => toggleFaq(id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-black/5 min-h-[60px]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                              {isDos ? <BookOpen className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                              <div className="text-base font-semibold text-black">
                                {isDos ? "Dos und Donts in Japan" : "Wichtige Nummern & Notfallkontakte"}
                              </div>
                              <div className="text-xs text-black/50 mt-0.5">
                                {isDos ? "Verhaltenstipps, Trinkgeld, kulturelle Besonderheiten" : "Polizei, Krankenwagen, Deutsche Botschaft u. v. m."}
                              </div>
                            </div>
                          </div>
                          {open ? <ChevronUp className="h-4 w-4 shrink-0 text-black/50" /> : <ChevronDown className="h-4 w-4 shrink-0 text-black/50" />}
                        </button>

                        {open && isDos && (
                          <div className="border-t border-black/25 p-4 space-y-4">
                            {FAQ_DOS_CATEGORIES.map(cat => (
                              <div key={cat.label} className="rounded-2xl border border-black/25 bg-black/[0.03] p-4">
                                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">{cat.label}</div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">DOS</div>
                                    <ul className="space-y-1.5">
                                      {cat.dos.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-black/75 leading-snug">
                                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50">DONTS</div>
                                    <ul className="space-y-1.5">
                                      {cat.donts.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-black/75 leading-snug">
                                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600/50" />
                                          {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {open && !isDos && (
                          <div className="border-t border-black/25 p-4 space-y-3">
                            {EMERGENCY_CONTACTS.map(c => (
                              <div key={c.label} className="rounded-2xl border border-black/25 bg-black/[0.03] px-4 py-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600 mb-0.5">{c.label}</div>
                                    <div className="text-base font-bold text-black tabular-nums">{c.number}</div>
                                    <div className="mt-0.5 text-xs text-black/50 leading-snug">{c.note}</div>
                                  </div>
                                  {c.href && (
                                    <a href={c.href} target="_blank" rel="noreferrer"
                                       className="shrink-0 rounded-full border border-black/25 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:border-red-600/50 transition">
                                      Web ↗
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}

                            <div className="rounded-2xl bg-red-600/[0.06] border border-red-600/25 px-4 py-3">
                              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600 mb-1">Tipp</div>
                              <p className="text-xs text-black/75 leading-snug">Nummern als Screenshot speichern – bei fehlendem Mobilempfang oder leerer Batterie trotzdem griffbereit.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
