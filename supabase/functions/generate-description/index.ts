import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_DATA: Record<string, string> = {
  "intra-juice": `Intra Herbal Juice – A botanical beverage with 23 time-tested botanicals supporting 8 biological systems (Immune, Digestive, Circulatory, Respiratory, Nervous, Skeletal, Urinary, Endocrine). Key ingredients: Astragalus, Reishi Mushroom, Siberian Ginseng, Schisandra, Ginger, Passionflower, Bee Pollen, and more. Daily serving: 1 oz (30ml). Mix with water or juice. Alcohol-free, caffeine-free.`,
  "intra-capsules": `Intra Herbal Capsules – The same powerful 23-botanical formula as Intra juice, now in convenient capsule form. Supports all 8 biological systems. Dosage: 2 capsules twice daily. Perfect for on-the-go use. Same trusted formula, portable format.`,
  "nutriaplus": `NutriaPlus – Comprehensive daily multivitamin/mineral supplement. Contains essential vitamins (A, C, D, E, K, B-complex), minerals (Calcium, Magnesium, Zinc, Selenium, Chromium), plus plant-based antioxidants. Dosage: 2 capsules daily with a meal. Fills nutritional gaps, supports energy, immunity, and bone health.`,
  "cardiolife": `CardioLife – Heart health supplement featuring CoQ10, Omega-3 (EPA/DHA from fish oil), Vitamin E, and Folic Acid. Dosage: 2 softgels daily with a meal. Supports cardiovascular health, healthy cholesterol, blood pressure, and heart muscle function.`,
  "fibrelife": `FibreLife – Soluble and insoluble dietary fibre supplement. Contains Psyllium Husk, Oat Fibre, Apple Pectin. Mix 1 scoop with 8oz water/juice, 1-3 times daily. Supports digestive regularity, weight management, cholesterol, and blood sugar balance. Gentle, non-cramping.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product, audience, tone, sellingPoints } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const productInfo = PRODUCT_DATA[product];
    if (!productInfo) {
      return new Response(
        JSON.stringify({ error: "Invalid product selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Generate an optimized Facebook Marketplace listing description for this product.

Product info: ${productInfo}

${audience ? `Target audience: ${audience}` : "Target audience: Health-conscious buyers"}
${tone ? `Tone: ${tone}` : "Tone: Professional but friendly"}
${sellingPoints ? `Emphasize these points: ${sellingPoints}` : ""}

Create the listing with:
1. An attention-grabbing title (use emojis sparingly)
2. Key benefits & features (bullet points)
3. Usage/dosage instructions
4. A compelling call to action (e.g., "Message me to order!")
5. Include the FDA disclaimer at the bottom

Keep it concise and mobile-friendly (most buyers browse on phones). Use simple language. Format for easy reading on Facebook.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: "You are an expert copywriter specializing in health product listings for Facebook Marketplace. Write compelling, accurate descriptions based only on official product information provided.",
            },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-description error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
