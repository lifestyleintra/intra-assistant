import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWidget from "@/pages/ChatWidget";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:right-6 animate-enter origin-bottom-right">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold text-foreground">Product Q&A</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWidget embedded />
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-6"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

export default ChatBubble;
