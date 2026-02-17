import { useState, useRef, useEffect } from "react";
import { Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { streamFromEdge, type Msg } from "@/lib/stream";
import ReactMarkdown from "react-markdown";

const QUICK_REPLIES = [
  "What is Intra juice?",
  "Compare all products",
  "How do I take FibreLife?",
];

interface ChatWidgetProps {
  embedded?: boolean;
}

const ChatWidget = ({ embedded }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const userMsg: Msg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamFromEdge({
      functionName: "chat",
      body: { messages: [...messages, userMsg] },
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setIsLoading(false);
        toast({ title: "Error", description: err, variant: "destructive" });
      },
    });
  };

  const copyMessage = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className={`flex flex-col bg-background ${embedded ? "h-full" : "h-screen"}`}>
      {/* Messages */}
      <ScrollArea className="flex-1 px-2 py-2">
        {messages.length === 0 && (
          <div className="mt-6 space-y-3 text-center">
            <p className="text-xs text-muted-foreground">
              Ask about Lifestyles products
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mx-auto max-w-lg space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[90%] rounded-2xl px-3 py-2 text-xs ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-xs max-w-none dark:prose-invert">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
                {m.role === "assistant" && (
                  <button
                    onClick={() => copyMessage(m.content, i)}
                    className="absolute -bottom-5 right-0 flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    {copiedIdx === i ? (
                      <><Check className="h-2.5 w-2.5" /> Copied</>
                    ) : (
                      <><Copy className="h-2.5 w-2.5" /> Copy</>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-2 py-2">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex gap-1.5"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="h-8 flex-1 text-xs"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-8 w-8">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
