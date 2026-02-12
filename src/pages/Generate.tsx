import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { streamFromEdge } from "@/lib/stream";
import ReactMarkdown from "react-markdown";

const PRODUCTS = [
  { value: "intra-juice", label: "Intra Juice" },
  { value: "intra-capsules", label: "Intra Capsules" },
  { value: "nutriaplus", label: "NutriaPlus" },
  { value: "cardiolife", label: "CardioLife" },
  { value: "fibrelife", label: "FibreLife" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "urgent", label: "Urgent / Limited Stock" },
];

const Generate = () => {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [sellingPoints, setSellingPoints] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    if (!product) {
      toast({ title: "Select a product", variant: "destructive" });
      return;
    }
    setResult("");
    setIsLoading(true);

    let text = "";
    await streamFromEdge({
      functionName: "generate-description",
      body: { product, audience, tone, sellingPoints },
      onDelta: (chunk) => {
        text += chunk;
        setResult(text);
      },
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setIsLoading(false);
        toast({ title: "Error", description: err, variant: "destructive" });
      },
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          Listing Generator
        </h1>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label>Product *</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Target Audience (optional)</Label>
            <Input
              className="mt-1"
              placeholder="e.g. Health-conscious Filipino buyers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <div>
            <Label>Key Selling Points (optional)</Label>
            <Textarea
              className="mt-1"
              placeholder="e.g. All-natural ingredients, supports immunity"
              value={sellingPoints}
              onChange={(e) => setSellingPoints(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={generate} disabled={isLoading} className="w-full">
            {isLoading ? "Generating..." : "Generate Listing"}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={copy} className="gap-1">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generate}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Generate;
