import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon"],
  future: {
    compatibilityVersion: 4,
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [
      // @ts-ignore
      tailwindcss(),
    ],
  },
})
