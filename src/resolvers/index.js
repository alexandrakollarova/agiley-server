import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Project from '../models'
import { v4 as uuid } from 'uuid'

export const resolvers = {
  Query: {
    projects: () => {
      return Project.find({})
    },
    project: (_, { id }) => {
      if (!mongoose.Types.ObjectId.isValise(id)) {
        throw new UserInputError(`${id} is not a valid project ID.`)
      }
      return Project.findById(id)
    },
  },

  Mutation: {
    addProject: (_, { title }) => {
      const newProject = {
        title,
        lists: [
          { id: uuid(), header: 'Todo', cards: [] },
          { id: uuid(), header: 'In-progress', cards: [] },
          { id: uuid(), header: 'Done', cards: [] }
        ]
      }
      return Project.create(newProject)
    }
  }
}

export default resolvers