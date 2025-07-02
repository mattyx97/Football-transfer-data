import tailwindcss from "@tailwindcss/vite";
import { z } from "zod";

const privateEnv = z
  .object({
    NUXT_MONGODB_URI: z.string(),
  })
  .parse(process.env)

const publicEnv = z
  .object({
  })
  .parse(process.env)


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  future: {
    compatibilityVersion: 4,
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    ...stripNuxtPrefix(privateEnv),
    public: stripNuxtPrefix(publicEnv),
  },
  nitro: {
    experimental: {
      tasks: true,
    }
  }
})

function stripNuxtPrefix(key: Record<string, any>) {
  // remove NUXT_ or NUXT_PUBLIC_ prefix
  return Object.fromEntries(
    Object.entries(key).map(([k, v]) => [k.replace(/^NUXT(_PUBLIC)?_/, ""), v]),
  )
}
