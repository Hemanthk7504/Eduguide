import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Loader2, BookOpen, Bot, User, RotateCcw, Sparkles } from "lucide-react";
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

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  isPending?: boolean;
}

const SUGGESTION_PROMPTS = [
  "🎯 What colleges best match my entrance rank?",
  "💡 Compare CSE vs AI & Data Science branches",
  "💰 What scholarships am I eligible for?",
  "🏫 How are campus placements in top colleges?",
];

export function ChatPanel({ profileId }: { profileId?: string }) {
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId(profileId));
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingUserMsg, setPendingUserMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery<ChatMessageOut[]>({
    queryKey: ["chat-history", sessionId],
    queryFn: () => getChatHistory(sessionId),
    retry: false,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, pendingUserMsg, sending]);

  function handleResetChat() {
    const newSid = uuidv4();
    localStorage.setItem(sessionKey(profileId), newSid);
    setSessionId(newSid);
    setPendingUserMsg(null);
    setSending(false);
  }

  async function executeSend(textToSend: string) {
    const message = textToSend.trim();
    if (!message || sending) return;

    setDraft("");
    setPendingUserMsg(message);
    setSending(true);

    try {
      const res = await sendChatMessage({ session_id: sessionId, profile_id: profileId, message });

      // Cleanly append to query cache without duplication
      queryClient.setQueryData<ChatMessageOut[]>(["chat-history", sessionId], (old = []) => [
        ...old,
        {
          role: "user",
          content: message,
          created_at: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: res.reply,
          sources: res.sources,
          created_at: new Date().toISOString(),
        } as any,
      ]);
    } catch {
      queryClient.setQueryData<ChatMessageOut[]>(["chat-history", sessionId], (old = []) => [
        ...old,
        {
          role: "user",
          content: message,
          created_at: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: "I couldn't reach the server just now. Please verify your connection or try again in a moment.",
          created_at: new Date().toISOString(),
        } as any,
      ]);
    } finally {
      setPendingUserMsg(null);
      setSending(false);
    }
  }

  async function handleSend() {
    await executeSend(draft);
  }

  // Combine database history with optimistic pending message
  const displayMessages: DisplayMessage[] = [
    ...history.map((h, i) => ({
      id: `hist-${i}-${h.created_at}`,
      role: h.role,
      content: h.content,
      sources: (h as any).sources,
    })),
    ...(pendingUserMsg
      ? [
          {
            id: "pending-user",
            role: "user" as const,
            content: pendingUserMsg,
            isPending: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Mini Header with New Session action */}
      <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] pb-2 mb-2 text-xs text-[var(--color-ink-dim)]">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand)]" />
          Live Admissions Counselor
        </span>
        {history.length > 0 && (
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
            title="Start fresh conversation"
          >
            <RotateCcw className="h-3 w-3" />
            New Chat
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {isLoading && history.length === 0 && (
          <div className="grid h-full place-items-center text-center text-sm text-[var(--color-ink-faint)]">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-brand)]" />
          </div>
        )}

        {!isLoading && displayMessages.length === 0 && (
          <div className="flex h-full flex-col justify-center items-center text-center px-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] mb-3">
              <Bot className="h-6 w-6" />
            </span>
            <h4 className="font-display text-sm font-semibold text-[var(--color-ink)]">
              Welcome to EduGuide Assistant
            </h4>
            <p className="mt-1 text-xs text-[var(--color-ink-dim)] max-w-xs">
              Ask about college cutoffs, admissions criteria, scholarships, or branch guidance.
            </p>

            {/* Starter Suggestion Chips */}
            <div className="mt-5 w-full max-w-sm space-y-2">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)] text-left">
                Suggested questions:
              </span>
              {SUGGESTION_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => executeSend(prompt)}
                  className="w-full text-left rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 px-3 py-2 text-xs text-[var(--color-ink)] transition-all hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-brand)]/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayMessages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
                <Bot className="h-3.5 w-3.5" />
              </span>
            )}
            <div className={`max-w-[85%] ${m.role === "user" ? "order-1" : ""}`}>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-xs ${
                  m.role === "user"
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-ink)] border border-[var(--color-border-soft)]/50"
                }`}
              >
                {m.role === "assistant" ? <Markdown content={m.content} compact /> : m.content}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.sources.map((s, si) => (
                    <span
                      key={si}
                      className="badge bg-[var(--color-surface)] text-[var(--color-ink-faint)] ring-1 ring-inset ring-[var(--color-border)] text-[10px]"
                    >
                      <BookOpen className="h-2.5 w-2.5" /> {s}
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
          <div className="flex items-center gap-2 text-xs text-[var(--color-ink-dim)] pl-8">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-brand)]" />
            <span>EduGuide Assistant is formulating advice…</span>
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
          placeholder="Ask EduGuide about cutoffs, branches, or colleges…"
          className="input max-h-28 flex-1 resize-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          aria-label="Send message"
          className="btn-primary h-[42px] w-[42px] shrink-0 !px-0 flex items-center justify-center rounded-xl"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
