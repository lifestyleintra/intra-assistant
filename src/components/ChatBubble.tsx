import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWidget from "@/pages/ChatWidget";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const openOverlay = () => {
    setVisible(true);
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setAnimating(true));
    setOpen(true);
  };

  const closeOverlay = () => {
    setAnimating(false);
    setOpen(false);
    // Wait for exit animation to finish before unmounting
    setTimeout(() => setVisible(false), 300);
  };

  const toggle = () => {
    if (open) {
      closeOverlay();
    } else {
      openOverlay();
    }
  };

  return (
    <>
      {/* Overlay */}
      {visible && (
        <div
          className={`fixed bottom-20 right-4 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:right-6 origin-bottom-right transition-all duration-300 ease-out ${
            animating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold text-foreground">Product Q&A</span>
            <button
              onClick={closeOverlay}
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
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 sm:right-6"
        aria-label="Open chat"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
        )}
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

export default ChatBubble;
