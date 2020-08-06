import express from 'express'
import cors from 'cors'
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
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} from '../config'

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

const SubscriptionsResolvers = {
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
    },
  },
}

const customResolvers = {
  Project: {
    sections(parent, args, cxt) {
      return cxt.section.getSectionsByProjectId(parent._id)
    }
  },
  Section: {
    cards(parent, args, cxt) {
      return cxt.card.getCardsBySectionId(parent._id)
    },
  },
}

const resolvers = merge(
  cardResolvers,
  sectionResolvers,
  projectResolvers,
  customResolvers,
  SubscriptionsResolvers
)

mongoose
  .connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?ssl=true&replicaSet=xxx-shard-0&authSource=admin`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('MongoDB connected successfully')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        card: cardModel,
        section: sectionModel,
        project: projectModel,
        publisher: pubsub,
        SUBSCRIPTION_CONSTANTS: SUBSCRIPTION_CONSTANTS
      })
    })

    const app = express()
    app.use(cors())
    app.disable('x-powered-by')

    server.applyMiddleware({ app })

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    httpServer.listen({ port: PORT }, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
