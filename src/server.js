import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { ApolloServer, gql } from 'apollo-server-express'
import merge from 'lodash/merge'
import { PubSub } from 'apollo-server'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { cardResolvers, cardTypeDefs } from './card'
import { sectionResolvers, sectionTypeDefs } from './section'
import { projectResolvers, projectTypeDefs } from './project'
import cardModel from './card/model'
import sectionModel from './section/model'
import projectModel from './project/model'
import SUBSCRIPTION_CONSTANTS from './subscriptionConstants'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import bodyParser from 'body-parser'
import {
  PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} from '../config'

const WS_PORT = 5000

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
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?ssl=true&replicaSet=xxx-shard-0&authSource=admin`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log('MongoDB connected successfully')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      subscriptions: {
        onConnect: () => console.log('Connected to websocket'),
        onDisconnect: () => console.log('Disconnected from websocket')
      },
      tracing: true,
      context: () => ({
        card: cardModel,
        section: sectionModel,
        project: projectModel,
        SUBSCRIPTION_CONSTANTS: SUBSCRIPTION_CONSTANTS,
        publisher: pubsub
      })
    })

    const app = express()
    app.use('/graph', bodyParser.json())

    const corsOptions = {
      origin: '*',
    }

    app.use(cors(corsOptions))
    app.disable('x-powered-by')

    server.applyMiddleware({
      app,
      cors: false
    })

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    httpServer.listen({ port: PORT }, () => {
      console.log(`Server ready on port ${PORT}`)
      console.log(`Subscriptions ready on port ${PORT}`)
      new SubscriptionServer({
        execute,
        subscribe,
        schema: resolvers
      }, {
        server: httpServer,
        path: '/graph'
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
