import type { Booking, Message } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function getStatusStr(status: unknown): string {
  if (typeof status === "string") return status;
  return Object.keys(status as Record<string, unknown>)[0];
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: "/messages/$bookingId" });
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [messages, setMessages] = useState<Message[]>([]);
  const [bookingInfo, setBookingInfo] = useState<Booking | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const bookingIdBig = BigInt(bookingId);
  const myPrincipalStr = identity?.getPrincipal().toString() ?? "";

  const fetchMessages = useCallback(async () => {
    if (!actor || !identity) return;
    try {
      const msgs = await actor.getMessages(bookingIdBig);
      setMessages(msgs);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [actor, identity, bookingIdBig]);

  // Load booking context
  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getBooking(bookingIdBig)
      .then((bk) => {
        if (bk) setBookingInfo(bk);
      })
      .catch(() => {});
  }, [actor, identity, bookingIdBig]);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [actor, isFetching, identity, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendMessage = async () => {
    if (!actor || !identity || !text.trim()) return;
    setSending(true);
    try {
      await actor.submitMessage(bookingIdBig, text.trim());
      setText("");
      await fetchMessages();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to view messages
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="messages.signin_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const statusStr = bookingInfo ? getStatusStr(bookingInfo.status) : null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/my-bookings" })}
          data-ocid="messages.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="circle-icon w-10 h-10 bg-primary/10 border border-primary/40 shrink-0">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Chat — Booking #{bookingId}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-xs text-muted-foreground">
              Auto-refreshes every 5s
            </p>
          </div>
        </div>
      </header>

      {/* Booking Context Banner */}
      {bookingInfo && (
        <div className="px-4 py-2 bg-card/40 border-b border-border/20 flex items-center gap-3 text-xs text-muted-foreground shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-primary/60" />
            <span>
              Dentist:{" "}
              <span className="text-foreground">
                {bookingInfo.dentistEmail}
              </span>
            </span>
          </div>
          {bookingInfo.requestedDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 text-primary/60" />
              <span>{bookingInfo.requestedDate}</span>
            </div>
          )}
          {statusStr && (
            <span
              className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusStr === "approved" ? "bg-primary/10 text-primary border-primary/30" : statusStr === "completed" ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"}`}
            >
              {statusStr}
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        data-ocid="messages.panel"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            data-ocid="messages.empty_state"
          >
            <div className="circle-icon w-16 h-16 bg-primary/10 border border-primary/30">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              No messages yet.
              <br />
              Start the conversation below.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => {
              const isMe = msg.senderPrincipal === myPrincipalStr;
              const time = new Date(
                Number(msg.createdAt / 1_000_000n),
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <motion.div
                  key={msg.id.toString()}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < 8 ? i * 0.04 : 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  data-ocid={`messages.item.${i + 1}`}
                >
                  <div
                    className={`max-w-[78%] ${isMe ? "order-2" : "order-1"}`}
                  >
                    {!isMe && (
                      <p className="text-[10px] text-muted-foreground px-1 mb-0.5">
                        {msg.senderName || "Dentist"}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-3xl text-sm leading-relaxed ${isMe ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-sm" : "glass-card rounded-bl-sm"}`}
                    >
                      {msg.content}
                    </div>
                    <p
                      className={`text-[10px] text-muted-foreground mt-1 px-1 ${isMe ? "text-right" : "text-left"}`}
                    >
                      {time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/30 bg-card/60 backdrop-blur shrink-0">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            className="rounded-full bg-background/60 border-border/40 focus:border-primary/50 flex-1"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            data-ocid="messages.input"
          />
          <Button
            className="rounded-full glow-primary px-4 w-11 h-11 p-0 shrink-0 disabled:opacity-40"
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            aria-label="Send"
            data-ocid="messages.send_button"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <footer className="py-3 text-center text-xs text-muted-foreground border-t border-border/30 shrink-0">
        <p>
          © {new Date().getFullYear()} DantaNova · Developed by Swanandi Manoj
          Vispute ·{" "}
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-primary hover:underline"
          >
            DANTANOVA.14@gmail.com
          </a>{" "}
          ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
