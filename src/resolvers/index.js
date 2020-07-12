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
      // if (!mongoose.Types.ObjectId.isValise(id)) {
      //   throw new UserInputError(`${id} is not a valid project ID.`)
      //}
      return Project.findById(id)
    },
  },

  Mutation: {
    addProject: (_, { title }) => {
      const newProject = {
        title,
        lists: [
          { id: uuid(), title: 'Todo', cards: [] },
          { id: uuid(), title: 'In-progress', cards: [] },
          { id: uuid(), title: 'Done', cards: [] }
        ]
      }
      return Project.create(newProject)
    },
    addCard: (_, { projectId, listId, title, content }) => {
      const newCard = {
        id: uuid(),
        title,
        content
      }
      return Project.updateOne(
        { _id: projectId, 'lists.id': listId },
        { $push: { 'lists.$.cards': newCard } }
      )
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

      // Project.findById(projectId).then(project => {
      //   return project.lists.find(list => list._id == listId)
      // })
      //   .then(list => list.cards.filter(card => card._id != cardId))
      //   .then(res => {
      //     console.log(res)
      //     if (!res) {
      //       return {
      //         success: false,
      //         message: 'Failed to delete card'
      //       }
      //     } else {
      //       return {
      //         success: true,
      //         message: `Deleted card with id ${cardId}`
      //       }
      //     }
      //   })
      // project.save()
    }
  }
}

export default resolvers