import { Schema, model } from "mongoose"

export const ClubModel = model(
  "Club",
  new Schema({
    club_id: { type: Number, required: true, unique: true },
    club_code: { type: String },
    name: { type: String },
    domestic_competition_id: { type: String },
    total_market_value: { type: String },
    squad_size: { type: Number },
    average_age: { type: Number },
    foreigners_number: { type: Number },
    foreigners_percentage: { type: String },
    national_team_players: { type: Number },
    stadium_name: { type: String },
    stadium_seats: { type: Number },
    net_transfer_record: { type: String },
    coach_name: { type: String },
    last_season: { type: Number },
    filename: { type: String },
    url: { type: String },
  })
)

export const PlayerModel = model(
  "Player",
  new Schema({
    player_id: { type: Number, required: true, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    name: { type: String },
    last_season: { type: Number },
    current_club_id: { type: Number },
    player_code: { type: String },
    country_of_birth: { type: String },
    city_of_birth: { type: String },
    country_of_citizenship: { type: String },
    date_of_birth: { type: Date },
    sub_position: { type: String },
    position: { type: String },
    foot: { type: String },
    height_in_cm: { type: Number },
    contract_expiration_date: { type: Date },
    agent_name: { type: String },
    image_url: { type: String },
    url: { type: String },
    current_club_domestic_competition_id: { type: String },
    current_club_name: { type: String },
    market_value_in_eur: { type: Number },
    highest_market_value_in_eur: { type: Number },
  })
)

export const PlayerValuationModel = model(
  "PlayerValuation",
  new Schema({
    player_id: { type: Number, required: true },
    date: { type: Date, required: true },
    market_value_in_eur: { type: Number },
    current_club_id: { type: Number },
    player_club_domestic_competition_id: { type: String },
  })
)

export const TransferModel = model(
  "Transfer",
  new Schema({
    player_id: { type: Number, required: true },
    transfer_date: { type: Date },
    transfer_season: { type: String },
    from_club_id: { type: Number },
    to_club_id: { type: Number },
    from_club_name: { type: String },
    to_club_name: { type: String },
    transfer_fee: { type: String },
    market_value_in_eur: { type: Number },
    player_name: { type: String },
  })
)
