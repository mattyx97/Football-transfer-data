import mongoose from "mongoose"

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  console.log("[PLUGIN: mongoose] Connecting to MongoDB...")
  await mongoose.connect(config.MONGODB_URI)
  console.log("[PLUGIN: mongoose] Connected to MongoDB!")

  nitroApp.hooks.hook("close", async () => {
    console.log("[PLUGIN: mongoose] Disconnecting from MongoDB...")
    await mongoose.disconnect()
    console.log("[PLUGIN: mongoose] Disconnected from MongoDB!")
  })
})
