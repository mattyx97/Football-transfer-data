import { z } from 'zod'
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
})

export default defineZodEventHandler({
  input: {
    body: z.object({
      message: z.string().min(1, 'Il messaggio non può essere vuoto'),
      context: z.object({
        currentPage: z.string().optional(),
        clubData: z.any().optional(),
        playersData: z.any().optional(),
        availableData: z.any().optional()
      }).optional()
    })
  },
  async handler(event, { input: { body } }) {
    // Verifica che l'API key sia presente
    if (!process.env.NEBIUS_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API key Nebius non configurata'
      })
    }

    try {
      // Prompt intelligente con fallback AI
      const systemPrompt = `Sei un assistente calcistico esperto. Analizza la domanda e rispondi SEMPRE con JSON:

{
  "action": "api_call" | "search_club" | "ai_knowledge",
  "endpoint": "/api/..." (solo se action è api_call/search_club),
  "params": {},
  "explanation": "Spiegazione"
}

API DISPONIBILI per dati dal database:
- /api/players/top-by-value - Top giocatori per valore
- /api/players - Lista giocatori 
- /api/clubs - Cerca club (usa ?search=nome)
- /api/clubs/[id]/players - Rosa del club
- /api/transfers/recent - Trasferimenti recenti
- /api/stats/positions - Distribuzione posizioni
- /api/stats/ages - Distribuzione età  
- /api/stats/leagues - Statistiche campionati
- /api/stats/market-trends - Tendenze mercato

REGOLE:
1. Se la domanda riguarda dati specifici nel database → usa API appropriate
2. Se la domanda è generale/opinione/analisi/confronti → action: "ai_knowledge"
3. Per squadre specifiche senza ID → action: "search_club"

ESEMPI:
"Rosa Juventus" → search_club
"Top giocatori" → api_call /api/players/top-by-value
"Chi è il miglior giocatore?" → ai_knowledge
"Differenza tra Messi e Ronaldo" → ai_knowledge
"Cosa pensi del calcio moderno?" → ai_knowledge
"Analisi tattica 4-3-3" → ai_knowledge`

      // Non recuperare dati - troppo pesanti per il messaggio

            // Costruisci messaggio MINIMO per evitare errore 400
      let userMessage = `Domanda: ${body.message}`
      
      userMessage += `\nPagina: ${body.context?.currentPage || 'dashboard'}`
      
      if (body.context?.clubData?.club) {
        userMessage += `\nClub: ${body.context.clubData.club.name} (ID: ${body.context.clubData.club.club_id})`
      }
      
      // NON aggiungere dati - troppo pesanti
      userMessage += `\nAPI: /api/players/top-by-value, /api/clubs/[id]/players, /api/transfers/recent, /api/stats/positions`

      console.log('Inviando richiesta all\'IA con:', {
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messageLength: userMessage.length,
        hasApiKey: !!process.env.NEBIUS_API_KEY
      })

      const completion = await client.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              {
                type: "text",
                text: userMessage
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })

      const aiResponse = completion.choices[0]?.message?.content || '{"action": "error", "explanation": "Errore nella generazione della risposta"}'

      // Parse della risposta JSON dell'IA
      let aiParsed: any = {}
      try {
        aiParsed = JSON.parse(aiResponse)
      } catch (e) {
        return {
          success: false,
          message: 'Errore nel parsing della risposta IA',
          timestamp: new Date().toISOString()
        }
      }

      // Se l'IA ha richiesto una ricerca club, falla prima
      if (aiParsed.action === 'search_club' && aiParsed.params?.search) {
        try {
          console.log('IA ha richiesto ricerca club:', aiParsed.params.search)
          
          // Cerca il club
          const searchResults = await $fetch(`/api/clubs?search=${encodeURIComponent(aiParsed.params.search)}`) as any
          
          if (searchResults.data && searchResults.data.length > 0) {
            const firstClub = searchResults.data[0]
            console.log('Club trovato:', firstClub.name, 'ID:', firstClub.club_id)
            
            // Ora prendi i giocatori del club trovato
            const playersData = await $fetch(`/api/clubs/${firstClub.club_id}/players`) as any
            
            return {
              success: true,
              message: `Ho trovato ${firstClub.name}! Ecco la rosa con ${playersData.players?.length || 0} giocatori:`,
              data: playersData,
              apiCalled: `/api/clubs/${firstClub.club_id}/players`,
              clubFound: firstClub,
              timestamp: new Date().toISOString()
            }
          } else {
            return {
              success: true,
              message: `Non ho trovato nessun club con il nome "${aiParsed.params.search}". Prova con un nome diverso.`,
              timestamp: new Date().toISOString()
            }
          }
        } catch (error) {
          console.error('Errore nella ricerca club:', error)
          return {
            success: true,
            message: `Errore nella ricerca del club. Riprova.`,
            timestamp: new Date().toISOString()
          }
        }
      }

      // Se l'IA ha richiesto una chiamata API normale, eseguila
      if (aiParsed.action === 'api_call' && aiParsed.endpoint) {
        try {
          console.log('IA ha richiesto chiamata API:', aiParsed.endpoint)
          
          // Costruisci l'URL completo
          let apiUrl = aiParsed.endpoint
          
          // Aggiungi parametri di query se presenti
          if (aiParsed.params && Object.keys(aiParsed.params).length > 0) {
            const queryParams = new URLSearchParams()
            Object.entries(aiParsed.params).forEach(([key, value]) => {
              if (key !== 'clubId') { // clubId va nell'URL, non nei query params
                queryParams.append(key, String(value))
              }
            })
            if (queryParams.toString()) {
              apiUrl += `?${queryParams.toString()}`
            }
          }
          
          // Sostituisci i parametri nell'URL se necessario
          if (aiParsed.params?.clubId) {
            apiUrl = apiUrl.replace('[id]', aiParsed.params.clubId.toString())
          }
          
          // Se è un endpoint di club ma non ha ID, prova a usare quello dal contesto
          if (apiUrl.includes('[id]') && body.context?.clubData?.club?.club_id) {
            apiUrl = apiUrl.replace('[id]', body.context.clubData.club.club_id.toString())
          }
          
          // Chiama l'API
          const apiData = await $fetch(apiUrl)
          
          const data = apiData as any
          console.log('Dati ricevuti dall\'API:', JSON.stringify(data, null, 2))
          
          // Risposta più umana
          let humanMessage = aiParsed.explanation
          
          if (data.topPlayers && data.topPlayers.length > 0) {
            humanMessage = `Ecco i giocatori più costosi del database! Ho trovato ${data.topPlayers.length} giocatori. I primi 5 sono:`
          } else if (data.players && data.players.length > 0) {
            humanMessage = `Ho trovato ${data.players.length} giocatori per questo club. Ecco la rosa:`
          } else if (data.recentTransfers && data.recentTransfers.length > 0) {
            humanMessage = `Ecco gli ultimi ${data.recentTransfers.length} trasferimenti più recenti:`
          } else if (data.positionTrends && data.positionTrends.length > 0) {
            const totalPlayers = data.positionTrends.reduce((sum: number, pos: any) => sum + pos.playerCount, 0)
            humanMessage = `Ecco come sono distribuiti i ${totalPlayers.toLocaleString()} giocatori per posizione:`
          } else if (data.ageGroups && data.ageGroups.length > 0) {
            humanMessage = `Ecco la distribuzione dei giocatori per fasce d'età:`
          } else if (data.topLeagues && data.topLeagues.length > 0) {
            humanMessage = `Ecco le ${data.topLeagues.length} migliori leghe per valore di mercato:`
          } else if (data.data && Array.isArray(data.data)) {
            humanMessage = `Ho trovato ${data.data.length} risultati:`
          }
          
          return {
            success: true,
            message: humanMessage,
            data: apiData,
            apiCalled: apiUrl,
            timestamp: new Date().toISOString()
          }
        } catch (apiError) {
          console.error('Errore nella chiamata API automatica:', apiError)
          return {
            success: true,
            message: `${aiParsed.explanation}\n\nErrore nel recupero dati: ${apiError}`,
            timestamp: new Date().toISOString()
          }
        }
      }

      // Se l'IA ha scelto di rispondere con la sua conoscenza
      if (aiParsed.action === 'ai_knowledge') {
        try {
          console.log('IA risponde con conoscenza generale per:', body.message)
          
          // Nuova chiamata per risposta dettagliata basata su conoscenza AI
          const knowledgeCompletion = await client.chat.completions.create({
            model: "meta-llama/Llama-3.3-70B-Instruct",
            messages: [
              { 
                role: "system", 
                content: `Sei un esperto di calcio con conoscenza approfondita. Rispondi in italiano in modo conversazionale e dettagliato. Fornisci analisi, opinioni e spiegazioni basate sulla tua conoscenza del calcio.` 
              },
              { 
                role: "user", 
                content: [
                  {
                    type: "text",
                    text: body.message
                  }
                ]
              }
            ],
            max_tokens: 1500,
            temperature: 0.7
          })

          const knowledgeResponse = knowledgeCompletion.choices[0]?.message?.content || 'Mi dispiace, non riesco a rispondere.'

          return {
            success: true,
            message: knowledgeResponse,
            aiKnowledge: true,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          console.error('Errore nella risposta AI knowledge:', error)
          return {
            success: true,
            message: aiParsed.explanation || 'Mi dispiace, non riesco a rispondere a questa domanda.',
            timestamp: new Date().toISOString()
          }
        }
      }

      return {
        success: true,
        message: aiParsed.explanation || aiResponse,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Errore nella chat con IA:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Errore nella comunicazione con l\'IA'
      })
    }
  }
}) 