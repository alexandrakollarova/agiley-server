import Mongoose from 'mongoose'

const projectSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  sections: {
    type: Array
  }
})

class Project {
  static getProjects() {
    return this.find().exec()
  }

  static getProjectById(id) {
    return this.findOne({ _id: Mongoose.mongo.ObjectID(id) }).exec()
  }

  static insertProject(title) {
    const project = this(title)
    return project.save()
  }

  static addSectionToProject(id, sectionInfo) {
    // let newSections
    // return this.findOne({ _id: Mongoose.mongo.ObjectID(id) }).then(res => {
    //   newSections = res.sections.concat(sectionInfo)
    // })
    return this.update(
      { _id: Mongoose.mongo.ObjectID(id) },
      { $push: { sections: sectionInfo } }
    ).exec()
  }
}

projectSchema.loadClass(Project)

export default Mongoose.model('Project', projectSchema)