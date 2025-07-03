<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 to-slate-900">
    <!-- Loading State -->
    <div v-if="pending" class="space-y-6 p-6">
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 animate-pulse shadow-xl shadow-emerald-900/20">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-xl"></div>
          <div class="flex-1 space-y-4">
            <div class="h-8 bg-emerald-500/20 rounded-lg w-1/3"></div>
            <div class="h-4 bg-emerald-500/20 rounded w-1/2"></div>
            <div class="grid grid-cols-4 gap-4">
              <div class="h-16 bg-emerald-500/20 rounded-lg"></div>
              <div class="h-16 bg-emerald-500/20 rounded-lg"></div>
              <div class="h-16 bg-emerald-500/20 rounded-lg"></div>
              <div class="h-16 bg-emerald-500/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        title="Errore nel caricamento"
        :description="error.data?.message || 'Errore sconosciuto'"
      />
    </div>

    <!-- Main Content -->
    <div v-else-if="clubData" class="space-y-8 p-6">
      <!-- Hero Section -->
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-600/80 to-lime-500/80 p-8">
          <div class="flex items-center space-x-6">
            <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <img :src="clubData?.imageUrl" alt="Club Logo" class="w-full h-full object-contain" />
            </div>
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-white mb-2">{{ clubData.club.name }}</h1>
              <div class="flex items-center space-x-4 text-emerald-100 mb-4">
                <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
                <span>{{ clubData.club.domesticCompetition }}</span>
                <span v-if="clubData.club.stadium">•</span>
                <UIcon v-if="clubData.club.stadium" name="i-heroicons-map-pin" class="w-4 h-4" />
                <span v-if="clubData.club.stadium">{{ clubData.club.stadium }}</span>
              </div>
              <div v-if="clubData.club.stadiumCapacity" class="text-emerald-100">
                <UIcon name="i-heroicons-users" class="w-4 h-4 inline mr-2" />
                Capacità: {{ clubData.club.stadiumCapacity?.toLocaleString('it-IT') }} posti
              </div>
            </div>
          </div>
        </div>
        
        <!-- Stats Cards -->
        <div class="p-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-emerald-950/50 to-lime-950/50 p-6 rounded-xl border border-emerald-500/30 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
                  <UIcon name="i-heroicons-currency-euro" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-sm text-emerald-300 font-medium">Valore Totale</p>
                  <p class="text-2xl font-bold text-white">{{ clubData.stats.totalValue }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-emerald-950/50 to-lime-950/50 p-6 rounded-xl border border-emerald-500/30 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
                  <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-sm text-emerald-300 font-medium">Giocatori</p>
                  <p class="text-2xl font-bold text-white">{{ clubData.stats.totalPlayers }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-emerald-950/50 to-lime-950/50 p-6 rounded-xl border border-emerald-500/30 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
                  <UIcon name="i-heroicons-clock" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-sm text-emerald-300 font-medium">Età Media</p>
                  <p class="text-2xl font-bold text-white">{{ clubData.stats.averageAge }} anni</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-emerald-950/50 to-lime-950/50 p-6 rounded-xl border border-emerald-500/30 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
                  <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <p class="text-sm text-emerald-300 font-medium">Stranieri</p>
                  <p class="text-2xl font-bold text-white">{{ clubData.stats.foreigners }} ({{ clubData.stats.foreignersPercentage }}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 p-6">
        <div class="flex items-center space-x-2 mb-6">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg">
            <UIcon name="i-heroicons-funnel" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Filtri e Ordinamento</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UFormGroup label="Posizione" class="text-emerald-300">
            <USelect 
              v-model="selectedPosition" 
              :options="positionOptions"
              placeholder="Tutte le posizioni"
              @change="fetchPlayers"
              class="bg-emerald-950/50 border-emerald-500/30"
            />
          </UFormGroup>
          
          <UFormGroup label="Ordina per" class="text-emerald-300">
            <USelect 
              v-model="sortBy" 
              :options="sortOptions"
              @change="fetchPlayers"
              class="bg-emerald-950/50 border-emerald-500/30"
            />
          </UFormGroup>
          
          <UFormGroup label="Ordine" class="text-emerald-300">
            <USelect 
              v-model="sortOrder" 
              :options="orderOptions"
              @change="fetchPlayers"
              class="bg-emerald-950/50 border-emerald-500/30"
            />
          </UFormGroup>
        </div>
      </div>

      <!-- Players Grid -->
      <div class="bg-emerald-950/40 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-xl shadow-emerald-900/20 p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-users" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Rosa Completa</h3>
            <UBadge v-if="displayedPlayers.length" color="emerald" variant="soft" class="bg-emerald-500/20 text-emerald-300">
              {{ displayedPlayers.length }} giocatori
            </UBadge>
          </div>
          <UButton
            v-if="viewMode === 'grid'"
            @click="viewMode = 'list'"
            icon="i-heroicons-list-bullet"
            color="white"
            variant="ghost"
            size="sm"
            class="text-emerald-300 hover:text-emerald-200"
          >
            Vista Lista
          </UButton>
          <UButton
            v-else
            @click="viewMode = 'grid'"
            icon="i-heroicons-squares-2x2"
            color="white"
            variant="ghost"
            size="sm"
            class="text-emerald-300 hover:text-emerald-200"
          >
            Vista Griglia
          </UButton>
        </div>

        <!-- Loading -->
        <div v-if="playersLoading" class="space-y-4">
          <div v-for="i in 6" :key="i" class="flex items-center space-x-4 p-4 bg-emerald-950/30 rounded-xl animate-pulse">
            <div class="w-16 h-16 bg-emerald-500/20 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-emerald-500/20 rounded w-1/3"></div>
              <div class="h-3 bg-emerald-500/20 rounded w-1/2"></div>
            </div>
            <div class="h-6 bg-emerald-500/20 rounded w-20"></div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid' && displayedPlayers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="player in displayedPlayers" 
            :key="player.id"
            class="bg-gradient-to-br from-emerald-950/50 to-lime-950/50 p-6 rounded-xl border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            @click="navigateToPlayer(player.id)"
          >
            <div class="text-center">
              <img 
                :src="player.photo" 
                :alt="player.name"
                class="w-20 h-20 object-cover rounded-full mx-auto mb-4 border-4 border-emerald-500/30 shadow-lg"
                @error="handleImageError"
              />
              <h4 class="font-bold text-white mb-2 text-lg">{{ player.name }}</h4>
              <div class="flex items-center justify-center space-x-2 mb-3">
                <span class="text-2xl">{{ player.nationality }}</span>
                <UBadge :color="getPositionColor(player.position)" variant="soft" class="bg-emerald-500/20 text-emerald-300">
                  {{ player.position }}
                </UBadge>
              </div>
              <div class="space-y-2 text-sm text-emerald-300/80">
                <p>{{ player.age }} anni • {{ player.height }}</p>
                <p class="font-semibold text-emerald-400 text-lg">{{ player.marketValue }}</p>
                <p v-if="player.contractExpiration" class="text-xs">
                  Contratto: {{ player.contractExpiration }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list' && displayedPlayers.length > 0" class="space-y-3">
          <div 
            v-for="player in displayedPlayers" 
            :key="player.id"
            class="flex items-center space-x-4 p-4 bg-gradient-to-br from-emerald-950/50 to-lime-950/50 rounded-xl border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            @click="navigateToPlayer(player.id)"
          >
            <img 
              :src="player.photo" 
              :alt="player.name"
              class="w-16 h-16 object-cover rounded-full border-2 border-emerald-500/30 shadow-lg"
              @error="handleImageError"
            />
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h4 class="font-bold text-white text-lg">{{ player.name }}</h4>
                <span class="text-xl">{{ player.nationality }}</span>
                <UBadge :color="getPositionColor(player.position)" variant="soft" class="bg-emerald-500/20 text-emerald-300">
                  {{ player.position }}
                </UBadge>
              </div>
              <p class="text-emerald-300/80">{{ player.age }} anni • {{ player.height }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-emerald-400 text-xl">{{ player.marketValue }}</p>
              <p v-if="player.contractExpiration" class="text-xs text-emerald-300/60">
                Contratto: {{ player.contractExpiration }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <UIcon name="i-heroicons-user-group" class="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-white mb-2">Nessun giocatore trovato</h3>
          <p class="text-emerald-300/80">Prova a modificare i filtri di ricerca</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Player {
  id: number
  name: string
  age: string
  nationality: string
  position: string
  positionOriginal: string
  marketValue: string
  marketValueRaw: number
  height: string
  photo: string
  contractExpiration?: string
}

const route = useRoute()
const router = useRouter()
const clubId = computed(() => route.params.id as string)

// Stato locale
const selectedPosition = ref('')
const sortBy = ref('value')
const sortOrder = ref('desc')
const playersLoading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

// Fetch dei dati del club
const { data: clubData, pending, error } = await useLazyFetch(`/api/clubs/${clubId.value}/players`)

// Giocatori
const displayedPlayers = ref<Player[]>([])
const availablePositions = ref<string[]>([])

// Opzioni per i filtri
const positionOptions = computed(() => [
  { label: 'Tutte le posizioni', value: '' },
  ...availablePositions.value.map(pos => ({
    label: translatePosition(pos),
    value: pos
  }))
])

const sortOptions = [
  { label: 'Valore di mercato', value: 'value' },
  { label: 'Nome', value: 'name' },
  { label: 'Età', value: 'age' },
  { label: 'Posizione', value: 'position' }
]

const orderOptions = [
  { label: 'Decrescente', value: 'desc' },
  { label: 'Crescente', value: 'asc' }
]

// Funzioni di utilità
const translatePosition = (position: string): string => {
  const translations: Record<string, string> = {
    'Centre-Forward': 'Centravanti',
    'Central Midfield': 'Centrocampo Centrale',
    'Right Winger': 'Ala Destra',
    'Left Winger': 'Ala Sinistra',
    'Left-Back': 'Terzino Sinistro',
    'Right-Back': 'Terzino Destro',
    'Centre-Back': 'Difensore Centrale',
    'Goalkeeper': 'Portiere',
    'Defensive Midfield': 'Mediano',
    'Attacking Midfield': 'Trequartista',
    'Left Midfield': 'Centrocampo Sinistro',
    'Right Midfield': 'Centrocampo Destro',
    'Secondary Striker': 'Seconda Punta'
  }
  
  return translations[position] || position
}

const getPositionColor = (position: string) => {
  if (position.includes('Portiere')) return 'warning'
  if (position.includes('Difensore') || position.includes('Terzino')) return 'info'
  if (position.includes('Centrocampo') || position.includes('Mediano') || position.includes('Trequartista')) return 'success'
  if (position.includes('Attac') || position.includes('Ala') || position.includes('Centravanti')) return 'error'
  return 'neutral'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/default-player.png'
  }
}

const navigateToPlayer = (playerId: number) => {
  router.push(`/players/${playerId}`)
}

// Fetch dei giocatori con filtri
const fetchPlayers = async () => {
  if (!clubData.value) return
  
  playersLoading.value = true
  try {
    const params = new URLSearchParams({
      sortBy: sortBy.value,
      order: sortOrder.value
    })
    
    if (selectedPosition.value) {
      params.append('position', selectedPosition.value)
    }
    
    const response = await $fetch(`/api/clubs/${clubId.value}/players?${params}`) as any
    displayedPlayers.value = response.players || []
  } catch (err) {
    console.error('Errore nel caricamento dei giocatori:', err)
  } finally {
    playersLoading.value = false
  }
}

// Inizializza i dati quando il club viene caricato
watch(clubData, (newData) => {
  if (newData?.players) {
    displayedPlayers.value = newData.players as Player[]
    availablePositions.value = [...new Set(newData.players.map((p: any) => p.positionOriginal).filter(Boolean))]
  }
}, { immediate: true })

// Meta SEO
useHead({
  title: `${clubData.value?.club?.name || 'Club'} - Rosa Completa - Football Transfer Data`,
  meta: [
    {
      name: 'description',
      content: `Rosa completa di ${clubData.value?.club?.name || 'club'}: giocatori, valori di mercato e statistiche.`
    }
  ]
})
</script> 