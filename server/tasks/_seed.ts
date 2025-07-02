import { createReadStream } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { parse } from "csv-parse"
import mongoose from "mongoose"
import { ClubModel, PlayerModel, PlayerValuationModel, TransferModel } from "../lib/db/schema"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATASET_DIR = path.resolve(__dirname, "../../dataset")

function readCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = []
    createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on("data", (row) => records.push(row))
      .on("end", () => resolve(records))
      .on("error", reject)
  })
}

export default defineTask({
  async run(event) {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.NUXT_MONGODB_URI
    if (!MONGODB_URI) throw new Error("MONGODB_URI is not set")
    await mongoose.connect(MONGODB_URI)

    // Clubs
    const clubs: any[] = await readCSV(path.join(DATASET_DIR, "clubs.csv"))
    await ClubModel.deleteMany({})
    await ClubModel.insertMany(clubs)

    // Players
    const players: any[] = await readCSV(path.join(DATASET_DIR, "players.csv"))
    await PlayerModel.deleteMany({})
    await PlayerModel.insertMany(players)

    // Player Valuations
    const playerValuations: any[] = await readCSV(path.join(DATASET_DIR, "player_valuations.csv"))
    await PlayerValuationModel.deleteMany({})
    await PlayerValuationModel.insertMany(playerValuations)

    // Transfers
    const transfers: any[] = await readCSV(path.join(DATASET_DIR, "transfers.csv"))
    await TransferModel.deleteMany({})
    await TransferModel.insertMany(transfers)

    await mongoose.disconnect()
    return {
      result: "success",
      counts: {
        clubs: clubs.length,
        players: players.length,
        playerValuations: playerValuations.length,
        transfers: transfers.length,
      },
    }
  },
})
