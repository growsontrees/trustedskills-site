import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Github, Shield } from "../../components/icons";
import { Eyebrow, Note, Panel } from "../../components/ui";
import { canonicalUrl } from "../../lib/site-url";
import {
  GITHUB_ISSUES_URL,
  REPORT_PROMISE,
  REPORT_SKILL_URL,
  REQUEST_SKILL_URL,
  SITE_BUG_URL,
} from "../../lib/github-links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Report a malicious or broken skill, request a skill, or report a problem with the site. Everything goes through GitHub issues on the TrustedSkills site repository.",
  alternates: { canonical: canonicalUrl("/contact") },
};

/** One channel, three doors. Discussions is deliberately off. */
const CHANNELS = [
  {
    href: REPORT_SKILL_URL,
    icon: AlertTriangle,
    title: "Report a skill",
    body:
      "A listing is malicious, its install command is dead, its badge misrepresents it, or its upstream repository is gone. Include the skill page and the commit shown on it.",
    cta: "Report a skill",
  },
  {
    href: REQUEST_SKILL_URL,
    icon: Shield,
    title: "Request a skill",
    body:
      "Something you expected to find isn't in the index. If you published it yourself you don't need this — a public repository carrying the openclaw-skill topic is picked up on the next crawl.",
    cta: "Request a skill",
  },
  {
    href: SITE_BUG_URL,
    icon: Github,
    title: "Report a site bug",
    body:
      "A page on trustedskills.dev is broken, a docs command doesn't work, or a number doesn't add up. Tell us the URL and what you expected.",
    cta: "Report a site bug",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-1 text-3xl font-semibold text-ink-50">Get in touch</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-400">
          Everything runs through issues on the repository this site is built from. It&apos;s
          public, it&apos;s the only channel we watch, and what you write there stays readable to
          everyone — including the next person hitting the same problem.
        </p>
      </header>

      <section className="mt-8 space-y-3">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;
          return (
            <Panel key={channel.title} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-50">
                  <Icon className="h-4 w-4 shrink-0 text-ink-450" />
                  {channel.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-450">{channel.body}</p>
              </div>
              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-ink-700 bg-ink-850 px-4 text-sm font-medium text-ink-200 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50"
              >
                {channel.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Panel>
          );
        })}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink-50">What we do with a report</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">{REPORT_PROMISE} Delisting
          removes a skill from this index and nothing else: if it also ships as an npm package,
          report that separately to npm — removing it here does not remove it there.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          We don&apos;t read the code of the skills we list, and no badge on this site means
          anyone has. What the badges actually describe is set out in{" "}
          <Link
            href="/docs/advanced/verification-badges"
            className="text-accent-400 transition-colors hover:text-accent-300"
          >
            what each badge means
          </Link>
          .
        </p>
      </section>

      <section className="mt-8">
        <Note>
          No email address, on purpose. A GitHub issue is a thread anyone can search, quote and
          reopen — an inbox is a place a report goes to be forgotten. If you need to raise
          something you can&apos;t say in public, check the{" "}
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 transition-colors hover:text-accent-300"
          >
            repository
          </a>{" "}
          for a Security tab before writing anything sensitive into an issue.
        </Note>
      </section>
    </div>
  );
}
