# ⚽ Football Transfer Data

**Sistema di Analisi Dati Calcistici con AI Integrata**

Un'applicazione web moderna per l'analisi di dati calcistici che combina un database MongoDB NoSQL con un agente AI intelligente per fornire insights avanzati su giocatori, club, trasferimenti e statistiche di mercato.

## 🚀 Caratteristiche Principali

### 🗄️ **Database NoSQL Avanzato**
- **MongoDB** con schema flessibile per dati calcistici
- **4 Collections**: Clubs, Players, PlayerValuations, Transfers
- **Query di aggregazione** complesse per statistiche avanzate
- **Indici ottimizzati** per performance eccellenti

### 🤖 **Agente AI Intelligente**
- **Llama-3.3-70B-Instruct** per analisi conversazionale
- **Decision making automatico** per chiamate API
- **Integrazione seamless** con database
- **Assistenza contestuale** per utenti

### 🌐 **Frontend Moderno**
- **Nuxt 3** + **Vue 3** + **TypeScript**
- **Nuxt UI** per componenti accessibili
- **Tailwind CSS** per design responsive
- **File-based routing** automatico

### 🐳 **Containerizzazione**
- **Docker Compose** per setup semplificato
- **MongoDB containerizzato** per portabilità
- **Ambiente consistente** sviluppo/produzione

## 📊 Dati Disponibili

### Collections MongoDB
- **Clubs**: 500+ squadre con statistiche complete
- **Players**: 10,000+ giocatori con dettagli personali
- **PlayerValuations**: Storico valutazioni di mercato
- **Transfers**: Storico trasferimenti con quote

### Statistiche Avanzate
- **Tendenze di mercato** per lega
- **Distribuzione per posizione** e età
- **Analisi trasferimenti** per stagione
- **Top giocatori** per valore e performance

## 🛠️ Tecnologie Utilizzate

### Backend
- **Nuxt 3.17.6** - Framework full-stack
- **Nitro** - Server engine
- **MongoDB 8.16.1** - Database NoSQL
- **Mongoose** - ODM per MongoDB
- **Zod** - Validazione schemi
- **OpenAI API** - Integrazione AI

### Frontend
- **Vue 3.5.17** - Framework frontend
- **TypeScript** - Type safety
- **Nuxt UI 3.2.0** - Componenti UI
- **Tailwind CSS 4.1.11** - Styling

### DevOps
- **Docker Compose** - Containerizzazione
- **MongoDB** - Database containerizzato

## 🚀 Quick Start

### Prerequisiti
- **Node.js** 18+ 
- **Docker** e **Docker Compose**
- **pnpm** (raccomandato) o npm

### Installazione

1. **Clona il repository**
```bash
git clone https://github.com/username/football-transfer-data.git
cd football-transfer-data
```

2. **Installa dipendenze**
```bash
pnpm install
```

3. **Avvia MongoDB con Docker**
```bash
pnpm infra-dev-up
```

4. **Configura variabili ambiente**
```bash
cp .env.example .env
# Modifica .env con le tue credenziali
```

5. **Popola il database**
```bash
pnpm db:seed-dev
```

6. **Avvia l'applicazione**
```bash
pnpm dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 📁 Struttura del Progetto

```
Football-transfer-data/
├── app/                    # Frontend Nuxt
│   ├── components/         # Componenti Vue
│   │   ├── AIChatDialog.vue    # Chat AI
│   │   └── AIChatDialog.vue    # Dialog AI
│   ├── pages/             # Routing basato su file
│   │   ├── index.vue          # Dashboard
│   │   ├── players/[id].vue   # Dettaglio giocatore
│   │   └── clubs/[id].vue     # Dettaglio club
│   ├── layouts/           # Layout templates
│   └── composables/       # Composables Vue
├── server/                # Backend Nitro
│   ├── api/              # API endpoints
│   │   ├── players/          # API giocatori
│   │   ├── clubs/            # API club
│   │   ├── stats/            # API statistiche
│   │   └── ai/               # API AI
│   ├── lib/db/           # Schema database
│   │   └── schema.ts         # Modelli Mongoose
│   ├── plugins/          # Plugin Nitro
│   │   └── mongoose.ts       # Connessione MongoDB
│   └── tasks/            # Task di background
│       └── _seed.ts          # Popolamento database
├── dataset/              # Dati CSV originali
│   ├── clubs.csv
│   ├── players.csv
│   ├── player_valuations.csv
│   └── transfers.csv
└── docker-compose.yml    # Configurazione Docker
```

## 🔍 API Endpoints

### Players
- `GET /api/players` - Lista giocatori con paginazione
- `GET /api/players/top-by-value` - Top giocatori per valore
- `GET /api/players/[id]` - Dettaglio giocatore
- `GET /api/players/[id]/transfers` - Storico trasferimenti
- `GET /api/players/[id]/valuations` - Storico valutazioni

### Clubs
- `GET /api/clubs` - Lista club con ricerca
- `GET /api/clubs/[id]` - Dettaglio club
- `GET /api/clubs/[id]/players` - Rosa del club

### Statistics
- `GET /api/stats/market-trends` - Tendenze di mercato
- `GET /api/stats/positions` - Distribuzione posizioni
- `GET /api/stats/ages` - Distribuzione età
- `GET /api/stats/leagues` - Statistiche leghe

### AI
- `POST /api/ai/chat` - Chat con agente AI

## 🤖 Agente AI

L'agente AI utilizza un approccio ibrido per fornire assistenza intelligente:

### Funzionalità
- **Analisi conversazionale** delle domande utente
- **Decision making automatico** per chiamate API
- **Ricerca intelligente** di club e giocatori
- **Risposte contestuali** basate sui dati

### Esempi di Utilizzo
```
Utente: "Chi sono i giocatori più costosi?"
AI: Chiama automaticamente /api/players/top-by-value

Utente: "Mostrami la rosa della Juventus"
AI: Cerca "Juventus" e chiama /api/clubs/[id]/players

Utente: "Qual è la differenza tra Messi e Ronaldo?"
AI: Risponde con conoscenza generale AI
```

## 🗄️ Database Schema

### Players Collection
```typescript
{
  player_id: Number,                  // ID univoco
  name: String,                       // Nome completo
  position: String,                   // Posizione
  market_value_in_eur: Number,        // Valore di mercato
  current_club_id: Number,            // Club attuale
  date_of_birth: Date,                // Data nascita
  country_of_citizenship: String,     // Nazionalità
  height_in_cm: Number,               // Altezza
  contract_expiration_date: Date      // Scadenza contratto
}
```

### Clubs Collection
```typescript
{
  club_id: Number,                    // ID univoco
  name: String,                       // Nome club
  domestic_competition_id: String,    // ID competizione
  total_market_value: String,         // Valore totale
  squad_size: Number,                 // Dimensione rosa
  average_age: Number,                // Età media
  stadium_name: String,               // Nome stadio
  coach_name: String                  // Nome allenatore
}
```

## 📊 Query MongoDB Esempi

### Top Giocatori per Valore
```javascript
db.players.aggregate([
  {
    $match: { market_value_in_eur: { $gt: 0 } }
  },
  {
    $sort: { market_value_in_eur: -1 }
  },
  {
    $limit: 10
  }
])
```

### Statistiche per Posizione
```javascript
db.players.aggregate([
  {
    $group: {
      _id: "$position",
      totalPlayers: { $sum: 1 },
      totalValue: { $sum: "$market_value_in_eur" },
      avgValue: { $avg: "$market_value_in_eur" }
    }
  }
])
```

### Analisi Età
```javascript
db.players.aggregate([
  {
    $addFields: {
      age: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), "$date_of_birth"] },
            365.25 * 24 * 60 * 60 * 1000
          ]
        }
      }
    }
  }
])
```

## 🐳 Docker Setup

### Configurazione
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
```

### Comandi Utili
```bash
# Avvia MongoDB
pnpm infra-dev-up

# Ferma e rimuovi container
docker-compose down

# Reset completo database
docker-compose down -v
```

## 🔒 Sicurezza

### Database
- **Authentication** MongoDB protetta
- **Input validation** con Zod
- **SQL injection** impossibile con Mongoose
- **Data sanitization** automatica

### API
- **CORS** configurato appropriatamente
- **Rate limiting** per protezione DDoS
- **Error handling** sicuro
- **Environment variables** protette

## 📈 Performance

### Database
- **Query performance**: < 100ms per query complesse
- **Indici ottimizzati** per query frequenti
- **Aggregazioni efficienti** con pipeline
- **Paginazione** per grandi dataset

### Frontend
- **SSR/SSG** automatico con Nuxt
- **Lazy loading** componenti
- **Image optimization** automatica
- **Code splitting** intelligente

## 🧪 Testing

### Database Testing
- **Schema validation** Mongoose
- **Data integrity** checks
- **Performance testing** query

### API Testing
- **Endpoint testing** completo
- **Error scenarios** coverage
- **Load testing** con dati reali

## 📚 Documentazione

- **[Documentazione Tecnica](./DOCUMENTAZIONE_TECNICA.md)** - Analisi dettagliata
- **[Presentazione Progetto](./PRESENTAZIONE_PROGETTO.md)** - Slides presentazione
- **[Esempi Query MongoDB](./ESEMPI_QUERY_MONGODB.md)** - Query pratiche
- **[API Documentation](./API_DOCS.md)** - Documentazione API

## 🤝 Contribuire

1. **Fork** il repository
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 👥 Team

- **Sviluppatore**: [Nome Cognome]
- **Mentor**: [Nome Cognome]
- **Università**: [Nome Università]
- **Corso**: Big Data 2

## 📞 Contatti

- 📧 **Email**: [email@example.com]
- 💼 **LinkedIn**: [linkedin.com/in/username]
- 🐙 **GitHub**: [github.com/username]

---

**⚽ Football Transfer Data** - Analisi dati calcistici con AI integrata 