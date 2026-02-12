import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_KNOWLEDGE = `You are a knowledgeable Lifestyles product assistant. Answer ONLY based on the official product information below. If a question is outside this scope, politely say you can only help with Lifestyles products.

## INTRA (Herbal Juice & Capsules)
Intra is a botanical beverage made from 23 carefully selected botanicals. Available as a juice (daily serving: 1 oz / 30ml mixed with water, juice, or taken straight) and capsules (2 capsules twice daily).

Key botanicals include: Astragalus (immune support), Reishi Mushroom (adaptogen, immune), Chinese Pearl Barley (digestion), Siberian Ginseng (energy, stamina), Schisandra (liver support, adaptogen), Ginger (digestion, circulation), Passionflower (relaxation, sleep), German Chamomile (calming, digestion), Bee Pollen (nutrition), Licorice Root (adrenal support), Juniper Berry (urinary health), Alfalfa (nutrition), Celery Seed (anti-inflammatory), Cascara Sagrada (digestive regularity), Capsicum (circulation), Chicory Root (prebiotic, liver), Dandelion (liver, detox), Fenugreek (blood sugar), Sarsaparilla (skin health), Thyme (respiratory), and more.

Benefits: Supports 8 biological systems – Immune, Digestive, Circulatory, Respiratory, Nervous, Skeletal/Structural, Urinary, and Endocrine.

## NUTRIAPLUS
NutriaPlus is a comprehensive daily multivitamin/mineral supplement in capsule form. Contains essential vitamins (A, C, D, E, K, B-complex) and minerals (Calcium, Magnesium, Zinc, Selenium, Chromium, etc.) plus plant-based antioxidants. Dosage: 2 capsules daily with a meal.

Benefits: Fills nutritional gaps, supports energy metabolism, immune function, bone health, and provides antioxidant protection.

## CARDIOLIFE
CardioLife is a heart health supplement featuring CoQ10, Omega-3 fatty acids (EPA/DHA from fish oil), Vitamin E, and Folic Acid. Dosage: 2 softgels daily with a meal.

Benefits: Supports cardiovascular health, healthy cholesterol levels, blood pressure, and heart muscle function. CoQ10 supports cellular energy production.

## FIBRELIFE
FibreLife is a soluble and insoluble dietary fibre supplement. Contains Psyllium Husk, Oat Fibre, Apple Pectin, and other natural fibres. Mix 1 scoop with 8oz water, juice, or smoothie. Take 1-3 times daily.

Benefits: Supports digestive regularity, healthy weight management (promotes fullness), cholesterol management, and blood sugar balance. Gentle, non-cramping formula.

## IMPORTANT DISCLAIMER
Always include this when health benefits are discussed:
"*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.*"

## GUIDELINES
- Be friendly, helpful, and concise
- Always recommend consulting a healthcare professional for medical advice
- If asked about pricing, say to contact the seller directly
- Support English and Filipino/Tagalog responses
- Keep answers focused on product information from the brochure`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            { role: "system", content: PRODUCT_KNOWLEDGE },
            ...messages,
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
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
