<script setup lang="ts">
// Dati mock per la demo
const stats = [
  {
    title: 'Giocatori Analizzati',
    value: '15,847',
    change: '+12%',
    icon: 'i-heroicons-user-group',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30'
  },
  {
    title: 'Club Monitorati',
    value: '2,456',
    change: '+8%',
    icon: 'i-heroicons-building-office',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    title: 'Trasferimenti Tracciati',
    value: '8,234',
    change: '+24%',
    icon: 'i-heroicons-arrow-path',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    title: 'Valore Totale Analizzato',
    value: '€2.4B',
    change: '+15%',
    icon: 'i-heroicons-currency-euro',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  }
]

const topPlayers = [
  { name: 'Erling Haaland', club: 'Manchester City', value: '€180M', change: '+15%', position: 'ST' },
  { name: 'Kylian Mbappé', club: 'PSG', value: '€160M', change: '+8%', position: 'LW' },
  { name: 'Jude Bellingham', club: 'Real Madrid', value: '€150M', change: '+25%', position: 'CM' },
  { name: 'Pedri', club: 'Barcelona', value: '€120M', change: '+12%', position: 'CM' },
  { name: 'Vinícius Jr.', club: 'Real Madrid', value: '€140M', change: '+18%', position: 'LW' }
]

const recentTransfers = [
  { player: 'Declan Rice', from: 'West Ham', to: 'Arsenal', value: '€116M', date: '2024-01-15' },
  { player: 'Enzo Fernández', from: 'Benfica', to: 'Chelsea', value: '€121M', date: '2024-01-10' },
  { player: 'Moisés Caicedo', from: 'Brighton', to: 'Chelsea', value: '€133M', date: '2024-01-08' }
]
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="bg-gradient-to-r from-black/60 via-black/40 to-transparent backdrop-blur-sm rounded-2xl border border-white/10 p-8">
        <div class="relative z-10">
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <UIcon name="i-heroicons-cpu-chip" class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard Analisi Calcistica
              </h1>
              <p class="text-gray-400 mt-1">Powered by AI • Analisi in tempo reale • Predizioni avanzate</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-white">Insights AI del Giorno</h2>
              <div class="space-y-3">
                <div class="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-cyan-500/20">
                  <div class="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p class="text-gray-300 text-sm">
                      <span class="text-cyan-400 font-medium">Haaland</span> mostra un trend di crescita del +15% nel valore di mercato
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-purple-500/20">
                  <div class="w-2 h-2 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p class="text-gray-300 text-sm">
                      Il mercato dei <span class="text-purple-400 font-medium">centrocampisti</span> è in forte crescita (+24%)
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3 p-4 bg-white/5 rounded-xl border border-green-500/20">
                  <div class="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse"></div>
                  <div>
                    <p class="text-gray-300 text-sm">
                      <span class="text-green-400 font-medium">Premier League</span> domina i trasferimenti più costosi
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
                  class="justify-start bg-white/5 hover:bg-white/10 border-white/20 text-white"
                >
                  <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2" />
                  Analisi Avanzata
                </UButton>
                <UButton 
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-white/5 hover:bg-white/10 border-white/20 text-white"
                >
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 mr-2" />
                  Ricerca AI
                </UButton>
                <UButton 
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-white/5 hover:bg-white/10 border-white/20 text-white"
                >
                  <UIcon name="i-heroicons-document-chart-bar" class="w-5 h-5 mr-2" />
                  Report
                </UButton>
                <UButton 
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-white/5 hover:bg-white/10 border-white/20 text-white"
                >
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-2" />
                  Configurazione
                </UButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard 
        v-for="(stat, index) in stats" 
        :key="index"
        class="bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
        :class="stat.borderColor"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-400 text-sm font-medium">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-white mt-1">{{ stat.value }}</p>
            <p class="text-green-400 text-xs mt-1 flex items-center">
              <UIcon name="i-heroicons-arrow-trending-up" class="w-3 h-3 mr-1" />
              {{ stat.change }}
            </p>
          </div>
          <div :class="[stat.bgColor, stat.borderColor]" class="w-12 h-12 rounded-xl border flex items-center justify-center">
            <UIcon :name="stat.icon" :class="stat.color" class="w-6 h-6" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Top Players -->
      <UCard class="bg-black/40 backdrop-blur-sm border-white/10">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <UIcon name="i-heroicons-star" class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-white">Top Players per Valore</h3>
            </div>
            <UButton variant="ghost" size="xs" class="text-cyan-400">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="(player, index) in topPlayers" 
            :key="index"
            class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold">
                {{ index + 1 }}
              </div>
              <div>
                <p class="font-medium text-white">{{ player.name }}</p>
                <p class="text-sm text-gray-400">{{ player.club }} • {{ player.position }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-white">{{ player.value }}</p>
              <p class="text-xs text-green-400">{{ player.change }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Recent Transfers -->
      <UCard class="bg-black/40 backdrop-blur-sm border-white/10">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-white">Trasferimenti Recenti</h3>
            </div>
            <UButton variant="ghost" size="xs" class="text-purple-400">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <div 
            v-for="(transfer, index) in recentTransfers" 
            :key="index"
            class="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="font-medium text-white">{{ transfer.player }}</p>
              <span class="text-xs text-gray-400">{{ transfer.date }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-gray-400">
                <span>{{ transfer.from }}</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                <span class="text-white">{{ transfer.to }}</span>
              </div>
              <span class="font-semibold text-green-400">{{ transfer.value }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- AI Analysis Section -->
    <UCard class="bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-sm border border-cyan-500/30">
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center animate-pulse">
            <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Analisi AI Avanzata</h3>
          <UBadge variant="outline" class="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            BETA
          </UBadge>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8 text-cyan-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Predizioni di Valore</h4>
          <p class="text-gray-400 text-sm">Algoritmi ML per prevedere l'andamento del valore dei giocatori</p>
        </div>

        <div class="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-light-bulb" class="w-8 h-8 text-purple-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Insights Intelligenti</h4>
          <p class="text-gray-400 text-sm">Analisi comportamentali e pattern recognition sui trasferimenti</p>
        </div>

        <div class="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-green-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Raccomandazioni</h4>
          <p class="text-gray-400 text-sm">Suggerimenti personalizzati basati su AI per investimenti ottimali</p>
        </div>
      </div>
    </UCard>
  </div>
</template>