import fs from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "data.js");

const WATCHED_DATE = "2026-05-19";
const USER_AGENT = "Watchlog local metadata importer (personal catalog)";

const rawList = `
Movies

the silence of the lambs
the prestige
the game
the shawshank redemption
the good, the bad, and the ugly
the patriot
runner runner
catch me if you can
deja vu
reservoir dogs
training day
minority report
inside man
the book of eli
vanilla sky
war of the worlds
oblivion
american gangster
edge of tomorrow
source code
seven
the departed
good fellas
shutter island
gone girl
limitless
anna (2014)
the outpost
mile 22
extraction
homefront
the old guard
6 underground
daredevil
annihilation
takers
no escape
polar
from paris with love
the girl with the dragon tattoo
the others
the social network
apocalypto
10,000 BC
300
sicario
monsters of man
in the shadow of the moon
anon
passengers
dead man down
girl, interrupted
awake
all the old knives
constantine
castaway
the recruit
mad max fury road
the day after tomorrow
the day the earth stood still
greenland
dune
tenet
interstellar
inception
gladiator
unbroken
the happening
life of pi
i am legend
ender's game
rango
the water horse legend of the deep
ex-machina
equilibrium
the bank job
dracula untold
irobot
get the gringo
from dusk till dawn
gattaca
flight
the talented mr. ripley
bird box
meet joe black
the pianist
heat
shooter
king arthur
paycheck
blood diamond
the platform (2019)
the black stallion (1979)
old yeller (1957)
homeward bound the incredible journey
zone 414
cowboys & aliens
beasts of no nation
the king
valerian and the city of a thousand planets
twelve monkeys
the lovely bones
life (2017)
bullet train
the northman
the man in the iron mask
hunter killer
pride and prejudice
all quiet on the western front
the creator (2023)
world war z
salt
exodus: gods and kings
stay
65
wolf (1994)
plane
the judge
predestination
z for zachariah
the salvation
kingdom of heaven
leave the world behind
rebel ridge
in time
wolfs (2024)
the edge
shadow (2018)
the swordsman (2020)
requiem for a dream
aeon flux
the menu
count of monte cristo
den of thieves
den of thieves 2: pantera
the gorge
troy
to catch a killer
allied
burnt
no tears for the dead
hostiles
mystic river
hero (2002)
relay
dark city
wake up dead man: a knives out mystery
drive
predator: badlands
riddick
underworld
hell boy
skyfall
jason bourne
kill bill
brother bear
the fox and the hound
balto

Shows

prison break
house md
mr. robot
halt and catch fire
mad men
game of thrones
dexter
the mentalist
white collar
money heist
graceland
altered carbon
lost
ted lasso
suits
the vampire diaries
the originals
the witcher
the queen's gambit
zerozerozero
billions
ragnarok
bodyguard
the fall of the house of usher
the umbrella academy
bodies
the recruit
the night agent
the bastard son and the devil himself
the gentlemen
shogun
the peripheral
foundation
raised by wolves
dark matter
sugar
luther
presumed innocent
peaky blinders
gangs of london
monsieur spade
warrior
the agency
silo
black doves
squid game
alice in borderland
the fall
taboo
the night manager
adolescence
second sight
mare of easttown
banshee
alien:earth
landman
jin
pursuit of jade
my journey to you
the double
delightfully deceitful
flower of evil

Anime

Dragon Ball Z
Cyberpunk: Edgerunners
Sword Art Online
Hunter x Hunter
Steins;Gate
Naruto
Avatar: The Last Airbender
The Legend of Korra
Cowboy Bebop
Death Note
Attack On Titan
Neon Genesis Evangelion
The Promised Neverland
Solo Leveling
7th Time Loop
Classroom of the Elite
Code Geass
Blame!
The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat
I Got a Cheat Skill in Another World and Became Unrivaled in The Real World, Too
Death March to the Parallel World Rhapsody
Unnamed Memory
The New Gate
Berserk of Gluttony
Our Last Crusade or the Rise of a New World
The Asterisk War
Guilty Crown
Wise Man's Grandchild
Kaguya-sama: Love is War
Pantheon
I'm a Noble on the Brink of Ruin, So I Might as Well Try Mastering Magic
Re:Zero Starting Life in Another World
Berserk
Lord of Mysteries
Dragon Raja - The Blazing Dawn
the beginning after the end
`;

const CATEGORY_OPTIONS = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Fantasy",
  "Mystery",
  "Romance",
  "Sci-fi",
  "Thriller"
];

const COUNTRY_OPTIONS = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" }
];

const countryCodeByName = new Map(COUNTRY_OPTIONS.map(country => [country.name.toLowerCase(), country.code]));
countryCodeByName.set("united states of america", "US");
countryCodeByName.set("u.s.", "US");
countryCodeByName.set("uk", "GB");
countryCodeByName.set("united kingdom", "GB");
countryCodeByName.set("people's republic of china", "CN");
countryCodeByName.set("south korea", "KR");
countryCodeByName.set("republic of korea", "KR");
countryCodeByName.set("hong kong", "HK");
countryCodeByName.set("soviet union", "RU");

const countryByDemonym = [
  ["American", "US"],
  ["British", "GB"],
  ["English", "GB"],
  ["French", "FR"],
  ["Italian", "IT"],
  ["Spanish", "ES"],
  ["Mexican", "MX"],
  ["Canadian", "CA"],
  ["Australian", "AU"],
  ["Chinese", "CN"],
  ["Hong Kong", "HK"],
  ["Japanese", "JP"],
  ["South Korean", "KR"],
  ["Korean", "KR"],
  ["German", "DE"],
  ["Danish", "DK"],
  ["Norwegian", "NO"],
  ["Swedish", "SE"],
  ["Irish", "IE"],
  ["Indian", "IN"]
];

const manualQuery = new Map(Object.entries({
  "movie:anna (2014)": "Anna 2013 film Mindscape",
  "movie:balto": "Balto 1995 film",
  "movie:brother bear": "Brother Bear 2003 film",
  "movie:castaway": "Cast Away 2000 film",
  "movie:good fellas": "Goodfellas",
  "movie:hell boy": "Hellboy 2004 film",
  "movie:irobot": "I, Robot 2004 film",
  "movie:kill bill": "Kill Bill Volume 1",
  "movie:count of monte cristo": "The Count of Monte Cristo 2002 film",
  "movie:drive": "Drive 2011 film",
  "movie:dune": "Dune 2021 film",
  "movie:all quiet on the western front": "All Quiet on the Western Front 2022 film",
  "movie:the day the earth stood still": "The Day the Earth Stood Still 2008 film",
  "movie:the edge": "The Edge 1997 film",
  "movie:the judge": "The Judge 2014 film",
  "movie:the king": "The King 2019 film",
  "movie:the patriot": "The Patriot 2000 film",
  "movie:the recruit": "The Recruit 2003 film",
  "movie:pride and prejudice": "Pride & Prejudice 2005 film",
  "movie:plane": "Plane 2023 film",
  "movie:stay": "Stay 2005 film",
  "movie:underworld": "Underworld 2003 film",
  "movie:war of the worlds": "War of the Worlds 2005 film",
  "movie:life (2017)": "Life 2017 film",
  "movie:hero (2002)": "Hero 2002 film",
  "movie:shadow (2018)": "Shadow 2018 film",
  "movie:the platform (2019)": "The Platform 2019 film",
  "movie:wolf (1994)": "Wolf 1994 film",
  "show:bodyguard": "Bodyguard British TV series",
  "show:dark matter": "Dark Matter 2024 TV series",
  "show:the recruit": "The Recruit 2022 TV series",
  "show:the fall": "The Fall British Irish TV series",
  "show:shogun": "Shogun 2024 TV series",
  "show:the agency": "The Agency 2024 TV series",
  "show:alien:earth": "Alien: Earth television series",
  "show:jin": "Jin Japanese television drama",
  "anime:7th time loop": "7th Time Loop anime",
  "anime:blame!": "Blame! 2017 film",
  "anime:berserk": "Berserk 1997 anime",
  "anime:dragon raja - the blazing dawn": "Dragon Raja anime",
  "anime:lord of mysteries": "Lord of Mysteries donghua",
  "anime:the beginning after the end": "The Beginning After the End anime"
}));

const manualYears = new Map(Object.entries({
  "movie:anna (2014)": 2014,
  "movie:den of thieves 2: pantera": 2025,
  "movie:the gorge": 2025,
  "movie:wake up dead man: a knives out mystery": 2025,
  "movie:predator: badlands": 2025,
  "movie:relay": 2024,
  "show:alien:earth": 2025,
  "show:the agency": 2024,
  "show:adolescence": 2025,
  "anime:lord of mysteries": 2025,
  "anime:the beginning after the end": 2025
}));

function normalizeTitle(value) {
  return value
    .normalize("NFKD")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, "\"")
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parseList(raw) {
  const entries = [];
  let kind = "";
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (lower === "movies") {
      kind = "movie";
      continue;
    }
    if (lower === "shows") {
      kind = "show";
      continue;
    }
    if (lower === "anime") {
      kind = "anime";
      continue;
    }
    entries.push({ title: trimmed, kind });
  }
  return entries;
}

function titleCase(value) {
  const small = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "nor", "of", "on", "or", "the", "to", "with"]);
  return value
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word, index) => {
      if (/^[A-Z0-9:&.!'-]+$/.test(word) && /[A-Z]/.test(word)) return word;
      const lower = word.toLowerCase();
      if (index > 0 && small.has(lower)) return lower;
      return lower.replace(/(^|[-'/:])([a-z])/g, (_, sep, char) => `${sep}${char.toUpperCase()}`);
    })
    .join(" ")
    .replace(/\bMd\b/g, "M.D.")
    .replace(/\bMr\.\b/g, "Mr.")
    .replace(/\bIrobot\b/g, "I, Robot")
    .replace(/\bEx-Machina\b/g, "Ex Machina")
    .replace(/\bAeon Flux\b/g, "Aeon Flux")
    .replace(/'S\b/g, "'s")
    .replace(/\bI'M\b/g, "I'm");
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

function hashColor(seed) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const hue = hash % 360;
  return hslToHex(hue, 28, 36);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${[f(0), f(8), f(4)].map(x => Math.round(255 * x).toString(16).padStart(2, "0")).join("")}`;
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: AbortSignal.timeout(8000)
      });
      if (response.ok) return response.json();
      if (response.status === 404) return null;
      const retryAfter = Number(response.headers.get("retry-after") || 0);
      const backoff = retryAfter ? retryAfter * 1000 : 600 * attempt + Math.floor(Math.random() * 250);
      if (attempt === 5) console.warn(`  ${response.status} ${response.statusText}: ${url}`);
      await sleep(backoff);
    } catch (error) {
      if (attempt === 5) console.warn(`  ${error.name || "FetchError"}: ${url}`);
      await sleep(500 * attempt);
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withTimeout(promise, ms) {
  return Promise.race([promise, sleep(ms).then(() => null)]);
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function concise(value = "", fallback = "") {
  const text = stripHtml(value || fallback);
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  const short = sentences ? sentences.slice(0, 2).join(" ") : text;
  return short.length > 280 ? `${short.slice(0, 277).trim()}...` : short.trim();
}

function categoriesFromGenres(genres = [], kind = "") {
  const text = genres.join(" ").toLowerCase();
  const categories = new Set();
  if (kind === "anime" || text.includes("animation") || text.includes("anime")) categories.add("Animation");
  if (/(action|martial|superhero|war|military|samurai|western|spy)/.test(text)) categories.add("Action");
  if (/(adventure|quest|survival|road|space|pirate)/.test(text)) categories.add("Adventure");
  if (/(comedy|sitcom|satire|humor|funny)/.test(text)) categories.add("Comedy");
  if (/(drama|historical|biograph|coming-of-age|slice of life|crime)/.test(text)) categories.add("Drama");
  if (/(fantasy|supernatural|myth|magic|isekai|fairy|vampire)/.test(text)) categories.add("Fantasy");
  if (/(mystery|detective|whodunit|noir)/.test(text)) categories.add("Mystery");
  if (/(romance|romantic|love)/.test(text)) categories.add("Romance");
  if (/(science fiction|sci-fi|sci fi|cyberpunk|dystop|space|future|mecha|robot|time travel|post-apocalyptic)/.test(text)) categories.add("Sci-fi");
  if (/(thriller|suspense|horror|psychological|crime|neo-noir|noir|disaster|survival)/.test(text)) categories.add("Thriller");
  if (!categories.size) categories.add(kind === "anime" ? "Animation" : "Drama");
  return [...categories].slice(0, 4);
}

function countriesFromNames(names = [], fallback = "US") {
  const countries = names
    .map(name => countryCodeByName.get(String(name).toLowerCase()))
    .filter(Boolean);
  return [...new Set(countries)].slice(0, 3).length ? [...new Set(countries)].slice(0, 3) : [fallback];
}

function languagesFromNames(names = []) {
  return [...new Set(names.filter(Boolean).map(name => String(name).replace(/^.+ language$/i, "$&")))].slice(0, 3);
}

function yearFromTime(value) {
  const match = String(value || "").match(/[+-]?(\d{4})/);
  return match ? Number(match[1]) : undefined;
}

function commonsImageUrl(filename) {
  return filename ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=360` : undefined;
}

function claimValues(entity, property) {
  return (entity.claims?.[property] || [])
    .map(claim => claim.mainsnak?.datavalue?.value)
    .filter(Boolean);
}

function entityIdsFromClaims(entity, properties) {
  const ids = [];
  for (const property of properties) {
    for (const value of claimValues(entity, property)) {
      if (value["entity-type"] === "item" && value.id) ids.push(value.id);
    }
  }
  return [...new Set(ids)];
}

async function fetchEntityLabels(ids) {
  const labels = new Map();
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.search = new URLSearchParams({
      action: "wbgetentities",
      ids: chunk.join("|"),
      props: "labels",
      languages: "en",
      format: "json",
      origin: "*"
    });
    const data = await fetchJson(url);
    for (const [id, entity] of Object.entries(data?.entities || {})) {
      labels.set(id, entity.labels?.en?.value || id);
    }
  }
  return labels;
}

async function searchWikidata(entry) {
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const baseQuery = manualQuery.get(key) || entry.title.replace(/\s*\(\d{4}\)\s*$/, "");
  const suffix = entry.kind === "movie" ? " film" : entry.kind === "show" ? " television series" : " anime";
  const queries = [...new Set([baseQuery, `${baseQuery}${suffix}`])];
  const results = [];

  for (const query of queries) {
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.search = new URLSearchParams({
      action: "wbsearchentities",
      search: query,
      language: "en",
      format: "json",
      limit: "12",
      origin: "*"
    });
    const data = await fetchJson(url);
    for (const result of data?.search || []) results.push(result);
  }

  const ids = [...new Set(results.map(result => result.id))];
  if (!ids.length) return null;

  const url = new URL("https://www.wikidata.org/w/api.php");
  url.search = new URLSearchParams({
    action: "wbgetentities",
    ids: ids.join("|"),
    props: "labels|descriptions|claims|sitelinks",
    languages: "en",
    format: "json",
    origin: "*"
  });
  const data = await fetchJson(url);
  const entities = Object.values(data?.entities || {});
  const scored = entities
    .filter(entity => !entity.missing)
    .map(entity => ({ entity, score: scoreWikidata(entity, entry) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].entity : null;
}

function scoreWikidata(entity, entry) {
  const label = normalizeTitle(entity.labels?.en?.value || "");
  const wanted = normalizeTitle(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""));
  const description = String(entity.descriptions?.en?.value || "").toLowerCase();
  const instances = entityIdsFromClaims(entity, ["P31"]);
  let score = 0;

  if (label === wanted) score += 50;
  if (label.includes(wanted) || wanted.includes(label)) score += 15;
  if (entry.kind === "movie" && (description.includes("film") || instances.includes("Q11424"))) score += 80;
  if (entry.kind === "show" && /(television|tv|series|miniseries)/.test(description)) score += 80;
  if (entry.kind === "anime" && /(anime|animated|television series|film)/.test(description)) score += 65;
  if (/\b(book|novel|album|song|soundtrack|episode|edition|scientific article|disambiguation|character)\b/.test(description)) score -= 80;

  const manualYear = manualYears.get(`${entry.kind}:${normalizeTitle(entry.title)}`);
  const releaseYear = yearFromTime(claimValues(entity, "P577")[0]?.time) || yearFromTime(claimValues(entity, "P580")[0]?.time);
  if (manualYear && releaseYear === manualYear) score += 20;
  if (manualYear && releaseYear && releaseYear !== manualYear) score -= 20;

  return score;
}

async function wikidataRecord(entry) {
  const entity = await searchWikidata(entry);
  if (!entity) return null;

  const ids = entityIdsFromClaims(entity, ["P136", "P495", "P364", "P57", "P58", "P161", "P86", "P344", "P170", "P272", "P449", "P750"]);
  const labels = await fetchEntityLabels(ids);
  const namesFor = property => entityIdsFromClaims(entity, [property]).map(id => labels.get(id) || id);
  const releaseYear =
    manualYears.get(`${entry.kind}:${normalizeTitle(entry.title)}`) ||
    yearFromTime(claimValues(entity, "P577")[0]?.time) ||
    yearFromTime(claimValues(entity, "P580")[0]?.time) ||
    yearFromTitle(entry.title) ||
    2026;
  const genreLabels = namesFor("P136");
  const countryLabels = namesFor("P495");
  const languageLabels = namesFor("P364");
  const cast = namesFor("P161").slice(0, 3).map(name => ({ name, role: "Cast" }));
  const staff = [];

  for (const name of namesFor("P57").slice(0, 2)) staff.push({ job: "Director", name });
  for (const name of namesFor("P170").slice(0, 2)) staff.push({ job: "Creator", name });
  for (const name of namesFor("P58").slice(0, 1)) staff.push({ job: "Writer", name });
  for (const name of namesFor("P86").slice(0, 1)) staff.push({ job: "Music", name });
  for (const name of namesFor("P344").slice(0, 1)) staff.push({ job: "Cinematography", name });

  const duration = claimValues(entity, "P2047")[0];
  const minutes = duration?.amount ? Math.round(Number(duration.amount)) : undefined;
  const episodes = Number(claimValues(entity, "P1113")[0]?.amount || 0) || undefined;
  const seasons = Number(claimValues(entity, "P2437")[0]?.amount || 0) || undefined;
  const wikiTitle = entity.sitelinks?.enwiki?.title;
  const summary = wikiTitle ? await wikipediaSummary(wikiTitle) : null;
  const commonsImage = claimValues(entity, "P18")[0];
  const title = entity.labels?.en?.value || titleCase(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""));

  return completeRecord(entry, {
    title,
    releaseYear,
    runtime: runtimeFor(entry.kind, { minutes, episodes, seasons }),
    categories: categoriesFromGenres(genreLabels, entry.kind),
    countries: countriesFromNames(countryLabels, entry.kind === "anime" ? "JP" : "US"),
    synopsis: concise(summary?.extract, entity.descriptions?.en?.value || ""),
    posterImage: summary?.thumbnail?.source || summary?.originalimage?.source || commonsImageUrl(commonsImage),
    cast,
    staff,
    studios: [...new Set([...namesFor("P272"), ...namesFor("P449"), ...namesFor("P750")])].slice(0, 3),
    languages: languagesFromNames(languageLabels)
  });
}

async function wikipediaSummary(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = await fetchJson(url);
  return data;
}

async function wikipediaSearch(entry) {
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const title = entry.title.replace(/\s*\(\d{4}\)\s*$/, "");
  const manual = manualQuery.get(key);
  const year = manualYears.get(key) || yearFromTitle(entry.title);
  const query = manual || `${title}${year ? ` ${year}` : ""} ${entry.kind === "movie" ? "film" : ""}`.trim();
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: "8",
    format: "json",
    origin: "*"
  });
  const data = await fetchJson(url);
  return data?.query?.search || [];
}

function parseNames(value = "") {
  return value
    .replace(/\([^)]*\)/g, "")
    .split(/,\s*|\s+and\s+/i)
    .map(name => name.trim())
    .filter(name => name && name.length < 42)
    .slice(0, 3);
}

function countriesFromExtract(extract = "", fallback = "US") {
  const countries = [];
  for (const [demonym, code] of countryByDemonym) {
    if (new RegExp(`\\b${demonym}\\b`, "i").test(extract)) countries.push(code);
  }
  return [...new Set(countries)].slice(0, 3).length ? [...new Set(countries)].slice(0, 3) : [fallback];
}

function yearFromSummary(summary, fallback) {
  if (fallback) return fallback;
  const fromTitle = yearFromTitle(summary?.title || "");
  if (fromTitle) return fromTitle;
  const text = `${summary?.description || ""} ${summary?.extract || ""}`;
  const filmYear = text.match(/\b(19\d{2}|20\d{2})\b(?=[^.\n]{0,90}\b(?:film|movie|television|series)\b)/i);
  return filmYear ? Number(filmYear[1]) : Number(text.match(/\b(19\d{2}|20\d{2})\b/)?.[1]) || undefined;
}

function wikipediaTitleCandidates(entry) {
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const cleanTitle = entry.title.replace(/\s*\(\d{4}\)\s*$/, "");
  const manual = manualQuery.get(key);
  const year = manualYears.get(key) || yearFromTitle(entry.title);
  const candidates = [];
  const add = value => {
    if (value && !candidates.includes(value)) candidates.push(value);
  };
  if (manual) {
    const manualYearFilm = manual.match(/^(.+?)\s+(\d{4})\s+film$/i);
    add(manualYearFilm ? `${manualYearFilm[1]} (${manualYearFilm[2]} film)` : manual);
  }
  if (year) add(`${titleCase(cleanTitle)} (${year} film)`);
  add(titleCase(cleanTitle));
  return candidates;
}

function isUsableMovieSummary(summary, entry) {
  if (!summary?.extract || summary.type === "disambiguation") return false;
  const wanted = normalizeTitle(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""));
  const summaryTitle = normalizeTitle(String(summary.title || "").replace(/\s*\([^)]*\)/g, " "));
  const text = `${summary.title || ""} ${summary.description || ""} ${summary.extract || ""}`.toLowerCase();
  if (/\bnovel\b|\bbook\b|\balbum\b|\bsong\b|\bepisode\b|\bvideo game\b|\bdisambiguation\b/.test(text) && !/\bfilm\b|\bmovie\b/.test(text)) {
    return false;
  }
  return /\bfilm\b|\bmovie\b/.test(text) || summaryTitle === wanted;
}

async function wikipediaRecord(entry) {
  if (entry.kind !== "movie") return null;
  let summary = null;
  for (const candidate of wikipediaTitleCandidates(entry)) {
    const candidateSummary = await wikipediaSummary(candidate);
    if (isUsableMovieSummary(candidateSummary, entry)) {
      summary = candidateSummary;
      break;
    }
  }

  if (!summary) {
    const results = await wikipediaSearch(entry);
    if (!results.length) return null;
    const wanted = normalizeTitle(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""));
    const selected = results
      .map(result => {
        const title = normalizeTitle(result.title.replace(/\s*\([^)]*\)\s*/g, " "));
        const text = `${result.title} ${stripHtml(result.snippet || "")}`.toLowerCase();
        let score = title === wanted ? 100 : 0;
        if (title.includes(wanted) || wanted.includes(title)) score += 30;
        if (/\bfilm\b|\bmovie\b/.test(text)) score += 60;
        if (/\bnovel\b|\bbook\b|\balbum\b|\bsong\b|\bepisode\b|\bvideo game\b|\bdisambiguation\b/.test(text)) score -= 70;
        return { result, score };
      })
      .sort((a, b) => b.score - a.score)[0]?.result;
    if (!selected) return null;
    summary = await wikipediaSummary(selected.title);
  }

  if (!summary?.extract) return null;

  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const releaseYear = yearFromSummary(summary, manualYears.get(key) || yearFromTitle(entry.title)) || 2026;
  const extract = summary.extract;
  const director = extract.match(/directed by ([^.;,]+(?:,\s*[^.;,]+)?)/i)?.[1];
  const writer = extract.match(/written by ([^.;]+?)(?:\.| and |, and |, starring | starring )/i)?.[1];
  const stars = extract.match(/stars? ([^.;]+?)(?:\.| The film| It | and follows | as )/i)?.[1];
  const staff = [];
  for (const name of parseNames(director)) staff.push({ job: "Director", name });
  for (const name of parseNames(writer).slice(0, 1)) staff.push({ job: "Writer", name });

  return completeRecord(entry, {
    title: summary.title?.replace(/\s*\(\d{4} film\)$/i, "") || titleCase(entry.title),
    releaseYear,
    runtime: runtimeFor(entry.kind, {}),
    categories: categoriesFromGenres([summary.description || "", extract], entry.kind),
    countries: countriesFromExtract(extract),
    synopsis: concise(extract),
    posterImage: summary.thumbnail?.source || summary.originalimage?.source,
    cast: parseNames(stars).map(name => ({ name, role: "Cast" })),
    staff,
    studios: ["Unknown"],
    languages: ["English"]
  });
}

async function tvmazeRecord(entry) {
  if (entry.kind !== "show") return null;
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const query = manualQuery.get(key) || entry.title;
  const searchUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
  const search = await fetchJson(searchUrl);
  const candidates = (search || []).map(item => item.show).filter(Boolean);
  const wanted = normalizeTitle(entry.title);
  const show = candidates
    .map(candidate => {
      const names = [candidate.name, ...(candidate.externals?.thetvdb ? [] : [])].map(normalizeTitle);
      let score = names.includes(wanted) ? 100 : 0;
      if (normalizeTitle(candidate.name || "").includes(wanted)) score += 25;
      if (manualYears.get(key) && Number(candidate.premiered?.slice(0, 4)) === manualYears.get(key)) score += 25;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.candidate;
  if (!show) return null;

  const [castData, episodeData] = await Promise.all([
    fetchJson(`https://api.tvmaze.com/shows/${show.id}/cast`),
    fetchJson(`https://api.tvmaze.com/shows/${show.id}/episodes`)
  ]);
  const episodes = Array.isArray(episodeData) ? episodeData.length : undefined;
  const seasons = Array.isArray(episodeData) ? Math.max(...episodeData.map(ep => ep.season || 0), 0) || undefined : undefined;

  return completeRecord(entry, {
    title: show.name || titleCase(entry.title),
    releaseYear: manualYears.get(key) || Number(show.premiered?.slice(0, 4)) || yearFromTitle(entry.title) || 2026,
    runtime: runtimeFor(entry.kind, {
      episodes,
      seasons,
      minutesPerEpisode: show.averageRuntime || show.runtime || undefined
    }),
    categories: categoriesFromGenres(show.genres || [], entry.kind),
    countries: countriesFromNames([show.network?.country?.name || show.webChannel?.country?.name].filter(Boolean), "US"),
    synopsis: concise(show.summary, `${show.name || entry.title} is a ${show.genres?.join(", ").toLowerCase() || "drama"} series.`),
    posterImage: show.image?.medium || show.image?.original,
    cast: (castData || []).slice(0, 3).map(item => ({ name: item.person?.name || "Unknown", role: item.character?.name || "Cast" })),
    staff: [],
    studios: [show.network?.name || show.webChannel?.name].filter(Boolean),
    languages: [show.language].filter(Boolean)
  });
}

async function jikanRecord(entry) {
  if (entry.kind !== "anime") return null;
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const query = manualQuery.get(key) || entry.title;
  const search = await fetchJson(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`);
  const wanted = normalizeTitle(entry.title);
  const anime = (search?.data || [])
    .map(candidate => {
      const names = [candidate.title, candidate.title_english, candidate.title_japanese, ...(candidate.titles || []).map(item => item.title)]
        .filter(Boolean)
        .map(normalizeTitle);
      let score = names.includes(wanted) ? 100 : 0;
      if (names.some(name => name.includes(wanted) || wanted.includes(name))) score += 25;
      if (manualYears.get(key) && candidate.year === manualYears.get(key)) score += 25;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.candidate;
  if (!anime) return null;

  const genres = [...(anime.genres || []), ...(anime.themes || []), ...(anime.demographics || [])].map(item => item.name);

  return completeRecord(entry, {
    title: anime.title_english || anime.title || titleCase(entry.title),
    releaseYear: manualYears.get(key) || anime.year || yearFromTitle(entry.title) || yearFromTime(anime.aired?.from) || 2026,
    runtime: runtimeFor(entry.kind, {
      episodes: anime.episodes || undefined,
      minutesPerEpisode: Number(String(anime.duration || "").match(/(\d+)\s*min/i)?.[1]) || 24
    }),
    categories: categoriesFromGenres(genres, entry.kind),
    countries: ["JP"],
    synopsis: concise(anime.synopsis, `${anime.title || entry.title} is an anime title.`),
    posterImage: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.images?.webp?.large_image_url,
    cast: [],
    staff: [],
    studios: (anime.studios || []).map(item => item.name).slice(0, 3),
    languages: ["Japanese"]
  });
}

function runtimeFor(kind, values) {
  if (kind === "movie") return { minutes: values.minutes && values.minutes > 20 ? values.minutes : 100 };
  const runtime = {};
  if (values.seasons) runtime.seasons = values.seasons;
  if (values.episodes) runtime.episodes = values.episodes;
  runtime.minutesPerEpisode = values.minutesPerEpisode || (kind === "anime" ? 24 : 45);
  if (!runtime.episodes) runtime.episodes = kind === "anime" ? 12 : 8;
  return runtime;
}

function yearFromTitle(title) {
  const match = title.match(/\((\d{4})\)/);
  return match ? Number(match[1]) : undefined;
}

function completeRecord(entry, data) {
  const title = data.title || titleCase(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""));
  const staff = data.staff?.length ? data.staff : [{ job: entry.kind === "movie" ? "Director" : "Creator", name: "Unknown" }];
  const cast = data.cast?.length ? data.cast : [{ name: "Unknown", role: "Cast" }];
  const synopsis =
    data.synopsis ||
    `${title} is a ${data.releaseYear || yearFromTitle(entry.title) || 2026} ${entry.kind === "anime" ? "anime" : entry.kind} entry in this watchlist.`;

  return {
    id: slugify(title),
    title,
    kind: entry.kind,
    releaseYear: data.releaseYear || yearFromTitle(entry.title) || 2026,
    watchStatus: "planned",
    watchedDate: WATCHED_DATE,
    runtime: data.runtime || runtimeFor(entry.kind, {}),
    categories: data.categories?.length ? data.categories : categoriesFromGenres([], entry.kind),
    countries: data.countries?.length ? data.countries : [entry.kind === "anime" ? "JP" : "US"],
    synopsis,
    credits: {
      cast,
      staff: staff.slice(0, 4)
    },
    production: {
      studios: data.studios?.length ? data.studios : ["Unknown"],
      languages: data.languages?.length ? data.languages : [entry.kind === "anime" ? "Japanese" : "English"],
      release: String(data.releaseYear || yearFromTitle(entry.title) || 2026)
    },
    assets: {
      posterColor: hashColor(`${entry.kind}:${title}`),
      ...(data.posterImage ? { posterImage: data.posterImage } : {})
    }
  };
}

async function fallbackRecord(entry) {
  const key = `${entry.kind}:${normalizeTitle(entry.title)}`;
  const year = manualYears.get(key) || yearFromTitle(entry.title) || 2026;
  return completeRecord(entry, {
    title: titleCase(entry.title.replace(/\s*\(\d{4}\)\s*$/, "")),
    releaseYear: year,
    runtime: runtimeFor(entry.kind, {}),
    categories: categoriesFromGenres([], entry.kind),
    countries: [entry.kind === "anime" ? "JP" : "US"],
    synopsis: `${titleCase(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""))} is a ${year} ${entry.kind === "anime" ? "anime" : entry.kind} entry added from the requested watchlist.`,
    cast: [{ name: "Unknown", role: "Cast" }],
    staff: [{ job: entry.kind === "movie" ? "Director" : "Creator", name: "Unknown" }],
    studios: ["Unknown"],
    languages: [entry.kind === "anime" ? "Japanese" : "English"]
  });
}

async function buildRecord(entry, index, total) {
  const label = `${entry.kind}:${entry.title}`;
  console.log(`[${index + 1}/${total}] ${label}`);
  try {
    const apiRecord =
      entry.kind === "movie"
        ? await withTimeout(wikipediaRecord(entry), 4500)
        : (await withTimeout(tvmazeRecord(entry), 4500)) ||
          (await withTimeout(jikanRecord(entry), 4500)) ||
          (await withTimeout(wikipediaRecord(entry), 4500)) ||
          (await withTimeout(wikidataRecord(entry), 4500));
    if (apiRecord) return apiRecord;
  } catch (error) {
    console.warn(`  metadata lookup failed for ${label}: ${error.message}`);
  }
  return fallbackRecord(entry);
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  const runners = Array.from({ length: limit }, async () => {
    while (cursor < values.length) {
      const index = cursor++;
      results[index] = await worker(values[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

function uniquifyIds(items) {
  const seen = new Map();
  for (const item of items) {
    const base = item.id || slugify(item.title);
    const key = seen.get(base) || 0;
    seen.set(base, key + 1);
    item.id = key === 0 ? base : `${base}-${item.kind}`;
    while (seen.has(item.id) && seen.get(item.id) > 1) {
      const next = seen.get(base);
      seen.set(base, next + 1);
      item.id = `${base}-${item.kind}-${next}`;
    }
    seen.set(item.id, 1);
  }
  return items;
}

function itemKey(item) {
  return `${item.kind}:${normalizeTitle(item.title)}`;
}

function entryKey(entry) {
  return `${entry.kind}:${normalizeTitle(entry.title.replace(/\s*\(\d{4}\)\s*$/, ""))}`;
}

async function main() {
  const existingModule = await import(pathToFileURL(dataPath).href);
  const requested = parseList(rawList);
  const requestedKeys = new Set(requested.map(entryKey));
  const total = requested.length;
  const generated = await mapLimit(requested, 8, (entry, index) => buildRecord(entry, index, total));

  const byKey = new Map();
  for (const item of existingModule.WATCH_ITEMS) {
    if (!requestedKeys.has(itemKey(item))) byKey.set(itemKey(item), item);
  }
  for (const item of generated) {
    const key = itemKey(item);
    byKey.set(key, item);
  }

  const items = uniquifyIds([...byKey.values()]);
  const output = `export const CATEGORY_OPTIONS = ${JSON.stringify(CATEGORY_OPTIONS, null, 2)};\n\n` +
    `export const COUNTRY_OPTIONS = ${JSON.stringify(COUNTRY_OPTIONS, null, 2)};\n\n` +
    `export const WATCH_ITEMS = ${JSON.stringify(items, null, 2)};\n`;

  await fs.writeFile(dataPath, output);
  console.log(`Wrote ${items.length} total records (${generated.length} generated, ${existingModule.WATCH_ITEMS.length} existing preserved).`);
}

export { buildRecord, jikanRecord, parseList, tvmazeRecord, wikidataRecord, wikipediaRecord };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
