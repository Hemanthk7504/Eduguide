import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Loader2, BookOpen, Bot, User } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatHistory, sendChatMessage } from "../api/misc";
import { Markdown } from "./Markdown";
import type { ChatMessageOut } from "../types/api";

function sessionKey(profileId?: string) {
  return profileId ? `eduguide_chat_session_${profileId}` : "eduguide_chat_session_global";
}

function getOrCreateSessionId(profileId?: string): string {
  const key = sessionKey(profileId);
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = uuidv4();
    localStorage.setItem(key, sid);
  }
  return sid;
}

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export function ChatPanel({ profileId }: { profileId?: string }) {
  const [sessionId] = useState(() => getOrCreateSessionId(profileId));
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history } = useQuery<ChatMessageOut[]>({
    queryKey: ["chat-history", sessionId],
    queryFn: () => getChatHistory(sessionId),
    retry: false,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, localMessages]);

  async function handleSend() {
    const message = draft.trim();
    if (!message || sending) return;
    setDraft("");
    setLocalMessages((m) => [...m, { role: "user", content: message }]);
    setSending(true);
    try {
      const res = await sendChatMessage({ session_id: sessionId, profile_id: profileId, message });
      setLocalMessages((m) => [...m, { role: "assistant", content: res.reply, sources: res.sources }]);
      queryClient.invalidateQueries({ queryKey: ["chat-history", sessionId] });
    } catch {
      setLocalMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach the server just now. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  const allMessages: LocalMessage[] = [
    ...(history?.map((h) => ({ role: h.role, content: h.content })) ?? []),
    ...localMessages,
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {allMessages.length === 0 && (
          <div className="grid h-full place-items-center text-center text-sm text-[var(--color-ink-faint)]">
            <div>
              <Bot className="mx-auto mb-2 h-8 w-8 text-[var(--color-brand)]" />
              Ask about colleges, cutoffs, scholarships, or branches.
            </div>
          </div>
        )}
        {allMessages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-agent-blue)]/20 text-[var(--color-agent-blue)]">
                <Bot className="h-3.5 w-3.5" />
              </span>
            )}
            <div className={`max-w-[80%] ${m.role === "user" ? "order-1" : ""}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-ink)]"
                }`}
              >
                {m.role === "assistant" ? <Markdown content={m.content} compact /> : m.content}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.sources.map((s, si) => (
                    <span
                      key={si}
                      className="badge bg-[var(--color-surface)] text-[var(--color-ink-faint)] ring-1 ring-inset ring-[var(--color-border)]"
                    >
                      <BookOpen className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && (
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">
                <User className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-ink-faint)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-end gap-2 border-t border-[var(--color-border-soft)] pt-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder="Ask EduGuide anything…"
          className="input max-h-28 flex-1 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          aria-label="Send message"
          className="btn-primary h-[42px] w-[42px] shrink-0 !px-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
