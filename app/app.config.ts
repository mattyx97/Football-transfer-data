export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: "cursor-pointer",
      },
    },
    modal: {
      slots: {
        overlay: "bg-zinc-900/80",
      },
    },
  },
})
