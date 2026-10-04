/* i18n.js — Lightweight Internationalization & Contextual Localization Engine for Fleximbols Browser.
 * Zero-dependency, ultra-fast, supporting 78 languages with country flags and native RTL direction.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FlexiI18n = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  "use strict";

  const LANGUAGES = [
  {
    "code": "en",
    "flag": "🇬🇧",
    "name": "English",
    "nativeName": "English",
    "dir": "ltr"
  },
  {
    "code": "es",
    "flag": "🇪🇸",
    "name": "Spanish",
    "nativeName": "Español",
    "dir": "ltr"
  },
  {
    "code": "fr",
    "flag": "🇫🇷",
    "name": "French",
    "nativeName": "Français",
    "dir": "ltr"
  },
  {
    "code": "de",
    "flag": "🇩🇪",
    "name": "German",
    "nativeName": "Deutsch",
    "dir": "ltr"
  },
  {
    "code": "it",
    "flag": "🇮🇹",
    "name": "Italian",
    "nativeName": "Italiano",
    "dir": "ltr"
  },
  {
    "code": "pt",
    "flag": "🇵🇹",
    "name": "Portuguese",
    "nativeName": "Português",
    "dir": "ltr"
  },
  {
    "code": "zhc",
    "flag": "🇨🇳",
    "name": "Chinese (Simplified)",
    "nativeName": "中文 (简体)",
    "dir": "ltr"
  },
  {
    "code": "zh",
    "flag": "🇹🇼",
    "name": "Chinese (Traditional)",
    "nativeName": "中文 (繁體)",
    "dir": "ltr"
  },
  {
    "code": "ja",
    "flag": "🇯🇵",
    "name": "Japanese",
    "nativeName": "日本語",
    "dir": "ltr"
  },
  {
    "code": "ko",
    "flag": "🇰🇷",
    "name": "Korean",
    "nativeName": "한국어",
    "dir": "ltr"
  },
  {
    "code": "ar",
    "flag": "🇸🇦",
    "name": "Arabic",
    "nativeName": "العربية",
    "dir": "rtl"
  },
  {
    "code": "hi",
    "flag": "🇮🇳",
    "name": "Hindi",
    "nativeName": "हिन्दी",
    "dir": "ltr"
  },
  {
    "code": "be",
    "flag": "🇧🇩",
    "name": "Bengali",
    "nativeName": "বাংলা",
    "dir": "ltr"
  },
  {
    "code": "ur",
    "flag": "🇵🇰",
    "name": "Urdu",
    "nativeName": "اردو",
    "dir": "rtl"
  },
  {
    "code": "fa",
    "flag": "🇮🇷",
    "name": "Persian",
    "nativeName": "فارسی",
    "dir": "rtl"
  },
  {
    "code": "tr",
    "flag": "🇹🇷",
    "name": "Turkish",
    "nativeName": "Türkçe",
    "dir": "ltr"
  },
  {
    "code": "ru",
    "flag": "🇷🇺",
    "name": "Russian",
    "nativeName": "Русский",
    "dir": "ltr"
  },
  {
    "code": "uk",
    "flag": "🇺🇦",
    "name": "Ukrainian",
    "nativeName": "Українська",
    "dir": "ltr"
  },
  {
    "code": "pl",
    "flag": "🇵🇱",
    "name": "Polish",
    "nativeName": "Polski",
    "dir": "ltr"
  },
  {
    "code": "nl",
    "flag": "🇳🇱",
    "name": "Dutch",
    "nativeName": "Nederlands",
    "dir": "ltr"
  },
  {
    "code": "vi",
    "flag": "🇻🇳",
    "name": "Vietnamese",
    "nativeName": "Tiếng Việt",
    "dir": "ltr"
  },
  {
    "code": "th",
    "flag": "🇹🇭",
    "name": "Thai",
    "nativeName": "ไทย",
    "dir": "ltr"
  },
  {
    "code": "ms",
    "flag": "🇲🇾",
    "name": "Malay",
    "nativeName": "Bahasa Melayu",
    "dir": "ltr"
  },
  {
    "code": "fil",
    "flag": "🇵🇭",
    "name": "Filipino",
    "nativeName": "Filipino",
    "dir": "ltr"
  },
  {
    "code": "he",
    "flag": "🇮🇱",
    "name": "Hebrew",
    "nativeName": "עברית",
    "dir": "rtl"
  },
  {
    "code": "el",
    "flag": "🇬🇷",
    "name": "Greek",
    "nativeName": "Ελληνικά",
    "dir": "ltr"
  },
  {
    "code": "cs",
    "flag": "🇨🇿",
    "name": "Czech",
    "nativeName": "Čeština",
    "dir": "ltr"
  },
  {
    "code": "hu",
    "flag": "🇭🇺",
    "name": "Hungarian",
    "nativeName": "Magyar",
    "dir": "ltr"
  },
  {
    "code": "ro",
    "flag": "🇷🇴",
    "name": "Romanian",
    "nativeName": "Română",
    "dir": "ltr"
  },
  {
    "code": "sv",
    "flag": "🇸🇪",
    "name": "Swedish",
    "nativeName": "Svenska",
    "dir": "ltr"
  },
  {
    "code": "da",
    "flag": "🇩🇰",
    "name": "Danish",
    "nativeName": "Dansk",
    "dir": "ltr"
  },
  {
    "code": "no",
    "flag": "🇳🇴",
    "name": "Norwegian",
    "nativeName": "Norsk",
    "dir": "ltr"
  },
  {
    "code": "fi",
    "flag": "🇫🇮",
    "name": "Finnish",
    "nativeName": "Suomi",
    "dir": "ltr"
  },
  {
    "code": "sk",
    "flag": "🇸🇰",
    "name": "Slovak",
    "nativeName": "Slovenčina",
    "dir": "ltr"
  },
  {
    "code": "bg",
    "flag": "🇧🇬",
    "name": "Bulgarian",
    "nativeName": "Български",
    "dir": "ltr"
  },
  {
    "code": "hr",
    "flag": "🇭🇷",
    "name": "Croatian",
    "nativeName": "Hrvatski",
    "dir": "ltr"
  },
  {
    "code": "sr",
    "flag": "🇷🇸",
    "name": "Serbian",
    "nativeName": "Српски",
    "dir": "ltr"
  },
  {
    "code": "sl",
    "flag": "🇸🇮",
    "name": "Slovenian",
    "nativeName": "Slovenščina",
    "dir": "ltr"
  },
  {
    "code": "lt",
    "flag": "🇱🇹",
    "name": "Lithuanian",
    "nativeName": "Lietuvių",
    "dir": "ltr"
  },
  {
    "code": "lv",
    "flag": "🇱🇻",
    "name": "Latvian",
    "nativeName": "Latviešu",
    "dir": "ltr"
  },
  {
    "code": "et",
    "flag": "🇪🇪",
    "name": "Estonian",
    "nativeName": "Eesti",
    "dir": "ltr"
  },
  {
    "code": "is",
    "flag": "🇮🇸",
    "name": "Icelandic",
    "nativeName": "Íslenska",
    "dir": "ltr"
  },
  {
    "code": "ga",
    "flag": "🇮🇪",
    "name": "Irish",
    "nativeName": "Gaeilge",
    "dir": "ltr"
  },
  {
    "code": "cy",
    "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "name": "Welsh",
    "nativeName": "Cymraeg",
    "dir": "ltr"
  },
  {
    "code": "gd",
    "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "name": "Scottish Gaelic",
    "nativeName": "Gàidhlig",
    "dir": "ltr"
  },
  {
    "code": "ca",
    "flag": "🇪🇸",
    "name": "Catalan",
    "nativeName": "Català",
    "dir": "ltr"
  },
  {
    "code": "eo",
    "flag": "🌍",
    "name": "Esperanto",
    "nativeName": "Esperanto",
    "dir": "ltr"
  },
  {
    "code": "afr",
    "flag": "🇿🇦",
    "name": "Afrikaans",
    "nativeName": "Afrikaans",
    "dir": "ltr"
  },
  {
    "code": "sw",
    "flag": "🇹🇿",
    "name": "Swahili",
    "nativeName": "Kiswahili",
    "dir": "ltr"
  },
  {
    "code": "ta",
    "flag": "🇮🇳",
    "name": "Tamil",
    "nativeName": "தமிழ்",
    "dir": "ltr"
  },
  {
    "code": "te",
    "flag": "🇮🇳",
    "name": "Telugu",
    "nativeName": "తెలుగు",
    "dir": "ltr"
  },
  {
    "code": "mr",
    "flag": "🇮🇳",
    "name": "Marathi",
    "nativeName": "मराठी",
    "dir": "ltr"
  },
  {
    "code": "gu",
    "flag": "🇮🇳",
    "name": "Gujarati",
    "nativeName": "ગુજરાતી",
    "dir": "ltr"
  },
  {
    "code": "kok",
    "flag": "🇮🇳",
    "name": "Konkani",
    "nativeName": "कोंकणी",
    "dir": "ltr"
  },
  {
    "code": "ml",
    "flag": "🇮🇳",
    "name": "Malayalam",
    "nativeName": "മലയാളം",
    "dir": "ltr"
  },
  {
    "code": "kn",
    "flag": "🇮🇳",
    "name": "Kannada",
    "nativeName": "ಕನ್ನಡ",
    "dir": "ltr"
  },
  {
    "code": "pu",
    "flag": "🇮🇳",
    "name": "Punjabi",
    "nativeName": "ਪੰਜਾਬੀ",
    "dir": "ltr"
  },
  {
    "code": "or",
    "flag": "🇮🇳",
    "name": "Odia",
    "nativeName": "ଓଡ଼ିଆ",
    "dir": "ltr"
  },
  {
    "code": "as",
    "flag": "🇮🇳",
    "name": "Assamese",
    "nativeName": "অসমীয়া",
    "dir": "ltr"
  },
  {
    "code": "bh",
    "flag": "🇮🇳",
    "name": "Bhojpuri",
    "nativeName": "भोजपुरी",
    "dir": "ltr"
  },
  {
    "code": "ne",
    "flag": "🇳🇵",
    "name": "Nepali",
    "nativeName": "नेपाली",
    "dir": "ltr"
  },
  {
    "code": "sin",
    "flag": "🇱🇰",
    "name": "Sinhala",
    "nativeName": "සිංහල",
    "dir": "ltr"
  },
  {
    "code": "my",
    "flag": "🇲🇲",
    "name": "Burmese",
    "nativeName": "မြန်မာစာ",
    "dir": "ltr"
  },
  {
    "code": "km",
    "flag": "🇰🇭",
    "name": "Khmer",
    "nativeName": "ភាសាខ្មែរ",
    "dir": "ltr"
  },
  {
    "code": "lo",
    "flag": "🇱🇦",
    "name": "Lao",
    "nativeName": "ລາວ",
    "dir": "ltr"
  },
  {
    "code": "ckb",
    "flag": "🇮🇶",
    "name": "Kurdish (Sorani)",
    "nativeName": "کوردی",
    "dir": "rtl"
  },
  {
    "code": "yi",
    "flag": "🇮🇱",
    "name": "Yiddish",
    "nativeName": "ייִדיש",
    "dir": "rtl"
  },
  {
    "code": "hy",
    "flag": "🇦🇲",
    "name": "Armenian",
    "nativeName": "Հայերեն",
    "dir": "ltr"
  },
  {
    "code": "ka",
    "flag": "🇬🇪",
    "name": "Georgian",
    "nativeName": "ქართული",
    "dir": "ltr"
  },
  {
    "code": "kk",
    "flag": "🇰🇿",
    "name": "Kazakh",
    "nativeName": "Қазақша",
    "dir": "ltr"
  },
  {
    "code": "uz",
    "flag": "🇺🇿",
    "name": "Uzbek",
    "nativeName": "Oʻzbekcha",
    "dir": "ltr"
  },
  {
    "code": "tt",
    "flag": "🇷🇺",
    "name": "Tatar",
    "nativeName": "Татарча",
    "dir": "ltr"
  },
  {
    "code": "mn",
    "flag": "🇲🇳",
    "name": "Mongolian",
    "nativeName": "Монгол",
    "dir": "ltr"
  },
  {
    "code": "lg",
    "flag": "🇺🇬",
    "name": "Luganda",
    "nativeName": "Luganda",
    "dir": "ltr"
  },
  {
    "code": "rw",
    "flag": "🇷🇼",
    "name": "Kinyarwanda",
    "nativeName": "Ikinyarwanda",
    "dir": "ltr"
  },
  {
    "code": "ny",
    "flag": "🇲🇼",
    "name": "Chichewa",
    "nativeName": "Chichewa",
    "dir": "ltr"
  },
  {
    "code": "sot",
    "flag": "🇱🇸",
    "name": "Sesotho",
    "nativeName": "Sesotho",
    "dir": "ltr"
  },
  {
    "code": "mao",
    "flag": "🇳🇿",
    "name": "Maori",
    "nativeName": "Te Reo Māori",
    "dir": "ltr"
  },
  {
    "code": "bel",
    "flag": "🇧🇾",
    "name": "Belarusian",
    "nativeName": "Беларуская",
    "dir": "ltr"
  }
];
  const UI_STRINGS = {
  "en": {
    "app_title": "PiCom Icon Browser",
    "filter_placeholder": "Search…",
    "search_placeholder": "Search…",
    "library": "Library",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Toon figures",
    "anime": "Anime figures",
    "simplified": "Simplified figures",
    "inclusive": "Inclusive figures",
    "kawaii": "Kawaii figures",
    "threed": "3D figures",
    "lineart": "Lineart figures",
    "all": "All",
    "male": "Male",
    "female": "Female",
    "random": "Random",
    "gender": "Gender",
    "also_show": "Also show",
    "plurals_tenses": "Plurals & tenses",
    "alphabets": "Alphabets",
    "adult_18": "18+",
    "categories": "Categories",
    "sort_az": "A→Z",
    "sort_newest": "Newest first",
    "transform": "Transform",
    "figures": "Figures",
    "border": "Border",
    "skin": "Skin",
    "hair": "Hair",
    "colour": "Colour",
    "traditional": "Traditional",
    "fill": "Fill",
    "arms": "Arms",
    "clothes": "Clothes",
    "varied_figures": "Varied figures",
    "mirror": "Mirror",
    "cvi_mode": "CVI mode",
    "reset_all": "Reset all",
    "page": "Page",
    "of": "of",
    "first_page": "First page",
    "prev_page": "Previous page",
    "next_page": "Next page",
    "last_page": "Last page",
    "download_svg": "⬇ Download SVG",
    "leave_feedback": "💬 Leave feedback",
    "send": "Send",
    "thanks": "Thanks!",
    "help": "Help",
    "original": "original",
    "none": "none",
    "thin": "thin",
    "medium": "medium",
    "thick": "thick",
    "default": "default",
    "light": "light",
    "tan": "tan",
    "olive": "olive",
    "brown": "brown",
    "dark": "dark",
    "black": "black",
    "darkbrown": "dark brown",
    "blonde": "blonde",
    "ginger": "ginger",
    "grey": "grey",
    "white": "white",
    "bold": "bold",
    "muted": "muted",
    "bare": "bare",
    "clothed": "clothed"
  },
  "es": {
    "app_title": "Explorador de Iconos PiCom",
    "filter_placeholder": "Filtrar…",
    "library": "Biblioteca",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Figuras Toon",
    "anime": "Figuras Anime",
    "simplified": "Figuras Simplificadas",
    "inclusive": "Figuras Inclusivas",
    "kawaii": "Figuras Kawaii",
    "threed": "Figuras 3D",
    "lineart": "Figuras Lineales",
    "all": "Todos",
    "male": "Masculino",
    "female": "Femenino",
    "random": "Aleatorio",
    "gender": "Género",
    "also_show": "Mostrar también",
    "plurals_tenses": "Plurales y tiempos",
    "alphabets": "Alfabetos",
    "adult_18": "18+",
    "categories": "Categorías",
    "sort_az": "A→Z",
    "sort_newest": "Más recientes",
    "transform": "Transformar",
    "figures": "Figuras",
    "border": "Borde",
    "skin": "Piel",
    "hair": "Cabello",
    "colour": "Color",
    "traditional": "Tradicional",
    "fill": "Relleno",
    "arms": "Brazos",
    "clothes": "Ropa",
    "varied_figures": "Figuras variadas",
    "mirror": "Reflejar",
    "cvi_mode": "Modo CVI",
    "reset_all": "Restablecer todo",
    "page": "Página",
    "of": "de",
    "first_page": "Primera página",
    "prev_page": "Página anterior",
    "next_page": "Página siguiente",
    "last_page": "Última página",
    "download_svg": "⬇ Descargar SVG",
    "leave_feedback": "💬 Dejar comentarios",
    "send": "Enviar",
    "thanks": "¡Gracias!",
    "help": "Ayuda",
    "original": "original",
    "none": "ninguno",
    "thin": "fino",
    "medium": "medio",
    "thick": "grueso",
    "default": "predeterminado",
    "light": "claro",
    "tan": "bronceado",
    "olive": "oliva",
    "brown": "marrón",
    "dark": "oscuro",
    "black": "negro",
    "darkbrown": "marrón oscuro",
    "blonde": "rubio",
    "ginger": "pelirrojo",
    "grey": "gris",
    "white": "blanco",
    "bold": "vivo",
    "muted": "suave",
    "bare": "descubierto",
    "clothed": "vestido"
  },
  "fr": {
    "app_title": "Explorateur d'icônes PiCom",
    "filter_placeholder": "Filtrer…",
    "library": "Bibliothèque",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Personnages Toon",
    "anime": "Personnages Anime",
    "simplified": "Personnages Simplifiés",
    "inclusive": "Personnages Inclusifs",
    "kawaii": "Personnages Kawaii",
    "threed": "Personnages 3D",
    "lineart": "Dessin au trait",
    "all": "Tous",
    "male": "Masculin",
    "female": "Féminin",
    "random": "Aléatoire",
    "gender": "Genre",
    "also_show": "Afficher aussi",
    "plurals_tenses": "Pluriels & temps",
    "alphabets": "Alphabets",
    "adult_18": "18+",
    "categories": "Catégories",
    "sort_az": "A→Z",
    "sort_newest": "Plus récents",
    "transform": "Transformer",
    "figures": "Personnages",
    "border": "Bordure",
    "skin": "Peau",
    "hair": "Cheveux",
    "colour": "Couleur",
    "traditional": "Traditionnel",
    "fill": "Remplissage",
    "arms": "Bras",
    "clothes": "Vêtements",
    "varied_figures": "Personnages variés",
    "mirror": "Miroir",
    "cvi_mode": "Mode CVI",
    "reset_all": "Tout réinitialiser",
    "page": "Page",
    "of": "sur",
    "first_page": "Première page",
    "prev_page": "Page précédente",
    "next_page": "Page suivante",
    "last_page": "Dernière page",
    "download_svg": "⬇ Télécharger SVG",
    "leave_feedback": "💬 Laisser un commentaire",
    "send": "Envoyer",
    "thanks": "Merci !",
    "help": "Aide",
    "original": "original",
    "none": "aucun",
    "thin": "fin",
    "medium": "moyen",
    "thick": "épais",
    "default": "par défaut",
    "light": "clair",
    "tan": "hâlé",
    "olive": "olive",
    "brown": "brun",
    "dark": "foncé",
    "black": "noir",
    "darkbrown": "châtain foncé",
    "blonde": "blond",
    "ginger": "roux",
    "grey": "gris",
    "white": "blanc",
    "bold": "vif",
    "muted": "atténué",
    "bare": "nu",
    "clothed": "habillé"
  },
  "de": {
    "app_title": "PiCom Symbol-Browser",
    "filter_placeholder": "Filtern…",
    "library": "Bibliothek",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Toon-Figuren",
    "anime": "Anime-Figuren",
    "simplified": "Vereinfachte Figuren",
    "inclusive": "Inklusive Figuren",
    "kawaii": "Kawaii-Figuren",
    "threed": "3D-Figuren",
    "lineart": "Strichzeichnung",
    "all": "Alle",
    "male": "Männlich",
    "female": "Weiblich",
    "random": "Zufällig",
    "gender": "Geschlecht",
    "also_show": "Auch anzeigen",
    "plurals_tenses": "Plurale & Zeitformen",
    "alphabets": "Alphabete",
    "adult_18": "18+",
    "categories": "Kategorien",
    "sort_az": "A→Z",
    "sort_newest": "Neueste zuerst",
    "transform": "Anpassen",
    "figures": "Figuren",
    "border": "Rahmen",
    "skin": "Hautfarbe",
    "hair": "Haarfarbe",
    "colour": "Farbe",
    "traditional": "Traditionell",
    "fill": "Füllung",
    "arms": "Arme",
    "clothes": "Kleidung",
    "varied_figures": "Vielfältige Figuren",
    "mirror": "Spiegeln",
    "cvi_mode": "CVI-Modus",
    "reset_all": "Zurücksetzen",
    "page": "Seite",
    "of": "von",
    "first_page": "Erste Seite",
    "prev_page": "Vorherige Seite",
    "next_page": "Nächste Seite",
    "last_page": "Letzte Seite",
    "download_svg": "⬇ SVG herunterladen",
    "leave_feedback": "💬 Feedback geben",
    "send": "Senden",
    "thanks": "Vielen Dank!",
    "help": "Hilfe",
    "original": "original",
    "none": "keine",
    "thin": "dünn",
    "medium": "mittel",
    "thick": "dick",
    "default": "Standard",
    "light": "hell",
    "tan": "gebräunt",
    "olive": "oliv",
    "brown": "braun",
    "dark": "dunkel",
    "black": "schwarz",
    "darkbrown": "dunkelbraun",
    "blonde": "blond",
    "ginger": "rotblond",
    "grey": "grau",
    "white": "weiß",
    "bold": "kräftig",
    "muted": "gedämpft",
    "bare": "bloß",
    "clothed": "bekleidet"
  },
  "ar": {
    "app_title": "متصفح رموز PiCom",
    "filter_placeholder": "بحث وتصفية…",
    "library": "المكتبة",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "شخصيات كرتونية",
    "anime": "شخصيات أنمي",
    "simplified": "شخصيات مبسطة",
    "inclusive": "شخصيات شاملة",
    "kawaii": "شخصيات كواي",
    "threed": "شخصيات ثلاثية الأبعاد",
    "lineart": "رسوم خطية",
    "all": "الكل",
    "male": "ذكر",
    "female": "أنثى",
    "random": "عشوائي",
    "gender": "الجنس",
    "also_show": "إظهار أيضاً",
    "plurals_tenses": "الجموع والأزمنة",
    "alphabets": "الأبجديات",
    "adult_18": "18+",
    "categories": "التصنيفات",
    "sort_az": "أ→ي",
    "sort_newest": "الأحدث أولاً",
    "transform": "تعديل المظهر",
    "figures": "الشخصيات",
    "border": "الإطار",
    "skin": "لون البشرة",
    "hair": "الشعر",
    "colour": "الألوان",
    "traditional": "الزي التقليدي",
    "fill": "التعبئة",
    "arms": "الذراعين",
    "clothes": "الملابس",
    "varied_figures": "شخصيات متنوعة",
    "mirror": "عكس الاتجاه",
    "cvi_mode": "وضع CVI عالي التباين",
    "reset_all": "إعادة ضبط",
    "page": "صفحة",
    "of": "من",
    "first_page": "الصفحة الأولى",
    "prev_page": "الصفحة السابقة",
    "next_page": "الصفحة التالية",
    "last_page": "الصفحة الأخيرة",
    "download_svg": "⬇ تنزيل SVG",
    "leave_feedback": "💬 إرسال ملاحظات",
    "send": "إرسال",
    "thanks": "شكراً لك!",
    "help": "تعليمات الاستخدام",
    "original": "أصلي",
    "none": "بدون",
    "thin": "رفيع",
    "medium": "متوسط",
    "thick": "عريض",
    "default": "افتراضي",
    "light": "فاتح",
    "tan": "حنطي",
    "olive": "حنطي داكن",
    "brown": "أسمر",
    "dark": "داكن",
    "black": "أسود",
    "darkbrown": "بني داكن",
    "blonde": "أشقر",
    "ginger": "أحمر",
    "grey": "رمادي",
    "white": "أبيض",
    "bold": "ساطع",
    "muted": "هادئ",
    "bare": "مكشوف",
    "clothed": "مغطى"
  },
  "zhc": {
    "app_title": "PiCom 图标浏览器",
    "filter_placeholder": "搜索过滤…",
    "library": "符号库",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "卡通人物",
    "anime": "动漫人物",
    "simplified": "极简人物",
    "inclusive": "包容性人物",
    "kawaii": "可爱人物",
    "threed": "3D人物",
    "lineart": "黑白线稿",
    "all": "全部",
    "male": "男性",
    "female": "女性",
    "random": "随机",
    "gender": "性别",
    "also_show": "同时显示",
    "plurals_tenses": "复数与时态",
    "alphabets": "字母表",
    "adult_18": "18+",
    "categories": "分类",
    "sort_az": "字母排序",
    "sort_newest": "最新优先",
    "transform": "视觉变换",
    "figures": "人物样式",
    "border": "边框",
    "skin": "肤色",
    "hair": "发色",
    "colour": "色彩",
    "traditional": "传统服饰",
    "fill": "填充",
    "arms": "手臂",
    "clothes": "服装颜色",
    "varied_figures": "多元化人物",
    "mirror": "镜像翻转",
    "cvi_mode": "CVI高对比模式",
    "reset_all": "重置所有",
    "page": "页码",
    "of": "/",
    "first_page": "第一页",
    "prev_page": "上一页",
    "next_page": "下一页",
    "last_page": "最后一页",
    "download_svg": "⬇ 下载 SVG",
    "leave_feedback": "💬 提供反馈",
    "send": "发送",
    "thanks": "感谢您的反馈！",
    "help": "使用说明",
    "original": "原版",
    "none": "无",
    "thin": "细线",
    "medium": "中等",
    "thick": "粗线",
    "default": "默认",
    "light": "浅色",
    "tan": "小麦色",
    "olive": "橄榄色",
    "brown": "棕色",
    "dark": "深色",
    "black": "黑色",
    "darkbrown": "深棕色",
    "blonde": "金色",
    "ginger": "红棕色",
    "grey": "灰色",
    "white": "白色",
    "bold": "鲜明",
    "muted": "柔和",
    "bare": "无袖",
    "clothed": "有袖"
  },
  "pt": {
    "app_title": "Navegador de Ícones PiCom",
    "filter_placeholder": "Filtrar…",
    "library": "Biblioteca",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Figuras Toon",
    "anime": "Figuras Anime",
    "simplified": "Figuras Simplificadas",
    "inclusive": "Figuras Inclusivas",
    "kawaii": "Figuras Kawaii",
    "threed": "Figuras 3D",
    "lineart": "Figuras Lineares",
    "all": "Todos",
    "male": "Masculino",
    "female": "Feminino",
    "random": "Aleatório",
    "gender": "Gênero",
    "also_show": "Mostrar também",
    "plurals_tenses": "Plurais e tempos",
    "alphabets": "Alfabetos",
    "adult_18": "18+",
    "categories": "Categorias",
    "sort_az": "A→Z",
    "sort_newest": "Mais recentes",
    "transform": "Transformar",
    "figures": "Figuras",
    "border": "Borda",
    "skin": "Pele",
    "hair": "Cabelo",
    "colour": "Cor",
    "traditional": "Tradicional",
    "fill": "Preenchimento",
    "arms": "Braços",
    "clothes": "Roupas",
    "varied_figures": "Figuras variadas",
    "mirror": "Espelhar",
    "cvi_mode": "Modo CVI",
    "reset_all": "Redefinir tudo",
    "page": "Página",
    "of": "de",
    "first_page": "Primeira página",
    "prev_page": "Página anterior",
    "next_page": "Próxima página",
    "last_page": "Última página",
    "download_svg": "⬇ Baixar SVG",
    "leave_feedback": "💬 Deixar feedback",
    "send": "Enviar",
    "thanks": "Obrigado!",
    "help": "Ajuda",
    "original": "original",
    "none": "nenhum",
    "thin": "fino",
    "medium": "médio",
    "thick": "grosso",
    "default": "padrão",
    "light": "claro",
    "tan": "bronzeado",
    "olive": "oliva",
    "brown": "castanho",
    "dark": "escuro",
    "black": "preto",
    "darkbrown": "castanho escuro",
    "blonde": "loiro",
    "ginger": "ruivo",
    "grey": "cinza",
    "white": "branco",
    "bold": "vivo",
    "muted": "suave",
    "bare": "descoberto",
    "clothed": "vestido"
  },
  "it": {
    "app_title": "Browser di Icone PiCom",
    "filter_placeholder": "Filtra…",
    "library": "Libreria",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Figure Toon",
    "anime": "Figure Anime",
    "simplified": "Figure Semplificate",
    "inclusive": "Figure Inclusive",
    "kawaii": "Figure Kawaii",
    "threed": "Figure 3D",
    "lineart": "Disegni a tratti",
    "all": "Tutti",
    "male": "Maschile",
    "female": "Femminile",
    "random": "Casuale",
    "gender": "Genere",
    "also_show": "Mostra anche",
    "plurals_tenses": "Plurali e tempi",
    "alphabets": "Alfabeti",
    "adult_18": "18+",
    "categories": "Categorie",
    "sort_az": "A→Z",
    "sort_newest": "I più recenti",
    "transform": "Trasforma",
    "figures": "Figure",
    "border": "Bordo",
    "skin": "Pelle",
    "hair": "Capelli",
    "colour": "Colore",
    "traditional": "Tradizionale",
    "fill": "Riempimento",
    "arms": "Braccia",
    "clothes": "Vestiti",
    "varied_figures": "Figure variegate",
    "mirror": "Specchia",
    "cvi_mode": "Modalità CVI",
    "reset_all": "Reimposta tutto",
    "page": "Pagina",
    "of": "di",
    "first_page": "Prima pagina",
    "prev_page": "Pagina precedente",
    "next_page": "Pagina successiva",
    "last_page": "Ultima pagina",
    "download_svg": "⬇ Scarica SVG",
    "leave_feedback": "💬 Lascia un commento",
    "send": "Invia",
    "thanks": "Grazie!",
    "help": "Guida",
    "original": "originale",
    "none": "nessuno",
    "thin": "sottile",
    "medium": "medio",
    "thick": "spesso",
    "default": "predefinito",
    "light": "chiaro",
    "tan": "abbronzato",
    "olive": "olivastro",
    "brown": "marrone",
    "dark": "scuro",
    "black": "nero",
    "darkbrown": "castano scuro",
    "blonde": "biondo",
    "ginger": "rosso",
    "grey": "grigio",
    "white": "bianco",
    "bold": "vivace",
    "muted": "tenue",
    "bare": "scoperto",
    "clothed": "vestito"
  },
  "hi": {
    "app_title": "PiCom प्रतीक ब्राउज़र",
    "filter_placeholder": "खोजें या फ़िल्टर करें…",
    "library": "लाइब्रेरी",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "कार्टून आकृतियाँ",
    "anime": "एनीमे आकृतियाँ",
    "simplified": "सरलीकृत आकृतियाँ",
    "inclusive": "समावेशी आकृतियाँ",
    "kawaii": "कवाई आकृतियाँ",
    "threed": "3D आकृतियाँ",
    "lineart": "रेखाचित्र",
    "all": "सभी",
    "male": "पुरुष",
    "female": "महिला",
    "random": "यादृच्छिक",
    "gender": "लिंग",
    "also_show": "यह भी दिखाएं",
    "plurals_tenses": "बहुवचन और काल",
    "alphabets": "वर्णमाला",
    "adult_18": "18+",
    "categories": "श्रेणियाँ",
    "sort_az": "अ→ह (वर्णक्रम)",
    "sort_newest": "नवीनतम पहले",
    "transform": "रूप बदलें",
    "figures": "आकृतियाँ",
    "border": "किनारा (बॉर्डर)",
    "skin": "त्वचा का रंग",
    "hair": "बालों का रंग",
    "colour": "रंग",
    "traditional": "पारंपरिक पोशाक",
    "fill": "भराव",
    "arms": "बाँहें",
    "clothes": "कपड़े",
    "varied_figures": "विविध आकृतियाँ",
    "mirror": "दर्पण (मिरर)",
    "cvi_mode": "CVI उच्च कंट्रास्ट",
    "reset_all": "रीसेट करें",
    "page": "पृष्ठ",
    "of": "का",
    "first_page": "पहला पृष्ठ",
    "prev_page": "पिछला पृष्ठ",
    "next_page": "अगला पृष्ठ",
    "last_page": "अंतिम पृष्ठ",
    "download_svg": "⬇ SVG डाउनलोड करें",
    "leave_feedback": "💬 प्रतिक्रिया दें",
    "send": "भेजें",
    "thanks": "धन्यवाद!",
    "help": "सहायता",
    "original": "मूल",
    "none": "कोई नहीं",
    "thin": "पतला",
    "medium": "मध्यम",
    "thick": "मोटा",
    "default": "डिफ़ॉल्ट",
    "light": "गोरा",
    "tan": "गेहुंआ",
    "olive": "सांवला",
    "brown": "भूरा",
    "dark": "गहरा",
    "black": "काला",
    "darkbrown": "गहरा भूरा",
    "blonde": "सुनहरा",
    "ginger": "लाल",
    "grey": "ग्रे",
    "white": "सफेद",
    "bold": "गहरा",
    "muted": "हल्का",
    "bare": "खुला",
    "clothed": "पहने हुए"
  },
  "ja": {
    "app_title": "PiCom シンボルブラウザ",
    "filter_placeholder": "絞り込み・検索…",
    "library": "ライブラリ",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "トゥーン",
    "anime": "アニメ",
    "simplified": "シンプル",
    "inclusive": "インクルーシブ",
    "kawaii": "カワイイ",
    "threed": "3D",
    "lineart": "線画",
    "all": "すべて",
    "male": "男性",
    "female": "女性",
    "random": "ランダム",
    "gender": "性別",
    "also_show": "表示オプション",
    "plurals_tenses": "複数形・時制",
    "alphabets": "文字・アルファベット",
    "adult_18": "18+",
    "categories": "カテゴリー",
    "sort_az": "50音順 / A→Z",
    "sort_newest": "新しい順",
    "transform": "表示カスタマイズ",
    "figures": "人物スタイル",
    "border": "枠線",
    "skin": "肌の色",
    "hair": "髪の色",
    "colour": "色彩",
    "traditional": "伝統衣装",
    "fill": "塗りつぶし",
    "arms": "腕",
    "clothes": "服の色",
    "varied_figures": "多様な人物",
    "mirror": "左右反転",
    "cvi_mode": "CVIハイコントラスト",
    "reset_all": "すべてリセット",
    "page": "ページ",
    "of": "/",
    "first_page": "最初のページ",
    "prev_page": "前のページ",
    "next_page": "次のページ",
    "last_page": "最後のページ",
    "download_svg": "⬇ SVGをダウンロード",
    "leave_feedback": "💬 フィードバックを送信",
    "send": "送信",
    "thanks": "ありがとうございます！",
    "help": "使い方",
    "original": "オリジナル",
    "none": "なし",
    "thin": "細い",
    "medium": "普通",
    "thick": "太い",
    "default": "デフォルト",
    "light": "明るい",
    "tan": "小麦色",
    "olive": "オリーブ",
    "brown": "褐色",
    "dark": "濃い",
    "black": "黒",
    "darkbrown": "ダークブラウン",
    "blonde": "金髪",
    "ginger": "赤毛",
    "grey": "グレー",
    "white": "白",
    "bold": "鮮やか",
    "muted": "落ち着いた",
    "bare": "半袖・ノースリーブ",
    "clothed": "長袖"
  },
  "ru": {
    "app_title": "Браузер пиктограмм PiCom",
    "filter_placeholder": "Поиск и фильтр…",
    "library": "Библиотека",
    "fluent": "PiCom Fluent",
    "stick": "PiCom Fleximbols",
    "toon": "Мультяшные",
    "anime": "Аниме",
    "simplified": "Упрощенные",
    "inclusive": "Инклюзивные",
    "kawaii": "Каваи",
    "threed": "3D",
    "lineart": "Контурные",
    "all": "Все",
    "male": "Мужской",
    "female": "Женский",
    "random": "Случайно",
    "gender": "Пол",
    "also_show": "Также показывать",
    "plurals_tenses": "Множественное число и времена",
    "alphabets": "Алфавиты",
    "adult_18": "18+",
    "categories": "Категории",
    "sort_az": "А→Я",
    "sort_newest": "Сначала новые",
    "transform": "Внешний вид",
    "figures": "Фигуры",
    "border": "Контур",
    "skin": "Цвет кожи",
    "hair": "Цвет волос",
    "colour": "Цвета",
    "traditional": "Традиционный костюм",
    "fill": "Заливка",
    "arms": "Руки",
    "clothes": "Одежда",
    "varied_figures": "Разнообразные фигуры",
    "mirror": "Отразить",
    "cvi_mode": "Режим CVI (контрастный)",
    "reset_all": "Сбросить всё",
    "page": "Страница",
    "of": "из",
    "first_page": "Первая страница",
    "prev_page": "Предыдущая страница",
    "next_page": "Следующая страница",
    "last_page": "Последняя страница",
    "download_svg": "⬇ Скачать SVG",
    "leave_feedback": "💬 Оставить отзыв",
    "send": "Отправить",
    "thanks": "Спасибо!",
    "help": "Справка",
    "original": "оригинал",
    "none": "нет",
    "thin": "тонкий",
    "medium": "средний",
    "thick": "толстый",
    "default": "по умолчанию",
    "light": "светлая",
    "tan": "загорелая",
    "olive": "оливковая",
    "brown": "смуглая",
    "dark": "темная",
    "black": "черный",
    "darkbrown": "темно-каштановый",
    "blonde": "блонд",
    "ginger": "рыжий",
    "grey": "серый",
    "white": "белый",
    "bold": "яркий",
    "muted": "приглушенный",
    "bare": "без рукавов",
    "clothed": "с рукавами"
  }
};
  const CATEGORIES = {
  "AAC Device": {
    "es": "Dispositivo CAA",
    "fr": "Appareil CAA",
    "de": "UK-Gerät",
    "ar": "أجهزة التواصل البديل",
    "zhc": "辅助沟通设备",
    "it": "Dispositivo CAA",
    "pt": "Dispositivo CAA",
    "ru": "Устройство ААС",
    "ja": "AAC機器",
    "hi": "एएसी उपकरण"
  },
  "Animals": {
    "es": "Animales",
    "fr": "Animaux",
    "de": "Tiere",
    "ar": "حيوانات",
    "zhc": "动物",
    "it": "Animali",
    "pt": "Animais",
    "ru": "Животные",
    "ja": "動物",
    "hi": "जानवर"
  },
  "BodyParts": {
    "es": "Partes del cuerpo",
    "fr": "Parties du corps",
    "de": "Körperteile",
    "ar": "أجزاء الجسم",
    "zhc": "身体部位",
    "it": "Parti del corpo",
    "pt": "Partes do corpo",
    "ru": "Части тела",
    "ja": "体の部位",
    "hi": "शरीर के अंग"
  },
  "Clothing": {
    "es": "Ropa",
    "fr": "Vêtements",
    "de": "Kleidung",
    "ar": "ملابس",
    "zhc": "服装",
    "it": "Abbigliamento",
    "pt": "Roupas",
    "ru": "Одежда",
    "ja": "衣服",
    "hi": "कपड़े"
  },
  "Colours": {
    "es": "Colores",
    "fr": "Couleurs",
    "de": "Farben",
    "ar": "ألوان",
    "zhc": "颜色",
    "it": "Colori",
    "pt": "Cores",
    "ru": "Цвета",
    "ja": "色",
    "hi": "रंग"
  },
  "Food and Drink": {
    "es": "Comida y bebida",
    "fr": "Nourriture et boissons",
    "de": "Essen und Trinken",
    "ar": "طعام وشراب",
    "zhc": "食物与饮料",
    "it": "Cibo e bevande",
    "pt": "Comida e bebida",
    "ru": "Еда и напитки",
    "ja": "食べ物と飲み物",
    "hi": "खान-पान"
  },
  "Feelings Extra": {
    "es": "Sentimientos",
    "fr": "Sentiments",
    "de": "Gefühle",
    "ar": "مشاعر وعواطف",
    "zhc": "情绪与感受",
    "it": "Sentimenti",
    "pt": "Sentimentos",
    "ru": "Чувства и эмоции",
    "ja": "気持ち・感情",
    "hi": "भावनाएं"
  },
  "Family": {
    "es": "Familia",
    "fr": "Famille",
    "de": "Familie",
    "ar": "العائلة",
    "zhc": "家庭成员",
    "it": "Famiglia",
    "pt": "Família",
    "ru": "Семья",
    "ja": "家族",
    "hi": "परिवार"
  },
  "Health": {
    "es": "Salud",
    "fr": "Santé",
    "de": "Gesundheit",
    "ar": "الصحة",
    "zhc": "健康与医疗",
    "it": "Salute",
    "pt": "Saúde",
    "ru": "Здоровье",
    "ja": "健康",
    "hi": "स्वास्थ्य"
  },
  "Home": {
    "es": "Hogar",
    "fr": "Maison",
    "de": "Zuhause",
    "ar": "المنزل",
    "zhc": "居家生活",
    "it": "Casa",
    "pt": "Casa",
    "ru": "Дом",
    "ja": "家・家庭",
    "hi": "घर"
  },
  "Household Objects": {
    "es": "Objetos del hogar",
    "fr": "Objets de la maison",
    "de": "Haushaltsgegenstände",
    "ar": "أدوات منزلية",
    "zhc": "家居用品",
    "it": "Oggetti per la casa",
    "pt": "Objetos domésticos",
    "ru": "Предметы быта",
    "ja": "家庭用品",
    "hi": "घरेलू सामान"
  },
  "Kitchen Objects": {
    "es": "Objetos de cocina",
    "fr": "Objets de cuisine",
    "de": "Küchenutensilien",
    "ar": "أدوات المطبخ",
    "zhc": "厨房用品",
    "it": "Oggetti da cucina",
    "pt": "Objetos de cozinha",
    "ru": "Кухонные принадлежности",
    "ja": "台所用品",
    "hi": "रसोई का सामान"
  },
  "School": {
    "es": "Escuela",
    "fr": "École",
    "de": "Schule",
    "ar": "المدرسة",
    "zhc": "学校教育",
    "it": "Scuola",
    "pt": "Escola",
    "ru": "Школа",
    "ja": "学校",
    "hi": "स्कूल"
  },
  "SchoolSubjects": {
    "es": "Asignaturas escolares",
    "fr": "Matières scolaires",
    "de": "Schulfächer",
    "ar": "المواد الدراسية",
    "zhc": "学科课程",
    "it": "Materie scolastiche",
    "pt": "Disciplinas escolares",
    "ru": "Школьные предметы",
    "ja": "教科・科目",
    "hi": "स्कूली विषय"
  },
  "Sports": {
    "es": "Deportes",
    "fr": "Sports",
    "de": "Sport",
    "ar": "رياضة",
    "zhc": "体育运动",
    "it": "Sport",
    "pt": "Esportes",
    "ru": "Спорт",
    "ja": "スポーツ",
    "hi": "खेलकूद"
  },
  "Music": {
    "es": "Música",
    "fr": "Musique",
    "de": "Musik",
    "ar": "موسيقى",
    "zhc": "音乐",
    "it": "Musica",
    "pt": "Música",
    "ru": "Музыка",
    "ja": "音楽",
    "hi": "संगीत"
  },
  "Instruments": {
    "es": "Instrumentos musicales",
    "fr": "Instruments de musique",
    "de": "Musikinstrumente",
    "ar": "آلات موسيقية",
    "zhc": "乐器",
    "it": "Strumenti musicali",
    "pt": "Instrumentos musicais",
    "ru": "Музыкальные инструменты",
    "ja": "楽器",
    "hi": "वाद्य यंत्र"
  },
  "Transport": {
    "es": "Transporte",
    "fr": "Transport",
    "de": "Verkehr & Fahrzeuge",
    "ar": "وسائل النقل",
    "zhc": "交通工具",
    "it": "Trasporti",
    "pt": "Transporte",
    "ru": "Транспорт",
    "ja": "乗り物・交通",
    "hi": "परिवहन"
  },
  "Travel": {
    "es": "Viajes",
    "fr": "Voyage",
    "de": "Reisen",
    "ar": "السفر والسياحة",
    "zhc": "旅游出行",
    "it": "Viaggi",
    "pt": "Viagem",
    "ru": "Путешествия",
    "ja": "旅行",
    "hi": "यात्रा"
  },
  "Work and Jobs": {
    "es": "Trabajo y profesiones",
    "fr": "Travail et métiers",
    "de": "Berufe & Arbeit",
    "ar": "المهن والوظائف",
    "zhc": "职业与工作",
    "it": "Lavoro e professioni",
    "pt": "Trabalho e profissões",
    "ru": "Работа и профессии",
    "ja": "職業・仕事",
    "hi": "नौकरी और व्यवसाय"
  },
  "Weather": {
    "es": "Clima y tiempo",
    "fr": "Météo",
    "de": "Wetter",
    "ar": "الطقس والمناخ",
    "zhc": "天气气候",
    "it": "Meteo",
    "pt": "Clima e tempo",
    "ru": "Погода",
    "ja": "天気",
    "hi": "मौसम"
  },
  "Time": {
    "es": "Tiempo y horas",
    "fr": "Temps et heure",
    "de": "Zeit & Uhrzeit",
    "ar": "الوقت والزمن",
    "zhc": "时间",
    "it": "Tempo e ora",
    "pt": "Tempo e hora",
    "ru": "Время",
    "ja": "時間・時刻",
    "hi": "समय"
  },
  "Telling Time": {
    "es": "Lectura del reloj",
    "fr": "Lire l'heure",
    "de": "Uhrzeit lesen",
    "ar": "قراءة الساعة",
    "zhc": "认读钟表",
    "it": "Leggere l'ora",
    "pt": "Ler as horas",
    "ru": "Определение времени",
    "ja": "時計の読み方",
    "hi": "घड़ी देखना"
  },
  "Nature": {
    "es": "Naturaleza",
    "fr": "Nature",
    "de": "Natur",
    "ar": "الطبيعة",
    "zhc": "大自然",
    "it": "Natura",
    "pt": "Natureza",
    "ru": "Природа",
    "ja": "自然",
    "hi": "प्रकृति"
  },
  "Places": {
    "es": "Lugares",
    "fr": "Lieux",
    "de": "Orte",
    "ar": "أماكن",
    "zhc": "地点场所",
    "it": "Luoghi",
    "pt": "Lugares",
    "ru": "Места",
    "ja": "場所",
    "hi": "स्थान"
  },
  "Community Places": {
    "es": "Lugares de la comunidad",
    "fr": "Lieux de la communauté",
    "de": "Öffentliche Orte",
    "ar": "أماكن مجتمعية",
    "zhc": "社区公共场所",
    "it": "Luoghi della comunità",
    "pt": "Locais da comunidade",
    "ru": "Общественные места",
    "ja": "公共の場所",
    "hi": "सार्वजनिक स्थल"
  },
  "Verbs": {
    "es": "Verbos / Acciones",
    "fr": "Verbes / Actions",
    "de": "Verben / Handlungen",
    "ar": "أفعال وأنشطة",
    "zhc": "动词与动作",
    "it": "Verbi / Azioni",
    "pt": "Verbos / Ações",
    "ru": "Глаголы и действия",
    "ja": "動詞・動作",
    "hi": "क्रियाएं"
  },
  "Core Words": {
    "es": "Vocabulario básico",
    "fr": "Mots clés CAA",
    "de": "Kernvokabular",
    "ar": "الكلمات الأساسية",
    "zhc": "核心词汇",
    "it": "Parole chiave",
    "pt": "Vocabulário essencial",
    "ru": "Базовые слова",
    "ja": "コア単語",
    "hi": "मूल शब्द"
  },
  "Sensory": {
    "es": "Sensorial",
    "fr": "Sensoriel",
    "de": "Sensorik",
    "ar": "الحواس والإدراك",
    "zhc": "感官知觉",
    "it": "Sensoriale",
    "pt": "Sensorial",
    "ru": "Сенсорика",
    "ja": "感覚",
    "hi": "संवेदी"
  },
  "SelfCare": {
    "es": "Cuidado personal",
    "fr": "Soin de soi",
    "de": "Selbstfürsorge",
    "ar": "العناية الذاتية",
    "zhc": "自我护理",
    "it": "Cura di sé",
    "pt": "Autocuidado",
    "ru": "Самообслуживание",
    "ja": "セルフケア",
    "hi": "स्वयं की देखभाल"
  },
  "Life Skills": {
    "es": "Habilidades para la vida",
    "fr": "Compétences de vie",
    "de": "Lebenskompetenzen",
    "ar": "مهارات الحياة",
    "zhc": "生活技能",
    "it": "Abilità pratiche",
    "pt": "Habilidades da vida",
    "ru": "Бытовые навыки",
    "ja": "ライフスキル",
    "hi": "जीवन कौशल"
  },
  "Social and Emotional": {
    "es": "Socioemocional",
    "fr": "Socio-émotionnel",
    "de": "Sozial-emotional",
    "ar": "المهارات الاجتماعية والانفعالية",
    "zhc": "社交与情感",
    "it": "Socio-emotivo",
    "pt": "Socioemocional",
    "ru": "Социально-эмоциональное",
    "ja": "社会性と情動",
    "hi": "सामाजिक और भावनात्मक"
  },
  "Zones": {
    "es": "Zonas de regulación",
    "fr": "Zones de régulation",
    "de": "Regulationszonen",
    "ar": "مناطق التنظيم الانفعالي",
    "zhc": "情绪自控区",
    "it": "Zone di regolazione",
    "pt": "Zonas de regulação",
    "ru": "Зоны регуляции",
    "ja": "感情のゾーン",
    "hi": "विनियमन क्षेत्र"
  },
  "American Sign Language": {
    "es": "Lengua de signos americana (ASL)",
    "fr": "Langue des signes américaine (ASL)",
    "de": "Amerikanische Gebärdensprache",
    "ar": "لغة الإشارة الأمريكية",
    "zhc": "美式手语 (ASL)",
    "it": "Lingua dei segni americana",
    "pt": "Língua de sinais americana",
    "ru": "Американский жестовый язык",
    "ja": "アメリカ手話",
    "hi": "अमेरिकी सांकेतिक भाषा"
  },
  "British Sign Language": {
    "es": "Lengua de signos británica (BSL)",
    "fr": "Langue des signes britannique (BSL)",
    "de": "Britische Gebärdensprache",
    "ar": "لغة الإشارة البريطانية",
    "zhc": "英式手语 (BSL)",
    "it": "Lingua dei segni britannica",
    "pt": "Língua de sinais britânica",
    "ru": "Британский жестовый язык",
    "ja": "イギリス手話",
    "hi": "ब्रिटिश सांकेतिक भाषा"
  },
  "Alphabets": {
    "es": "Alfabetos",
    "fr": "Alphabets",
    "de": "Alphabete",
    "ar": "أبجديات وحروف",
    "zhc": "字母系统",
    "it": "Alfabeti",
    "pt": "Alfabetos",
    "ru": "Алфавиты",
    "ja": "文字・アルファベット",
    "hi": "वर्णमाला"
  },
  "Numbers": {
    "es": "Números",
    "fr": "Nombres",
    "de": "Zahlen",
    "ar": "الأرقام",
    "zhc": "数字",
    "it": "Numeri",
    "pt": "Números",
    "ru": "Числа",
    "ja": "数字",
    "hi": "संख्याएँ"
  },
  "Shapes": {
    "es": "Formas geométricas",
    "fr": "Formes",
    "de": "Formen",
    "ar": "أشكال هندسية",
    "zhc": "形状",
    "it": "Forme",
    "pt": "Formas",
    "ru": "Геометрические фигуры",
    "ja": "図形・形",
    "hi": "आकृतियाँ"
  },
  "Maths": {
    "es": "Matemáticas",
    "fr": "Mathématiques",
    "de": "Mathematik",
    "ar": "الرياضيات",
    "zhc": "数学",
    "it": "Matematica",
    "pt": "Matemática",
    "ru": "Математика",
    "ja": "算数・数学",
    "hi": "गणित"
  },
  "Science": {
    "es": "Ciencias",
    "fr": "Sciences",
    "de": "Wissenschaft",
    "ar": "العلوم",
    "zhc": "科学",
    "it": "Scienze",
    "pt": "Ciências",
    "ru": "Наука",
    "ja": "科学・理科",
    "hi": "विज्ञान"
  },
  "Geography": {
    "es": "Geografía",
    "fr": "Géographie",
    "de": "Geografie",
    "ar": "الجغرافيا",
    "zhc": "地理",
    "it": "Geografia",
    "pt": "Geografia",
    "ru": "География",
    "ja": "地理",
    "hi": "भूगोल"
  },
  "History": {
    "es": "Historia",
    "fr": "Histoire",
    "de": "Geschichte",
    "ar": "التاريخ",
    "zhc": "历史",
    "it": "Storia",
    "pt": "História",
    "ru": "История",
    "ja": "歴史",
    "hi": "इतिहास"
  },
  "World Landmarks": {
    "es": "Monumentos del mundo",
    "fr": "Monuments du monde",
    "de": "Sehenswürdigkeiten",
    "ar": "معالم العالم الشهيرة",
    "zhc": "世界地标",
    "it": "Monumenti mondiali",
    "pt": "Monumentos do mundo",
    "ru": "Мировые достопримечательности",
    "ja": "世界の建造物・名所",
    "hi": "विश्व के प्रसिद्ध स्थल"
  },
  "Diversity and Inclusion": {
    "es": "Diversidad e inclusión",
    "fr": "Diversité et inclusion",
    "de": "Vielfalt & Inklusion",
    "ar": "التنوع والشمول",
    "zhc": "多元与包容",
    "it": "Diversità e inclusione",
    "pt": "Diversidade e inclusão",
    "ru": "Разнообразие и инклюзия",
    "ja": "多様性とインクルージョン",
    "hi": "विविधता और समावेशन"
  },
  "Plurals and tenses": {
    "es": "Plurales y tiempos",
    "fr": "Pluriels et temps",
    "de": "Plurale und Zeiten",
    "ar": "الجموع وتصريف الأفعال",
    "zhc": "复数与时态变体",
    "it": "Plurali e tempi",
    "pt": "Plurais e tempos",
    "ru": "Множественное число и времена",
    "ja": "複数形と時制",
    "hi": "बहुवचन और काल"
  }
};
  const CONTEXTUAL_CONCEPTS = {
  "board": {
    "AAC Device": {
      "es": "Tablero de comunicación",
      "fr": "Tableau de communication",
      "de": "Kommunikationstafel",
      "ar": "لوحة تواصل",
      "zhc": "沟通板",
      "it": "Tabella di comunicazione",
      "pt": "Prancha de comunicação",
      "ja": "コミュニケーションボード",
      "hi": "संचार बोर्ड"
    },
    "Business and Workplace Concepts": {
      "es": "Junta directiva",
      "fr": "Conseil d'administration",
      "de": "Vorstand",
      "ar": "مجلس إدارة",
      "zhc": "董事会",
      "it": "Consiglio di amministrazione",
      "pt": "Conselho de administração",
      "ja": "取締役会",
      "hi": "निदेशक मंडल"
    },
    "Work and Jobs": {
      "es": "Junta directiva",
      "fr": "Conseil d'administration",
      "de": "Vorstand",
      "ar": "مجلس إدارة",
      "zhc": "董事会",
      "it": "Consiglio di amministrazione",
      "pt": "Conselho de administração",
      "ja": "取締役会",
      "hi": "निदेशक मंडल"
    },
    "Games": {
      "es": "Tablero de juego",
      "fr": "Plateau de jeu",
      "de": "Spielbrett",
      "ar": "لوحة ألعاب",
      "zhc": "棋盘",
      "it": "Tavola da gioco",
      "pt": "Tabuleiro de jogo",
      "ja": "ゲーム盤",
      "hi": "गेम बोर्ड"
    },
    "Transport": {
      "es": "Embarcar / Subir",
      "fr": "Embarquer / Monter",
      "de": "Einsteigen / An Bord gehen",
      "ar": "صعود / ركوب",
      "zhc": "登机/上车",
      "it": "Imbarcarsi",
      "pt": "Embarcar",
      "ja": "乗車・搭乗",
      "hi": "सवार होना"
    },
    "default": {
      "es": "Tablero",
      "fr": "Tableau",
      "de": "Tafel / Brett",
      "ar": "لوحة",
      "zhc": "板",
      "it": "Tavola",
      "pt": "Quadro / Tabuleiro",
      "ja": "板",
      "hi": "तख्ता / बोर्ड"
    }
  },
  "play": {
    "Games": {
      "es": "Jugar",
      "fr": "Jouer",
      "de": "Spielen",
      "ar": "لعب",
      "zhc": "玩耍 / 游戏",
      "it": "Giocare",
      "pt": "Brincar / Jogar",
      "ja": "遊ぶ",
      "hi": "खेलना"
    },
    "Music": {
      "es": "Tocar instrumento",
      "fr": "Jouer de la musique",
      "de": "Musizieren",
      "ar": "عزف",
      "zhc": "演奏",
      "it": "Suonare",
      "pt": "Tocar música",
      "ja": "演奏する",
      "hi": "बजाना"
    },
    "Instruments": {
      "es": "Tocar instrumento",
      "fr": "Jouer d'un instrument",
      "de": "Instrument spielen",
      "ar": "عزف آلة",
      "zhc": "弹奏",
      "it": "Suonare uno strumento",
      "pt": "Tocar instrumento",
      "ja": "楽器を演奏する",
      "hi": "वाद्य बजाना"
    },
    "Storytelling": {
      "es": "Obra de teatro",
      "fr": "Pièce de théâtre",
      "de": "Theaterstück",
      "ar": "مسرحية",
      "zhc": "戏剧表演",
      "it": "Spettacolo teatrale",
      "pt": "Peça de teatro",
      "ja": "演劇・劇",
      "hi": "नाटक"
    },
    "default": {
      "es": "Jugar",
      "fr": "Jouer",
      "de": "Spielen",
      "ar": "لعب",
      "zhc": "玩",
      "it": "Giocare",
      "pt": "Jogar",
      "ja": "遊ぶ",
      "hi": "खेलना"
    }
  },
  "scale": {
    "Kitchen Objects": {
      "es": "Báscula de cocina",
      "fr": "Balance de cuisine",
      "de": "Küchenwaage",
      "ar": "ميزان مطبخ",
      "zhc": "厨房秤",
      "it": "Bilancia da cucina",
      "pt": "Balança de cozinha",
      "ja": "キッチンスケール",
      "hi": "रसोई तराजू"
    },
    "Measuring": {
      "es": "Báscula / Balanza",
      "fr": "Balance de mesure",
      "de": "Waage",
      "ar": "ميزان قياس",
      "zhc": "天平 / 称",
      "it": "Bilancia",
      "pt": "Balança",
      "ja": "体重計・天秤",
      "hi": "तराजू"
    },
    "Animals": {
      "es": "Escama",
      "fr": "Écaille",
      "de": "Schuppe",
      "ar": "حرشفة سمك",
      "zhc": "鱼鳞",
      "it": "Squama",
      "pt": "Escama",
      "ja": "うろこ",
      "hi": "शल्क"
    },
    "Music": {
      "es": "Escala musical",
      "fr": "Gamme musicale",
      "de": "Tonleiter",
      "ar": "سلم موسيقي",
      "zhc": "音阶",
      "it": "Scala musicale",
      "pt": "Escala musical",
      "ja": "音階",
      "hi": "सरगम / स्केल"
    },
    "default": {
      "es": "Báscula / Escala",
      "fr": "Balance / Échelle",
      "de": "Waage / Skala",
      "ar": "ميزان / مقياس",
      "zhc": "秤 / 尺度",
      "it": "Bilancia / Scala",
      "pt": "Balança / Escala",
      "ja": "目盛り・秤",
      "hi": "पैमाना / तराजू"
    }
  },
  "ring": {
    "Clothing": {
      "es": "Anillo",
      "fr": "Bague",
      "de": "Ring (Schmuck)",
      "ar": "خاتم",
      "zhc": "戒指",
      "it": "Anello",
      "pt": "Anel",
      "ja": "指輪",
      "hi": "अंगूठी"
    },
    "Technology": {
      "es": "Sonar / Timbre",
      "fr": "Sonnerie",
      "de": "Klingeln",
      "ar": "رنين الهاتف",
      "zhc": "电话铃声",
      "it": "Suoneria",
      "pt": "Toque de telefone",
      "ja": "着信音・ベル",
      "hi": "घंटी बजना"
    },
    "Sports": {
      "es": "Cuadrilátero de boxeo",
      "fr": "Ring de boxe",
      "de": "Boxring",
      "ar": "حلبة ملاكمة",
      "zhc": "拳击台",
      "it": "Ring di pugilato",
      "pt": "Ringue",
      "ja": "リング（ボクシング）",
      "hi": "मुक्केबाजी रिंग"
    },
    "default": {
      "es": "Anillo / Timbre",
      "fr": "Bague / Sonnerie",
      "de": "Ring / Klingel",
      "ar": "خاتم / رنين",
      "zhc": "戒指 / 铃声",
      "it": "Anello / Squillo",
      "pt": "Anel / Toque",
      "ja": "リング",
      "hi": "अंगूठी / घंटी"
    }
  },
  "tie": {
    "Clothing": {
      "es": "Corbata",
      "fr": "Cravate",
      "de": "Krawatte",
      "ar": "ربطة عنق",
      "zhc": "领带",
      "it": "Cravatta",
      "pt": "Gravata",
      "ja": "ネクタイ",
      "hi": "टाई"
    },
    "Life Skills": {
      "es": "Atar cordones",
      "fr": "Nouer les lacets",
      "de": "Binden / Schnüren",
      "ar": "ربط الحذاء",
      "zhc": "系鞋带",
      "it": "Allacciare le scarpe",
      "pt": "Amarrar sapatos",
      "ja": "結ぶ（靴紐など）",
      "hi": "फीता बांधना"
    },
    "Sports": {
      "es": "Empate",
      "fr": "Égalité / Match nul",
      "de": "Unentschieden",
      "ar": "تعادل",
      "zhc": "平局",
      "it": "Pareggio",
      "pt": "Empate",
      "ja": "引き分け",
      "hi": "बराबरी (टाई)"
    },
    "default": {
      "es": "Corbata / Atar",
      "fr": "Cravate / Nouer",
      "de": "Krawatte / Binden",
      "ar": "ربطة عنق / ربط",
      "zhc": "领带 / 系",
      "it": "Cravatta / Legare",
      "pt": "Gravata / Amarrar",
      "ja": "ネクタイ・結ぶ",
      "hi": "टाई / बांधना"
    }
  },
  "park": {
    "Community Places": {
      "es": "Parque público",
      "fr": "Parc public",
      "de": "Parkanlage",
      "ar": "حديقة عامة",
      "zhc": "公园",
      "it": "Parco pubblico",
      "pt": "Parque público",
      "ja": "公園",
      "hi": "सार्वजनिक पार्क"
    },
    "Places": {
      "es": "Parque",
      "fr": "Parc",
      "de": "Park",
      "ar": "حديقة",
      "zhc": "公园",
      "it": "Parco",
      "pt": "Parque",
      "ja": "公園",
      "hi": "पार्क"
    },
    "Transport": {
      "es": "Estacionar vehículo",
      "fr": "Stationner / Garer",
      "de": "Einparken",
      "ar": "ركن السيارة",
      "zhc": "停车",
      "it": "Parcheggiare",
      "pt": "Estacionar",
      "ja": "駐車する",
      "hi": "पार्क करना"
    },
    "default": {
      "es": "Parque",
      "fr": "Parc",
      "de": "Park",
      "ar": "حديقة",
      "zhc": "公园",
      "it": "Parco",
      "pt": "Parque",
      "ja": "公園",
      "hi": "पार्क"
    }
  },
  "bat": {
    "Animals": {
      "es": "Murciélago",
      "fr": "Chauve-souris",
      "de": "Fledermaus",
      "ar": "خفاش",
      "zhc": "蝙蝠",
      "it": "Pipistrello",
      "pt": "Morcego",
      "ja": "コウモリ",
      "hi": "चमगादड़"
    },
    "Sports": {
      "es": "Bate de béisbol / críquet",
      "fr": "Batte",
      "de": "Schläger (Baseball/Cricket)",
      "ar": "مضرب بيسبول",
      "zhc": "球棒",
      "it": "Mazza da baseball",
      "pt": "Taco de beisebol",
      "ja": "バット（野球）",
      "hi": "बल्ला"
    },
    "Toys": {
      "es": "Bate de juguete",
      "fr": "Batte de jeu",
      "de": "Spielzeugschläger",
      "ar": "مضرب ألعاب",
      "zhc": "玩具球棒",
      "it": "Mazza giocattolo",
      "pt": "Taco de brinquedo",
      "ja": "おもちゃのバット",
      "hi": "खिलौना बल्ला"
    },
    "default": {
      "es": "Murciélago / Bate",
      "fr": "Chauve-souris / Batte",
      "de": "Fledermaus / Schläger",
      "ar": "خفاش / مضرب",
      "zhc": "蝙蝠 / 球棒",
      "it": "Pipistrello / Mazza",
      "pt": "Morcego / Taco",
      "ja": "コウモリ / バット",
      "hi": "चमगादड़ / बल्ला"
    }
  },
  "bank": {
    "Community Places": {
      "es": "Banco financiero",
      "fr": "Banque",
      "de": "Bank (Geldinstitut)",
      "ar": "مصرف / بنك",
      "zhc": "银行",
      "it": "Banca",
      "pt": "Banco",
      "ja": "銀行",
      "hi": "बैंक"
    },
    "Money": {
      "es": "Banco",
      "fr": "Banque",
      "de": "Bank",
      "ar": "بنك",
      "zhc": "银行",
      "it": "Banca",
      "pt": "Banco",
      "ja": "銀行",
      "hi": "बैंक"
    },
    "Nature": {
      "es": "Orilla del río",
      "fr": "Rive du fleuve",
      "de": "Flussufer",
      "ar": "ضفة النهر",
      "zhc": "河岸",
      "it": "Riva del fiume",
      "pt": "Margem do rio",
      "ja": "川岸・土手",
      "hi": "नदी का किनारा"
    },
    "default": {
      "es": "Banco",
      "fr": "Banque",
      "de": "Bank / Ufer",
      "ar": "بنك / ضفة",
      "zhc": "银行 / 河岸",
      "it": "Banca / Riva",
      "pt": "Banco / Margem",
      "ja": "銀行 / 土手",
      "hi": "बैंक / किनारा"
    }
  },
  "fly": {
    "Animals": {
      "es": "Mosca",
      "fr": "Mouche",
      "de": "Fliege (Insekt)",
      "ar": "ذبابة",
      "zhc": "苍蝇",
      "it": "Mosca",
      "pt": "Mosca",
      "ja": "ハエ",
      "hi": "मक्खी"
    },
    "Insects": {
      "es": "Mosca",
      "fr": "Mouche",
      "de": "Fliege",
      "ar": "ذبابة",
      "zhc": "苍蝇",
      "it": "Mosca",
      "pt": "Mosca",
      "ja": "ハエ",
      "hi": "मक्खी"
    },
    "Verbs": {
      "es": "Volar",
      "fr": "Voler",
      "de": "Fliegen",
      "ar": "يطير",
      "zhc": "飞行",
      "it": "Volare",
      "pt": "Voar",
      "ja": "飛ぶ",
      "hi": "उड़ना"
    },
    "Transport": {
      "es": "Volar en avión",
      "fr": "Prendre l'avion",
      "de": "Fliegen (Flugzeug)",
      "ar": "سفر بالطائرة",
      "zhc": "乘机飞行",
      "it": "Volare in aereo",
      "pt": "Voar de avião",
      "ja": "飛行機に乗る",
      "hi": "विमान से उड़ना"
    },
    "default": {
      "es": "Mosca / Volar",
      "fr": "Mouche / Voler",
      "de": "Fliege / Fliegen",
      "ar": "ذبابة / يطير",
      "zhc": "苍蝇 / 飞",
      "it": "Mosca / Volare",
      "pt": "Mosca / Voar",
      "ja": "ハエ / 飛ぶ",
      "hi": "मक्खी / उड़ना"
    }
  },
  "duck": {
    "Animals": {
      "es": "Pato",
      "fr": "Canard",
      "de": "Ente",
      "ar": "بطة",
      "zhc": "鸭子",
      "it": "Anatra",
      "pt": "Pato",
      "ja": "アヒル・カモ",
      "hi": "बत्तख"
    },
    "Birds": {
      "es": "Pato",
      "fr": "Canard",
      "de": "Ente",
      "ar": "بطة",
      "zhc": "鸭子",
      "it": "Anatra",
      "pt": "Pato",
      "ja": "アヒル",
      "hi": "बत्तख"
    },
    "Verbs": {
      "es": "Agacharse / Esquivar",
      "fr": "S'abaisser / Esquiver",
      "de": "Sich ducken",
      "ar": "ينحني / يطأطئ",
      "zhc": "躲闪 / 蹲下",
      "it": "Chinarsi",
      "pt": "Abaixar-se",
      "ja": "しゃがむ・身をかわす",
      "hi": "झुकना"
    },
    "default": {
      "es": "Pato",
      "fr": "Canard",
      "de": "Ente",
      "ar": "بطة",
      "zhc": "鸭子",
      "it": "Anatra",
      "pt": "Pato",
      "ja": "アヒル",
      "hi": "बत्तख"
    }
  },
  "bark": {
    "Animals": {
      "es": "Ladrido de perro",
      "fr": "Aboyement",
      "de": "Bellen",
      "ar": "نباح الكلب",
      "zhc": "狗叫声",
      "it": "Abbaio",
      "pt": "Latido",
      "ja": "犬の鳴き声",
      "hi": "भौंकना"
    },
    "Nature": {
      "es": "Corteza de árbol",
      "fr": "Écorce d'arbre",
      "de": "Baumrinde",
      "ar": "لحاء الشجر",
      "zhc": "树皮",
      "it": "Corteccia",
      "pt": "Casca de árvore",
      "ja": "樹皮",
      "hi": "पेड़ की छाल"
    },
    "Plants": {
      "es": "Corteza de árbol",
      "fr": "Écorce",
      "de": "Baumrinde",
      "ar": "لحاء الشجر",
      "zhc": "树皮",
      "it": "Corteccia",
      "pt": "Casca",
      "ja": "樹皮",
      "hi": "छाल"
    },
    "default": {
      "es": "Ladrido / Corteza",
      "fr": "Aboyer / Écorce",
      "de": "Bellen / Baumrinde",
      "ar": "نباح / لحاء",
      "zhc": "吠叫 / 树皮",
      "it": "Abbaiare / Corteccia",
      "pt": "Latir / Casca",
      "ja": "鳴く / 樹皮",
      "hi": "भौंकना / छाल"
    }
  },
  "fall": {
    "Weather": {
      "es": "Otoño",
      "fr": "Automne",
      "de": "Herbst",
      "ar": "فصل الخريف",
      "zhc": "秋天",
      "it": "Autunno",
      "pt": "Outono",
      "ja": "秋",
      "hi": "शरद ऋतु (पतझड़)"
    },
    "Time": {
      "es": "Otoño",
      "fr": "Automne",
      "de": "Herbst",
      "ar": "الخريف",
      "zhc": "秋季",
      "it": "Autunno",
      "pt": "Outono",
      "ja": "秋",
      "hi": "पतझड़"
    },
    "Verbs": {
      "es": "Caerse",
      "fr": "Tomber",
      "de": "Fallen / Hinfallen",
      "ar": "يسقط / يقع",
      "zhc": "跌倒 / 掉落",
      "it": "Cadere",
      "pt": "Cair",
      "ja": "転ぶ・落ちる",
      "hi": "गिरना"
    },
    "default": {
      "es": "Otoño / Caer",
      "fr": "Automne / Tomber",
      "de": "Herbst / Fallen",
      "ar": "خريف / سقوط",
      "zhc": "秋天 / 跌落",
      "it": "Autunno / Cadere",
      "pt": "Outono / Cair",
      "ja": "秋 / 落ちる",
      "hi": "पतझड़ / गिरना"
    }
  },
  "wave": {
    "Verbs": {
      "es": "Saludar con la mano",
      "fr": "Faire un signe de la main",
      "de": "Winken",
      "ar": "يلوح بيده",
      "zhc": "挥手打招呼",
      "it": "Salutare con la mano",
      "pt": "Acenar",
      "ja": "手を振る",
      "hi": "हाथ हिलाना"
    },
    "Social and Emotional": {
      "es": "Saludar con la mano",
      "fr": "Faire signe",
      "de": "Winken",
      "ar": "يلوح بيده",
      "zhc": "挥手",
      "it": "Salutare",
      "pt": "Acenar",
      "ja": "手を振る",
      "hi": "अभिवादन करना"
    },
    "Nature": {
      "es": "Ola del mar",
      "fr": "Vague de mer",
      "de": "Meereswelle",
      "ar": "موجة البحر",
      "zhc": "海浪",
      "it": "Onda marina",
      "pt": "Onda do mar",
      "ja": "海の波",
      "hi": "समुद्री लहर"
    },
    "Weather": {
      "es": "Ola de calor / frío",
      "fr": "Vague de chaleur",
      "de": "Welle",
      "ar": "موجة حرارة",
      "zhc": "气温波",
      "it": "Ondata",
      "pt": "Onda",
      "ja": "熱波・波",
      "hi": "लहर"
    },
    "default": {
      "es": "Saludar / Ola",
      "fr": "Faire signe / Vague",
      "de": "Winken / Welle",
      "ar": "يلوح / موجة",
      "zhc": "挥手 / 波浪",
      "it": "Salutare / Onda",
      "pt": "Aceno / Onda",
      "ja": "手を振る / 波",
      "hi": "हाथ हिलाना / लहर"
    }
  },
  "plant": {
    "Nature": {
      "es": "Planta",
      "fr": "Plante",
      "de": "Pflanze",
      "ar": "نبات",
      "zhc": "植物",
      "it": "Pianta",
      "pt": "Planta",
      "ja": "植物",
      "hi": "पौधा"
    },
    "Plants": {
      "es": "Planta",
      "fr": "Plante",
      "de": "Pflanze",
      "ar": "نبات",
      "zhc": "植物",
      "it": "Pianta",
      "pt": "Planta",
      "ja": "植物",
      "hi": "पौधा"
    },
    "Work and Jobs": {
      "es": "Fábrica / Planta industrial",
      "fr": "Usine industrielle",
      "de": "Industrieanlage / Werk",
      "ar": "مصنع / منشأة صناعية",
      "zhc": "工厂 / 厂房",
      "it": "Impianto industriale",
      "pt": "Fábrica / Usina",
      "ja": "工場・プラント",
      "hi": "कारखाना / संयंत्र"
    },
    "Verbs": {
      "es": "Plantar / Sembrar",
      "fr": "Planter",
      "de": "Pflanzen / Säen",
      "ar": "يزرع",
      "zhc": "种植",
      "it": "Piantare",
      "pt": "Plantar",
      "ja": "植える",
      "hi": "पौधा लगाना"
    },
    "default": {
      "es": "Planta",
      "fr": "Plante",
      "de": "Pflanze",
      "ar": "نبات",
      "zhc": "植物",
      "it": "Pianta",
      "pt": "Planta",
      "ja": "植物",
      "hi": "पौधा"
    }
  },
  "train": {
    "Transport": {
      "es": "Tren",
      "fr": "Train",
      "de": "Zug / Eisenbahn",
      "ar": "قطار",
      "zhc": "火车",
      "it": "Treno",
      "pt": "Trem",
      "ja": "電車・列車",
      "hi": "रेलगाड़ी"
    },
    "Sports": {
      "es": "Entrenar / Ejercicio",
      "fr": "S'entraîner",
      "de": "Trainieren",
      "ar": "يتدرب / تمرين",
      "zhc": "体育锻炼 / 训练",
      "it": "Allenarsi",
      "pt": "Treinar",
      "ja": "トレーニングする",
      "hi": "प्रशिक्षण लेना"
    },
    "Verbs": {
      "es": "Entrenar / Capacitar",
      "fr": "Entraîner / Former",
      "de": "Trainieren / Schulen",
      "ar": "يدرب",
      "zhc": "训练 / 培训",
      "it": "Addestrare",
      "pt": "Capacitar",
      "ja": "訓練する",
      "hi": "ट्रेनिंग देना"
    },
    "default": {
      "es": "Tren",
      "fr": "Train",
      "de": "Zug",
      "ar": "قطار",
      "zhc": "火车",
      "it": "Treno",
      "pt": "Trem",
      "ja": "電車",
      "hi": "ट्रेन"
    }
  },
  "saw": {
    "Tools": {
      "es": "Sierra de mano",
      "fr": "Scie à main",
      "de": "Handsäge",
      "ar": "منشار يدوي",
      "zhc": "锯子",
      "it": "Sega a mano",
      "pt": "Serra",
      "ja": "のこぎり",
      "hi": "आरी"
    },
    "Verbs": {
      "es": "Vio (pasado de ver)",
      "fr": "A vu (passé de voir)",
      "de": "Sah (Vergangenheit von sehen)",
      "ar": "رأى",
      "zhc": "看见了 (过去式)",
      "it": "Ha visto",
      "pt": "Viu",
      "ja": "見た",
      "hi": "देखा"
    },
    "default": {
      "es": "Sierra / Vio",
      "fr": "Scie / A vu",
      "de": "Säge / Sah",
      "ar": "منشار / رأى",
      "zhc": "锯子 / 看见",
      "it": "Sega / Visto",
      "pt": "Serra / Viu",
      "ja": "のこぎり / 見た",
      "hi": "आरी / देखा"
    }
  },
  "match": {
    "Household Objects": {
      "es": "Cerilla / Fósforo",
      "fr": "Allumette",
      "de": "Streichholz",
      "ar": "عود ثقاب",
      "zhc": "火柴",
      "it": "Fiammifero",
      "pt": "Fósforo",
      "ja": "マッチ",
      "hi": "माचिस की तीली"
    },
    "Sports": {
      "es": "Partido deportivo",
      "fr": "Match sportif",
      "de": "Wettkampf / Spiel",
      "ar": "مباراة رياضية",
      "zhc": "体育比赛",
      "it": "Partita",
      "pt": "Partida",
      "ja": "試合",
      "hi": "मैच"
    },
    "Verbs": {
      "es": "Emparejar / Coincidir",
      "fr": "Associer / Correspondre",
      "de": "Zuordnen / Passen",
      "ar": "يطابق / يوفق",
      "zhc": "配对 / 匹配",
      "it": "Abbinare",
      "pt": "Combinar",
      "ja": "合わせる・一致する",
      "hi": "मिलान करना"
    },
    "default": {
      "es": "Cerilla / Partido",
      "fr": "Allumette / Match",
      "de": "Streichholz / Spiel",
      "ar": "عود ثقاب / مباراة",
      "zhc": "火柴 / 比赛",
      "it": "Fiammifero / Partita",
      "pt": "Fósforo / Jogo",
      "ja": "マッチ / 試合",
      "hi": "माचिस / मैच"
    }
  },
  "rock": {
    "Nature": {
      "es": "Roca / Piedra",
      "fr": "Roche / Pierre",
      "de": "Fels / Stein",
      "ar": "صخرة / حجر",
      "zhc": "岩石 / 石头",
      "it": "Roccia / Sasso",
      "pt": "Rocha / Pedra",
      "ja": "岩・石",
      "hi": "चट्टान / पत्थर"
    },
    "Music": {
      "es": "Música rock",
      "fr": "Musique rock",
      "de": "Rockmusik",
      "ar": "موسيقى الروك",
      "zhc": "摇滚乐",
      "it": "Musica rock",
      "pt": "Rock",
      "ja": "ロック音楽",
      "hi": "रॉक संगीत"
    },
    "Verbs": {
      "es": "Mecer / Balancear",
      "fr": "Bercer / Balancer",
      "de": "Wiegen / Schaukeln",
      "ar": "يهز / يتأرجح",
      "zhc": "摇晃",
      "it": "Dondolare",
      "pt": "Balançar",
      "ja": "揺らす",
      "hi": "झूलना / हिलाना"
    },
    "default": {
      "es": "Roca",
      "fr": "Rocher",
      "de": "Stein",
      "ar": "صخرة",
      "zhc": "岩石",
      "it": "Roccia",
      "pt": "Rocha",
      "ja": "岩",
      "hi": "चट्टान"
    }
  },
  "seal": {
    "Animals": {
      "es": "Foca",
      "fr": "Phoque",
      "de": "Seehund / Robbe",
      "ar": "فقمة",
      "zhc": "海豹",
      "it": "Foca",
      "pt": "Foca",
      "ja": "アザラシ",
      "hi": "सील (जलचर)"
    },
    "Tools": {
      "es": "Sello / Precinto",
      "fr": "Sceau / Cachet",
      "de": "Siegel / Stempel",
      "ar": "ختم رسمي",
      "zhc": "印章 / 封条",
      "it": "Sigillo / Timbro",
      "pt": "Selo / Lacre",
      "ja": "印鑑・封印",
      "hi": "मुहर / सील"
    },
    "default": {
      "es": "Foca / Sello",
      "fr": "Phoque / Sceau",
      "de": "Robbe / Siegel",
      "ar": "فقمة / ختم",
      "zhc": "海豹 / 印章",
      "it": "Foca / Sigillo",
      "pt": "Foca / Selo",
      "ja": "アザラシ / 封",
      "hi": "सील / मुहर"
    }
  },
  "spring": {
    "Weather": {
      "es": "Primavera",
      "fr": "Printemps",
      "de": "Frühling",
      "ar": "فصل الربيع",
      "zhc": "春天",
      "it": "Primavera",
      "pt": "Primavera",
      "ja": "春",
      "hi": "बसंत ऋतु"
    },
    "Time": {
      "es": "Primavera",
      "fr": "Printemps",
      "de": "Frühling",
      "ar": "الربيع",
      "zhc": "春季",
      "it": "Primavera",
      "pt": "Primavera",
      "ja": "春",
      "hi": "बसंत"
    },
    "Household Objects": {
      "es": "Muelle / Resorte",
      "fr": "Ressort",
      "de": "Sprungfeder",
      "ar": "زنبرك / سلك لولبي",
      "zhc": "弹簧",
      "it": "Molla",
      "pt": "Mola",
      "ja": "バネ・スプリング",
      "hi": "कमानी (स्प्रिंग)"
    },
    "Nature": {
      "es": "Manantial de agua",
      "fr": "Source d'eau",
      "de": "Wasserquelle",
      "ar": "نبع ماء",
      "zhc": "泉水",
      "it": "Sorgente d'acqua",
      "pt": "Fonte de água",
      "ja": "泉・湧水",
      "hi": "पानी का झरना/सोता"
    },
    "default": {
      "es": "Primavera / Resorte",
      "fr": "Printemps / Ressort",
      "de": "Frühling / Feder",
      "ar": "ربيع / زنبرك",
      "zhc": "春天 / 弹簧",
      "it": "Primavera / Molla",
      "pt": "Primavera / Mola",
      "ja": "春 / バネ",
      "hi": "बसंत / कमानी"
    }
  },
  "trunk": {
    "Animals": {
      "es": "Trompa de elefante",
      "fr": "Trompe d'éléphant",
      "de": "Elefantenrüssel",
      "ar": "خرطوم الفيل",
      "zhc": "象鼻",
      "it": "Proboscide",
      "pt": "Tromba de elefante",
      "ja": "象の鼻",
      "hi": "हाथी की सूंड"
    },
    "Nature": {
      "es": "Tronco de árbol",
      "fr": "Tronc d'arbre",
      "de": "Baumstamm",
      "ar": "جذع شجرة",
      "zhc": "树干",
      "it": "Tronco d'albero",
      "pt": "Tronco de árvore",
      "ja": "木の幹",
      "hi": "पेड़ का तना"
    },
    "Transport": {
      "es": "Maletero del coche",
      "fr": "Coffre de voiture",
      "de": "Kofferraum",
      "ar": "صندوق السيارة",
      "zhc": "后备箱",
      "it": "Portabagagli",
      "pt": "Porta-malas",
      "ja": "車のトランク",
      "hi": "कार की डिक्की"
    },
    "Clothing": {
      "es": "Bañador / Pantalón corto",
      "fr": "Maillot de bain",
      "de": "Badehose",
      "ar": "شورت سباحة",
      "zhc": "泳裤",
      "it": "Costume da bagno",
      "pt": "Calção de banho",
      "ja": "海パン・トランクス",
      "hi": "स्विमिंग ट्रंक"
    },
    "default": {
      "es": "Tronco / Trompa",
      "fr": "Tronc / Trompe",
      "de": "Stamm / Rüssel",
      "ar": "جذع / خرطوم",
      "zhc": "树干 / 象鼻",
      "it": "Tronco / Proboscide",
      "pt": "Tronco / Tromba",
      "ja": "幹 / 象の鼻",
      "hi": "तना / सूंड"
    }
  },
  "mouse": {
    "Animals": {
      "es": "Ratón (animal)",
      "fr": "Souris (animal)",
      "de": "Maus (Tier)",
      "ar": "فأر",
      "zhc": "老鼠",
      "it": "Topo",
      "pt": "Rato",
      "ja": "ネズミ",
      "hi": "चूहा"
    },
    "Technology": {
      "es": "Ratón de ordenador",
      "fr": "Souris d'ordinateur",
      "de": "Computermaus",
      "ar": "فأرة حاسوب",
      "zhc": "电脑鼠标",
      "it": "Mouse per computer",
      "pt": "Mouse de computador",
      "ja": "パソコンのマウス",
      "hi": "कंप्यूटर माउस"
    },
    "default": {
      "es": "Ratón",
      "fr": "Souris",
      "de": "Maus",
      "ar": "فأر",
      "zhc": "鼠标 / 老鼠",
      "it": "Mouse",
      "pt": "Mouse",
      "ja": "マウス",
      "hi": "माउस"
    }
  },
  "chest": {
    "Health": {
      "es": "Pecho / Tórax",
      "fr": "Poitrine / Torse",
      "de": "Brustkorb",
      "ar": "الصدر",
      "zhc": "胸膛",
      "it": "Petto",
      "pt": "Peito",
      "ja": "胸",
      "hi": "छाती"
    },
    "Household Objects": {
      "es": "Cofre / Baúl",
      "fr": "Coffre de rangement",
      "de": "Truhe",
      "ar": "صندوق تخزين",
      "zhc": "收纳箱 / 百宝箱",
      "it": "Cassapanca",
      "pt": "Baú",
      "ja": "衣装箱・宝箱",
      "hi": "संदूक / बक्सा"
    },
    "default": {
      "es": "Pecho / Cofre",
      "fr": "Poitrine / Coffre",
      "de": "Brust / Truhe",
      "ar": "صدر / صندوق",
      "zhc": "胸膛 / 箱子",
      "it": "Petto / Cassapanca",
      "pt": "Peito / Baú",
      "ja": "胸 / 箱",
      "hi": "छाती / संदूक"
    }
  },
  "sign": {
    "American Sign Language": {
      "es": "Gesto de lengua de signos",
      "fr": "Signe en langue des signes",
      "de": "Gebärdenzeichen",
      "ar": "إشارة لغة الصم",
      "zhc": "手语动作",
      "it": "Segno LIS",
      "pt": "Sinal de Libras",
      "ja": "手話の合図",
      "hi": "सांकेतिक भाषा"
    },
    "Community Places": {
      "es": "Señal de tráfico / Cartel",
      "fr": "Panneau de signalisation",
      "de": "Hinweisschild",
      "ar": "لافتة إرشادية",
      "zhc": "路标 / 标识牌",
      "it": "Cartello stradale",
      "pt": "Placa de trânsito",
      "ja": "標識・看板",
      "hi": "संकेत बोर्ड"
    },
    "Verbs": {
      "es": "Firmar con bolígrafo",
      "fr": "Signer",
      "de": "Unterschreiben",
      "ar": "يوقع بالقلم",
      "zhc": "签字 / 署名",
      "it": "Firmare",
      "pt": "Assinar",
      "ja": "署名する",
      "hi": "हस्ताक्षर करना"
    },
    "default": {
      "es": "Señal / Firmar",
      "fr": "Signe / Panneau",
      "de": "Schild / Gebärde",
      "ar": "إشارة / لافتة",
      "zhc": "标志 / 手语",
      "it": "Segno / Cartello",
      "pt": "Sinal / Placa",
      "ja": "サイン・標識",
      "hi": "संकेत / मुहर"
    }
  },
  "fan": {
    "Household Objects": {
      "es": "Ventilador / Abanico",
      "fr": "Ventilateur / Éventail",
      "de": "Ventilator / Fächer",
      "ar": "مروحة",
      "zhc": "电风扇 / 折扇",
      "it": "Ventilatore",
      "pt": "Ventilador / Leque",
      "ja": "扇風機・うちわ",
      "hi": "पंखा"
    },
    "Sports": {
      "es": "Aficionado / Hincha",
      "fr": "Supporter / Fan",
      "de": "Sportfan / Anhänger",
      "ar": "مشجع رياضي",
      "zhc": "球迷 / 粉丝",
      "it": "Tifoso",
      "pt": "Torcedor",
      "ja": "ファン・サポーター",
      "hi": "प्रशंसक (फैन)"
    },
    "default": {
      "es": "Ventilador / Fan",
      "fr": "Ventilateur / Fan",
      "de": "Ventilator / Fan",
      "ar": "مروحة / مشجع",
      "zhc": "风扇 / 粉丝",
      "it": "Ventilatore / Fan",
      "pt": "Ventilador / Fã",
      "ja": "ファン / 扇風機",
      "hi": "पंखा / प्रशंसक"
    }
  },
  "star": {
    "Nature": {
      "es": "Estrella del cielo",
      "fr": "Étoile du ciel",
      "de": "Himmelsstern",
      "ar": "نجم السماء",
      "zhc": "天上的星星",
      "it": "Stella del cielo",
      "pt": "Estrela do céu",
      "ja": "星（天体）",
      "hi": "आकाश का तारा"
    },
    "Feelings Extra": {
      "es": "Estrella brillante",
      "fr": "Étoile",
      "de": "Stern",
      "ar": "نجمة مميزة",
      "zhc": "闪亮明星",
      "it": "Stella",
      "pt": "Estrela",
      "ja": "星・スター",
      "hi": "तारा"
    },
    "default": {
      "es": "Estrella",
      "fr": "Étoile",
      "de": "Stern",
      "ar": "نجمة",
      "zhc": "星星",
      "it": "Stella",
      "pt": "Estrela",
      "ja": "星",
      "hi": "तारा"
    }
  },
  "nail": {
    "Health": {
      "es": "Uña del dedo",
      "fr": "Ongle",
      "de": "Fingernagel",
      "ar": "ظفر الإصبع",
      "zhc": "手指甲",
      "it": "Unghia",
      "pt": "Unha",
      "ja": "爪",
      "hi": "नाखून"
    },
    "Tools": {
      "es": "Clavo metálico",
      "fr": "Clou métallique",
      "de": "Metallnagel",
      "ar": "مسمار حديدي",
      "zhc": "铁钉",
      "it": "Chiodo",
      "pt": "Prego",
      "ja": "釘（くぎ）",
      "hi": "कीला (नेल)"
    },
    "default": {
      "es": "Uña / Clavo",
      "fr": "Ongle / Clou",
      "de": "Nagel",
      "ar": "ظفر / مسمار",
      "zhc": "指甲 / 钉子",
      "it": "Unghia / Chiodo",
      "pt": "Unha / Prego",
      "ja": "爪 / 釘",
      "hi": "नाखून / कील"
    }
  },
  "ruler": {
    "School": {
      "es": "Regla de medir",
      "fr": "Règle graduée",
      "de": "Lineal",
      "ar": "مسطرة قياس",
      "zhc": "刻度尺",
      "it": "Righello",
      "pt": "Régua",
      "ja": "定規・ものさし",
      "hi": "पैमाना (रूलर)"
    },
    "History": {
      "es": "Gobernante / Rey",
      "fr": "Souverain / Roi",
      "de": "Herrscher",
      "ar": "حاكم / ملك",
      "zhc": "统治者 / 君主",
      "it": "Sovrano",
      "pt": "Governante",
      "ja": "統治者",
      "hi": "शासक"
    },
    "default": {
      "es": "Regla",
      "fr": "Règle",
      "de": "Lineal",
      "ar": "مسطرة",
      "zhc": "尺子",
      "it": "Righello",
      "pt": "Régua",
      "ja": "定規",
      "hi": "रूलर"
    }
  },
  "palm": {
    "Health": {
      "es": "Palma de la mano",
      "fr": "Paume de la main",
      "de": "Handfläche",
      "ar": "كف اليد",
      "zhc": "手掌",
      "it": "Palmo della mano",
      "pt": "Palma da mão",
      "ja": "手のひら",
      "hi": "हथेली"
    },
    "Nature": {
      "es": "Palmera",
      "fr": "Palmier",
      "de": "Palme",
      "ar": "شجرة نخيل",
      "zhc": "棕榈树 / 椰树",
      "it": "Palma",
      "pt": "Palmeira",
      "ja": "ヤシの木",
      "hi": "ताड़ का पेड़"
    },
    "Plants": {
      "es": "Palmera",
      "fr": "Palmier",
      "de": "Palme",
      "ar": "نخلة",
      "zhc": "棕榈",
      "it": "Palma",
      "pt": "Palmeira",
      "ja": "ヤシの木",
      "hi": "खजूर/ताड़ का पेड़"
    },
    "default": {
      "es": "Palma / Palmera",
      "fr": "Paume / Palmier",
      "de": "Handfläche / Palme",
      "ar": "كف / نخلة",
      "zhc": "手掌 / 棕榈",
      "it": "Palmo / Palma",
      "pt": "Palma / Palmeira",
      "ja": "手のひら / ヤシ",
      "hi": "हथेली / ताड़"
    }
  },
  "jam": {
    "Food and Drink": {
      "es": "Mermelada de frutas",
      "fr": "Confiture de fruits",
      "de": "Fruchtmarmelade",
      "ar": "مربى الفواكه",
      "zhc": "水果果酱",
      "it": "Marmellata",
      "pt": "Geleia",
      "ja": "ジャム",
      "hi": "फलों का जैम"
    },
    "Transport": {
      "es": "Atasco de tráfico",
      "fr": "Embouteillage routier",
      "de": "Verkehrsstau",
      "ar": "ازدحام مروري",
      "zhc": "交通堵塞",
      "it": "Ingorgo stradale",
      "pt": "Engarrafamento",
      "ja": "交通渋滞",
      "hi": "ट्रैफिक जाम"
    },
    "default": {
      "es": "Mermelada / Atasco",
      "fr": "Confiture / Embouteillage",
      "de": "Marmelade / Stau",
      "ar": "مربى / زحمة",
      "zhc": "果酱 / 堵塞",
      "it": "Marmellata / Ingorgo",
      "pt": "Geleia / Engarrafamento",
      "ja": "ジャム / 渋滞",
      "hi": "जैम / जाम"
    }
  },
  "sink": {
    "Kitchen Objects": {
      "es": "Fregadero de cocina",
      "fr": "Évier de cuisine",
      "de": "Spülbecken",
      "ar": "حوض المطبخ",
      "zhc": "厨房水槽",
      "it": "Lavello da cucina",
      "pt": "Pia de cozinha",
      "ja": "流し台・シンク",
      "hi": "रसोई का सिंक"
    },
    "Household Objects": {
      "es": "Lavabo",
      "fr": "Lavabo",
      "de": "Waschbecken",
      "ar": "مغسلة",
      "zhc": "洗手盆",
      "it": "Lavandino",
      "pt": "Pia do banheiro",
      "ja": "洗面台",
      "hi": "वॉशबेसिन"
    },
    "Verbs": {
      "es": "Hundirse en el agua",
      "fr": "Couler / Sombrer",
      "de": "Sinken / Untergehen",
      "ar": "يغرق / يغوص",
      "zhc": "下沉 / 沉没",
      "it": "Affondare",
      "pt": "Afundar",
      "ja": "沈む",
      "hi": "डूबना"
    },
    "default": {
      "es": "Fregadero / Hundirse",
      "fr": "Évier / Couler",
      "de": "Spüle / Sinken",
      "ar": "حوض / يغرق",
      "zhc": "水槽 / 沉没",
      "it": "Lavello / Affondare",
      "pt": "Pia / Afundar",
      "ja": "シンク / 沈む",
      "hi": "सिंक / डूबना"
    }
  },
  "light": {
    "Household Objects": {
      "es": "Lámpara / Luz",
      "fr": "Lampe / Lumière",
      "de": "Lampe / Licht",
      "ar": "مصباح / ضوء",
      "zhc": "电灯 / 灯光",
      "it": "Luce / Lampada",
      "pt": "Luz / Lâmpada",
      "ja": "照明・明かり",
      "hi": "बत्ती / प्रकाश"
    },
    "Sensory": {
      "es": "Brillante / Ligero",
      "fr": "Clair / Léger",
      "de": "Hell / Leicht",
      "ar": "خفيف / مضيء",
      "zhc": "明亮的 / 轻的",
      "it": "Luminoso / Leggero",
      "pt": "Claro / Leve",
      "ja": "明るい・軽い",
      "hi": "हल्का / चमकदार"
    },
    "default": {
      "es": "Luz",
      "fr": "Lumière",
      "de": "Licht",
      "ar": "ضوء",
      "zhc": "光",
      "it": "Luce",
      "pt": "Luz",
      "ja": "光",
      "hi": "प्रकाश"
    }
  },
  "key": {
    "Household Objects": {
      "es": "Llave de puerta",
      "fr": "Clé de porte",
      "de": "Türschlüssel",
      "ar": "مفتاح الباب",
      "zhc": "大门钥匙",
      "it": "Chiave di casa",
      "pt": "Chave da porta",
      "ja": "ドアの鍵",
      "hi": "चाबी"
    },
    "Music": {
      "es": "Tecla de piano / Tono",
      "fr": "Touche de piano / Tonalité",
      "de": "Klaviertaste / Tonart",
      "ar": "مفتاح بيانو / نغمة",
      "zhc": "钢琴琴键 / 音调",
      "it": "Tasto di pianoforte",
      "pt": "Tecla de piano",
      "ja": "ピアノの鍵盤",
      "hi": "पियानो की चाबी"
    },
    "default": {
      "es": "Llave",
      "fr": "Clé",
      "de": "Schlüssel",
      "ar": "مفتاح",
      "zhc": "钥匙",
      "it": "Chiave",
      "pt": "Chave",
      "ja": "鍵",
      "hi": "कुंजी / चाबी"
    }
  },
  "toast": {
    "Food and Drink": {
      "es": "Tostada de pan",
      "fr": "Pain grillé / Toast",
      "de": "Toastbrot",
      "ar": "خبز محمص",
      "zhc": "烤面包片",
      "it": "Pane tostato",
      "pt": "Torrada",
      "ja": "トースト",
      "hi": "टोस्ट (सिका ब्रेड)"
    },
    "Social and Emotional": {
      "es": "Brindis de celebración",
      "fr": "Trinquer / Porter un toast",
      "de": "Anstoßen / Trinkspruch",
      "ar": "نخب احتفال",
      "zhc": "祝酒干杯",
      "it": "Brindisi",
      "pt": "Brinde",
      "ja": "乾杯",
      "hi": "चीयर्स / जाम टकराना"
    },
    "default": {
      "es": "Tostada / Brindis",
      "fr": "Toast",
      "de": "Toast",
      "ar": "توست / نخب",
      "zhc": "吐司 / 干杯",
      "it": "Toast / Brindisi",
      "pt": "Torrada / Brinde",
      "ja": "トースト / 乾杯",
      "hi": "टोस्ट"
    }
  }
};

  let currentLocale = 'en';
  let listeners = [];
  const loadedLocales = {};

  function normalizeCode(c) {
    if (!c) return 'en';
    const s = String(c).toLowerCase().trim();
    if (s === 'zh-cn' || s === 'zh_hans') return 'zhc';
    if (s === 'zh-tw' || s === 'zh-hk' || s === 'zh_hant') return 'zh';
    return s.split('-')[0];
  }

  function getLocale() {
    return currentLocale;
  }

  function getLocaleInfo(code = currentLocale) {
    const norm = normalizeCode(code);
    return LANGUAGES.find(l => l.code === norm) || LANGUAGES.find(l => l.code === 'en');
  }

  function getLanguages() {
    return [...LANGUAGES];
  }

  async function loadLocale(code) {
    const norm = normalizeCode(code);
    if (loadedLocales[norm]) return loadedLocales[norm];

    let data = null;
    // 1. Try Node.js filesystem if available
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      try {
        const fs = require('fs');
        const path = require('path');
        const candidatePaths = [
          path.join(__dirname, 'locales', `${norm}.json`),
          path.join(process.cwd(), 'locales', `${norm}.json`),
          path.join('/Users/paulblenkhorn/Desktop/fleximbols-browser/locales', `${norm}.json`)
        ];
        for (const p of candidatePaths) {
          if (fs.existsSync(p)) {
            data = JSON.parse(fs.readFileSync(p, 'utf8'));
            break;
          }
        }
      } catch (e) {}
    }

    // 2. Try Fetch in Browser or Worker
    if (!data && typeof fetch === 'function') {
      const urls = [`/locales/${norm}.json`, `locales/${norm}.json`];
      for (const u of urls) {
        try {
          const r = await fetch(u);
          if (r.ok) {
            data = await r.json();
            break;
          }
        } catch (e) {}
      }
    }

    if (data) {
      loadedLocales[norm] = data;
    }
    return data || null;
  }

  function registerLocale(code, localeData) {
    if (code && localeData) {
      loadedLocales[normalizeCode(code)] = localeData;
    }
  }

  function t(key, fallback = '') {
    const loc = loadedLocales[currentLocale];
    if (loc && loc.ui && loc.ui[key]) return loc.ui[key];

    const dict = UI_STRINGS[currentLocale] || {};
    if (dict[key]) return dict[key];

    const enLoc = loadedLocales['en'];
    if (enLoc && enLoc.ui && enLoc.ui[key]) return enLoc.ui[key];

    const enDict = UI_STRINGS['en'] || {};
    return enDict[key] || fallback || key;
  }

  function translateCategory(catName) {
    if (!catName) return '';
    const normCat = String(catName).trim();

    const loc = loadedLocales[currentLocale];
    if (loc && loc.categories && loc.categories[normCat]) {
      return loc.categories[normCat];
    }

    const entry = CATEGORIES[normCat];
    if (entry && (entry[currentLocale] || entry['en'])) {
      return entry[currentLocale] || entry['en'];
    }

    const enLoc = loadedLocales['en'];
    if (enLoc && enLoc.categories && enLoc.categories[normCat]) {
      return enLoc.categories[normCat];
    }

    return normCat;
  }

  function cleanSymbolStem(name) {
    return String(name || '')
      .replace(/.*\//, '')
      .replace(/\.[a-zA-Z0-9]+$/i, '')
      .replace(/\s*\(\d+\)/g, '')
      .replace(/\s*\([MF]\)/g, '')
      .trim()
      .toLowerCase();
  }

  function translateSymbol(symbolPath) {
    if (!symbolPath) return '';
    const parts = String(symbolPath).split('/');
    const cat = parts.length > 1 ? parts[0] : '';
    const rawFile = parts[parts.length - 1].replace(/\.[a-zA-Z0-9]+$/i, '');
    const stem = cleanSymbolStem(rawFile);
    const stemHyphen = stem.replace(/\s+/g, '-');
    const stemSpace = stem.replace(/-/g, ' ');

    let result = null;

    // 1. Dynamic Locale Disambiguations
    const loc = loadedLocales[currentLocale];
    if (loc && loc.disambiguations) {
      const dEntry = loc.disambiguations[stem] || loc.disambiguations[stemHyphen] || loc.disambiguations[stemSpace];
      if (dEntry) {
        result = (cat && dEntry[cat]) || dEntry['default'] || null;
      }
    }

    // 2. Built-in CONTEXTUAL_CONCEPTS
    if (!result) {
      const ctxEntry = CONTEXTUAL_CONCEPTS[stem] || CONTEXTUAL_CONCEPTS[stemHyphen] || CONTEXTUAL_CONCEPTS[stemSpace];
      if (ctxEntry) {
        const transObj = (cat && ctxEntry[cat]) || ctxEntry['default'];
        if (transObj) {
          result = transObj[currentLocale] || transObj['en'] || null;
        }
      }
    }

    // 3. Dynamic Locale Symbol dictionary
    if (!result && loc && loc.symbols) {
      result = (cat && loc.symbols[cat + '/' + stem]) ||
               (cat && loc.symbols[cat + '/' + stemHyphen]) ||
               (cat && loc.symbols[cat + '/' + stemSpace]) ||
               loc.symbols[stem] ||
               loc.symbols[stemHyphen] ||
               loc.symbols[stemSpace] ||
               null;
    }

    if (result) {
      if (rawFile.includes('(M)')) result += ' (M)';
      else if (rawFile.includes('(F)')) result += ' (F)';
      return result;
    }

    // 4. Fallback to English raw file stem
    return rawFile;
  }

  function applyDomLocale(info) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir || 'ltr';
      if (info.dir === 'rtl') {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
  }

  function notifyListeners(valid, info) {
    for (const fn of listeners) {
      try { fn(valid, info); } catch (err) { console.error(err); }
    }
  }

  function setLocale(code) {
    const norm = normalizeCode(code);
    const valid = LANGUAGES.some(l => l.code === norm) ? norm : 'en';
    currentLocale = valid;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fleximbols_lang', valid);
      }
    } catch (e) {}

    const info = getLocaleInfo(valid);
    applyDomLocale(info);

    // If locale is already loaded or is English, notify immediately
    if (loadedLocales[valid] || valid === 'en') {
      notifyListeners(valid, info);
    }

    // Always ensure latest JSON bundle is fetched/loaded
    loadLocale(valid).then(() => {
      notifyListeners(valid, info);
    }).catch(() => {
      notifyListeners(valid, info);
    });
  }

  function onLocaleChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function init() {
    let saved = 'en';
    try {
      if (typeof localStorage !== 'undefined') {
        saved = localStorage.getItem('fleximbols_lang') || navigator.language || 'en';
      }
    } catch (e) {}
    setLocale(saved);
  }

  return {
    getLocale,
    getLocaleInfo,
    getLanguages,
    t,
    translateCategory,
    translateSymbol,
    cleanSymbolStem,
    loadLocale,
    registerLocale,
    setLocale,
    onLocaleChange,
    init
  };
}));

