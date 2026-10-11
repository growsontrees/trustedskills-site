import type { Metadata } from "next";
import Link from "next/link";
import { getSignalMeta, getTrendingRepos, SKILLS_PER_REPO, type TrendingRepo } from "../../lib/trending";
import { SIGNAL_PARTS, formatCount, formatDate, type SignalMeta, type SignalPart, type Skill } from "../../lib/skill-config";
import { canonicalUrl, skillPath } from "../../lib/site-url";
import { ExternalLink, Info, TrendingUp } from "../../components/icons";
import { Chip, Eyebrow, Note, Panel } from "../../components/ui";

const LIMIT = 50;

export const metadata: Metadata = {
  title: "Trending AI Agent Skills",
  description:
    "Skill repos ranked by the GitHub stars they gained in the last two weeks, not by their all-time total. Updated from the TrustedSkills registry.",
  alternates: { canonical: canonicalUrl("/trending") },
  openGraph: {
    title: "Trending AI Agent Skills | TrustedSkills",
    description: "Skill repos ranked by recent GitHub star growth, not all-time stars.",
    url: canonicalUrl("/trending"),
  },
};

const PART_LABEL: Record<SignalPart, string> = {
  velocity: "Star growth",
  stars: "Stars",
  recency: "Recency",
  installs: "Installs",
};

const number = (n: number) => n.toLocaleString("en-GB");

/** The delta window most repos share, so the lead can name it once. */
function usualWindow(repos: TrendingRepo[]): number | null {
  const tally = new Map<number, number>();
  for (const r of repos) tally.set(r.days, (tally.get(r.days) ?? 0) + 1);
  const top = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

function SignalCell({ value }: { value: number | null }) {
  return value === null ? (
    <span className="text-ink-500">
      <span aria-hidden="true">—</span>
      <span className="sr-only">not measured</span>
    </span>
  ) : (
    <>{Math.round(value * 100)}</>
  );
}

function SignalBreakdown({ skills, meta }: { skills: Skill[]; meta: SignalMeta }) {
  const scored = skills.filter((s) => s.signal);
  if (scored.length === 0) return null;
  return (
    <details className="group mt-3">
      <summary className="cursor-pointer text-xs text-ink-450 transition-colors hover:text-ink-200">
        Signal Score breakdown
      </summary>
      <div className="mt-2 overflow-x-auto">
        <table className="tabular w-full min-w-[34rem] text-left text-xs">
          <caption className="sr-only">Signal Score parts for each listed skill, out of 100</caption>
          <thead className="text-ink-500">
            <tr>
              <th scope="col" className="py-1.5 pr-3 font-medium">Skill</th>
              <th scope="col" className="py-1.5 pr-3 font-medium">Score</th>
              {SIGNAL_PARTS.map((part) => (
                <th key={part} scope="col" className="py-1.5 pr-3 font-medium">
                  {PART_LABEL[part]} <span className="text-ink-500">×{meta.weights[part]}</span>
                </th>
              ))}
              <th scope="col" className="py-1.5 font-medium">Measured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800 text-ink-300">
            {scored.map((skill) => {
              const signal = skill.signal!;
              return (
                <tr key={skill.slug}>
                  <th scope="row" className="max-w-[12rem] truncate py-1.5 pr-3 font-normal text-ink-200">
                    {skill.name}
                  </th>
                  <td className="py-1.5 pr-3 text-ink-50">
                    {signal.rankable ? Math.round(signal.score) : <span className="text-ink-500">too little data</span>}
                  </td>
                  {SIGNAL_PARTS.map((part) => (
                    <td key={part} className="py-1.5 pr-3">
                      <SignalCell value={signal.parts[part]} />
                    </td>
                  ))}
                  <td className="py-1.5">{Math.round(signal.coverage * 100)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function RepoRow({ rank, repo, meta }: { rank: number; repo: TrendingRepo; meta: SignalMeta | null }) {
  const shown = repo.skills.slice(0, SKILLS_PER_REPO);
  const more = repo.skills.length - shown.length;
  return (
    <li>
      <Panel className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between" padded>
        <div className="flex min-w-0 gap-4">
          <span className="tabular mt-0.5 w-6 shrink-0 text-right text-sm text-ink-500">{rank}</span>
          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink-50">
              <a
                href={`https://github.com/${repo.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1.5 break-all transition-colors hover:text-accent-300"
              >
                {repo.repo}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-500" />
                <span className="sr-only">(GitHub, opens in a new tab)</span>
              </a>
              {repo.bundled ? <Chip>Bundle · {number(repo.skills.length)} skills listed</Chip> : null}
            </h2>
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {shown.map((skill) => (
                <li key={skill.slug} className="flex items-baseline gap-2">
                  <Link href={skillPath(skill.slug)} className="truncate text-ink-300 transition-colors hover:text-ink-50">
                    {skill.name}
                  </Link>
                  {skill.signal?.rankable ? (
                    <span className="tabular shrink-0 text-2xs text-ink-500">
                      Signal {Math.round(skill.signal.score)}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            {more > 0 ? (
              <p className="mt-1 text-xs text-ink-500">
                and {number(more)} more skill{more === 1 ? "" : "s"} from this repo
              </p>
            ) : null}
            {meta ? <SignalBreakdown skills={shown} meta={meta} /> : null}
          </div>
        </div>

        <div className="shrink-0 pl-10 sm:pl-0 sm:text-right">
          <p className="tabular text-xl font-semibold text-ink-50">+{number(repo.starsGained)}</p>
          <p className="text-xs text-ink-450">
            stars in {repo.days} days
            {repo.growth !== null ? <> · +{Math.round(repo.growth * 100)}%</> : null}
          </p>
          <p className="mt-1 text-xs text-ink-500">{formatCount(repo.stars) ?? number(repo.stars)} stars in total</p>
        </div>
      </Panel>
    </li>
  );
}

export default function TrendingPage() {
  const all = getTrendingRepos();
  const repos = all.slice(0, LIMIT);
  const meta = getSignalMeta();
  const window = usualWindow(repos);
  const scored = meta ? formatDate(meta.scored_at) : null;

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <Eyebrow className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          Trending
        </Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold text-ink-50">Skill repos gaining stars fastest</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-400">
          Ranked by the GitHub stars each repo gained
          {window ? <> over the last {window} days</> : null}, not by its all-time total. An all-time
          count mostly rewards age. Growth is what shows you something new.
        </p>
      </header>

      <div className="mt-6 max-w-3xl">
        <Note icon={Info}>
          Stars belong to a repo, not to a skill. A repo that ships an app as well as skills gains
          stars for the app, and every skill in a bundle shows the same number. Each row lists the
          repo&apos;s skills so you can judge that for yourself.
        </Note>
      </div>

      {repos.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-750 py-20 text-center">
          <h2 className="text-base font-semibold text-ink-200">No star history yet</h2>
          <p className="mt-2 text-sm text-ink-500">This page fills in once the registry has two star counts to compare.</p>
        </div>
      ) : (
        <ol className="mt-8 flex flex-col gap-3" aria-label={`Top ${repos.length} trending skill repos`}>
          {repos.map((repo, i) => (
            <RepoRow key={repo.repo} rank={i + 1} repo={repo} meta={meta} />
          ))}
        </ol>
      )}

      <section className="mt-section max-w-3xl" aria-labelledby="how">
        <h2 id="how" className="text-lg font-semibold text-ink-50">How this list is made</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-400">
          <p>
            The registry records each repo&apos;s star count every night. A repo&apos;s gain is its
            stars now minus its stars at the start of the window, which is as close to 30 days as the
            history allows. Repos are ranked on stars gained per day, so windows of different lengths
            compare fairly. A repo needs at least 25 new stars to be listed. {number(all.length)} repos
            qualify; this page shows the top {repos.length}.
          </p>
          {meta ? (
            <>
              <p>
                The <strong className="font-semibold text-ink-200">Signal Score</strong> next to each
                skill combines {SIGNAL_PARTS.map((p) => `${PART_LABEL[p].toLowerCase()} (${meta.weights[p]})`).join(", ")}.
                Stars and star growth are divided by the number of skills in a bundle, so a skill does
                not inherit a big repo&apos;s total. Recency counts only a commit to the skill&apos;s own
                folder, never the repo&apos;s. Installs are the skills.sh count, which we cannot audit,
                so it carries the least weight.
              </p>
              <p>
                {Object.entries(meta.not_yet_measured)
                  .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1))
                  .join(" and ")}{" "}
                are not measured yet, so no skill can have more than{" "}
                {Math.round(meta.max_coverage * 100)}% of the score&apos;s inputs. A part we could not
                measure for one skill earns nothing and shows as a dash. Skills with under{" "}
                {Math.round(meta.min_coverage * 100)}% measured get no score.
                {scored ? <> Last scored {scored}.</> : null}
              </p>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
