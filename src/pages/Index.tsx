import { Link } from "react-router-dom";
import { MessageCircle, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import lifestylesLogo from "@/assets/lifestyles-logo.png";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        <img
          src={lifestylesLogo}
          alt="Lifestyles logo"
          className="mx-auto mb-6 h-24 w-24"
        />
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Lifestyles Intra
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your AI-powered product assistant. Ask questions or generate Facebook
          Marketplace listings instantly.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/chat">
              <MessageCircle className="h-5 w-5" />
              Ask a Question
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/generate">
              <FileText className="h-5 w-5" />
              Generate a Listing
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/compare">
              <BarChart3 className="h-5 w-5" />
              Compare Products
            </Link>
          </Button>
        </div>
      </div>

      <p className="mt-16 max-w-md text-center text-xs text-muted-foreground">
        *These statements have not been evaluated by the Food and Drug
        Administration. These products are not intended to diagnose, treat,
        cure, or prevent any disease.*
      </p>
    </div>
  );
};

export default Index;
