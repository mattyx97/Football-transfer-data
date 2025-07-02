

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <!-- Main Layout -->
    <div class="relative z-10">
      <!-- Top Header -->
      <header class="bg-black/40 backdrop-blur-xl border-b border-white/10 h-20">
        <div class="flex items-center justify-between h-full px-6">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                FootballAI
              </h1>
              <p class="text-xs text-gray-400">Analytics Platform</p>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-6">
            <div class="relative">
              <UInput
                placeholder="Cerca giocatori, club, trasferimenti... (AI-powered)"
                class="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/30"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-gray-400" />
                </template>
              </UInput>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <UKbd size="xs" class="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  ⌘K
                </UKbd>
              </div>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center space-x-4">
            <UButton variant="ghost" size="sm" class="relative">
              <UIcon name="i-heroicons-bell" class="w-5 h-5" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </UButton>
            
            <UButton variant="ghost" size="sm">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
            </UButton>

            <div class="h-6 w-px bg-white/20"></div>

            <UButton variant="ghost" size="sm" class="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 mr-2" />
              AI Assistant
            </UButton>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="overflow-y-auto bg-black/20 backdrop-blur-sm">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

/* Glassmorphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
