const Mongoose = require('mongoose')

const projectSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true
  }
})

class Project {
  static getProjects() {
    return this.find().exec()
  }

  static insertProject(title) {
    const project = this(title)
    return project.save()
  }
}

projectSchema.loadClass(Project)

module.exports = Mongoose.model('Project', projectSchema)