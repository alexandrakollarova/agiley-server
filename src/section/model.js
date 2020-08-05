const Mongoose = require("mongoose")
const Project = require("../project/model")

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
})

class Section {
  static getSections() {
    return this.find().sort("pos").exec()
  }

  static getSectionsById(ids) {
    return this.find().where('_id').in(ids).then(res => res)
  }

  static insertSection(id, sectionInfo) {
    const section = this(sectionInfo)

    Project.findOne({
      _id: Mongoose.mongo.ObjectID(id)
    }).then(res => {
      return section.save()
        .then(section => {
          res.sections.push({ id: section._id })
          res.save()
        })
    })
    return section
  }


  static addInitialSections(id) {
    this.create(
      { title: 'todo', label: 'todo', pos: 2048, projectId: id },
      { title: 'in progress', label: 'in progress', pos: 19456, projectId: id },
      { title: 'done', label: 'done', pos: 35840, projectId: id }
    )
    this.save()
  }

  static updatePos(id, pos) {
    return this.findOneAndUpdate(
      { _id: Mongoose.mongo.ObjectID(id) },
      {
        $set: {
          pos,
        },
      },
      {
        new: true,
      }
    ).exec()
  }
}

sectionSchema.loadClass(Section);

module.exports = Mongoose.model("Section", sectionSchema);
