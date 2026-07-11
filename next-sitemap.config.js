/** @type {import('next-sitemap').IConfig} */

// eslint-disable-next-line no-undef
module.exports = {
  siteUrl: "https://parmipicks.com/",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  output: "standalone",

  // Keep the internal design-system reference out of the sitemap.
  exclude: ["/design"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/404", "/500", "/design"],
      },
    ],
  },
};
