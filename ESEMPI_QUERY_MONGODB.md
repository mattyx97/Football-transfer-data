# ESEMPI PRATICI QUERY MONGODB - FOOTBALL TRANSFER DATA

## 1. QUERY SEMPLICI

### 1.1 Trova tutti i giocatori di una squadra
```javascript
// Trova tutti i giocatori del club con ID 5 (es. Juventus)
db.players.find({ current_club_id: 5 })

// Con proiezione per mostrare solo campi specifici
db.players.find(
  { current_club_id: 5 },
  { name: 1, position: 1, market_value_in_eur: 1, _id: 0 }
)
```

### 1.2 Ricerca giocatori per nome
```javascript
// Ricerca case-insensitive per nome
db.players.find({
  name: { $regex: "Messi", $options: "i" }
})

// Ricerca in nome o cognome
db.players.find({
  $or: [
    { first_name: { $regex: "Lionel", $options: "i" } },
    { last_name: { $regex: "Messi", $options: "i" } }
  ]
})
```

### 1.3 Filtri per valore di mercato
```javascript
// Giocatori con valore > 50 milioni
db.players.find({
  market_value_in_eur: { $gt: 50000000 }
})

// Giocatori tra 10 e 100 milioni
db.players.find({
  market_value_in_eur: { 
    $gte: 10000000, 
    $lte: 100000000 
  }
})
```

## 2. AGGREGAZIONI AVANZATE

### 2.1 Top 10 giocatori per valore
```javascript
db.players.aggregate([
  {
    $match: {
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $sort: { market_value_in_eur: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      name: 1,
      position: 1,
      market_value_in_eur: 1,
      current_club_name: 1,
      value_in_millions: {
        $divide: ["$market_value_in_eur", 1000000]
      }
    }
  }
])
```

### 2.2 Statistiche per posizione
```javascript
db.players.aggregate([
  {
    $match: {
      position: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $group: {
      _id: "$position",
      totalPlayers: { $sum: 1 },
      totalValue: { $sum: "$market_value_in_eur" },
      avgValue: { $avg: "$market_value_in_eur" },
      maxValue: { $max: "$market_value_in_eur" },
      minValue: { $min: "$market_value_in_eur" }
    }
  },
  {
    $sort: { totalValue: -1 }
  }
])
```

### 2.3 Analisi per età
```javascript
db.players.aggregate([
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
            { $subtract: [new Date(), "$date_of_birth"] },
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
            { case: { $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 21] }] }, then: "18-21" },
            { case: { $and: [{ $gte: ["$age", 22] }, { $lte: ["$age", 25] }] }, then: "22-25" },
            { case: { $and: [{ $gte: ["$age", 26] }, { $lte: ["$age", 29] }] }, then: "26-29" },
            { case: { $gte: ["$age", 30] }, then: "30+" }
          ],
          default: "Unknown"
        }
      }
    }
  },
  {
    $group: {
      _id: "$ageGroup",
      totalPlayers: { $sum: 1 },
      totalValue: { $sum: "$market_value_in_eur" },
      avgAge: { $avg: "$age" },
      avgValue: { $avg: "$market_value_in_eur" }
    }
  },
  {
    $sort: { _id: 1 }
  }
])
```

## 3. JOIN E RELAZIONI

### 3.1 Giocatori con informazioni club
```javascript
db.players.aggregate([
  {
    $lookup: {
      from: "clubs",
      localField: "current_club_id",
      foreignField: "club_id",
      as: "club_info"
    }
  },
  {
    $unwind: "$club_info"
  },
  {
    $project: {
      name: 1,
      position: 1,
      market_value_in_eur: 1,
      club_name: "$club_info.name",
      league: "$club_info.domestic_competition_id"
    }
  }
])
```

### 3.2 Trasferimenti con dettagli giocatore
```javascript
db.transfers.aggregate([
  {
    $lookup: {
      from: "players",
      localField: "player_id",
      foreignField: "player_id",
      as: "player_info"
    }
  },
  {
    $unwind: "$player_info"
  },
  {
    $project: {
      player_name: 1,
      transfer_date: 1,
      from_club_name: 1,
      to_club_name: 1,
      transfer_fee: 1,
      player_position: "$player_info.position",
      player_nationality: "$player_info.country_of_citizenship"
    }
  },
  {
    $sort: { transfer_date: -1 }
  }
])
```

## 4. QUERY COMPLESSE

### 4.1 Analisi trasferimenti per stagione
```javascript
db.transfers.aggregate([
  {
    $match: {
      transfer_season: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$transfer_season",
      totalTransfers: { $sum: 1 },
      totalValue: { $sum: "$market_value_in_eur" },
      avgValue: { $avg: "$market_value_in_eur" },
      maxTransfer: { $max: "$market_value_in_eur" }
    }
  },
  {
    $sort: { _id: -1 }
  }
])
```

### 4.2 Top club per valore totale rosa
```javascript
db.players.aggregate([
  {
    $match: {
      current_club_id: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $group: {
      _id: "$current_club_id",
      totalValue: { $sum: "$market_value_in_eur" },
      playerCount: { $sum: 1 },
      avgValue: { $avg: "$market_value_in_eur" }
    }
  },
  {
    $lookup: {
      from: "clubs",
      localField: "_id",
      foreignField: "club_id",
      as: "club_info"
    }
  },
  {
    $unwind: "$club_info"
  },
  {
    $project: {
      club_name: "$club_info.name",
      totalValue: 1,
      playerCount: 1,
      avgValue: 1,
      value_in_millions: { $divide: ["$totalValue", 1000000] }
    }
  },
  {
    $sort: { totalValue: -1 }
  },
  {
    $limit: 20
  }
])
```

### 4.3 Analisi nazionalità
```javascript
db.players.aggregate([
  {
    $match: {
      country_of_citizenship: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $group: {
      _id: "$country_of_citizenship",
      totalPlayers: { $sum: 1 },
      totalValue: { $sum: "$market_value_in_eur" },
      avgValue: { $avg: "$market_value_in_eur" }
    }
  },
  {
    $sort: { totalValue: -1 }
  },
  {
    $limit: 15
  }
])
```

## 5. QUERY PER STATISTICHE AVANZATE

### 5.1 Distribuzione altezza per posizione
```javascript
db.players.aggregate([
  {
    $match: {
      height_in_cm: { $exists: true, $gt: 0 },
      position: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$position",
      avgHeight: { $avg: "$height_in_cm" },
      minHeight: { $min: "$height_in_cm" },
      maxHeight: { $max: "$height_in_cm" },
      playerCount: { $sum: 1 }
    }
  },
  {
    $sort: { avgHeight: -1 }
  }
])
```

### 5.2 Analisi contratti in scadenza
```javascript
db.players.aggregate([
  {
    $match: {
      contract_expiration_date: { $exists: true, $ne: null }
    }
  },
  {
    $addFields: {
      daysUntilExpiry: {
        $ceil: {
          $divide: [
            { $subtract: ["$contract_expiration_date", new Date()] },
            24 * 60 * 60 * 1000
          ]
        }
      }
    }
  },
  {
    $match: {
      daysUntilExpiry: { $gte: 0, $lte: 365 }
    }
  },
  {
    $sort: { daysUntilExpiry: 1 }
  },
  {
    $project: {
      name: 1,
      current_club_name: 1,
      contract_expiration_date: 1,
      daysUntilExpiry: 1,
      market_value_in_eur: 1
    }
  }
])
```

### 5.3 Tendenze di mercato per lega
```javascript
db.players.aggregate([
  {
    $match: {
      current_club_domestic_competition_id: { $exists: true, $ne: null },
      market_value_in_eur: { $exists: true, $gt: 0 }
    }
  },
  {
    $group: {
      _id: "$current_club_domestic_competition_id",
      totalValue: { $sum: "$market_value_in_eur" },
      playerCount: { $sum: 1 },
      avgValue: { $avg: "$market_value_in_eur" },
      maxValue: { $max: "$market_value_in_eur" }
    }
  },
  {
    $addFields: {
      valuePerPlayer: { $divide: ["$totalValue", "$playerCount"] }
    }
  },
  {
    $sort: { totalValue: -1 }
  }
])
```

## 6. QUERY PER RICERCA AVANZATA

### 6.1 Ricerca giocatori per criteri multipli
```javascript
db.players.find({
  $and: [
    { position: "Forward" },
    { market_value_in_eur: { $gte: 20000000 } },
    { date_of_birth: { $gte: new Date("1995-01-01") } },
    { country_of_citizenship: { $in: ["Brazil", "Argentina", "France"] } }
  ]
})
```

### 6.2 Giocatori con più trasferimenti
```javascript
db.transfers.aggregate([
  {
    $group: {
      _id: "$player_id",
      transferCount: { $sum: 1 },
      transfers: { $push: "$$ROOT" }
    }
  },
  {
    $sort: { transferCount: -1 }
  },
  {
    $limit: 20
  },
  {
    $lookup: {
      from: "players",
      localField: "_id",
      foreignField: "player_id",
      as: "player_info"
    }
  },
  {
    $unwind: "$player_info"
  },
  {
    $project: {
      player_name: "$player_info.name",
      transferCount: 1,
      current_club: "$player_info.current_club_name"
    }
  }
])
```

## 7. PERFORMANCE E INDICI

### 7.1 Indici consigliati
```javascript
// Indice per ricerca giocatori per club
db.players.createIndex({ "current_club_id": 1 })

// Indice composto per club + posizione
db.players.createIndex({ "current_club_id": 1, "position": 1 })

// Indice testuale per ricerca nomi
db.players.createIndex({ "name": "text", "first_name": "text", "last_name": "text" })

// Indice per valore di mercato
db.players.createIndex({ "market_value_in_eur": -1 })

// Indice per data di nascita
db.players.createIndex({ "date_of_birth": 1 })

// Indice per trasferimenti
db.transfers.createIndex({ "player_id": 1, "transfer_date": -1 })
```

### 7.2 Query ottimizzate con explain()
```javascript
// Analisi performance query
db.players.find({ current_club_id: 5 }).explain("executionStats")

// Verifica utilizzo indici
db.players.find({ 
  current_club_id: 5, 
  position: "Forward" 
}).explain("queryPlanner")
```

## 8. ESEMPI DI UTILIZZO NEL CODICE

### 8.1 Endpoint API per top giocatori
```typescript
// server/api/players/top-by-value.get.ts
export default defineZodEventHandler({
  async handler() {
    const topPlayers = await PlayerModel.aggregate([
      {
        $match: {
          market_value_in_eur: { $exists: true, $gt: 0 }
        }
      },
      {
        $sort: { market_value_in_eur: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          position: 1,
          market_value_in_eur: 1,
          current_club_name: 1
        }
      }
    ])
    
    return { topPlayers }
  }
})
```

### 8.2 Endpoint per statistiche club
```typescript
// server/api/clubs/[id]/players.get.ts
export default defineZodEventHandler({
  input: {
    params: z.object({
      id: z.coerce.number()
    })
  },
  async handler(event, { input: { params } }) {
    const [players, stats] = await Promise.all([
      PlayerModel.find({ current_club_id: params.id }),
      PlayerModel.aggregate([
        { $match: { current_club_id: params.id } },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$market_value_in_eur" },
            avgAge: { $avg: { $subtract: [new Date(), "$date_of_birth"] } },
            playerCount: { $sum: 1 }
          }
        }
      ])
    ])
    
    return { players, stats: stats[0] }
  }
})
```

Questi esempi dimostrano la potenza e flessibilità di MongoDB per l'analisi di dati complessi come quelli calcistici, con query che vanno da semplici filtri a aggregazioni complesse per statistiche avanzate. 