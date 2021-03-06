const Mongoose = require('mongoose')

const cardSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: String,
    pos: {
      type: Number,
      required: true,
    },
    sectionId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true
    },
  },
  { timestamps: true }
)

class Card {
  static insertCard(cardInfo) {
    const card = this(cardInfo)
    return card.save()
  }

  static getCardsBySectionId(sectionId) {
    return this.find({ sectionId }).sort('pos').exec()
  }

  static updateCardPos(cardId, pos, sectionId) {
    return this.findOneAndUpdate(
      {
        _id: Mongoose.mongo.ObjectID(cardId)
      },
      {
        $set: {
          pos,
          sectionId
        }
      },
      {
        new: true
      }
    ).exec()
  }
}

cardSchema.loadClass(Card)

module.exports = Mongoose.model('Card', cardSchema)
