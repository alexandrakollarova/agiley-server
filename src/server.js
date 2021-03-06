import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer, gql } from 'apollo-server-express'
import merge from 'lodash/merge'
import { PubSub } from 'apollo-server'
import { createServer } from 'http'
import { cardResolvers, cardTypeDefs } from './card'
import { sectionResolvers, sectionTypeDefs } from './section'
import { projectResolvers, projectTypeDefs } from './project'
import cardModel from './card/model'
import sectionModel from './section/model'
import projectModel from './project/model'
import SUBSCRIPTION_CONSTANTS from './subscriptionConstants'
import {
  PORT,
  MONGODB_URI
} from '../config'

require('events').EventEmitter.defaultMaxListeners = 100

const typeDefs = gql`
  type Subscription {
    projectAdded: Project
    sectionAdded: Section
    cardAdded: Card
    onSectionPosChange: Section
    onCardPosChange: Card
  }

  ${cardTypeDefs}
  ${sectionTypeDefs}
  ${projectTypeDefs}
`

const pubsub = new PubSub()

const subscriptionsResolvers = {
  Subscription: {
    projectAdded: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.PROJECT_ADDED]),
    },
    sectionAdded: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.SECTION_ADDED]),
    },
    cardAdded: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.CARD_ADDED]),
    },
    onSectionPosChange: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.ON_SECTION_POS_CHANGE]),
    },
    onCardPosChange: {
      subscribe: () =>
        pubsub.asyncIterator([SUBSCRIPTION_CONSTANTS.ON_CARD_POS_CHANGE]),
    }
  }
}

const customResolvers = {
  Project: {
    sections(parent, args, cxt) {
      return cxt.section.getSectionsByProjectId(parent._id)
    }
  },
  Section: {
    cards(parent, args, cxt) {
      try {
        return cxt.card.getCardsBySectionId(parent._id)
      } catch (e) {
        console.log('error =>', e)
        return null
      }
    }
  }
}

const resolvers = merge(
  cardResolvers,
  sectionResolvers,
  projectResolvers,
  customResolvers,
  subscriptionsResolvers
)

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log('MongoDB connected successfully')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: {
        card: cardModel,
        section: sectionModel,
        project: projectModel,
        publisher: pubsub,
        SUBSCRIPTION_CONSTANTS
      },
      introspection: true,
      playground: true,
      graphiql: true,
      engine: {
        reportSchema: true,
        variant: 'current'
      },
      subscriptions: {
        onConnect: async () => {
          console.log('Subscription client connected')
        },
        onDisconnect: async () => {
          console.log('Subscription client disconnected')
        }
      }
    })

    const app = express()
    app.disable('x-powered-by')

    server.applyMiddleware({ app })

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    httpServer.listen(PORT, () => {
      console.log(`Server ready on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('error =>', err)
  })
