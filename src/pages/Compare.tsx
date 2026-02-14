import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRODUCTS = [
  {
    name: "Intra",
    form: "Juice / Capsules",
    focus: "Whole Body Balance",
    keyIngredients: ["Astragalus", "Reishi Mushroom", "Siberian Ginseng", "Schisandra", "Ginger", "Passionflower", "Bee Pollen"],
    systems: ["Immune", "Digestive", "Circulatory", "Respiratory", "Nervous", "Skeletal", "Urinary", "Endocrine"],
    dosage: "Juice: 1 oz (30ml) daily · Capsules: 2 caps twice daily",
    bestFor: "Overall wellness & system balance",
  },
  {
    name: "NutriaPlus",
    form: "Capsules",
    focus: "Nutritional Foundation",
    keyIngredients: ["Vitamins A, C, D, E, K", "B-Complex", "Calcium", "Magnesium", "Zinc", "Selenium", "Chromium"],
    systems: ["Energy Metabolism", "Immune", "Bone Health"],
    dosage: "2 capsules daily with a meal",
    bestFor: "Filling nutritional gaps & daily vitality",
  },
  {
    name: "CardioLife",
    form: "Softgels",
    focus: "Heart Health",
    keyIngredients: ["CoQ10", "Omega-3 (EPA/DHA)", "Vitamin E", "Folic Acid"],
    systems: ["Cardiovascular", "Cholesterol", "Blood Pressure"],
    dosage: "2 softgels daily with a meal",
    bestFor: "Heart & cardiovascular support",
  },
  {
    name: "FibreLife",
    form: "Powder",
    focus: "Digestive Health",
    keyIngredients: ["Psyllium Husk", "Oat Fibre", "Apple Pectin"],
    systems: ["Digestive Regularity", "Weight Management", "Blood Sugar"],
    dosage: "1 scoop in 8oz water, 1–3× daily",
    bestFor: "Digestion, fullness & regularity",
  },
];

const Compare = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Compare Products</h1>
      </header>

      {/* Mobile: stacked cards */}
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 md:hidden">
        {PRODUCTS.map((p) => (
          <Card key={p.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{p.focus} · {p.form}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Key Ingredients</p>
                <p className="text-muted-foreground">{p.keyIngredients.join(", ")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Supports</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.systems.map((s) => (
                    <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground">Dosage</p>
                <p className="text-muted-foreground">{p.dosage}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Best For</p>
                <p className="text-muted-foreground">{p.bestFor}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="mx-auto hidden max-w-5xl px-4 py-6 md:block">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feature</th>
                {PRODUCTS.map((p) => (
                  <th key={p.name} className="px-4 py-3 text-left font-semibold text-foreground">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Form</td>
                {PRODUCTS.map((p) => <td key={p.name} className="px-4 py-3 text-foreground">{p.form}</td>)}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Primary Focus</td>
                {PRODUCTS.map((p) => <td key={p.name} className="px-4 py-3 text-foreground">{p.focus}</td>)}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Key Ingredients</td>
                {PRODUCTS.map((p) => <td key={p.name} className="px-4 py-3 text-foreground">{p.keyIngredients.join(", ")}</td>)}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Supports</td>
                {PRODUCTS.map((p) => (
                  <td key={p.name} className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.systems.map((s) => (
                        <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">{s}</span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Dosage</td>
                {PRODUCTS.map((p) => <td key={p.name} className="px-4 py-3 text-foreground">{p.dosage}</td>)}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-muted-foreground">Best For</td>
                {PRODUCTS.map((p) => <td key={p.name} className="px-4 py-3 font-medium text-foreground">{p.bestFor}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="px-4 pb-6 text-center text-xs text-muted-foreground">
        *These statements have not been evaluated by the Food and Drug Administration.
        These products are not intended to diagnose, treat, cure, or prevent any disease.*
      </p>
    </div>
  );
};

export default Compare;
