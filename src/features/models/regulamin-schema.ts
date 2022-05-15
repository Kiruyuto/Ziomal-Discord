import mongoose, { Schema } from 'mongoose'

const reqString = {
  type: String,
  required: true,
}

const schema = new Schema({
  // Guild ID
  _id: reqString,
  // Message ID
  messageId: reqString,
})

const name = 'Regulamin'
export default mongoose.models[name] || mongoose.model(name, schema, name)
