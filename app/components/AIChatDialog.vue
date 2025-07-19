<template>
  <UDialog v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Assistente IA</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Fai domande sui dati di calcio</p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <!-- Chat Messages -->
      <div class="h-96 overflow-y-auto p-4 space-y-4">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-sparkles" class="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ciao! Sono il tuo assistente IA</h4>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Posso aiutarti con informazioni su giocatori, club, trasferimenti e statistiche di calcio.
          </p>
          <div class="space-y-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">Prova a chiedermi:</p>
            <div class="flex flex-wrap gap-2 justify-center">
              <UBadge 
                v-for="suggestion in suggestions" 
                :key="suggestion"
                color="success" 
                variant="soft" 
                class="cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900"
                @click="() => sendMessage(suggestion)"
              >
                {{ suggestion }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
          <div 
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
            :class="message.role === 'user' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            
            <!-- Mostra se è conoscenza AI -->
            <div v-if="message.aiKnowledge && message.role === 'assistant'" class="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
              <p class="font-medium text-blue-700 dark:text-blue-300">
                🧠 Risposta basata su conoscenza AI generale
              </p>
            </div>
            
            <!-- Mostra i dati dell'API se disponibili -->
            <div v-if="message.data && message.role === 'assistant'" class="mt-3 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs">
              <p class="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                📊 Dati da: {{ message.apiCalled }}
              </p>
              
                             <!-- Top Players -->
               <div v-if="message.data.topPlayers" class="space-y-1">
                 <p class="font-medium">Top Giocatori:</p>
                 <div v-for="player in message.data.topPlayers.slice(0, 5)" :key="player.name" class="flex justify-between">
                   <span>{{ player.name }} {{ player.nationality }}</span>
                   <span class="font-medium">{{ player.value }}</span>
                 </div>
               </div>
              
                             <!-- Club Players -->
               <div v-if="message.data.players" class="space-y-1">
                 <p class="font-medium">Giocatori ({{ message.data.players.length }}):</p>
                 <div v-for="player in message.data.players.slice(0, 5)" :key="player.id || player.player_id" class="flex justify-between">
                   <span>{{ player.name }} {{ player.nationality }} ({{ player.position }})</span>
                   <span class="font-medium">{{ player.marketValue || formatMarketValue(player.market_value_in_eur) }}</span>
                 </div>
                 <p v-if="message.data.players.length > 5" class="text-xs opacity-70">
                   ...e altri {{ message.data.players.length - 5 }} giocatori
                 </p>
               </div>
              
                             <!-- Stats -->
               <div v-if="message.data.summary" class="space-y-1">
                 <p class="font-medium">Statistiche Generali:</p>
                 <p>Giocatori totali: {{ message.data.summary.totalPlayers }}</p>
                 <p>Club totali: {{ message.data.summary.totalClubs }}</p>
                 <p>Trasferimenti: {{ message.data.summary.totalTransfers }}</p>
               </div>
               
               <!-- Club Stats -->
               <div v-if="message.data.stats" class="space-y-1">
                 <p class="font-medium">Statistiche Club:</p>
                 <p>Valore totale: {{ message.data.stats.totalValue }}</p>
                 <p>Età media: {{ message.data.stats.averageAge }} anni</p>
                 <p>Stranieri: {{ message.data.stats.foreigners }} ({{ message.data.stats.foreignersPercentage }}%)</p>
               </div>
              
                             <!-- Transfers -->
               <div v-if="message.data.recentTransfers" class="space-y-1">
                 <p class="font-medium">Trasferimenti Recenti:</p>
                 <div v-for="transfer in message.data.recentTransfers.slice(0, 5)" :key="transfer.player + transfer.date" class="text-xs space-y-1">
                   <div class="flex justify-between">
                     <span>{{ transfer.player }} {{ transfer.nationality }}</span>
                     <span class="font-medium">{{ transfer.value }}</span>
                   </div>
                   <div class="text-xs opacity-70">
                     {{ transfer.from }} → {{ transfer.to }} ({{ transfer.date }})
                   </div>
                 </div>
               </div>
               
               <!-- Position Stats -->
               <div v-if="message.data.positionTrends" class="space-y-1">
                 <p class="font-medium">Distribuzione per Posizione:</p>
                 <div v-for="position in message.data.positionTrends" :key="position.position" class="flex justify-between text-xs">
                   <span>{{ translatePosition(position.position) }}</span>
                   <span class="font-medium">{{ position.playerCount }} ({{ position.percentage }}%)</span>
                 </div>
               </div>
               
               <!-- Age Groups -->
               <div v-if="message.data.ageGroups" class="space-y-1">
                 <p class="font-medium">Fasce d'Età:</p>
                 <div v-for="ageGroup in message.data.ageGroups.slice(0, 5)" :key="ageGroup.range" class="flex justify-between text-xs">
                   <span>{{ ageGroup.range }} anni</span>
                   <span class="font-medium">{{ ageGroup.percentage }}%</span>
                 </div>
               </div>
               
               <!-- Top Leagues -->
               <div v-if="message.data.topLeagues" class="space-y-1">
                 <p class="font-medium">Top Leghe:</p>
                 <div v-for="league in message.data.topLeagues.slice(0, 5)" :key="league.name" class="text-xs space-y-1">
                   <div class="flex justify-between">
                     <span class="font-medium">{{ league.name }}</span>
                     <span class="text-green-600">{{ league.change }}</span>
                   </div>
                   <div class="flex justify-between opacity-70">
                     <span>{{ league.playerCount }} giocatori, {{ league.clubCount }} club</span>
                     <span class="font-medium">{{ league.value }}</span>
                   </div>
                 </div>
               </div>
            </div>
            
            <p class="text-xs opacity-70 mt-1">{{ formatTime(message.timestamp) }}</p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Sto pensando...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <template #footer>
        <div class="flex items-center space-x-2">
          <UInput
            v-model="inputMessage"
            placeholder="Scrivi la tua domanda..."
            class="flex-1"
            :disabled="isLoading"
            @keyup.enter="() => sendMessage()"
          />
          <UButton
            :disabled="!inputMessage.trim() || isLoading"
            color="success"
            icon="i-heroicons-paper-airplane"
            @click="() => sendMessage()"
          >
            Invia
          </UButton>
        </div>
      </template>
    </UCard>
  </UDialog>
</template>

<script setup lang="ts">
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any
  apiCalled?: string
  aiKnowledge?: boolean
}

interface Props {
  modelValue: boolean
  context?: {
    currentPage?: string
    clubData?: any
    playersData?: any
    availableData?: any
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const isLoading = ref(false)

const suggestions = [
  'Chi sono i giocatori più costosi?',
  'Mostrami la rosa di questa squadra',
  'Quanti difensori e attaccanti ci sono?',
  'Quali sono gli ultimi trasferimenti?',
  'Che età hanno i giocatori in media?'
]

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatMarketValue = (value: number) => {
  if (!value) return '€0M'
  return `€${(value / 1000000).toFixed(1)}M`
}

const translatePosition = (position: string) => {
  const translations: Record<string, string> = {
    'Defender': 'Difensori',
    'Midfield': 'Centrocampisti', 
    'Attack': 'Attaccanti',
    'Goalkeeper': 'Portieri'
  }
  return translations[position] || position
}

const sendMessage = async (message?: string) => {
  const content = message || inputMessage.value.trim()
  if (!content || isLoading.value) return

  // Aggiungi messaggio utente
  messages.value.push({
    role: 'user',
    content,
    timestamp: new Date()
  })

  // Pulisci input
  inputMessage.value = ''
  isLoading.value = true

  try {
    // Invia richiesta all'API
    const response = await $fetch('/api/ai/chat', {
      method: 'POST',
      body: {
        message: content,
        context: props.context
      }
    }) as { message: string, data?: any, apiCalled?: string, aiKnowledge?: boolean }

    // Debug: log dei dati ricevuti
    console.log('Dati ricevuti nella chat:', response.data)
    
    // Aggiungi risposta dell'IA
    messages.value.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      data: response.data,
      apiCalled: response.apiCalled,
      aiKnowledge: response.aiKnowledge
    })
  } catch (error) {
    console.error('Errore nella chat:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}
</script> 