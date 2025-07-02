<script setup lang="ts">
// Simple debounce composable
function useDebounce(fn: (...args: any[]) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const search = ref("")
const showDropdown = ref(false)
const loading = ref(false)
const results = ref<{ players: any[]; clubs: any[] }>({ players: [], clubs: [] })
const router = useRouter()
const searchInputRef = ref()
const dropdownPosition = ref({ top: 0, left: 0, width: 0 })

const updateDropdownPosition = () => {
  if (searchInputRef.value?.$el) {
    const rect = searchInputRef.value.$el.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    }
  }
}

const doSearch = useDebounce(async (q: string) => {
  if (!q || q.length < 2) {
    results.value = { players: [], clubs: [] }
    loading.value = false
    showDropdown.value = false
    return
  }
  loading.value = true
  try {
    const [players, clubs] = await Promise.all([
      $fetch("/api/players", { query: { search: q, pageSize: 5 } }),
      $fetch("/api/clubs", { query: { search: q, pageSize: 5 } }),
    ])
    results.value = {
      players: players?.data || [],
      clubs: clubs?.data || [],
    }
    showDropdown.value = true
    nextTick(() => updateDropdownPosition())
  } finally {
    loading.value = false
  }
}, 300)

watch(search, (q) => {
  if (!q || q.length < 2) {
    showDropdown.value = false
    return
  }
  doSearch(q)
})

const handleSelect = (item: any, type: "player" | "club") => {
  showDropdown.value = false
  search.value = ""
  if (type === "player") {
    router.push(`/players/${item.player_id}`)
  } else {
    router.push(`/clubs/${item.club_id}`)
  }
}

const handleBlur = () => {
  setTimeout(() => (showDropdown.value = false), 200)
}

const handleFocus = () => {
  if (
    search.value &&
    search.value.length > 1 &&
    (results.value.players.length || results.value.clubs.length)
  ) {
    showDropdown.value = true
    nextTick(() => updateDropdownPosition())
  }
}

// Update position on scroll/resize
onMounted(() => {
  window.addEventListener("scroll", updateDropdownPosition)
  window.addEventListener("resize", updateDropdownPosition)
})

onUnmounted(() => {
  window.removeEventListener("scroll", updateDropdownPosition)
  window.removeEventListener("resize", updateDropdownPosition)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Campo da calcio pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-green-900/30"></div>
        <!-- Linee del campo -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 border-2 border-white/20 rounded-lg"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"
        ></div>
      </div>

      <!-- Effetti luminosi AI -->
      <div
        class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-500/20 to-lime-400/20 blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 blur-3xl animate-pulse"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-400/10 blur-3xl animate-pulse"
        style="animation-delay: 4s"
      ></div>
    </div>

    <!-- Main Layout -->
    <div class="relative z-10">
      <!-- Top Header -->
      <header
        @click="router.push('/')"
        class="bg-gradient-to-r cursor-pointer from-emerald-950/80 via-slate-900/80 to-green-950/80 backdrop-blur-xl border-b border-emerald-500/20 h-20"
      >
        <div class="flex items-center justify-between h-full px-6">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                class="text-xl font-bold bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 bg-clip-text text-transparent"
              >
                FootballAI
              </h1>
              <p class="text-xs text-emerald-300/70">Analytics Platform</p>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-6 relative">
            <UInput
              ref="searchInputRef"
              v-model="search"
              placeholder="Cerca giocatori, club, trasferimenti... (AI-powered)"
              class="w-full pl-12 pr-20 py-3 bg-emerald-950/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl text-white placeholder-emerald-300/50 focus:border-emerald-400/70 focus:ring-emerald-400/30 shadow-lg shadow-emerald-900/20"
              size="lg"
              @focus="handleFocus"
              @blur="handleBlur"
              autocomplete="off"
            >
              <template #leading>
                <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-emerald-400" />
              </template>
            </UInput>
            <!-- Badge ⌘K posizionato all'esterno dell'input -->
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span
                class="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium"
              >
                <UKbd size="sm" value="meta" class="bg-emerald-500/20 text-emerald-300" />
                <UKbd size="sm" value="k" class="bg-emerald-500/20 text-emerald-300"/>
              </span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center space-x-4">
            <UButton
              variant="ghost"
              size="sm"
              class="relative text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20"
            >
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
              <span
                class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"
              ></span>
            </UButton>

            <UButton
              variant="ghost"
              size="sm"
              class="text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20"
            >
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            </UButton>

            <div class="h-6 w-px bg-emerald-500/30"></div>

            <!-- AI Assistant Dialog -->
            <UModal>
              <UButton
                variant="ghost"
                size="sm"
                class="bg-gradient-to-r from-emerald-500/20 to-lime-500/20 border border-emerald-400/30 text-emerald-100 hover:from-emerald-500/30 hover:to-lime-500/30 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
              >
                <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 mr-2" />
                AI Assistant
              </UButton>
              <template #content>
                <AIAssistantDialog />
              </template>
            </UModal>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main
        class="overflow-y-auto bg-gradient-to-b from-emerald-950/30 to-slate-900/30 backdrop-blur-sm"
      >
        <slot />
      </main>
    </div>

    <!-- Search Dropdown via Teleport -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showDropdown && (results.players.length || results.clubs.length || loading)"
          class="fixed z-[9999]"
          :style="{
            top: dropdownPosition.top + 'px',
            left: dropdownPosition.left + 'px',
            width: dropdownPosition.width + 'px',
          }"
        >
          <div
            class="w-full bg-emerald-950/95 border border-emerald-500/30 rounded-xl shadow-xl backdrop-blur-xl max-h-96 overflow-y-auto"
          >
            <div v-if="loading" class="p-4 text-emerald-300 flex items-center space-x-2">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin w-5 h-5" />
              <span>Caricamento...</span>
            </div>

            <!-- Two Column Layout -->
            <div
              v-if="!loading && (results.players.length || results.clubs.length)"
              class="grid grid-cols-2 gap-0"
            >
              <!-- Players Column (Left) -->
              <div class="border-r border-emerald-500/20">
                <div
                  v-if="results.players.length"
                  class="px-4 pt-3 pb-1 text-xs text-emerald-400 font-semibold"
                >
                  Giocatori
                </div>
                <ul v-if="results.players.length">
                  <li
                    v-for="player in results.players"
                    :key="player.player_id"
                    class="flex items-center px-4 py-2 hover:bg-emerald-800/60 cursor-pointer transition"
                    @mousedown.prevent="handleSelect(player, 'player')"
                  >
                    <img
                      :src="player.image_url"
                      class="w-6 h-6 rounded-full mr-2 border border-emerald-400/30"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-white font-medium text-sm truncate">{{ player.name }}</div>
                      <div class="text-emerald-300 text-xs truncate">
                        {{ player.current_club_name }}
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  v-if="!results.players.length"
                  class="px-4 py-6 text-emerald-300/50 text-center text-sm"
                >
                  Nessun giocatore
                </div>
              </div>

              <!-- Clubs Column (Right) -->
              <div>
                <div
                  v-if="results.clubs.length"
                  class="px-4 pt-3 pb-1 text-xs text-lime-400 font-semibold"
                >
                  Club
                </div>
                <ul v-if="results.clubs.length">
                  <li
                    v-for="club in results.clubs"
                    :key="club.club_id"
                    class="flex items-center px-4 py-2 hover:bg-lime-800/60 cursor-pointer transition"
                    @mousedown.prevent="handleSelect(club, 'club')"
                  >
                    <img
                      :src="`https://tmssl.akamaized.net/images/wappen/head/${club.club_id}.png`"
                      class="w-6 h-6 rounded-full mr-2 border border-lime-400/30"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-white font-medium text-sm truncate">{{ club.name }}</div>
                      <div class="text-lime-300 text-xs truncate">
                        {{ club.domestic_competition_id }}
                      </div>
                    </div>
                  </li>
                </ul>
                <div
                  v-if="!results.clubs.length"
                  class="px-4 py-6 text-lime-300/50 text-center text-sm"
                >
                  Nessun club
                </div>
              </div>
            </div>

            <div
              v-if="!loading && !results.players.length && !results.clubs.length"
              class="p-4 text-emerald-300 text-center"
            >
              Nessun risultato trovato.
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Custom scrollbar con colori calcio */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(5, 46, 22, 0.3);
}

::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.7);
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Effetto campo da calcio */
.field-pattern {
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
