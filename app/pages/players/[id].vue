<template>
  <div class="space-y-6">
    <!-- Header del giocatore -->
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

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-800">Errore nel caricamento del giocatore: {{ error.data?.message || 'Errore sconosciuto' }}</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Header del giocatore -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-start space-x-6">
          <img 
            :src="playerData.player.photo" 
            :alt="playerData.player.name"
            class="w-32 h-32 object-cover rounded-lg"
            @error="$event.target.src = '/default-player.png'"
          />
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ playerData.player.name }}
            </h1>
            <div class="flex items-center space-x-4 text-lg text-gray-600 mb-4">
              <span>{{ playerData.player.nationality }} {{ playerData.player.countryOfCitizenship }}</span>
              <span>•</span>
              <span>{{ playerData.player.age }} anni</span>
              <span>•</span>
              <span>{{ playerData.player.position }}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-500">Valore di Mercato</p>
                <p class="text-xl font-semibold text-green-600">{{ playerData.player.marketValue }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Picco di Valore</p>
                <p class="text-lg font-semibold">{{ playerData.player.highestMarketValue }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Club Attuale</p>
                <p class="text-lg font-semibold">{{ playerData.player.currentClub }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Altezza</p>
                <p class="text-lg font-semibold">{{ playerData.player.height }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informazioni dettagliate -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Informazioni personali -->
        <UCard title="Informazioni Personali">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Nome completo:</span>
              <span class="font-semibold">{{ playerData.player.firstName }} {{ playerData.player.lastName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Data di nascita:</span>
              <span class="font-semibold">{{ playerData.player.dateOfBirth || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Luogo di nascita:</span>
              <span class="font-semibold">{{ playerData.player.cityOfBirth || 'N/A' }}, {{ playerData.player.countryOfBirth || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Piede preferito:</span>
              <span class="font-semibold">{{ playerData.player.foot || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sottocategoria:</span>
              <span class="font-semibold">{{ playerData.player.subPosition || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Agente:</span>
              <span class="font-semibold">{{ playerData.player.agent || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Scadenza contratto:</span>
              <span class="font-semibold">{{ playerData.player.contractExpiration || 'N/A' }}</span>
            </div>
          </div>
        </UCard>

        <!-- Grafico valutazioni -->
        <UCard title="Storico Valutazioni">
          <div v-if="valuationsPending" class="h-64 bg-gray-100 rounded animate-pulse"></div>
          <div v-else-if="valuationsData?.chartData.length > 0" class="h-64">
            <!-- Qui andrà il grafico delle valutazioni -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">Valore Attuale</p>
                <p class="text-lg font-semibold text-green-600">{{ valuationsData.stats.current }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Variazione</p>
                <p class="text-lg font-semibold" :class="valuationsData.stats.changePercent.includes('+') ? 'text-green-600' : 'text-red-600'">
                  {{ valuationsData.stats.changePercent }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Massimo</p>
                <p class="text-lg font-semibold">{{ valuationsData.stats.max }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Minimo</p>
                <p class="text-lg font-semibold">{{ valuationsData.stats.min }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-500">{{ valuationsData.stats.totalEntries }} valutazioni registrate</p>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            Nessun dato di valutazione disponibile
          </div>
        </UCard>
      </div>

      <!-- Trasferimenti -->
      <UCard title="Storico Trasferimenti">
        <div v-if="transfersPending" class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div class="w-12 h-12 bg-gray-300 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-1/3"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div class="w-12 h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div v-else-if="transfersData?.transfers.length > 0" class="space-y-4">
          <div 
            v-for="transfer in transfersData.transfers" 
            :key="transfer.id"
            class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <img 
              :src="transfer.fromLogo" 
              :alt="transfer.from"
              class="w-12 h-12 object-contain"
              @error="$event.target.src = '/default-club.png'"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="font-semibold">{{ transfer.from }}</span>
                <span class="text-gray-400">→</span>
                <span class="font-semibold">{{ transfer.to }}</span>
              </div>
              <div class="text-sm text-gray-600">
                {{ transfer.date }} • {{ transfer.season }}
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-green-600">{{ transfer.fee }}</p>
              <p class="text-sm text-gray-500">Valore mercato: {{ transfer.marketValue }}</p>
            </div>
            <img 
              :src="transfer.toLogo" 
              :alt="transfer.to"
              class="w-12 h-12 object-contain"
              @error="$event.target.src = '/default-club.png'"
            />
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          Nessun trasferimento registrato
        </div>
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
const { data: valuationsData, pending: valuationsPending } = await useLazyFetch(`/api/players/${playerId.value}/valuations`)

// Fetch dei trasferimenti
const { data: transfersData, pending: transfersPending } = await useLazyFetch(`/api/players/${playerId.value}/transfers`)

// Meta SEO
useHead({
  title: `${playerData?.player?.name || 'Giocatore'} - Football Transfer Data`,
  meta: [
    {
      name: 'description',
      content: `Dettagli completi di ${playerData?.player?.name || 'giocatore'}: valore di mercato, trasferimenti e statistiche.`
    }
  ]
})
</script> 