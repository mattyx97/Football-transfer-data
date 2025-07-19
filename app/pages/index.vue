<script setup lang="ts">
const nuxtApp = useNuxtApp()
const showAIChat = ref(false)

// Fetch dati reali dalle API
const [statsData, marketData, topPlayersData, transfersData] = await Promise.all([
  $fetch('/api/stats'),
  $fetch('/api/stats/market-trends'),
  $fetch('/api/players/top-by-value'),
  $fetch('/api/transfers/recent')
])

// Statistiche principali dalla API
const stats = statsData?.stats || []

// Dati reali dalle API
const topPlayers = topPlayersData?.topPlayers || []
const recentTransfers = transfersData?.recentTransfers || []

// Funzione per tradurre i ruoli in italiano
const translatePosition = (position: string): string => {
  const translations: Record<string, string> = {
    // Ruoli specifici
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
    'Secondary Striker': 'Seconda Punta',
    
    // Ruoli raggruppati
    'Defender': 'Difensore',
    'Midfield': 'Centrocampo',
    'Attack': 'Attacco'
  }
  
  return translations[position] || position
}

// Dati di mercato dalla API con traduzioni
const marketTrends = {
  topLeagues: marketData?.topLeagues || [],
  positionTrends: (marketData?.positionTrends || []).map((trend: any) => ({
    ...trend,
    position: translatePosition(trend.position)
  })),
  ageGroups: marketData?.ageGroups || []
}

// Aggiungo dati per l'analisi AI avanzata
const aiInsights = [
  {
    title: 'Predizioni di Valore',
    icon: 'i-heroicons-chart-bar-square',
    color: 'emerald',
    insights: [
      'Crescita prevista del 25% per giovani talenti U21',
      'Mercato dei centrocampisti in forte espansione',
      'Trend positivo per giocatori sudamericani'
    ]
  },
  {
    title: 'Pattern Recognition',
    icon: 'i-heroicons-light-bulb',
    color: 'amber',
    insights: [
      'Aumento degli scambi tra club della stessa lega',
      'Preferenza per contratti più brevi',
      'Crescita degli investimenti in settori giovanili'
    ]
  },
  {
    title: 'Raccomandazioni',
    icon: 'i-heroicons-sparkles',
    color: 'lime',
    insights: [
      'Focus su talenti emergenti dal Sud America',
      'Opportunità nel mercato dei terzini',
      'Momento ottimale per investimenti in Serie A'
    ]
  }
]

// Funzione per gestire errori di caricamento immagini
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/60x60/374151/9CA3AF?text=N/A'
}
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="bg-gradient-to-r from-emerald-950/80 via-slate-900/60 to-green-950/80 backdrop-blur-sm rounded-2xl border border-emerald-500/20 p-8 shadow-2xl shadow-emerald-900/20">
        <div class="relative z-10">
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <UIcon name="i-heroicons-cpu-chip" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-300 via-lime-400 to-amber-400 bg-clip-text text-transparent">
                Dashboard Analisi Calcistica
              </h1>
              <p class="text-emerald-300/70 mt-1">Powered by AI • Analisi in tempo reale • Predizioni avanzate</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-white">Insights AI del Giorno</h2>
              <div class="space-y-3">
                <div class="flex items-start space-x-3 p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/20">
                  <div class="w-2 h-2 bg-emerald-400 rounded-full mt-2 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <div>
                    <p class="text-emerald-100 text-sm">
                      <span class="text-emerald-400 font-medium">Haaland</span> mostra un trend di crescita del +15% nel valore di mercato
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-4 bg-amber-950/40 rounded-xl border border-amber-500/30 shadow-lg shadow-amber-900/20">
                  <div class="w-2 h-2 bg-amber-400 rounded-full mt-2 animate-pulse shadow-lg shadow-amber-400/50"></div>
                  <div>
                    <p class="text-emerald-100 text-sm">
                      Il mercato dei <span class="text-amber-400 font-medium">centrocampisti</span> è in forte crescita (+24%)
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-4 bg-lime-950/40 rounded-xl border border-lime-500/30 shadow-lg shadow-lime-900/20">
                  <div class="w-2 h-2 bg-lime-400 rounded-full mt-2 animate-pulse shadow-lg shadow-lime-400/50"></div>
                  <div>
                    <p class="text-emerald-100 text-sm">
                      <span class="text-lime-400 font-medium">Premier League</span> domina i trasferimenti più costosi
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-white">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-4">
                <UButton 
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-500/30 text-emerald-100 hover:border-emerald-400/50 shadow-lg shadow-emerald-900/20"
                >
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2" />
                  Analisi Avanzata
                </UButton>
                <UButton 
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-500/30 text-emerald-100 hover:border-emerald-400/50 shadow-lg shadow-emerald-900/20"
                >
                  <UIcon name="i-heroicons-document-chart-bar" class="w-5 h-5 mr-2" />
                  Report
                </UButton>
                <UButton 
                  @click="showAIChat = true"
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-500/30 text-emerald-100 hover:border-emerald-400/50 shadow-lg shadow-emerald-900/20"
                >
                  <UIcon name="i-heroicons-sparkles" class="w-5 h-5 mr-2" />
                  Chiedi all'IA
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-lime-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard 
        v-for="(stat, index) in stats" 
        :key="index"
        class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-900/20"
        :class="stat.borderColor"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-300/80 text-sm font-medium">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-white mt-1">{{ stat.value }}</p>
            <p class="text-lime-400 text-xs mt-1 flex items-center">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3 mr-1" />
              {{ stat.change }}
            </p>
            <p class="text-emerald-300/60 text-xs mt-2">{{ stat.details }}</p>
          </div>
          <div :class="[stat.bgColor, stat.borderColor]" class="w-12 h-12 rounded-xl border flex items-center justify-center shadow-lg">
            <UIcon :name="stat.icon" :class="stat.color" class="w-6 h-6" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Market Trends Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Top Leagues -->
      <UCard class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 shadow-xl shadow-emerald-900/20">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Top Leagues</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="league in marketTrends.topLeagues" 
            :key="league.name"
            class="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-white font-medium">{{ league.name }}</span>
              <span class="text-emerald-400 font-semibold">{{ league.value }}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-emerald-950/50 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                :class="league.color"
                :style="{ width: league.change.replace('+', '') }"
              ></div>
            </div>
            <p class="text-xs text-emerald-300/70 mt-2 flex items-center">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3 mr-1" />
              {{ league.change }} rispetto all'anno precedente
            </p>
          </div>
        </div>
      </UCard>

      <!-- Position Trends -->
      <UCard class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 shadow-xl shadow-emerald-900/20">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Trend per Ruolo</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="position in marketTrends.positionTrends" 
            :key="position.position"
            class="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="text-white font-medium">{{ position.position }}</span>
                <span class="text-xs text-emerald-300/70 ml-2">({{ position.percentage }}%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="position.trend === 'up' ? 'i-heroicons-arrow-trending-up' : position.trend === 'down' ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus'" 
                  class="w-4 h-4"
                  :class="position.trend === 'up' ? 'text-emerald-400' : position.trend === 'down' ? 'text-red-400' : 'text-yellow-400'"
                />
                <span class="text-emerald-400 font-semibold">{{ position.value }}</span>
              </div>
            </div>
            <div class="w-full h-2 rounded-full bg-emerald-950/50 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                :style="{ width: position.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Age Distribution -->
      <UCard class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 shadow-xl shadow-emerald-900/20">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <UIcon name="i-heroicons-chart-pie" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Distribuzione per Età</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="age in marketTrends.ageGroups" 
            :key="age.range"
            class="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="text-white font-medium">{{ age.range }} anni</span>
                <span class="text-xs text-emerald-300/70 ml-2">({{ age.percentage }}%)</span>
              </div>
              <div class="flex items-center space-x-2">
                <UIcon 
                  :name="age.trend === 'up' ? 'i-heroicons-arrow-trending-up' : age.trend === 'down' ? 'i-heroicons-arrow-trending-down' : 'i-heroicons-minus'" 
                  class="w-4 h-4"
                  :class="age.trend === 'up' ? 'text-emerald-400' : age.trend === 'down' ? 'text-red-400' : 'text-yellow-400'"
                />
                <span class="text-emerald-400 font-semibold">{{ age.value }}</span>
              </div>
            </div>
            <div class="w-full h-2 rounded-full bg-emerald-950/50 overflow-hidden">
              <div 
                class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                :style="{ width: age.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Top Players -->
      <UCard class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 shadow-xl shadow-emerald-900/20">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <UIcon name="i-heroicons-star" class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-white">Top Players per Valore</h3>
            </div>
            <UButton variant="ghost" size="xs" class="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="(player, index) in topPlayers" 
            :key="index"
            class="flex items-center justify-between p-4 bg-emerald-950/30 hover:bg-emerald-950/50 rounded-xl transition-all duration-200 cursor-pointer group border border-emerald-500/10 hover:border-emerald-400/30 shadow-lg shadow-emerald-900/10"
          >
            <div class="flex items-center space-x-4">
              <!-- Ranking number -->
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/30">
                {{ index + 1 }}
              </div>
              
              <!-- Player photo -->
              <div class="relative">
                <img 
                  :src="player.photo" 
                  :alt="player.name"
                  class="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors shadow-lg"
                  @error="handleImageError"
                />
                <div class="absolute -bottom-1 -right-1 text-xs">{{ player.nationality }}</div>
              </div>
              
              <!-- Player info -->
              <div>
                <div class="flex items-center space-x-2">
                  <p class="font-medium text-white">{{ player.name }}</p>
                  <span class="text-xs bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full border border-emerald-400/30">{{ player.age }}</span>
                </div>
                <div class="flex items-center space-x-3 mt-1">
                  <div class="flex items-center space-x-1">
                    <img 
                      :src="player.clubLogo" 
                      :alt="player.club"
                      class="w-4 h-4 object-contain"
                      @error="handleImageError"
                    />
                    <span class="text-sm text-emerald-300/80">{{ player.club }}</span>
                  </div>
                  <span class="text-xs bg-amber-500/30 text-amber-300 px-2 py-1 rounded-full border border-amber-400/30">{{ player.position }}</span>
                </div>
              </div>
            </div>
            
            <!-- Value and change -->
            <div class="text-right">
              <p class="font-semibold text-white">{{ player.value }}</p>
              <p class="text-xs text-lime-400 flex items-center justify-end">
                <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3 mr-1" />
                {{ player.change }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Recent Transfers -->
      <UCard class="bg-emerald-950/40 backdrop-blur-sm border-emerald-500/20 shadow-xl shadow-emerald-900/20">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-slate-900" />
              </div>
              <h3 class="text-lg font-semibold text-white">Trasferimenti Recenti</h3>
            </div>
            <UButton variant="ghost" size="xs" class="text-amber-400 hover:text-amber-300 hover:bg-amber-500/20">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="(transfer, index) in recentTransfers" 
            :key="index"
            class="p-4 bg-emerald-950/30 hover:bg-emerald-950/50 rounded-xl transition-all duration-200 cursor-pointer group border border-emerald-500/10 hover:border-emerald-400/30 shadow-lg shadow-emerald-900/10"
          >
            <!-- Header with player and date -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <img 
                  :src="transfer.playerPhoto" 
                  :alt="transfer.player"
                  class="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg"
                  @error="handleImageError"
                />
                <div>
                  <p class="font-medium text-white">{{ transfer.player }}</p>
                  <span class="text-xs text-emerald-300/70">{{ transfer.nationality }}</span>
                </div>
              </div>
              <span class="text-xs text-emerald-300/70">{{ transfer.date }}</span>
            </div>
            
            <!-- Transfer details -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- From club -->
                <div class="flex items-center space-x-2">
                  <img 
                    :src="transfer.fromLogo" 
                    :alt="transfer.from"
                    class="w-5 h-5 object-contain"
                    @error="handleImageError"
                  />
                  <span class="text-sm text-emerald-300/80">{{ transfer.from }}</span>
                </div>
                
                <!-- Arrow -->
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-emerald-400" />
                
                <!-- To club -->
                <div class="flex items-center space-x-2">
                  <img 
                    :src="transfer.toLogo" 
                    :alt="transfer.to"
                    class="w-5 h-5 object-contain"
                    @error="handleImageError"
                  />
                  <span class="text-sm text-white font-medium">{{ transfer.to }}</span>
                </div>
              </div>
              
              <!-- Transfer value -->
              <span class="font-semibold text-lime-400">{{ transfer.value }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- AI Analysis Section -->
    <UCard class="bg-gradient-to-r from-emerald-950/80 via-slate-900/60 to-emerald-950/80 backdrop-blur-sm border border-emerald-500/30 shadow-2xl shadow-emerald-900/30">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
              <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-white">Analisi AI Avanzata</h3>
            <UBadge variant="outline" class="bg-emerald-500/30 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-900/20">
              BETA
            </UBadge>
          </div>
          <UButton 
            variant="outline" 
            size="sm"
            class="bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-500/30 text-emerald-100 hover:border-emerald-400/50"
          >
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 mr-2" />
            Genera Report
          </UButton>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="insight in aiInsights"
          :key="insight.title"
          class="p-6 bg-emerald-950/30 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-900/20"
        >
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r flex items-center justify-center border shadow-lg"
            :class="{
              'from-emerald-500/30 to-lime-400/30 border-emerald-400/30 shadow-emerald-500/20': insight.color === 'emerald',
              'from-amber-500/30 to-yellow-400/30 border-amber-400/30 shadow-amber-500/20': insight.color === 'amber',
              'from-lime-500/30 to-green-400/30 border-lime-400/30 shadow-lime-500/20': insight.color === 'lime'
            }"
          >
            <UIcon :name="insight.icon" class="w-8 h-8"
              :class="{
                'text-emerald-400': insight.color === 'emerald',
                'text-amber-400': insight.color === 'amber',
                'text-lime-400': insight.color === 'lime'
              }"
            />
          </div>
          <h4 class="text-white font-semibold mb-4 text-center">{{ insight.title }}</h4>
          <ul class="space-y-3">
            <li 
              v-for="(item, index) in insight.insights"
              :key="index"
              class="flex items-start space-x-2"
            >
              <UIcon 
                name="i-heroicons-check-circle" 
                class="w-5 h-5 mt-0.5 flex-shrink-0"
                :class="{
                  'text-emerald-400': insight.color === 'emerald',
                  'text-amber-400': insight.color === 'amber',
                  'text-lime-400': insight.color === 'lime'
                }"
              />
              <span class="text-emerald-300/80 text-sm">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <!-- AI Chat Dialog -->
    <AIChatDialog 
      v-model="showAIChat"
      :context="{
        currentPage: 'dashboard',
        availableData: {
          stats,
          marketTrends,
          topPlayers,
          recentTransfers
        }
      }"
    />
  </div>
</template>