"use client";

import { useEffect, useState } from "react";
import {
  PlatformKey,
  SKILLS_CLI_AGENTS,
  isSkillsCliCommand,
  skillsCliCommand,
  usePlatform,
} from "../hooks/usePlatform";
import { installIsBroken, type InstallStatus } from "../lib/skill-config";
import { InstallBlock } from "./InstallBlock";
import { AlertTriangle, Clock, ExternalLink, Github, Info, platformIcon } from "./icons";
import { Note, cx } from "./ui";

type InstallOverride = {
  supported?: boolean;
  mode?: "generated" | "custom";
  command?: string;
  note?: string;
};

interface Props {
  slug: string;
  installCmd: string;
  repoUrl: string;
  platforms: string[];
  preferredPlatform?: PlatformKey;
  installOverrides?: Partial<Record<PlatformKey, InstallOverride>>;
  installStatus?: InstallStatus;
  installName?: string;
  installReason?: string;
  installCheckedAt?: string;
}

const ALL_TABS: { key: PlatformKey; label: string }[] = [
  { key: "claudecode", label: "Claude Code" },
  { key: "cursor", label: "Cursor" },
  { key: "codex", label: "Codex" },
  { key: "opencode", label: "OpenCode" },
  { key: "openclaw", label: "OpenClaw" },
  { key: "claude", label: "Claude Desktop" },
  { key: "mcp", label: "MCP (generic)" },
  { key: "openai", label: "OpenAI" },
];

/** A numbered step in an install guide. */
function Step({ n, title, children }: { n: number; title?: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="tabular mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-700 bg-ink-850 text-2xs font-semibold text-ink-400">
        {n}
      </span>
      <div className="min-w-0 flex-1 text-sm text-ink-400">
        {title ? <p className="mb-2 font-medium text-ink-200">{title}</p> : null}
        {children}
      </div>
    </li>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-stack-lg">{children}</ol>;
}

function Requirement({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-ink-750 pl-3 text-xs leading-relaxed text-ink-500">{children}</p>
  );
}

function RepoLink({ repoUrl }: { repoUrl: string }) {
  if (!repoUrl) return null;
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-accent-400 transition-colors hover:text-accent-300"
    >
      <Github className="h-3.5 w-3.5" />
      Repository install instructions
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-xs bg-ink-800 px-1 font-mono text-ink-300">{children}</code>
);

/** A SKILL.md skill, installed into one agent by the skills CLI. */
function SkillsCliGuide({ cmd }: { cmd: string }) {
  return (
    <Steps>
      <Step n={1} title="Run this in your project">
        <InstallBlock label="terminal" code={cmd} prompt />
      </Step>
      <li>
        <Requirement>
          Uses the open-source <Code>skills</Code> CLI and needs Node.js. Add <Code>-g</Code> to
          install it for your user instead of this project.
        </Requirement>
      </li>
    </Steps>
  );
}

/** A platform the skills CLI does not install into. */
function NotForThisPlatform({ label, reason, cmd, repoUrl }: { label: string; reason: string; cmd: string; repoUrl: string }) {
  return (
    <div className="space-y-stack-lg">
      <Note icon={Info}>
        <span className="font-medium text-ink-200">No {label} install for this skill.</span> {reason}
      </Note>
      {cmd ? (
        <Steps>
          <Step n={1} title="Install it for a coding agent instead">
            <InstallBlock label="terminal" code={cmd} prompt />
          </Step>
        </Steps>
      ) : null}
      <RepoLink repoUrl={repoUrl} />
    </div>
  );
}

/** A skill outside the skills CLI: only the command the registry recorded exists. */
function UpstreamGuide({ label, installCmd, repoUrl, override }: { label: string; installCmd: string; repoUrl: string; override?: InstallOverride }) {
  if (override?.supported && override.mode === "custom") {
    return (
      <div className="space-y-stack-lg">
        <Note tone="warn" icon={AlertTriangle}>
          <span className="font-medium">{label} uses a custom install flow for this skill.</span>{" "}
          {override.note || "Use the upstream command below."}
        </Note>
        <Steps>
          <Step n={1} title="Use the upstream install command">
            <InstallBlock label="terminal" code={override.command || installCmd} prompt />
          </Step>
        </Steps>
        <RepoLink repoUrl={repoUrl} />
      </div>
    );
  }
  return (
    <div className="space-y-stack-lg">
      <Note icon={Info}>
        <span className="font-medium text-ink-200">No {label} install is recorded for this skill.</span>{" "}
        We only show commands that exist. Use the upstream one below.
      </Note>
      {installCmd ? (
        <Steps>
          <Step n={1} title="Use the upstream install command">
            <InstallBlock label="terminal" code={installCmd} prompt />
          </Step>
        </Steps>
      ) : null}
      <RepoLink repoUrl={repoUrl} />
    </div>
  );
}

/** The registry checked this skill upstream and the command cannot work. */
function BrokenInstall({ installCmd, reason, checkedAt, repoUrl }: { installCmd: string; reason?: string; checkedAt?: string; repoUrl: string }) {
  const name = installCmd.match(/--skill (\S+)/)?.[1];
  return (
    <div className="space-y-stack-lg">
      <Note tone="warn" icon={AlertTriangle}>
        <span className="font-medium">
          This skill no longer installs{name ? <> under the name <Code>{name}</Code></> : null}.
        </span>{" "}
        {reason}
      </Note>
      <p className="text-xs text-ink-500">
        We check each listing against its upstream repository with the rules the{" "}
        <Code>skills</Code> CLI uses{checkedAt ? <>, last on {checkedAt}</> : null}. We don&apos;t show a
        command we know will fail.
      </p>
      <RepoLink repoUrl={repoUrl} />
    </div>
  );
}

function RenamedNote({ installName }: { installName: string }) {
  return (
    <Note icon={Info}>
      <span className="font-medium text-ink-200">Renamed upstream.</span> The skill is now called{" "}
      <Code>{installName}</Code>. The command below uses the new name.
    </Note>
  );
}

export function PlatformInstallTabs({
  installCmd,
  repoUrl,
  platforms,
  preferredPlatform,
  installOverrides,
  installStatus,
  installName,
  installReason,
  installCheckedAt,
}: Props) {
  const { platform: storedPlatform } = usePlatform();
  const cli = isSkillsCliCommand(installCmd);

  // Tabs with a real command behind them. For a SKILL.md skill that is every
  // agent the skills CLI installs into; otherwise only the recorded command.
  const supported = (key: PlatformKey): boolean =>
    cli
      ? key in SKILLS_CLI_AGENTS
      : key === "openclaw" || Boolean(installOverrides?.[key]?.supported) || platforms.includes(key);

  const fallbackTab: PlatformKey =
    preferredPlatform && supported(preferredPlatform) ? preferredPlatform : cli ? "claudecode" : "openclaw";
  const pick = (p: PlatformKey | null): PlatformKey => (p && supported(p) ? p : fallbackTab);
  const [activeTab, setActiveTab] = useState<PlatformKey>(fallbackTab);

  useEffect(() => {
    setActiveTab(pick(storedPlatform as PlatformKey | null));
    // pick is derived from the props below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedPlatform, cli, preferredPlatform, platforms, installOverrides]);

  const broken = installIsBroken({ install_status: installStatus });

  function renderGuide() {
    const label = ALL_TABS.find((t) => t.key === activeTab)?.label ?? activeTab;
    if (cli) {
      if (activeTab in SKILLS_CLI_AGENTS) return <SkillsCliGuide cmd={skillsCliCommand(installCmd, activeTab)} />;
      const agentCmd = skillsCliCommand(installCmd, "claudecode");
      if (activeTab === "mcp") {
        return (
          <NotForThisPlatform
            label="MCP"
            reason="This is a SKILL.md skill (instructions an agent loads), not an MCP server, so there is no MCP config to add."
            cmd={agentCmd}
            repoUrl={repoUrl}
          />
        );
      }
      return (
        <NotForThisPlatform
          label={label}
          reason={`${label} has no command-line install for SKILL.md skills.`}
          cmd={agentCmd}
          repoUrl={repoUrl}
        />
      );
    }
    if (activeTab === "openai") {
      return (
        <div className="space-y-stack-lg">
          <Note icon={Clock}>
            <span className="font-medium text-ink-200">No direct OpenAI install.</span> OpenAI has no
            universal skill install flow.
          </Note>
          <RepoLink repoUrl={repoUrl} />
        </div>
      );
    }
    if (activeTab === "openclaw") {
      return (
        <Steps>
          <Step n={1} title="Run this in your terminal">
            <InstallBlock label="terminal" code={installCmd} prompt />
          </Step>
        </Steps>
      );
    }
    return <UpstreamGuide label={label} installCmd={installCmd} repoUrl={repoUrl} override={installOverrides?.[activeTab]} />;
  }

  const activeLabel = ALL_TABS.find((t) => t.key === activeTab)?.label ?? "Claude Code";

  return (
    <div className="overflow-hidden rounded-xl border border-ink-750 bg-ink-900 shadow-e1">
      <div className={cx("px-gutter-lg pt-gutter-lg", !broken && "border-b border-ink-800")}>
        <h2 className="text-sm font-semibold text-ink-50">Install on your platform</h2>
        {broken ? null : (
          <>
            <p className="mt-1 text-sm text-ink-450">
              Showing <span className="font-medium text-ink-200">{activeLabel}</span>.
              {cli ? " One command installs this skill into any of the agents below." : null}
            </p>

            <div role="tablist" aria-label="Install platform" className="-mb-px mt-4 flex flex-wrap gap-0.5">
              {ALL_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const isSupported = supported(tab.key);
                const Icon = platformIcon(tab.key);
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.key)}
                    className={cx(
                      "-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-2 text-xs font-medium",
                      "transition duration-fast ease-out",
                      isActive
                        ? "border-accent-500 text-ink-50"
                        : "border-transparent text-ink-500 hover:border-ink-700 hover:text-ink-200",
                      !isSupported && !isActive && "opacity-60"
                    )}
                    title={isSupported ? undefined : "No install command for this platform"}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="space-y-stack-lg p-gutter-lg">
        {broken ? (
          <BrokenInstall installCmd={installCmd} reason={installReason} checkedAt={installCheckedAt} repoUrl={repoUrl} />
        ) : (
          <>
            {installStatus === "renamed" && installName ? (
              <RenamedNote installName={installName} />
            ) : null}
            {renderGuide()}
          </>
        )}
      </div>
    </div>
  );
}
