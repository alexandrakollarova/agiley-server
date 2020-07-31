import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import Project from '../models'

export const resolvers = {
  Query: {
    projects: () => {
      return Project.find({})
    },
    project: (_, { id }) => {
      // if (!mongoose.Types.ObjectId.isValise(id)) {
      //   throw new UserInputError(`${id} is not a valid project ID.`)
      //}
      return Project.findById(id)
    },
  },

  Mutation: {
    addProject: (_, { title }) => {
      let error

      const newProject = {
        title,
        lists: [
          { title: 'Todo', cards: [] },
          { title: 'In-progress', cards: [] },
          { title: 'Done', cards: [] }
        ]
      }
      Project.create(newProject, (err) => error = err)

      if (error)
        return {
          success: false,
          message: 'Failed to add project'
        }
      return {
        success: true,
        message: `Added project with title ${title}`
      }
    },
    addCard: (_, { projectId, listId, title, content }) => {
      let error

      const newCard = {
        title,
        content
      }

      Project.updateOne(
        { '_id': projectId, 'lists._id': listId },
        { $push: { 'lists.$.cards': newCard } },
        (err) => error = err
      )

      if (error)
        return {
          success: false,
          message: 'Failed to add card'
        }

      return {
        success: true,
        message: `Added card with title ${newCard.title} and content ${newCard.content}`
      }
    },
    deleteCard: (_, { projectId, listId, cardId }) => {
      let error

      Project.findOneAndUpdate(
        { '_id': projectId, 'lists._id': listId },
        { $pull: { 'lists.$.cards': { _id: cardId } } },
        (err) => error = err
      )

      if (error)
        return {
          success: false,
          message: 'Failed to delete card'
        }

      return {
        success: true,
        message: `Deleted card with id ${cardId}`
      }
    }
  }
}

export default resolvers