/** @type {import('next-sitemap').IConfig} */

// eslint-disable-next-line no-undef
module.exports = {
  siteUrl: "https://parmipicks.com/",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  output: "standalone",

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/404", "/500"],
      },
    ],
  },
};
