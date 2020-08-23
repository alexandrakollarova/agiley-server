const Mongoose = require('mongoose')

const sectionSchema = new Mongoose.Schema({
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
  projectId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
})

class Section {
  static getSections() {
    return this.find().sort('pos').exec()
  }

  static getSectionsByProjectId(projectId) {
    return this.find({ projectId }).sort('pos').exec()
  }

  static insertSection(sectionInfo) {
    const section = this(sectionInfo)
    return section.save()
  }

  static addInitialSections(sections) {
    return this.insertMany(sections)
  }

  static updateSectionPos(id, pos) {
    return this.findOneAndUpdate(
      { _id: Mongoose.mongo.ObjectID(id) },
      {
        $set: {
          pos,
        },
      },
      {
        new: true
      }
    ).exec()
  }
}

sectionSchema.loadClass(Section)

module.exports = Mongoose.model('Section', sectionSchema)
