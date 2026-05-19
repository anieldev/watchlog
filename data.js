export const CATEGORY_OPTIONS = [
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

export const COUNTRY_OPTIONS = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" }
];

export const WATCH_ITEMS = [
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    kind: "movie",
    releaseYear: 2024,
    watchStatus: "watched",
    watchedDate: "2026-05-18",
    runtime: { minutes: 166 },
    categories: ["Adventure", "Drama", "Sci-fi"],
    countries: ["US"],
    synopsis:
      "Paul Atreides joins the Fremen and moves deeper into prophecy, revenge, and political power on Arrakis.",
    credits: {
      cast: [
        { name: "Timothee Chalamet", role: "Paul Atreides" },
        { name: "Zendaya", role: "Chani" },
        { name: "Rebecca Ferguson", role: "Lady Jessica" }
      ],
      staff: [
        { job: "Director", name: "Denis Villeneuve" },
        { job: "Composer", name: "Hans Zimmer" },
        { job: "Cinematography", name: "Greig Fraser" }
      ]
    },
    production: {
      studios: ["Legendary Pictures"],
      languages: ["English"],
      release: "2024"
    },
    assets: { posterColor: "#57534e" }
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    kind: "anime",
    releaseYear: 2023,
    watchStatus: "completed",
    watchedDate: "2026-05-12",
    runtime: { episodes: 28, minutesPerEpisode: 24 },
    categories: ["Adventure", "Animation", "Drama", "Fantasy"],
    countries: ["JP"],
    synopsis:
      "An elf mage revisits the meaning of companionship after her hero party's journey has already ended.",
    credits: {
      cast: [
        { name: "Atsumi Tanezaki", role: "Frieren" },
        { name: "Kana Ichinose", role: "Fern" },
        { name: "Nobuhiko Okamoto", role: "Stark" }
      ],
      staff: [
        { job: "Director", name: "Keiichiro Saito" },
        { job: "Series composition", name: "Tomohiro Suzuki" },
        { job: "Music", name: "Evan Call" }
      ]
    },
    production: {
      studios: ["Madhouse"],
      languages: ["Japanese"],
      release: "2023"
    },
    assets: { posterColor: "#3f4f3a" }
  },
  {
    id: "severance",
    title: "Severance",
    kind: "show",
    releaseYear: 2022,
    watchStatus: "caught up",
    watchedDate: "2026-04-29",
    runtime: { seasons: 2, episodes: 19 },
    categories: ["Drama", "Mystery", "Sci-fi", "Thriller"],
    countries: ["US"],
    synopsis:
      "Workers at Lumon split their memories between office and home, creating a pristine corporate nightmare.",
    credits: {
      cast: [
        { name: "Adam Scott", role: "Mark Scout" },
        { name: "Britt Lower", role: "Helly R." },
        { name: "Patricia Arquette", role: "Harmony Cobel" }
      ],
      staff: [
        { job: "Creator", name: "Dan Erickson" },
        { job: "Director", name: "Ben Stiller" },
        { job: "Composer", name: "Theodore Shapiro" }
      ]
    },
    production: {
      studios: ["Fifth Season", "Red Hour Productions"],
      languages: ["English"],
      release: "2022"
    },
    assets: { posterColor: "#334155" }
  },
  {
    id: "perfect-days",
    title: "Perfect Days",
    kind: "movie",
    releaseYear: 2023,
    watchStatus: "watched",
    watchedDate: "2026-04-16",
    runtime: { minutes: 124 },
    categories: ["Drama"],
    countries: ["JP", "DE"],
    synopsis:
      "A Tokyo cleaner moves through daily rituals, small disruptions, music, trees, books, and solitude.",
    credits: {
      cast: [
        { name: "Koji Yakusho", role: "Hirayama" },
        { name: "Tokio Emoto", role: "Takashi" },
        { name: "Arisa Nakano", role: "Niko" }
      ],
      staff: [
        { job: "Director", name: "Wim Wenders" },
        { job: "Writer", name: "Wim Wenders, Takuma Takasaki" },
        { job: "Cinematography", name: "Franz Lustig" }
      ]
    },
    production: {
      studios: ["Master Mind"],
      languages: ["Japanese"],
      release: "2023"
    },
    assets: { posterColor: "#5f5747" }
  },
  {
    id: "scavengers-reign",
    title: "Scavengers Reign",
    kind: "show",
    releaseYear: 2023,
    watchStatus: "completed",
    watchedDate: "2026-03-24",
    runtime: { episodes: 12, minutesPerEpisode: 24 },
    categories: ["Adventure", "Animation", "Drama", "Sci-fi"],
    countries: ["US"],
    synopsis:
      "Stranded survivors move through an alien ecosystem that feels beautiful, brutal, and indifferent.",
    credits: {
      cast: [
        { name: "Sunita Mani", role: "Ursula" },
        { name: "Wunmi Mosaku", role: "Azi" },
        { name: "Alia Shawkat", role: "Levi" }
      ],
      staff: [
        { job: "Creators", name: "Joseph Bennett, Charles Huettner" },
        { job: "Music", name: "Nicolas Snyder" },
        { job: "Studio", name: "Titmouse" }
      ]
    },
    production: {
      studios: ["Green Street Pictures", "Titmouse"],
      languages: ["English"],
      release: "2023"
    },
    assets: { posterColor: "#4b4039" }
  },
  {
    id: "pluto",
    title: "Pluto",
    kind: "anime",
    releaseYear: 2023,
    watchStatus: "completed",
    watchedDate: "2026-02-09",
    runtime: { episodes: 8, minutesPerEpisode: 60 },
    categories: ["Animation", "Mystery", "Sci-fi", "Thriller"],
    countries: ["JP"],
    synopsis:
      "A robot detective investigates murders tied to war, grief, and the world's most advanced robots.",
    credits: {
      cast: [
        { name: "Shinshu Fuji", role: "Gesicht" },
        { name: "Yoko Hikasa", role: "Atom" },
        { name: "Minori Suzuki", role: "Uran" }
      ],
      staff: [
        { job: "Director", name: "Toshio Kawaguchi" },
        { job: "Original", name: "Naoki Urasawa, Osamu Tezuka" },
        { job: "Music", name: "Yugo Kanno" }
      ]
    },
    production: {
      studios: ["Studio M2"],
      languages: ["Japanese"],
      release: "2023"
    },
    assets: { posterColor: "#3f4752" }
  },
  {
    id: "past-lives",
    title: "Past Lives",
    kind: "movie",
    releaseYear: 2023,
    watchStatus: "watched",
    watchedDate: "2026-02-22",
    runtime: { minutes: 106 },
    categories: ["Drama", "Romance"],
    countries: ["US", "KR"],
    synopsis:
      "Two childhood friends reconnect across decades and continents, sitting with the life that did not happen.",
    credits: {
      cast: [
        { name: "Greta Lee", role: "Nora" },
        { name: "Teo Yoo", role: "Hae Sung" },
        { name: "John Magaro", role: "Arthur" }
      ],
      staff: [
        { job: "Director", name: "Celine Song" },
        { job: "Writer", name: "Celine Song" },
        { job: "Cinematography", name: "Shabier Kirchner" }
      ]
    },
    production: {
      studios: ["A24"],
      languages: ["English", "Korean"],
      release: "2023"
    },
    assets: { posterColor: "#4c4a58" }
  },
  {
    id: "millennium-actress",
    title: "Millennium Actress",
    kind: "anime",
    releaseYear: 2001,
    watchStatus: "watched",
    watchedDate: "2026-03-11",
    runtime: { minutes: 87 },
    categories: ["Animation", "Drama", "Fantasy"],
    countries: ["JP"],
    synopsis:
      "A documentary interview becomes a chase through a retired actor's memories, roles, and eras.",
    credits: {
      cast: [
        { name: "Miyoko Shoji", role: "Chiyoko Fujiwara" },
        { name: "Mami Koyama", role: "Chiyoko Fujiwara" },
        { name: "Fumiko Orikasa", role: "Chiyoko Fujiwara" }
      ],
      staff: [
        { job: "Director", name: "Satoshi Kon" },
        { job: "Writer", name: "Satoshi Kon, Sadayuki Murai" },
        { job: "Music", name: "Susumu Hirasawa" }
      ]
    },
    production: {
      studios: ["Madhouse"],
      languages: ["Japanese"],
      release: "2001"
    },
    assets: { posterColor: "#6b3f4a" }
  }
];
