import type { Metadata } from "next";
import Link from "next/link";
import { BarChart, Lock, Shield } from "../../components/icons";
import { Eyebrow, Note, Panel } from "../../components/ui";
import { canonicalUrl } from "../../lib/site-url";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What TrustedSkills collects and what it doesn't. Google Analytics 4 measures page views; there are no accounts, no sign-up and no personal data needed to browse. How to opt out.",
  alternates: { canonical: canonicalUrl("/privacy") },
};

/** What GA4 reports back on a page view. Deliberately the whole list. */
const COLLECTED = [
  "The page you looked at, and the page you came from.",
  "A referrer — the search engine, site or link that sent you here.",
  "Country and city, worked out from your IP address. Google discards the address itself and we never see it.",
  "Device type, screen size, browser, operating system and language.",
  "A randomly generated visitor ID, stored in a cookie, so a second page view is not counted as a second person.",
];

const NOT_COLLECTED = [
  "No account. There is nothing to sign up for and nothing to log into.",
  "No name, email address or payment details. No form on this site asks for them.",
  "No advertising. The ad_storage, ad_user_data and ad_personalization consent types stay denied for every visitor, everywhere.",
  "No selling or sharing of anything above with a third party beyond Google, who process it to produce the reports.",
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <Eyebrow>Privacy</Eyebrow>
        <h1 className="mt-1 text-3xl font-semibold text-ink-50">Privacy</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-400">
          This is an index you read. You don&apos;t need an account, and nothing here asks who you
          are. The one thing we do measure is traffic, with Google Analytics 4, and this page says
          exactly what that sees.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-50">
          <BarChart className="h-4 w-4 shrink-0 text-ink-450" />
          Google Analytics 4
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          Every page loads Google Analytics 4. It tells us which pages people read and which
          searches bring them here, which is how we decide what to fix next. It sets cookies in
          your browser — the <code className="font-mono text-ink-300">_ga</code> pair — to tell a
          returning reader from a new one. They expire after two years.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          Google acts as our processor for that data and keeps its own copy. Their terms are in the{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 transition-colors hover:text-accent-300"
          >
            Google Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Panel>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-50">
            <BarChart className="h-4 w-4 shrink-0 text-ink-450" />
            What it collects
          </h2>
          <ul className="mt-3 space-y-2">
            {COLLECTED.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-ink-450">
                {item}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-50">
            <Shield className="h-4 w-4 shrink-0 text-ink-450" />
            What it doesn&apos;t
          </h2>
          <ul className="mt-3 space-y-2">
            {NOT_COLLECTED.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-ink-450">
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-50">
          <Lock className="h-4 w-4 shrink-0 text-ink-450" />
          Consent, by region
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          We use Google Consent Mode v2. If you are in the EEA, the UK or Switzerland, all four
          consent types — analytics storage and the three advertising ones — are denied before
          Analytics starts. No cookie is set and no identifier is stored; we get an anonymous,
          cookieless count of the page view and nothing that can be tied back to a browser. That is
          why you don&apos;t get a cookie banner here.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          Everywhere else, analytics storage is granted and the{" "}
          <code className="font-mono text-ink-300">_ga</code> cookie is set. The three advertising
          consent types stay denied for everyone.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink-50">How to opt out</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          Any one of these stops the measurement. You lose nothing on the site by using them —
          every page works the same without Analytics.
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-400">
          <li>
            Install Google&apos;s{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 transition-colors hover:text-accent-300"
            >
              Analytics Opt-out Browser Add-on
            </a>
            , which blocks it on every site, not just this one.
          </li>
          <li>
            Turn on tracking protection in your browser, or use any content blocker. Firefox and
            Brave block Analytics out of the box.
          </li>
          <li>
            Block cookies for this site, or clear them. Clearing the{" "}
            <code className="font-mono text-ink-300">_ga</code> cookies resets the visitor ID.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ink-50">Other things that load</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          Install commands on a skill page are text for you to copy — nothing is run and nothing is
          sent anywhere when you copy one. Your platform choice on those pages is stored in your own
          browser, in <code className="font-mono text-ink-300">localStorage</code>, and never leaves
          it. Links out to GitHub and other sources are plain links; once you follow one you are on
          that site, under its own policy.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-400">
          This site is served through Cloudflare, which handles the connection and logs requests for
          security and abuse prevention as part of serving it.
        </p>
      </section>

      <section className="mt-8">
        <Note>
          Questions about any of this, or a request to have something removed, go to{" "}
          <Link href="/contact" className="text-accent-400 transition-colors hover:text-accent-300">
            Contact
          </Link>{" "}
          — or write to [contact address here].
        </Note>
      </section>
    </div>
  );
}
