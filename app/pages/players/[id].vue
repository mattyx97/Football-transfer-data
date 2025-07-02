<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse">
      <div class="flex items-start space-x-6">
        <div class="w-32 h-32 bg-gray-300 rounded-lg"></div>
        <div class="flex-1 space-y-4">
          <div class="h-8 bg-gray-300 rounded w-1/3"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
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
      <UCard class="shadow-lg">
        <div class="flex items-start space-x-6">
          <img
            :src="(playerData as any)?.photo"
            :alt="(playerData as any)?.name || 'Giocatore'"
            class="w-32 h-32 object-cover rounded-lg border-4 border-white shadow-lg"
            @error="(e) => ((e.target as HTMLImageElement).src = '/default-player.png')"
          />
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ (playerData as any)?.name || "Nome non disponibile" }}
            </h1>
            <div class="flex items-center space-x-4 text-lg text-gray-600 mb-4">
              <span v-if="(playerData as any)?.countryOfCitizenship">
                {{ (playerData as any).countryOfCitizenship }}
              </span>
              <span v-if="(playerData as any)?.position">•</span>
              <span v-if="(playerData as any)?.position">{{ (playerData as any).position }}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-500">Club Attuale</p>
                <p class="text-lg font-semibold">{{ (playerData as any)?.currentClub || "N/A" }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Altezza</p>
                <p class="text-lg font-semibold">{{ (playerData as any)?.height || "N/A" }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Piede</p>
                <p class="text-lg font-semibold">{{ (playerData as any)?.foot || "N/A" }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Posizione</p>
                <p class="text-lg font-semibold">{{ (playerData as any)?.subPosition || "N/A" }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Informazioni dettagliate -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informazioni personali -->
        <UCard title="Informazioni Personali">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Nome completo:</span>
              <span class="font-semibold">
                {{ (playerData as any)?.firstName || "" }} {{ (playerData as any)?.lastName || "" }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Data di nascita:</span>
              <span class="font-semibold">{{ (playerData as any)?.dateOfBirth || "N/A" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Età:</span>
              <span class="font-semibold">{{ (playerData as any)?.age || "N/A" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Luogo di nascita:</span>
              <span class="font-semibold">
                {{ (playerData as any)?.cityOfBirth || "N/A" }},
                {{ (playerData as any)?.countryOfBirth || "N/A" }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Nazionalità:</span>
              <span class="font-semibold">
                {{ (playerData as any)?.countryOfCitizenship || "N/A" }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Agente:</span>
              <span class="font-semibold">{{ (playerData as any)?.agent || "N/A" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ultimo aggiornamento:</span>
              <span class="font-semibold">{{ (playerData as any)?.lastSeason || "N/A" }}</span>
            </div>
          </div>
        </UCard>

        <!-- Valutazioni -->
        <UCard title="Valutazioni">
          <div v-if="valuationsPending" class="h-64 bg-gray-100 rounded animate-pulse"></div>
          <div
            v-else-if="valuationsData?.valuations && valuationsData.valuations.length > 0"
            class="space-y-4"
          >
            <div class="mb-4 p-4 bg-blue-50 rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Valore Attuale:</span>
                  <p class="font-semibold text-green-600">
                    {{ (valuationsData as any)?.stats?.current || "N/A" }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-600">Valore Massimo:</span>
                  <p class="font-semibold text-blue-600">
                    {{ (valuationsData as any)?.stats?.max || "N/A" }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-600">Variazione:</span>
                  <p
                    class="font-semibold"
                    :class="
                      (valuationsData as any)?.stats?.changePercent?.includes('+')
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    {{ (valuationsData as any)?.stats?.changePercent || "N/A" }}
                  </p>
                </div>
                <div>
                  <span class="text-gray-600">Storico:</span>
                  <p class="font-semibold">
                    {{ (valuationsData as any)?.stats?.totalEntries || 0 }} voci
                  </p>
                </div>
              </div>
            </div>
            <div class="max-h-48 overflow-y-auto space-y-2">
              <div
                v-for="valuation in valuationsData.valuations.slice(0, 10)"
                :key="valuation.date"
                class="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <span class="text-sm text-gray-600">{{ valuation.date }}</span>
                <span class="font-semibold text-green-600">{{ valuation.value }}</span>
              </div>
            </div>
          </div>
          <div v-else class="h-32 flex items-center justify-center text-gray-500">
            Nessun dato di valutazione disponibile
          </div>
        </UCard>
      </div>

      <!-- Trasferimenti -->
      <UCard title="Storico Trasferimenti">
        <div v-if="transfersPending" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse"
          >
            <div class="w-12 h-12 bg-gray-300 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div class="w-12 h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div
          v-else-if="transfersData?.transfers && transfersData.transfers.length > 0"
          class="space-y-4"
        >
          <div
            v-for="transfer in transfersData.transfers"
            :key="transfer.id"
            class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <img
              :src="transfer.fromLogo "
              :alt="transfer.from"
              class="w-12 h-12 object-contain"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="font-semibold">{{ transfer.from }}</span>
                <span class="text-gray-400">→</span>
                <span class="font-semibold">{{ transfer.to }}</span>
              </div>
              <div class="text-sm text-gray-600">{{ transfer.date }} • {{ transfer.season }}</div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600">{{ transfer.fee }}</p>
              <p class="text-sm text-gray-500">Valore mercato: {{ transfer.marketValue }}</p>
            </div>
            <img
              :src="transfer.toLogo || '/default-club.png'"
              :alt="transfer.to"
              class="w-12 h-12 object-contain"
              @error="(e) => ((e.target as HTMLImageElement).src = '/default-club.png')"
            />
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">Nessun trasferimento registrato</div>
      </UCard>
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
