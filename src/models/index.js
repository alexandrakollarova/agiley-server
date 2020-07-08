import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  title: String,
  content: String
})

const listSchema = new mongoose.Schema({
  title: String,
  cards: [cardSchema]
})

const projectSchema = new mongoose.Schema({
  title: String,
  lists: [listSchema]
})

export default mongoose.model('Project', projectSchema)