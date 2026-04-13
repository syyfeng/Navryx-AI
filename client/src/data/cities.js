export const CUISINES = [
  "Mediterranean", "East Asian", "Latin American", "Nordic", "Alpine",
  "Middle Eastern", "Italian", "Japanese", "Thai", "French",
  "Indian", "Mexican", "Korean", "Vietnamese", "Spanish",
  "Greek", "Turkish", "Peruvian", "Moroccan", "Ethiopian",
  "Brazilian", "Chinese", "Caribbean", "British", "German",
];

export const TASTE_PROFILES = [
  "Umami-rich", "Spicy & Bold", "Sweet & Savory", "Citrus & Fresh",
  "Heavy Carbs", "Artisanal Dairy", "Smoky & Grilled", "Fermented & Funky",
  "Herbaceous", "Rich & Indulgent",
];

export const VIBES = [
  "Neon Cyberpunk", "Historic Cobblestones", "Alpine Retreat",
  "Tropical Coastal", "Bustling Metropolis", "Romantic & Intimate",
  "Night Market Culture", "Wine Country", "Desert Oasis",
  "Fjord & Nature", "Cultural Heritage", "Bohemian & Artsy",
];

export const CITIES = [
  { cityName: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, cuisineType: ["Japanese", "East Asian"], tasteProfile: ["Umami-rich", "Fermented & Funky"], vibe: ["Neon Cyberpunk", "Bustling Metropolis", "Night Market Culture"], description: "Michelin capital of the world — from Tsukiji tuna to Shibuya ramen alleys" },
  { cityName: "Naples", country: "Italy", lat: 40.85, lng: 14.27, cuisineType: ["Italian", "Mediterranean"], tasteProfile: ["Heavy Carbs", "Artisanal Dairy"], vibe: ["Historic Cobblestones", "Romantic & Intimate"], description: "Birthplace of pizza, sun-drenched coastal charm and espresso culture" },
  { cityName: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.5, cuisineType: ["Thai", "East Asian"], tasteProfile: ["Spicy & Bold", "Sweet & Savory", "Herbaceous"], vibe: ["Night Market Culture", "Bustling Metropolis", "Neon Cyberpunk"], description: "Street food paradise — pad thai, som tam, and night market wonders" },
  { cityName: "Paris", country: "France", lat: 48.86, lng: 2.35, cuisineType: ["French", "Mediterranean"], tasteProfile: ["Rich & Indulgent", "Artisanal Dairy"], vibe: ["Romantic & Intimate", "Historic Cobblestones", "Bohemian & Artsy"], description: "Croissants at dawn, Michelin dinners at dusk — the culinary capital" },
  { cityName: "Mexico City", country: "Mexico", lat: 19.43, lng: -99.13, cuisineType: ["Mexican", "Latin American"], tasteProfile: ["Spicy & Bold", "Smoky & Grilled", "Citrus & Fresh"], vibe: ["Bustling Metropolis", "Cultural Heritage", "Bohemian & Artsy"], description: "Tacos al pastor, mole negro, and mezcal in vibrant colonias" },
  { cityName: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98, cuisineType: ["Turkish", "Middle Eastern", "Mediterranean"], tasteProfile: ["Smoky & Grilled", "Sweet & Savory", "Herbaceous"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Bustling Metropolis"], description: "Where East meets West — kebabs, baklava, and Bosphorus tea" },
  { cityName: "Lima", country: "Peru", lat: -12.05, lng: -77.04, cuisineType: ["Peruvian", "Latin American"], tasteProfile: ["Citrus & Fresh", "Spicy & Bold", "Umami-rich"], vibe: ["Cultural Heritage", "Bohemian & Artsy"], description: "Ceviche capital and culinary pioneer of South America" },
  { cityName: "Marrakech", country: "Morocco", lat: 31.63, lng: -8.0, cuisineType: ["Moroccan", "Middle Eastern"], tasteProfile: ["Spicy & Bold", "Sweet & Savory", "Herbaceous"], vibe: ["Desert Oasis", "Cultural Heritage", "Historic Cobblestones"], description: "Aromatic tagines, mint tea, and the magic of Jemaa el-Fna" },
  { cityName: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98, cuisineType: ["Korean", "East Asian"], tasteProfile: ["Spicy & Bold", "Fermented & Funky", "Smoky & Grilled"], vibe: ["Neon Cyberpunk", "Bustling Metropolis", "Night Market Culture"], description: "K-BBQ, kimchi jjigae, and 24-hour pojangmacha culture" },
  { cityName: "Barcelona", country: "Spain", lat: 41.39, lng: 2.17, cuisineType: ["Spanish", "Mediterranean"], tasteProfile: ["Citrus & Fresh", "Smoky & Grilled", "Rich & Indulgent"], vibe: ["Bohemian & Artsy", "Historic Cobblestones", "Tropical Coastal"], description: "Tapas bars, La Boqueria market, and Catalan creativity" },
  { cityName: "Hanoi", country: "Vietnam", lat: 21.03, lng: 105.85, cuisineType: ["Vietnamese", "East Asian"], tasteProfile: ["Herbaceous", "Umami-rich", "Citrus & Fresh"], vibe: ["Historic Cobblestones", "Bustling Metropolis", "Night Market Culture"], description: "Pho at dawn, bun cha at noon — street food poetry in motion" },
  { cityName: "New York City", country: "USA", lat: 40.71, lng: -74.01, cuisineType: ["Italian", "East Asian", "Latin American", "Middle Eastern"], tasteProfile: ["Rich & Indulgent", "Umami-rich", "Spicy & Bold"], vibe: ["Bustling Metropolis", "Neon Cyberpunk", "Bohemian & Artsy"], description: "The world on one island — pizza, dim sum, bagels, and beyond" },
  { cityName: "Mumbai", country: "India", lat: 19.08, lng: 72.88, cuisineType: ["Indian", "Middle Eastern"], tasteProfile: ["Spicy & Bold", "Sweet & Savory", "Herbaceous"], vibe: ["Bustling Metropolis", "Cultural Heritage", "Night Market Culture"], description: "Vada pav, chaat, and thali feasts in the city of dreams" },
  { cityName: "Osaka", country: "Japan", lat: 34.69, lng: 135.5, cuisineType: ["Japanese", "East Asian"], tasteProfile: ["Umami-rich", "Heavy Carbs", "Smoky & Grilled"], vibe: ["Neon Cyberpunk", "Night Market Culture", "Bustling Metropolis"], description: "Japan's kitchen — takoyaki, okonomiyaki, and Dotonbori magic" },
  { cityName: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14, cuisineType: ["Mediterranean", "Spanish"], tasteProfile: ["Citrus & Fresh", "Heavy Carbs", "Sweet & Savory"], vibe: ["Historic Cobblestones", "Romantic & Intimate", "Bohemian & Artsy"], description: "Pastéis de nata, bacalhau, and wine-soaked sunsets over the Tagus" },
  { cityName: "Addis Ababa", country: "Ethiopia", lat: 9.02, lng: 38.75, cuisineType: ["Ethiopian"], tasteProfile: ["Spicy & Bold", "Fermented & Funky", "Herbaceous"], vibe: ["Cultural Heritage", "Bustling Metropolis"], description: "Injera platters, coffee ceremonies, and ancient culinary traditions" },
  { cityName: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63, cuisineType: ["Brazilian", "Latin American", "Japanese"], tasteProfile: ["Smoky & Grilled", "Rich & Indulgent", "Citrus & Fresh"], vibe: ["Bustling Metropolis", "Bohemian & Artsy", "Night Market Culture"], description: "Churrascarias, Japanese-Brazilian fusion, and world-class gastronomy" },
  { cityName: "Copenhagen", country: "Denmark", lat: 55.68, lng: 12.57, cuisineType: ["Nordic"], tasteProfile: ["Fermented & Funky", "Herbaceous", "Citrus & Fresh"], vibe: ["Bohemian & Artsy", "Fjord & Nature"], description: "New Nordic cuisine capital — Noma legacy and smørrebrød culture" },
  { cityName: "Zurich", country: "Switzerland", lat: 47.37, lng: 8.54, cuisineType: ["Alpine", "German", "French"], tasteProfile: ["Artisanal Dairy", "Heavy Carbs", "Rich & Indulgent"], vibe: ["Alpine Retreat", "Historic Cobblestones"], description: "Fondue, raclette, and chocolate with Alpine lake panoramas" },
  { cityName: "Jaipur", country: "India", lat: 26.91, lng: 75.79, cuisineType: ["Indian"], tasteProfile: ["Spicy & Bold", "Sweet & Savory", "Rich & Indulgent"], vibe: ["Cultural Heritage", "Desert Oasis", "Historic Cobblestones"], description: "Rajasthani thalis, dal baati churma, and pink city spice bazaars" },
  { cityName: "Athens", country: "Greece", lat: 37.98, lng: 23.73, cuisineType: ["Greek", "Mediterranean"], tasteProfile: ["Citrus & Fresh", "Herbaceous", "Artisanal Dairy"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Tropical Coastal"], description: "Souvlaki, feta, and ouzo with Acropolis views" },
  { cityName: "Chengdu", country: "China", lat: 30.57, lng: 104.07, cuisineType: ["Chinese", "East Asian"], tasteProfile: ["Spicy & Bold", "Umami-rich", "Fermented & Funky"], vibe: ["Bustling Metropolis", "Night Market Culture", "Cultural Heritage"], description: "Sichuan peppercorn paradise — mapo tofu, hotpot, and dan dan noodles" },
  { cityName: "Bordeaux", country: "France", lat: 44.84, lng: -0.58, cuisineType: ["French", "Mediterranean"], tasteProfile: ["Rich & Indulgent", "Artisanal Dairy", "Smoky & Grilled"], vibe: ["Wine Country", "Romantic & Intimate", "Historic Cobblestones"], description: "World-class wine, canelé pastries, and Garonne river dining" },
  { cityName: "Oaxaca City", country: "Mexico", lat: 17.07, lng: -96.73, cuisineType: ["Mexican", "Latin American"], tasteProfile: ["Smoky & Grilled", "Spicy & Bold", "Herbaceous"], vibe: ["Cultural Heritage", "Bohemian & Artsy", "Historic Cobblestones"], description: "Mole capital of the world — mezcal, tlayudas, and chapulines" },
  { cityName: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, cuisineType: ["East Asian", "Indian", "Chinese", "Thai"], tasteProfile: ["Spicy & Bold", "Umami-rich", "Sweet & Savory"], vibe: ["Neon Cyberpunk", "Bustling Metropolis", "Night Market Culture"], description: "Hawker center heaven — chili crab, laksa, and Hainanese chicken rice" },
  { cityName: "Buenos Aires", country: "Argentina", lat: -34.6, lng: -58.38, cuisineType: ["Latin American", "Italian", "Spanish"], tasteProfile: ["Smoky & Grilled", "Rich & Indulgent", "Heavy Carbs"], vibe: ["Romantic & Intimate", "Bohemian & Artsy", "Cultural Heritage"], description: "Asado, empanadas, malbec, and tango-infused dining" },
  { cityName: "Kyoto", country: "Japan", lat: 35.01, lng: 135.77, cuisineType: ["Japanese", "East Asian"], tasteProfile: ["Umami-rich", "Sweet & Savory", "Herbaceous"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Romantic & Intimate"], description: "Kaiseki dining, matcha temples, and Nishiki Market elegance" },
  { cityName: "Tel Aviv", country: "Israel", lat: 32.08, lng: 34.78, cuisineType: ["Middle Eastern", "Mediterranean"], tasteProfile: ["Herbaceous", "Citrus & Fresh", "Spicy & Bold"], vibe: ["Tropical Coastal", "Bohemian & Artsy", "Bustling Metropolis"], description: "Hummus, shakshuka, and Mediterranean fusion on the beach" },
  { cityName: "Bergen", country: "Norway", lat: 60.39, lng: 5.32, cuisineType: ["Nordic"], tasteProfile: ["Citrus & Fresh", "Fermented & Funky", "Umami-rich"], vibe: ["Fjord & Nature", "Historic Cobblestones"], description: "Fresh fjord seafood, fish market treasures, and Nordic simplicity" },
  { cityName: "Kingston", country: "Jamaica", lat: 18.0, lng: -76.8, cuisineType: ["Caribbean"], tasteProfile: ["Spicy & Bold", "Smoky & Grilled", "Sweet & Savory"], vibe: ["Tropical Coastal", "Cultural Heritage"], description: "Jerk chicken, ackee & saltfish, and rum-soaked island vibes" },
  { cityName: "Vienna", country: "Austria", lat: 48.21, lng: 16.37, cuisineType: ["Alpine", "German"], tasteProfile: ["Heavy Carbs", "Artisanal Dairy", "Sweet & Savory"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Romantic & Intimate"], description: "Wiener schnitzel, Sachertorte, and coffeehouse culture since 1683" },
  { cityName: "Beirut", country: "Lebanon", lat: 33.89, lng: 35.5, cuisineType: ["Middle Eastern", "Mediterranean"], tasteProfile: ["Herbaceous", "Citrus & Fresh", "Smoky & Grilled"], vibe: ["Cultural Heritage", "Bohemian & Artsy", "Bustling Metropolis"], description: "Mezze feasts, shawarma alleys, and cedar-scented resilience" },
  { cityName: "Hong Kong", country: "China", lat: 22.32, lng: 114.17, cuisineType: ["Chinese", "East Asian"], tasteProfile: ["Umami-rich", "Sweet & Savory", "Rich & Indulgent"], vibe: ["Neon Cyberpunk", "Bustling Metropolis", "Night Market Culture"], description: "Dim sum temples, dai pai dong stalls, and egg waffle perfection" },
  { cityName: "London", country: "UK", lat: 51.51, lng: -0.13, cuisineType: ["British", "Indian", "Middle Eastern", "East Asian"], tasteProfile: ["Rich & Indulgent", "Umami-rich", "Artisanal Dairy"], vibe: ["Bustling Metropolis", "Historic Cobblestones", "Bohemian & Artsy"], description: "Borough Market, curry mile, and the world's most diverse food scene" },
  { cityName: "Cartagena", country: "Colombia", lat: 10.39, lng: -75.51, cuisineType: ["Latin American", "Caribbean"], tasteProfile: ["Citrus & Fresh", "Spicy & Bold", "Sweet & Savory"], vibe: ["Tropical Coastal", "Historic Cobblestones", "Romantic & Intimate"], description: "Ceviche, arepas de huevo, and colonial-walled seaside dining" },
  { cityName: "Munich", country: "Germany", lat: 48.14, lng: 11.58, cuisineType: ["German", "Alpine"], tasteProfile: ["Heavy Carbs", "Smoky & Grilled", "Artisanal Dairy"], vibe: ["Historic Cobblestones", "Alpine Retreat", "Cultural Heritage"], description: "Beer halls, weisswurst, pretzels, and Bavarian gemütlichkeit" },
  { cityName: "Taipei", country: "Taiwan", lat: 25.03, lng: 121.57, cuisineType: ["Chinese", "East Asian"], tasteProfile: ["Umami-rich", "Sweet & Savory", "Spicy & Bold"], vibe: ["Night Market Culture", "Neon Cyberpunk", "Bustling Metropolis"], description: "Night market royalty — beef noodle soup, bubble tea, and xiao long bao" },
  { cityName: "Florence", country: "Italy", lat: 43.77, lng: 11.25, cuisineType: ["Italian", "Mediterranean"], tasteProfile: ["Heavy Carbs", "Artisanal Dairy", "Rich & Indulgent"], vibe: ["Historic Cobblestones", "Wine Country", "Romantic & Intimate"], description: "Bistecca fiorentina, truffle pasta, and Tuscan wine under Renaissance domes" },
  { cityName: "Reykjavik", country: "Iceland", lat: 64.15, lng: -21.94, cuisineType: ["Nordic"], tasteProfile: ["Fermented & Funky", "Citrus & Fresh", "Umami-rich"], vibe: ["Fjord & Nature", "Bohemian & Artsy"], description: "Arctic char, fermented shark, and geothermal-baked rye bread" },
  { cityName: "San Sebastián", country: "Spain", lat: 43.32, lng: -1.98, cuisineType: ["Spanish", "French", "Mediterranean"], tasteProfile: ["Citrus & Fresh", "Rich & Indulgent", "Umami-rich"], vibe: ["Tropical Coastal", "Wine Country", "Romantic & Intimate"], description: "Pintxos bars, Michelin density, and Basque culinary excellence" },
  { cityName: "Cusco", country: "Peru", lat: -13.52, lng: -71.97, cuisineType: ["Peruvian", "Latin American"], tasteProfile: ["Herbaceous", "Smoky & Grilled", "Citrus & Fresh"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Alpine Retreat"], description: "Andean cuisine — quinoa, cuy, and chicha morada at altitude" },
  { cityName: "Dubai", country: "UAE", lat: 25.2, lng: 55.27, cuisineType: ["Middle Eastern", "Indian", "Mediterranean"], tasteProfile: ["Spicy & Bold", "Rich & Indulgent", "Sweet & Savory"], vibe: ["Neon Cyberpunk", "Desert Oasis", "Bustling Metropolis"], description: "Gold-leaf dining, shawarma at midnight, and global fusion excess" },
  { cityName: "Cape Town", country: "South Africa", lat: -33.93, lng: 18.42, cuisineType: ["Mediterranean", "Indian", "Ethiopian"], tasteProfile: ["Smoky & Grilled", "Spicy & Bold", "Herbaceous"], vibe: ["Tropical Coastal", "Wine Country", "Bohemian & Artsy"], description: "Braai culture, Cape Malay curries, and Stellenbosch wine estates" },
  { cityName: "Penang", country: "Malaysia", lat: 5.41, lng: 100.34, cuisineType: ["East Asian", "Indian", "Chinese", "Thai"], tasteProfile: ["Spicy & Bold", "Umami-rich", "Sweet & Savory"], vibe: ["Night Market Culture", "Historic Cobblestones", "Cultural Heritage"], description: "Char kway teow, assam laksa, and the street food UNESCO city" },
  { cityName: "New Orleans", country: "USA", lat: 29.95, lng: -90.07, cuisineType: ["French", "Caribbean", "Latin American"], tasteProfile: ["Rich & Indulgent", "Spicy & Bold", "Smoky & Grilled"], vibe: ["Cultural Heritage", "Bohemian & Artsy", "Night Market Culture"], description: "Gumbo, beignets, po'boys, and jazz-soaked Creole feasting" },
  { cityName: "Lyon", country: "France", lat: 45.76, lng: 4.84, cuisineType: ["French", "Mediterranean"], tasteProfile: ["Rich & Indulgent", "Artisanal Dairy", "Heavy Carbs"], vibe: ["Historic Cobblestones", "Wine Country", "Cultural Heritage"], description: "France's gastronomic capital — bouchons, quenelles, and silk-city charm" },
  { cityName: "Tbilisi", country: "Georgia", lat: 41.72, lng: 44.79, cuisineType: ["Middle Eastern", "Mediterranean"], tasteProfile: ["Artisanal Dairy", "Herbaceous", "Heavy Carbs"], vibe: ["Historic Cobblestones", "Bohemian & Artsy", "Wine Country"], description: "Khachapuri, khinkali, and natural wine in a Silk Road gem" },
  { cityName: "Bogotá", country: "Colombia", lat: 4.71, lng: -74.07, cuisineType: ["Latin American"], tasteProfile: ["Citrus & Fresh", "Heavy Carbs", "Herbaceous"], vibe: ["Bustling Metropolis", "Cultural Heritage", "Bohemian & Artsy"], description: "Ajiaco, arepas, and Andean fusion in a high-altitude capital" },
  { cityName: "Bali", country: "Indonesia", lat: -8.41, lng: 115.19, cuisineType: ["East Asian", "Thai"], tasteProfile: ["Spicy & Bold", "Herbaceous", "Sweet & Savory"], vibe: ["Tropical Coastal", "Cultural Heritage", "Bohemian & Artsy"], description: "Nasi goreng, babi guling, and jungle-canopy dining rituals" },
  { cityName: "Fez", country: "Morocco", lat: 34.03, lng: -5.0, cuisineType: ["Moroccan", "Middle Eastern"], tasteProfile: ["Sweet & Savory", "Spicy & Bold", "Herbaceous"], vibe: ["Historic Cobblestones", "Cultural Heritage", "Desert Oasis"], description: "Medieval medina cuisine — pastilla, tanjia, and centuries-old recipes" },
];

// ─── Cuisine → specific dishes mapping (all 25 cuisines) ────────

export const CUISINE_FOOD_MAP = {
  Mediterranean: ["Paella", "Greek Salad", "Hummus Platter", "Grilled Octopus", "Shakshuka", "Fattoush", "Spanakopita", "Lahmacun"],
  "East Asian": ["Dim Sum", "Pho", "Bibimbap", "Ramen", "Xiao Long Bao", "Pad See Ew", "Bao Buns", "Miso Soup"],
  "Latin American": ["Empanadas", "Arepas", "Ceviche", "Mole Poblano", "Pupusas", "Tamales", "Churrasco", "Açaí Bowl"],
  Nordic: ["Smørrebrød", "Gravlax", "Swedish Meatballs", "Cloudberry Jam", "Pickled Herring", "Rye Bread", "Skyr", "Kanelbulle"],
  Alpine: ["Cheese Fondue", "Raclette", "Rösti", "Wiener Schnitzel", "Apple Strudel", "Käsespätzle", "Bratwurst", "Kaiserschmarrn"],
  "Middle Eastern": ["Shawarma", "Falafel", "Kibbeh", "Manakeesh", "Knafeh", "Tabouleh", "Baba Ganoush", "Labneh"],
  Italian: ["Neapolitan Pizza", "Truffle Pasta", "Gelato", "Risotto", "Osso Buco", "Tiramisu", "Bruschetta", "Limoncello"],
  Japanese: ["Ramen", "Omakase Sushi", "Wagyu Beef", "Tempura", "Matcha", "Takoyaki", "Yakitori", "Mochi"],
  Thai: ["Pad Thai", "Tom Yum", "Green Curry", "Mango Sticky Rice", "Som Tam", "Massaman Curry", "Boat Noodles", "Khao Soi"],
  French: ["Croissants", "Duck Confit", "Crème Brûlée", "Ratatouille", "Bouillabaisse", "Quiche Lorraine", "Tarte Tatin", "Coq au Vin"],
  Indian: ["Butter Chicken", "Biryani", "Masala Dosa", "Tandoori", "Chaat", "Dal Makhani", "Paneer Tikka", "Gulab Jamun"],
  Mexican: ["Tacos al Pastor", "Mole Negro", "Churros", "Elote", "Pozole", "Tlayudas", "Tamales Oaxaqueños", "Chiles en Nogada"],
  Korean: ["Korean BBQ", "Kimchi Jjigae", "Bibimbap", "Tteokbokki", "Japchae", "Samgyeopsal", "Hotteok", "Sundubu-jjigae"],
  Vietnamese: ["Pho", "Banh Mi", "Bun Cha", "Spring Rolls", "Cao Lau", "Banh Xeo", "Che", "Com Tam"],
  Spanish: ["Pintxos", "Jamón Ibérico", "Gazpacho", "Paella Valenciana", "Churros con Chocolate", "Patatas Bravas", "Croquetas", "Tortilla Española"],
  Greek: ["Souvlaki", "Moussaka", "Spanakopita", "Fresh Feta", "Gyro", "Baklava", "Dolmades", "Loukoumades"],
  Turkish: ["Kebab Platter", "Baklava", "Pide", "Manti", "Simit", "Lahmacun", "Turkish Delight", "Iskender"],
  Peruvian: ["Ceviche", "Lomo Saltado", "Causa", "Anticuchos", "Pisco Sour", "Aji de Gallina", "Picarones", "Tiradito"],
  Moroccan: ["Tagine", "Couscous", "Pastilla", "Harira", "Mint Tea", "Msemen", "Rfissa", "Zaalouk"],
  Ethiopian: ["Injera Platter", "Doro Wat", "Kitfo", "Tibs", "Shiro", "Coffee Ceremony", "Gomen", "Firfir"],
  Brazilian: ["Picanha", "Feijoada", "Pão de Queijo", "Açaí Bowl", "Coxinha", "Moqueca", "Brigadeiro", "Caipirinha"],
  Chinese: ["Peking Duck", "Xiao Long Bao", "Mapo Tofu", "Hot Pot", "Dan Dan Noodles", "Kung Pao Chicken", "Char Siu", "Egg Tarts"],
  Caribbean: ["Jerk Chicken", "Ackee & Saltfish", "Roti", "Conch Fritters", "Plantain", "Oxtail Stew", "Rum Punch", "Rice & Peas"],
  British: ["Fish & Chips", "Sunday Roast", "Cornish Pasty", "Sticky Toffee Pudding", "Full English", "Afternoon Tea", "Scotch Egg", "Pie & Mash"],
  German: ["Schweinshaxe", "Pretzel", "Currywurst", "Sauerbraten", "Black Forest Cake", "Weisswurst", "Kartoffelpuffer", "Rouladen"],
};

// ─── Weighted scoring algorithm ─────────────────────────────────

const WEIGHTS = { cuisine: 3, vibe: 2, taste: 1 };
const MAX_POSSIBLE = WEIGHTS.cuisine + WEIGHTS.vibe + WEIGHTS.taste;

export function scoreCity(city, filters) {
  let score = 0;
  if (filters.cuisine && city.cuisineType.includes(filters.cuisine)) score += WEIGHTS.cuisine;
  if (filters.vibe && city.vibe.includes(filters.vibe)) score += WEIGHTS.vibe;
  if (filters.taste && city.tasteProfile.includes(filters.taste)) score += WEIGHTS.taste;
  return score;
}

export function getTopCities(filters, count = 3) {
  const activeFilters = [filters.cuisine, filters.vibe, filters.taste].filter(Boolean).length;
  if (activeFilters === 0) return [];

  const maxScore = (filters.cuisine ? WEIGHTS.cuisine : 0)
    + (filters.vibe ? WEIGHTS.vibe : 0)
    + (filters.taste ? WEIGHTS.taste : 0);

  const scored = CITIES
    .map((city) => ({ ...city, score: scoreCity(city, filters) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((c) => ({
      ...c,
      matchPct: Math.round((c.score / maxScore) * 100),
      matchReasons: [
        filters.cuisine && c.cuisineType.includes(filters.cuisine) ? `${filters.cuisine} cuisine` : null,
        filters.vibe && c.vibe.includes(filters.vibe) ? `${filters.vibe} vibe` : null,
        filters.taste && c.tasteProfile.includes(filters.taste) ? `${filters.taste} taste` : null,
      ].filter(Boolean),
    }));

  return scored;
}
