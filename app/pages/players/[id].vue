<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 to-slate-900 p-6 space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse">
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 shadow-xl shadow-emerald-900/20">
        <div class="flex items-start space-x-6">
          <div class="w-32 h-32 bg-emerald-500/20 rounded-lg"></div>
          <div class="flex-1 space-y-4">
            <div class="h-8 bg-emerald-500/20 rounded w-1/3"></div>
            <div class="h-4 bg-emerald-500/20 rounded w-1/4"></div>
            <div class="h-4 bg-emerald-500/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Errore nel caricamento"
        :description="error.data?.message || 'Errore sconosciuto'"
      />
    </div>

    <!-- Main Content -->
    <div v-else-if="playerData" class="space-y-6">
      <!-- Header del giocatore -->
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-600/80 to-lime-500/80 p-8">
          <div class="flex items-start space-x-6">
            <img
              :src="(playerData as any)?.photo"
              :alt="(playerData as any)?.name || 'Giocatore'"
              class="w-32 h-32 object-cover rounded-xl border-4 border-white/30 shadow-lg"
              @error="(e) => ((e.target as HTMLImageElement).src = '/default-player.png')"
            />
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-white mb-2">
                {{ (playerData as any)?.name || "Nome non disponibile" }}
              </h1>
              <div class="flex items-center space-x-4 text-lg text-emerald-100 mb-4">
                <span v-if="(playerData as any)?.countryOfCitizenship">
                  {{ (playerData as any).countryOfCitizenship }}
                </span>
                <span v-if="(playerData as any)?.position">•</span>
                <span v-if="(playerData as any)?.position">{{ (playerData as any).position }}</span>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                  <p class="text-sm text-emerald-300">Club Attuale</p>
                  <p class="text-lg font-semibold text-white">{{ (playerData as any)?.currentClub || "N/A" }}</p>
                </div>
                <div class="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                  <p class="text-sm text-emerald-300">Altezza</p>
                  <p class="text-lg font-semibold text-white">{{ (playerData as any)?.height || "N/A" }}</p>
                </div>
                <div class="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                  <p class="text-sm text-emerald-300">Piede</p>
                  <p class="text-lg font-semibold text-white">{{ (playerData as any)?.foot || "N/A" }}</p>
                </div>
                <div class="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                  <p class="text-sm text-emerald-300">Posizione</p>
                  <p class="text-lg font-semibold text-white">{{ (playerData as any)?.subPosition || "N/A" }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informazioni dettagliate -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informazioni personali -->
        <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-user" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Informazioni Personali</h3>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Nome completo:</span>
              <span class="font-semibold text-white">
                {{ (playerData as any)?.firstName || "" }} {{ (playerData as any)?.lastName || "" }}
              </span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Data di nascita:</span>
              <span class="font-semibold text-white">{{ (playerData as any)?.dateOfBirth || "N/A" }}</span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Età:</span>
              <span class="font-semibold text-white">{{ (playerData as any)?.age || "N/A" }}</span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Luogo di nascita:</span>
              <span class="font-semibold text-white">
                {{ (playerData as any)?.cityOfBirth || "N/A" }},
                {{ (playerData as any)?.countryOfBirth || "N/A" }}
              </span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Nazionalità:</span>
              <span class="font-semibold text-white">
                {{ (playerData as any)?.countryOfCitizenship || "N/A" }}
              </span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Agente:</span>
              <span class="font-semibold text-white">{{ (playerData as any)?.agent || "N/A" }}</span>
            </div>
            <div class="flex justify-between p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
              <span class="text-emerald-300">Ultimo aggiornamento:</span>
              <span class="font-semibold text-white">{{ (playerData as any)?.lastSeason || "N/A" }}</span>
            </div>
          </div>
        </div>

        <!-- Valutazioni -->
        <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Valutazioni</h3>
          </div>

          <div v-if="valuationsPending" class="h-64 bg-emerald-950/30 rounded animate-pulse"></div>
          <div
            v-else-if="valuationsData?.valuations && valuationsData.valuations.length > 0"
            class="space-y-4"
          >
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/30">
                <span class="text-emerald-300 text-sm">Valore Attuale:</span>
                <p class="font-semibold text-emerald-400 text-lg">
                  {{ (valuationsData as any)?.stats?.current || "N/A" }}
                </p>
              </div>
              <div class="bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/30">
                <span class="text-emerald-300 text-sm">Valore Massimo:</span>
                <p class="font-semibold text-emerald-400 text-lg">
                  {{ (valuationsData as any)?.stats?.max || "N/A" }}
                </p>
              </div>
              <div class="bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/30">
                <span class="text-emerald-300 text-sm">Variazione:</span>
                <p
                  class="font-semibold text-lg"
                  :class="(valuationsData as any)?.stats?.changePercent?.includes('+') ? 'text-emerald-400' : 'text-red-400'"
                >
                  {{ (valuationsData as any)?.stats?.changePercent || "N/A" }}
                </p>
              </div>
              <div class="bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/30">
                <span class="text-emerald-300 text-sm">Storico:</span>
                <p class="font-semibold text-white text-lg">
                  {{ (valuationsData as any)?.stats?.totalEntries || 0 }} voci
                </p>
              </div>
            </div>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="valuation in valuationsData.valuations.slice(0, 10)"
                :key="valuation.date"
                class="flex justify-between items-center p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30"
              >
                <span class="text-sm text-emerald-300">{{ valuation.date }}</span>
                <span class="font-semibold text-emerald-400">{{ valuation.value }}</span>
              </div>
            </div>
          </div>
          <div v-else class="h-32 flex items-center justify-center text-emerald-300">
            Nessun dato di valutazione disponibile
          </div>
        </div>
      </div>

      <!-- Trasferimenti -->
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg">
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Storico Trasferimenti</h3>
        </div>

        <div v-if="transfersPending" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center space-x-4 p-4 bg-emerald-950/30 rounded-lg animate-pulse"
          >
            <div class="w-12 h-12 bg-emerald-500/20 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-emerald-500/20 rounded w-1/3"></div>
              <div class="h-3 bg-emerald-500/20 rounded w-1/2"></div>
            </div>
            <div class="w-12 h-12 bg-emerald-500/20 rounded"></div>
          </div>
        </div>
        <div
          v-else-if="transfersData?.transfers && transfersData.transfers.length > 0"
          class="space-y-4"
        >
          <div
            v-for="transfer in transfersData.transfers"
            :key="transfer.id"
            class="flex items-center space-x-4 p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-200"
          >
            <img
              :src="transfer.fromLogo"
              :alt="transfer.from"
              class="w-12 h-12 object-contain bg-white/10 rounded-lg p-1"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-white">{{ transfer.from }}</span>
                <span class="text-emerald-400">→</span>
                <span class="font-semibold text-white">{{ transfer.to }}</span>
              </div>
              <div class="text-sm text-emerald-300">{{ transfer.date }} • {{ transfer.season }}</div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-emerald-400">{{ transfer.fee }}</p>
              <p class="text-sm text-emerald-300">Valore mercato: {{ transfer.marketValue }}</p>
            </div>
            <img
              :src="transfer.toLogo || '/default-club.png'"
              :alt="transfer.to"
              class="w-12 h-12 object-contain bg-white/10 rounded-lg p-1"
              @error="(e) => ((e.target as HTMLImageElement).src = '/default-club.png')"
            />
          </div>
        </div>
        <div v-else class="text-center py-8 text-emerald-300">Nessun trasferimento registrato</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ottieni l'ID del giocatore dalla route
const route = useRoute()
const playerId = computed(() => route.params.id as string)

// Fetch dei dati del giocatore
const { data: playerData, pending, error } = await useLazyFetch(`/api/players/${playerId.value}`)

// Fetch delle valutazioni storiche
const { data: valuationsData, pending: valuationsPending } = await useLazyFetch(
  `/api/players/${playerId.value}/valuations`
)

// Fetch dei trasferimenti
const { data: transfersData, pending: transfersPending } = await useLazyFetch(
  `/api/players/${playerId.value}/transfers`
)

// Meta SEO
useHead({
  title: computed(
    () => `${(playerData.value as any)?.name || "Giocatore"} - Football Transfer Data`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Dettagli completi di ${
            (playerData.value as any)?.name || "giocatore"
          }: valore di mercato, trasferimenti e statistiche.`
      ),
    },
  ],
})
</script>
