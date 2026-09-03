import { AGENTS } from "../lib/agents";

interface AgentRailProps {
  orientation?: "horizontal" | "vertical";
  activeKeys?: string[];
  pulse?: boolean;
  compact?: boolean;
}

const PIPELINE_ORDER = [
  "student_input",
  "profile_analyzer",
  "coordinator",
  "rag_pipeline",
  "llm",
  "college_agent",
  "scholarship_agent",
  "branch_agent",
  "career_guidance",
];

export function AgentRail({
  orientation = "horizontal",
  activeKeys,
  pulse = false,
  compact = orientation === "vertical",
}: AgentRailProps) {
  const agents = AGENTS.filter((a) => PIPELINE_ORDER.includes(a.key)).sort(
    (a, b) => PIPELINE_ORDER.indexOf(a.key) - PIPELINE_ORDER.indexOf(b.key)
  );

  if (orientation === "vertical") {
    return (
      <div className="relative flex flex-col gap-2 py-1 pl-1">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--color-border)]" />
        {agents.map((agent) => {
          const isActive = !activeKeys || activeKeys.includes(agent.key);
          return (
            <div key={agent.key} className="relative z-10 flex items-center gap-2.5">
              <span
                className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg ring-1 ring-inset transition-opacity"
                style={{
                  backgroundColor: `color-mix(in srgb, ${agent.color} 18%, transparent)`,
                  color: agent.color,
                  borderColor: agent.color,
                  opacity: isActive ? 1 : 0.35,
                }}
              >
                <agent.icon className="h-3.5 w-3.5" />
              </span>
              {!compact && (
                <span
                  className="truncate text-xs text-[var(--color-ink-faint)]"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  {agent.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-0 overflow-x-auto rail-track py-3">
      {agents.map((agent, i) => {
        const isActive = !activeKeys || activeKeys.includes(agent.key);
        return (
          <div key={agent.key} className="flex shrink-0 items-center">
            <div className="flex flex-col items-center gap-1.5 px-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset transition-all ${
                  pulse && isActive ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${agent.color} 16%, transparent)`,
                  color: agent.color,
                  borderColor: agent.color,
                  opacity: isActive ? 1 : 0.3,
                }}
                title={agent.label}
              >
                <agent.icon className="h-4 w-4" />
              </span>
              <span
                className="max-w-[64px] truncate text-center text-[10px] font-medium text-[var(--color-ink-faint)]"
                style={{ opacity: isActive ? 1 : 0.4 }}
              >
                {agent.label}
              </span>
            </div>
            {i < agents.length - 1 && (
              <div className="h-px w-6 shrink-0 bg-[var(--color-border)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
