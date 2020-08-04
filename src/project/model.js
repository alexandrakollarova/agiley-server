const Mongoose = require("mongoose")

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
}

projectSchema.loadClass(Project)

module.exports = Mongoose.model('Project', projectSchema)