const {
  SITE_URL,
  SITEMAP_SIZE,
  getCanonicalRoutes,
} = require('./scripts/discovery-routes.cjs');

const canonicalRoutes = getCanonicalRoutes();
const canonicalRouteSet = new Set(canonicalRoutes);

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  outDir: './public',
  autoLastmod: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: SITEMAP_SIZE,
  transform: async (config, url) => {
    const route = url !== '/' ? url.replace(/\/$/, '') : url;
    if (!canonicalRouteSet.has(route)) return null;

    return {
      loc: route,
      changefreq: config.changefreq,
      priority: config.priority,
    };
  },
  // App Router only pre-renders the top 5,000 skill pages. Supplying the full
  // approved inventory keeps every on-demand public page in the sitemap too.
  additionalPaths: async () => canonicalRoutes.map((loc) => ({
    loc,
    changefreq: 'weekly',
    priority: 0.7,
  })),
}
