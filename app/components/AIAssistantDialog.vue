<script setup lang="ts">
const query = ref('')
const isLoading = ref(false)
const messages = ref([
  {
    id: 1,
    type: 'assistant',
    content: 'Ciao! Sono il tuo assistente AI per l\'analisi calcistica. Posso aiutarti con analisi di giocatori, predizioni di mercato, statistiche avanzate e molto altro. Come posso aiutarti oggi?',
    timestamp: new Date()
  }
])

const handleSendQuery = async () => {
  if (!query.value.trim()) return
  
  // Aggiungi messaggio utente
  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: query.value,
    timestamp: new Date()
  })
  
  const userQuery = query.value
  query.value = ''
  isLoading.value = true
  
  // Simula risposta AI
  setTimeout(() => {
    messages.value.push({
      id: Date.now(),
      type: 'assistant',
      content: `Analizzando la tua richiesta "${userQuery}"... Basandomi sui dati più recenti, posso fornirti insights dettagliati. Le tendenze attuali del mercato mostrano interessanti pattern che potrebbero influenzare le tue decisioni.`,
      timestamp: new Date()
    })
    isLoading.value = false
  }, 1500)
}

const quickQuestions = [
  'Quale giocatore ha il miglior potenziale di crescita?',
  'Analizza il mercato dei centrocampisti',
  'Predici i prossimi trasferimenti importanti',
  'Mostrami le squadre più attive sul mercato'
]
</script>

<template>
  <UCard class="bg-gradient-to-b from-emerald-950/95 to-slate-900/95 border-emerald-500/30 shadow-2xl shadow-emerald-900/50">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
            <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold bg-gradient-to-r from-emerald-300 to-lime-400 bg-clip-text text-transparent">
              AI Assistant Calcistico
            </h3>
            <p class="text-emerald-300/70 text-sm">Analisi avanzata • Predizioni • Insights</p>
          </div>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Messages Area -->
      <div class="h-96 overflow-y-auto space-y-4 p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="flex"
          :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-[80%] p-4 rounded-xl shadow-lg"
            :class="message.type === 'user' 
              ? 'bg-emerald-600/80 text-white ml-4' 
              : 'bg-slate-800/80 text-emerald-100 mr-4 border border-emerald-500/20'"
          >
            <div class="flex items-start space-x-3">
              <div v-if="message.type === 'assistant'" class="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center flex-shrink-0 mt-1">
                <UIcon name="i-heroicons-cpu-chip" class="w-3 h-3 text-white" />
              </div>
              <div class="flex-1">
                <p class="text-sm leading-relaxed">{{ message.content }}</p>
                <p class="text-xs opacity-60 mt-2">
                  {{ message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-slate-800/80 text-emerald-100 p-4 rounded-xl shadow-lg border border-emerald-500/20 max-w-[80%] mr-4">
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center animate-pulse">
                <UIcon name="i-heroicons-cpu-chip" class="w-3 h-3 text-white" />
              </div>
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Questions -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-emerald-300/80">Domande rapide:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="question in quickQuestions"
            :key="question"
            @click="query = question"
            class="text-left p-3 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/20 hover:border-emerald-400/40 rounded-lg transition-all duration-200 text-sm text-emerald-200 hover:text-white"
          >
            {{ question }}
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="space-y-4">
        <div class="flex space-x-3">
          <UInput
            v-model="query"
            placeholder="Scrivi la tua domanda sull'analisi calcistica..."
            class="flex-1"
            size="lg"
            @keyup.enter="handleSendQuery"
            :disabled="isLoading"
          />
          <UButton 
            @click="handleSendQuery"
            :disabled="!query.trim() || isLoading"
            class="bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-600 hover:to-lime-500 text-white shadow-lg shadow-emerald-500/30"
            size="lg"
          >
            <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
          </UButton>
        </div>
        <p class="text-xs text-emerald-300/60">
          💡 Prova a chiedere analisi di giocatori, previsioni di mercato, statistiche comparate o insights AI
        </p>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
/* Custom scrollbar per messages */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(5, 46, 22, 0.3);
}

::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.5);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.7);
}
</style> 