import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Loader2, LogIn, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FloatingFeedback() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      if (actor) {
        await actor.submitFeedback(text.trim());
      }
      toast.success("Thank you for your feedback!", {
        description: "Your input helps us improve DantaNova.",
      });
      setText("");
      setOpen(false);
    } catch {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="feedback.open_modal_button"
          aria-label="Leave feedback"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shimmer-button transition-all duration-200 hover:scale-110 active:scale-95 group"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 72))",
            color: "oklch(0.08 0.005 60)",
            boxShadow:
              "0 0 24px oklch(0.88 0.18 85 / 0.5), 0 0 60px oklch(0.78 0.16 80 / 0.2), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <MessageSquarePlus className="w-6 h-6 transition-transform group-hover:rotate-6" />
        </button>
      </DialogTrigger>
      <DialogContent
        data-ocid="feedback.dialog"
        className="max-w-sm rounded-3xl glass-card border-primary/30"
        style={{
          boxShadow:
            "0 0 50px oklch(0.78 0.16 80 / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-gradient-gold">
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Help us make DantaNova better — your voice matters.
          </DialogDescription>
        </DialogHeader>

        {!identity ? (
          <div className="flex flex-col items-center gap-5 py-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.78 0.16 80 / 0.1)",
                border: "2px solid oklch(0.78 0.16 80 / 0.3)",
              }}
            >
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Sign in to leave feedback and help us improve.
            </p>
            <Button
              onClick={() => {
                setOpen(false);
                login();
              }}
              data-ocid="feedback.signin_button"
              className="rounded-full px-8 font-semibold shimmer-button glow-primary"
            >
              Sign In to Continue
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              data-ocid="feedback.textarea"
              placeholder="Your thoughts, suggestions, or issues..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="rounded-2xl resize-none border-border/60 focus:border-primary/60 bg-card/60 focus:ring-1 focus:ring-primary/30"
            />
            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="feedback.cancel_button"
                className="rounded-full px-6 hover:bg-card/80"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                data-ocid="feedback.submit_button"
                className="rounded-full px-6 shimmer-button font-semibold"
                style={{
                  background: text.trim()
                    ? "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 72))"
                    : "oklch(0.28 0.015 60)",
                  color: "oklch(0.08 0.005 60)",
                  fontWeight: 700,
                }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {loading ? "Sending..." : "Send Feedback"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
