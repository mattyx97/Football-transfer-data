<script setup lang="ts">
const isAIDialogOpen = ref(false)

const openAIDialog = () => {
  isAIDialogOpen.value = true
}

const closeAIDialog = () => {
  isAIDialogOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Campo da calcio pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-green-900/30"></div>
        <!-- Linee del campo -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 border-2 border-white/20 rounded-lg"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
      </div>
      
      <!-- Effetti luminosi AI -->
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-500/20 to-lime-400/20 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-400/10 blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Main Layout -->
    <div class="relative z-10">
      <!-- Top Header -->
      <header class="bg-gradient-to-r from-emerald-950/80 via-slate-900/80 to-green-950/80 backdrop-blur-xl border-b border-emerald-500/20 h-20">
        <div class="flex items-center justify-between h-full px-6">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 bg-clip-text text-transparent">
                FootballAI
              </h1>
              <p class="text-xs text-emerald-300/70">Analytics Platform</p>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-6">
            <div class="relative">
              <UInput
                placeholder="Cerca giocatori, club, trasferimenti... (AI-powered)"
                class="w-full pl-12 pr-4 py-3 bg-emerald-950/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl text-white placeholder-emerald-300/50 focus:border-emerald-400/70 focus:ring-emerald-400/30 shadow-lg shadow-emerald-900/20"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-emerald-400" />
                </template>
              </UInput>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <UKbd size="sm" class="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                  ⌘K
                </UKbd>
              </div>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center space-x-4">
            <UButton variant="ghost" size="sm" class="relative text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20">
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></span>
            </UButton>
            
            <UButton variant="ghost" size="sm" class="text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            </UButton>

            <div class="h-6 w-px bg-emerald-500/30"></div>

            <UButton 
              variant="ghost" 
              size="sm" 
              @click="openAIDialog"
              class="bg-gradient-to-r from-emerald-500/20 to-lime-500/20 border border-emerald-400/30 text-emerald-100 hover:from-emerald-500/30 hover:to-lime-500/30 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
            >
              <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 mr-2" />
              AI Assistant
            </UButton>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="overflow-y-auto bg-gradient-to-b from-emerald-950/30 to-slate-900/30 backdrop-blur-sm">
        <slot />
      </main>
    </div>

    <!-- AI Assistant Dialog -->
    <AIAssistantDialog 
      :is-open="isAIDialogOpen" 
      @close="closeAIDialog" 
    />
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
  background-image: 
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>
