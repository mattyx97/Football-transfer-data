# DOCUMENTAZIONE TECNICA - FOOTBALL TRANSFER DATA

## 1. ARCHITETTURA GENERALE

### 1.1 Stack Tecnologico
- **Frontend**: Nuxt 3.17.6 (Vue 3.5.17) con TypeScript
- **Backend**: Nitro (server engine di Nuxt)
- **Database**: MongoDB 8.16.1 con Mongoose ODM
- **UI Framework**: Nuxt UI 3.2.0
- **Styling**: Tailwind CSS 4.1.11
- **Containerizzazione**: Docker Compose
- **AI Integration**: OpenAI API (Nebius) con Llama-3.3-70B-Instruct

### 1.2 Struttura del Progetto
```
Football-transfer-data/
├── app/                    # Frontend Nuxt
│   ├── components/         # Componenti Vue
│   ├── pages/             # Routing basato su file
│   ├── layouts/           # Layout templates
│   └── composables/       # Composables Vue
├── server/                # Backend Nitro
│   ├── api/              # API endpoints
│   ├── lib/db/           # Schema database
│   ├── plugins/          # Plugin Nitro
│   └── tasks/            # Task di background
├── dataset/              # Dati CSV originali
└── docker-compose.yml    # Configurazione Docker
```

## 2. DATABASE MONGODB - ANALISI DETTAGLIATA

### 2.1 Schema del Database

#### 2.1.1 Collection: Clubs
```typescript
{
  club_id: Number,                    // ID univoco del club
  club_code: String,                  // Codice del club
  name: String,                       // Nome del club
  domestic_competition_id: String,    // ID della competizione domestica
  total_market_value: String,         // Valore totale di mercato
  squad_size: Number,                 // Dimensione della rosa
  average_age: Number,                // Età media della squadra
  foreigners_number: Number,          // Numero di stranieri
  foreigners_percentage: String,      // Percentuale di stranieri
  national_team_players: Number,      // Giocatori della nazionale
  stadium_name: String,               // Nome dello stadio
  stadium_seats: Number,              // Posti dello stadio
  net_transfer_record: String,        // Record trasferimenti netto
  coach_name: String,                 // Nome dell'allenatore
  last_season: Number,                // Ultima stagione
  filename: String,                   // Nome file origine
  url: String                         // URL riferimento
}
```

#### 2.1.2 Collection: Players
```typescript
{
  player_id: Number,                  // ID univoco del giocatore
  first_name: String,                 // Nome
  last_name: String,                  // Cognome
  name: String,                       // Nome completo
  last_season: Number,                // Ultima stagione
  current_club_id: Number,            // ID club attuale
  player_code: String,                // Codice giocatore
  country_of_birth: String,           // Paese di nascita
  city_of_birth: String,              // Città di nascita
  country_of_citizenship: String,     // Nazionalità
  date_of_birth: Date,                // Data di nascita
  sub_position: String,               // Sottoposizione
  position: String,                   // Posizione principale
  foot: String,                       // Piedi preferiti
  height_in_cm: Number,               // Altezza in cm
  contract_expiration_date: Date,     // Scadenza contratto
  agent_name: String,                 // Nome agente
  image_url: String,                  // URL immagine
  url: String,                        // URL riferimento
  current_club_domestic_competition_id: String,  // ID competizione club
  current_club_name: String,          // Nome club attuale
  market_value_in_eur: Number,        // Valore di mercato in EUR
  highest_market_value_in_eur: Number // Valore massimo storico
}
```

#### 2.1.3 Collection: PlayerValuations
```typescript
{
  player_id: Number,                  // ID giocatore
  date: Date,                         // Data valutazione
  market_value_in_eur: Number,        // Valore di mercato
  current_club_id: Number,            // ID club attuale
  player_club_domestic_competition_id: String  // ID competizione
}
```

#### 2.1.4 Collection: Transfers
```typescript
{
  player_id: Number,                  // ID giocatore
  transfer_date: Date,                // Data trasferimento
  transfer_season: String,            // Stagione trasferimento
  from_club_id: Number,               // ID club di partenza
  to_club_id: Number,                 // ID club di destinazione
  from_club_name: String,             // Nome club partenza
  to_club_name: String,               // Nome club destinazione
  transfer_fee: String,               // Quota trasferimento
  market_value_in_eur: Number,        // Valore di mercato
  player_name: String                 // Nome giocatore
}
```

### 2.2 Query MongoDB Avanzate

#### 2.2.1 Aggregazione per Tendenze di Mercato
```javascript
// Esempio: Analisi valore per lega
PlayerModel.aggregate([
  {
    $match: {
      current_club_domestic_competition_id: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $group: {
      _id: '$current_club_domestic_competition_id',
      totalValue: { $sum: '$market_value_in_eur' },
      playerCount: { $sum: 1 },
      avgValue: { $avg: '$market_value_in_eur' }
    }
  },
  {
    $sort: { totalValue: -1 }
  },
  {
    $limit: 5
  }
])
```

#### 2.2.2 Calcolo Età Dinamico
```javascript
// Esempio: Raggruppamento per fasce d'età
PlayerModel.aggregate([
  {
    $match: {
      date_of_birth: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $addFields: {
      age: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), '$date_of_birth'] },
            365.25 * 24 * 60 * 60 * 1000
          ]
        }
      }
    }
  },
  {
    $addFields: {
      ageGroup: {
        $switch: {
          branches: [
            { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 21] }] }, then: '18-21' },
            { case: { $and: [{ $gte: ['$age', 22] }, { $lte: ['$age', 25] }] }, then: '22-25' },
            { case: { $and: [{ $gte: ['$age', 26] }, { $lte: ['$age', 29] }] }, then: '26-29' },
            { case: { $gte: ['$age', 30] }, then: '30+' }
          ],
          default: 'Unknown'
        }
      }
    }
  }
])
```

#### 2.2.3 Ricerca Testuale Avanzata
```javascript
// Esempio: Ricerca giocatori con regex case-insensitive
PlayerModel.find({
  $or: [
    { name: { $regex: search, $options: "i" } },
    { first_name: { $regex: search, $options: "i" } },
    { last_name: { $regex: search, $options: "i" } }
  ]
})
```

### 2.3 Indici e Performance
- **Indici primari**: `_id` (automatico)
- **Indici univoci**: `club_id`, `player_id`
- **Indici composti**: `current_club_id` + `position` per query rosa
- **Indici testuali**: `name`, `first_name`, `last_name` per ricerca

## 3. API ENDPOINTS - ARCHITETTURA REST

### 3.1 Struttura API
Tutti gli endpoint seguono le convenzioni Nuxt/Nitro con validazione Zod:

```typescript
export default defineZodEventHandler({
  input: {
    query: z.object({
      page: z.coerce.number().optional().default(1),
      search: z.string().optional()
    })
  },
  async handler(event, { input: { query } }) {
    // Logica endpoint
  }
})
```

### 3.2 Endpoint Principali

#### 3.2.1 Players API
- `GET /api/players` - Lista giocatori con paginazione e ricerca
- `GET /api/players/top-by-value` - Top giocatori per valore
- `GET /api/players/[id]` - Dettaglio giocatore
- `GET /api/players/[id]/transfers` - Storico trasferimenti
- `GET /api/players/[id]/valuations` - Storico valutazioni

#### 3.2.2 Clubs API
- `GET /api/clubs` - Lista club con ricerca
- `GET /api/clubs/[id]` - Dettaglio club
- `GET /api/clubs/[id]/players` - Rosa del club

#### 3.2.3 Statistics API
- `GET /api/stats/market-trends` - Tendenze di mercato
- `GET /api/stats/positions` - Distribuzione posizioni
- `GET /api/stats/ages` - Distribuzione età
- `GET /api/stats/leagues` - Statistiche leghe

#### 3.2.4 Transfers API
- `GET /api/transfers/recent` - Trasferimenti recenti

### 3.3 Paginazione e Filtri
```typescript
const PAGE_SIZE = 20
const skip = (page - 1) * PAGE_SIZE

const [total, data] = await Promise.all([
  Model.countDocuments(filter),
  Model.find(filter).skip(skip).limit(PAGE_SIZE)
])

return {
  data,
  pagination: {
    total,
    page,
    pageSize: PAGE_SIZE
  }
}
```

## 4. DOCKER E CONTAINERIZZAZIONE

### 4.1 Configurazione Docker Compose
```yaml
version: "3.8"
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:
```

### 4.2 Vantaggi della Containerizzazione

#### 4.2.1 Isolamento e Portabilità
- **Ambiente isolato**: MongoDB gira in un container separato
- **Portabilità**: Funziona su qualsiasi sistema con Docker
- **Versioning**: Controllo preciso della versione del database

#### 4.2.2 Sviluppo e Deployment
- **Setup rapido**: `docker-compose up -d` per avviare tutto
- **Consistenza**: Stesso ambiente in sviluppo e produzione
- **Scalabilità**: Facile aggiungere repliche MongoDB

#### 4.2.3 Gestione Dati
- **Persistenza**: Volume `mongo-data` mantiene i dati
- **Backup**: Facile backup del volume
- **Reset**: `docker-compose down -v` per reset completo

### 4.3 Script di Automazione
```json
{
  "infra-dev-up": "docker compose -f docker-compose.yml up -d",
  "db:seed-dev": "curl -X GET http://localhost:3000/_nitro/tasks/_seed"
}
```

## 5. INTEGRAZIONE AI - AGENTE INTELLIGENTE

### 5.1 Architettura AI
L'agente AI utilizza un approccio ibrido:
- **Decision Making**: Llama-3.3-70B-Instruct per analisi
- **Data Integration**: Chiamate API automatiche al database
- **Context Awareness**: Conoscenza del contesto utente

### 5.2 Flusso di Elaborazione

#### 5.2.1 Analisi della Domanda
```typescript
const systemPrompt = `Sei un assistente calcistico esperto. Analizza la domanda e rispondi SEMPRE con JSON:

{
  "action": "api_call" | "search_club" | "ai_knowledge",
  "endpoint": "/api/..." (solo se action è api_call/search_club),
  "params": {},
  "explanation": "Spiegazione"
}
`
```

#### 5.2.2 Decision Tree
1. **Dati specifici** → Chiamata API appropriata
2. **Ricerca club** → Search + API club
3. **Conoscenza generale** → Risposta AI diretta

### 5.3 Integrazione con Database
```typescript
// Esempio: Ricerca automatica club
if (aiParsed.action === 'search_club') {
  const searchResults = await $fetch(`/api/clubs?search=${aiParsed.params.search}`)
  const playersData = await $fetch(`/api/clubs/${firstClub.club_id}/players`)
  
  return {
    success: true,
    message: `Ho trovato ${firstClub.name}!`,
    data: playersData,
    apiCalled: `/api/clubs/${firstClub.club_id}/players`
  }
}
```

### 5.4 API Disponibili per AI
- `/api/players/top-by-value` - Top giocatori
- `/api/clubs/[id]/players` - Rosa club
- `/api/transfers/recent` - Trasferimenti recenti
- `/api/stats/positions` - Distribuzione posizioni
- `/api/stats/ages` - Distribuzione età
- `/api/stats/market-trends` - Tendenze mercato

## 6. FRONTEND - NUXT 3 E VUE 3

### 6.1 Architettura Frontend
- **File-based Routing**: `/pages/` per routing automatico
- **Auto-imports**: Componenti e composables automatici
- **SSR/SSG**: Server-side rendering per performance
- **TypeScript**: Type safety completo

### 6.2 Componenti Principali

#### 6.2.1 AIChatDialog.vue
```vue
<template>
  <UDialog v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <!-- Chat interface con AI -->
  </UDialog>
</template>
```

**Caratteristiche**:
- **Real-time chat**: Interfaccia conversazionale
- **Context awareness**: Conosce la pagina corrente
- **Data visualization**: Mostra dati API in formato leggibile
- **Suggestions**: Domande suggerite per l'utente

#### 6.2.2 Layout Responsive
- **Mobile-first**: Design responsive con Tailwind
- **Dark mode**: Supporto tema scuro
- **Accessibility**: Componenti accessibili con Nuxt UI

### 6.3 State Management
```typescript
// Composables per gestione stato
export const useAIDialog = () => {
  const isOpen = ref(false)
  const context = ref({})
  
  return {
    isOpen,
    context,
    openDialog: (ctx?: any) => {
      context.value = ctx || {}
      isOpen.value = true
    }
  }
}
```

## 7. PERFORMANCE E OTTIMIZZAZIONI

### 7.1 Database Optimizations
- **Indexing**: Indici strategici per query frequenti
- **Aggregation Pipeline**: Query complesse ottimizzate
- **Pagination**: Limitazione risultati per performance
- **Lean Queries**: `lean()` per query read-only

### 7.2 Frontend Optimizations
- **Lazy Loading**: Componenti caricati on-demand
- **Image Optimization**: Ottimizzazione automatica immagini
- **Code Splitting**: Bundle splitting automatico
- **Caching**: Cache intelligente con Nitro

### 7.3 API Optimizations
- **Parallel Queries**: `Promise.all()` per query multiple
- **Response Formatting**: Dati formattati lato server
- **Error Handling**: Gestione errori robusta
- **Rate Limiting**: Protezione da abuso

## 8. SICUREZZA

### 8.1 Database Security
- **Authentication**: Credenziali MongoDB protette
- **Input Validation**: Zod per validazione input
- **SQL Injection**: Impossibile con Mongoose
- **Data Sanitization**: Pulizia dati input

### 8.2 API Security
- **CORS**: Configurazione CORS appropriata
- **Rate Limiting**: Protezione da DDoS
- **Input Validation**: Validazione Zod rigorosa
- **Error Handling**: Errori non esporre dati sensibili

### 8.3 Environment Variables
```typescript
// Configurazione sicura
const privateEnv = z.object({
  NUXT_MONGODB_URI: z.string(),
}).parse(process.env)
```

## 9. TESTING E QUALITÀ

### 9.1 Database Testing
- **Schema Validation**: Mongoose schema validation
- **Data Integrity**: Controlli integrità referenziale
- **Performance Testing**: Query performance monitoring

### 9.2 API Testing
- **Endpoint Testing**: Test tutti gli endpoint
- **Error Scenarios**: Test scenari di errore
- **Load Testing**: Test carico con dati reali

### 9.3 Frontend Testing
- **Component Testing**: Test componenti Vue
- **E2E Testing**: Test end-to-end
- **Accessibility Testing**: Test accessibilità

## 10. DEPLOYMENT E MONITORING

### 10.1 Deployment Strategy
- **Docker**: Containerizzazione completa
- **Environment**: Configurazione per diversi ambienti
- **CI/CD**: Pipeline di deployment automatizzato

### 10.2 Monitoring
- **Database Monitoring**: MongoDB performance
- **API Monitoring**: Endpoint performance
- **Error Tracking**: Tracciamento errori
- **User Analytics**: Analytics utilizzo

## 11. CONCLUSIONI

### 11.1 Punti di Forza
- **Architettura moderna**: Nuxt 3 + MongoDB + AI
- **Scalabilità**: Design modulare e containerizzato
- **User Experience**: Interfaccia intuitiva con AI
- **Performance**: Ottimizzazioni database e frontend
- **Sicurezza**: Validazione input e protezioni

### 11.2 Tecnologie Innovative
- **AI Integration**: Agente intelligente per assistenza
- **NoSQL**: MongoDB per flessibilità dati
- **Modern Stack**: Vue 3 + TypeScript + Tailwind
- **Containerization**: Docker per portabilità

### 11.3 Possibili Miglioramenti
- **Real-time**: WebSocket per aggiornamenti live
- **Advanced AI**: Machine learning per predizioni
- **Mobile App**: App nativa per mobile
- **Analytics**: Dashboard analytics avanzate 