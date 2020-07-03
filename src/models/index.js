import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: String,
  lists: Array
})

export default mongoose.model('Project', projectSchema)