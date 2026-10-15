'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-JYQN09HXKB';

/** localStorage key holding "granted" once a visitor has opted in. */
export const ANALYTICS_CONSENT_KEY = 'ts-analytics-consent';

/**
 * EEA, UK and Switzerland. Visitors from these regions get every storage
 * type denied by default, so GA4 sends cookieless pings until they opt in.
 */
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
  'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

/**
 * Consent Mode v2 defaults, then config. The two calls are pushed to
 * dataLayer in this order by one inline script, so gtag.js always reads the
 * defaults before the config however late it loads:
 *
 *  1. Regional default — everything denied in the EEA, UK and Switzerland.
 *  2. Global default — analytics_storage granted everywhere else. The three
 *     ad_* types stay denied for every visitor; the site runs no ads.
 *
 * A stored opt-in is replayed as a `consent update` before `config`, so a
 * visitor who accepted on an earlier visit is measured normally.
 */
const GTAG_INIT = [
  'window.dataLayer=window.dataLayer||[];',
  'function gtag(){dataLayer.push(arguments);}',
  `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)}});`,
  "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});",
  `try{if(localStorage.getItem(${JSON.stringify(ANALYTICS_CONSENT_KEY)})==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`,
  "gtag('js',new Date());",
  `gtag('config',${JSON.stringify(GA_ID)});`,
].join('');

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Record a visitor's analytics choice and tell GA4 about it straight away.
 * Call this from a consent prompt: `setAnalyticsConsent(true)` on accept,
 * `setAnalyticsConsent(false)` on decline.
 */
export function setAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {
    // Private mode or blocked storage — the update below still applies to this page view.
  }

  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
  } else {
    w.dataLayer.push(['consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' }]);
  }
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script id="gtag-consent-init" strategy="afterInteractive">
        {GTAG_INIT}
      </Script>
      <Script
        id="gtag-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
    </>
  );
}
