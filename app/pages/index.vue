<script setup lang="ts">
// Dati mock per la demo con foto e loghi
const stats = [
  {
    title: 'Giocatori Analizzati',
    value: '15,847',
    change: '+12%',
    icon: 'i-heroicons-user-group',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30'
  },
  {
    title: 'Club Monitorati',
    value: '2,456',
    change: '+8%',
    icon: 'i-heroicons-building-office',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30'
  },
  {
    title: 'Trasferimenti Tracciati',
    value: '8,234',
    change: '+24%',
    icon: 'i-heroicons-arrow-path',
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/20',
    borderColor: 'border-lime-500/30'
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
  { 
    name: 'Erling Haaland', 
    club: 'Manchester City', 
    value: '€180M', 
    change: '+15%', 
    position: 'ST',
    photo: 'https://img.a.transfermarkt.technology/portrait/big/418560-1667830379.jpg?lm=1',
    clubLogo: 'https://logoeps.com/wp-content/uploads/2013/03/manchester-city-vector-logo.png',
    nationality: '🇳🇴',
    age: '24'
  },
  { 
    name: 'Kylian Mbappé', 
    club: 'Real Madrid', 
    value: '€160M', 
    change: '+8%', 
    position: 'LW',
    photo: 'https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg?lm=1',
    clubLogo: 'https://logoeps.com/wp-content/uploads/2013/03/real-madrid-vector-logo.png',
    nationality: '🇫🇷',
    age: '25'
  },
  { 
    name: 'Jude Bellingham', 
    club: 'Real Madrid', 
    value: '€150M', 
    change: '+25%', 
    position: 'CM',
    photo: 'https://img.a.transfermarkt.technology/portrait/big/581678-1693210087.jpg?lm=1',
    clubLogo: 'https://logoeps.com/wp-content/uploads/2013/03/real-madrid-vector-logo.png',
    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    age: '21'
  },
  { 
    name: 'Pedri', 
    club: 'Barcelona', 
    value: '€120M', 
    change: '+12%', 
    position: 'CM',
    photo: 'https://img.a.transfermarkt.technology/portrait/big/757814-1661164482.jpg?lm=1',
    clubLogo: 'https://logoeps.com/wp-content/uploads/2013/03/fc-barcelona-vector-logo.png',
    nationality: '🇪🇸',
    age: '22'
  },
  { 
    name: 'Vinícius Jr.', 
    club: 'Real Madrid', 
    value: '€140M', 
    change: '+18%', 
    position: 'LW',
    photo: 'https://img.a.transfermarkt.technology/portrait/big/371998-1659358608.jpg?lm=1',
    clubLogo: 'https://logoeps.com/wp-content/uploads/2013/03/real-madrid-vector-logo.png',
    nationality: '🇧🇷',
    age: '24'
  }
]

const recentTransfers = [
  { 
    player: 'Declan Rice', 
    from: 'West Ham', 
    to: 'Arsenal', 
    value: '€116M', 
    date: '2024-01-15',
    playerPhoto: 'https://img.a.transfermarkt.technology/portrait/big/93726-1664804578.jpg?lm=1',
    fromLogo: 'https://logoeps.com/wp-content/uploads/2013/03/west-ham-vector-logo.png',
    toLogo: 'https://logoeps.com/wp-content/uploads/2013/03/arsenal-vector-logo.png',
    nationality: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  { 
    player: 'Enzo Fernández', 
    from: 'Benfica', 
    to: 'Chelsea', 
    value: '€121M', 
    date: '2024-01-10',
    playerPhoto: 'https://img.a.transfermarkt.technology/portrait/big/648195-1661776369.jpg?lm=1',
    fromLogo: 'https://logoeps.com/wp-content/uploads/2013/03/sl-benfica-vector-logo.png',
    toLogo: 'https://logoeps.com/wp-content/uploads/2013/03/chelsea-vector-logo.png',
    nationality: '🇦🇷'
  },
  { 
    player: 'Moisés Caicedo', 
    from: 'Brighton', 
    to: 'Chelsea', 
    value: '€133M', 
    date: '2024-01-08',
    playerPhoto: 'https://img.a.transfermarkt.technology/portrait/big/571697-1661164447.jpg?lm=1',
    fromLogo: 'https://logoeps.com/wp-content/uploads/2013/03/brighton-hove-albion-vector-logo.png',
    toLogo: 'https://logoeps.com/wp-content/uploads/2013/03/chelsea-vector-logo.png',
    nationality: '🇪🇨'
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
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 mr-2" />
                  Ricerca AI
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
                  size="lg" 
                  variant="outline" 
                  class="justify-start bg-emerald-950/30 hover:bg-emerald-950/50 border-emerald-500/30 text-emerald-100 hover:border-emerald-400/50 shadow-lg shadow-emerald-900/20"
                >
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-2" />
                  Configurazione
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
          </div>
          <div :class="[stat.bgColor, stat.borderColor]" class="w-12 h-12 rounded-xl border flex items-center justify-center shadow-lg">
            <UIcon :name="stat.icon" :class="stat.color" class="w-6 h-6" />
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
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
            <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Analisi AI Avanzata</h3>
          <UBadge variant="outline" class="bg-emerald-500/30 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-900/20">
            BETA
          </UBadge>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-6 bg-emerald-950/30 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500/30 to-lime-400/30 flex items-center justify-center border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
            <UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8 text-emerald-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Predizioni di Valore</h4>
          <p class="text-emerald-300/80 text-sm">Algoritmi ML per prevedere l'andamento del valore dei giocatori</p>
        </div>

        <div class="text-center p-6 bg-emerald-950/30 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-400/30 flex items-center justify-center border border-amber-400/30 shadow-lg shadow-amber-500/20">
            <UIcon name="i-heroicons-light-bulb" class="w-8 h-8 text-amber-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Insights Intelligenti</h4>
          <p class="text-emerald-300/80 text-sm">Analisi comportamentali e pattern recognition sui trasferimenti</p>
        </div>

        <div class="text-center p-6 bg-emerald-950/30 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-900/20">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-lime-500/30 to-green-400/30 flex items-center justify-center border border-lime-400/30 shadow-lg shadow-lime-500/20">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-lime-400" />
          </div>
          <h4 class="text-white font-semibold mb-2">Raccomandazioni</h4>
          <p class="text-emerald-300/80 text-sm">Suggerimenti personalizzati basati su AI per investimenti ottimali</p>
        </div>
      </div>
    </UCard>
  </div>
</template>