import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import typeDefs from './typeDefs'
import resolvers from './resolvers'
import {
  NODE_ENV,
  PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} from '../config'

(async () => {
  try {
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?ssl=true&replicaSet=xxx-shard-0&authSource=admin`,
      { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }
    )

    const app = express()
    app.use(cors())

    app.disable('x-powered-by')

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: NODE_ENV !== 'production'
    })

    server.applyMiddleware({ app });

    app.listen({ port: PORT }, () =>
      console.log(`http://localhost:${PORT}${server.graphqlPath}`)
    )
  }
  catch (e) {
    console.log(e)
  }
})()