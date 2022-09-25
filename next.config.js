/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en", "bg"],
    defaultLocale: "bg",
  },
});

module.exports = nextConfig;
