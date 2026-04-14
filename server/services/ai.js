import OpenAI from "openai";

const SYSTEM_PROMPT = `You are Navryx AI's travel concierge — an expert in global cuisine, fine dining, street food, and culinary travel. You help users plan food-focused trips with personalized restaurant recommendations, local food experiences, and travel logistics. Be warm, knowledgeable, and enthusiastic. Keep responses concise but informative. When suggesting places, include specific restaurant names, dish recommendations, and price ranges when possible.`;

const ITINERARY_CONTEXT_PROMPT = `You are Navryx AI's travel concierge. The user has a food-focused travel itinerary that they want to refine.

RESPONSE FORMAT RULES:
1. Write ONLY natural, conversational text. NEVER include raw JSON, code blocks, markdown formatting, or system tags in your visible response.
2. When the user asks about flights, hotels, transit, or accommodation, write a brief conversational summary (e.g. "Here are some great hotel options near your Day 2 restaurants:"), then include a HIDDEN structured data block.
3. The structured data block MUST be placed at the very END of your response, wrapped exactly like this:

[CARDS]
[...array of card objects...]
[/CARDS]

Card object formats:

Flight: {"type":"flight","airline":"Name","route":"A → B","price":"$XXX","duration":"Xh XXm","class":"Economy/Business","scenic":"scenic route description or null","rewards":"reward info or null"}

Hotel: {"type":"hotel","name":"Name","location":"Area","price":"$XXX/night","rating":4.8,"stars":5,"nearDay":1,"scenic":"view description or null","rewards":"Marriott Bonvoy: 5x points or null"}

Transit: {"type":"transit","name":"Name","route":"A → B","price":"$XX","duration":"Xh XXm","scenic":"scenic description or null"}

Rules:
- Provide 2-3 options at different price points
- Include "scenic" for scenic routes (alpine trains, coastal ferries, etc.)
- Include "rewards" for credit card / loyalty point optimization opportunities
- Include "nearDay" for hotels to indicate which itinerary day they serve
- Your conversational text should introduce the options naturally — the cards are rendered as beautiful UI components by the app, so DO NOT describe every detail in text
- NEVER use markdown code fences, backticks, or JSON in the conversational portion`;

const ITINERARY_SYSTEM_PROMPT = `You are Navryx AI's itinerary planner. Generate detailed day-by-day food-focused travel itineraries. You MUST respond with valid JSON only — no markdown, no explanation, no code fences, no extra text.

STRICT JSON SCHEMA — you must follow this exactly:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day title (short, descriptive)",
      "activities": [
        { "time": "HH:MM", "label": "Activity description", "type": "food|travel|hotel|activity", "cost": 50 }
      ]
    }
  ],
  "budget": {
    "flights": 0,
    "hotels": 0,
    "food": 0,
    "activities": 0,
    "total": 0
  }
}

CRITICAL RULES:

1. DAY GROUPING: Each day number MUST appear EXACTLY ONCE in the "itinerary" array. Day 1 is one object, Day 2 is one object, etc. NEVER create two separate objects with the same day number. ALL activities for a given day go inside that single day object's "activities" array.

2. MEAL RHYTHM:
   - If mealRhythm is "standard": Generate EXACTLY 3 food stops per day — one Breakfast (morning), one Lunch (midday), one Dinner (evening). Label them clearly, e.g. "Breakfast at [Restaurant] — [Dish]".
   - If mealRhythm is "grazing": Generate 5 or more smaller food stops scattered throughout the day — street food, snack stalls, cafes, tasting spots. Each should be a unique venue.

3. ANTI-REPETITION: You are planning for a foodie. You MUST NOT repeat any restaurant, cafe, or food stall across the ENTIRE trip. Every single dining recommendation across ALL days must be a unique establishment to maximize the culinary experience.

4. INTERLEAVING: Place non-food activities ("Space Between Meals") between food stops. Activities like museums, hiking, shopping, or sightseeing should fill the gaps.

5. SPECIFICITY: Use real restaurant names, real dish names, and real neighborhood names. Include the signature dish to try at each food stop in the label.

6. COSTS: "cost" is per-person in USD. Be realistic for the destination and budget strategy.

7. CHRONOLOGICAL ORDER: Activities within each day must be in chronological order by "time" field.

8. TASTE PROFILES: If the user specifies taste profiles (e.g. "Umami-rich", "Spicy & Bold", "Artisanal Dairy"), select restaurants and dishes that match those flavor preferences. For example, "Umami-rich" should favor places known for rich broths, aged cheeses, fermented ingredients, or slow-cooked meats. "Artisanal Dairy" should prioritize creameries, fromageries, and restaurants known for cheese-centric dishes.`;

function createClient(forceOllama = false) {
  const hasOpenAI =
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here" &&
    process.env.OPENAI_API_KEY.trim() !== "";

  if (!forceOllama && hasOpenAI) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      provider: "openai",
    };
  }

  const ollamaBase = process.env.OLLAMA_URL || "http://localhost:11434";
  return {
    client: new OpenAI({
      baseURL: `${ollamaBase}/v1`,
      apiKey: "ollama",
    }),
    model: process.env.OLLAMA_MODEL || "llama3.2",
    provider: "ollama",
  };
}

function resolveClient({ forceOllama = false, apiKey } = {}) {
  if (apiKey && apiKey.trim() && !forceOllama) {
    return {
      client: new OpenAI({ apiKey }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      provider: "openai",
    };
  }
  return createClient(forceOllama);
}

export async function chat(messages, { forceOllama = false, apiKey, itineraryContext } = {}) {
  const { client, model, provider } = resolveClient({ forceOllama, apiKey });

  const systemPrompt = itineraryContext
    ? `${ITINERARY_CONTEXT_PROMPT}\n\nHere is the user's current itinerary:\n${JSON.stringify(itineraryContext, null, 2)}`
    : SYSTEM_PROMPT;

  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: fullMessages,
      max_tokens: 2048,
      temperature: 0.8,
    });

    const raw = completion.choices[0].message.content;
    let content = raw;
    let cards = null;

    const cardsMatch = raw.match(/\[CARDS\]\s*([\s\S]*?)\s*\[\/CARDS\]/);
    if (cardsMatch) {
      try {
        cards = JSON.parse(cardsMatch[1].trim());
        content = raw.replace(/\[CARDS\][\s\S]*?\[\/CARDS\]/, "").trim();
      } catch { /* cards parsing failed, keep raw content */ }
    }

    // Strip any stray markdown code fences, raw JSON blocks, or system artifacts
    content = content
      .replace(/```(?:json)?\s*[\s\S]*?```/g, "")
      .replace(/\[CARDS\][\s\S]*?\[\/CARDS\]/g, "")
      .replace(/^\s*[\[{][\s\S]*?[\]}]\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return {
      role: "assistant",
      content,
      cards,
      provider,
      model,
    };
  } catch (err) {
    console.error(`AI error (${provider}/${model}):`, err.message);
    throw err;
  }
}

export async function generateItinerary(params, { forceOllama = false, apiKey } = {}) {
  const { client, model, provider } = resolveClient({ forceOllama, apiKey });

  const tasteLine = params.tasteProfiles?.length
    ? `- Taste profiles: ${params.tasteProfiles.join(", ")} — prioritize restaurants and dishes that match these flavor preferences`
    : "- Taste profiles: No specific preference";

  const userPrompt = `Plan a food-focused travel itinerary with these parameters:
- Destination: ${params.destination}
- Duration: ${params.duration} days
- Pace: ${params.pace}
- Dietary restrictions: ${params.dietary?.join(", ") || "None"}
- Dining styles: ${params.diningStyle?.join(", ") || "Any"}
- Meal rhythm: ${params.mealRhythm}
- Preferred cuisines: ${params.cuisines?.join(", ") || "Local cuisine"}
${tasteLine}
- Specific foods: ${params.specificFoods?.join(", ") || "Chef's choice"}
- Budget strategy: ${params.budgetStrategy}
- Activities between meals: ${params.activities?.join(", ") || "Exploring"}

Generate the JSON itinerary now.`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: ITINERARY_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    const cleaned = raw.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { ...parsed, provider, model };
  } catch (err) {
    console.error(`Itinerary generation error (${provider}/${model}):`, err.message);
    throw err;
  }
}
